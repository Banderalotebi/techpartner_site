// scripts/domain-hunter.ts - The CRM Domain Extractor
// Batch processes domains and extracts company data (email, phone, name, location)

import { db } from "../server/db";
import { domainLeads } from "../shared/schema";
import { eq } from "drizzle-orm";
import * as cheerio from "cheerio";
import { z } from "zod";

// Zod schema for extracted data validation
const ExtractedDataSchema = z.object({
  companyName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

type ExtractedData = z.infer<typeof ExtractedDataSchema>;

// Configuration
const BATCH_SIZE = 10;
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds
const DELAY_BETWEEN_REQUESTS = 500; // 500ms between individual requests

// Target keywords for domain matching
const TARGET_KEYWORDS = [
  "riyadh", "jeddah", "dammam", "saudi", "ksa", 
  "clinic", "dental", "realestate", "properties", 
  "tech", "saas", "app", "web", "design", "marketing",
  "hospital", "medical", "restaurant", "cafe", "shop"
];

// Sample domains to process (in production, this would come from a NRD API)
const SAMPLE_DOMAINS = [
  "riyadh-dental-care.com",
  "jeddah-luxury-realestate.sa",
  "techpartner-clone.com",
  "saudi-ai-solutions.org",
  "dammam-clinic.sa",
  "ksa-properties.com",
  "riyadh-tech-startup.io",
  "jeddah-web-design.sa",
  "saudi-marketing-agency.com",
  "riyadh-hospital.net",
  "jeddah-restaurant.sa",
  "dammam-cafe.com",
  "saudi-shopping.net",
  "riyadh-medical.com",
  "jeddah-properties.sa"
];

// Helper: Delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Extract company data from a website
async function extractCompanyData(domain: string): Promise<ExtractedData> {
  const url = domain.startsWith('http') ? domain : `https://${domain}`;
  
  try {
    // Try fetching the website
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.log(`  ⚠️  Failed to fetch ${domain}: ${response.status}`);
      return {};
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = $('body').text().match(emailRegex) || [];
    const email = emails[0];

    // Extract phone (common patterns)
    const phoneRegex = /(\+?966|0)[5-9][0-9]{8}/g;
    const phones = $('body').text().match(phoneRegex) || [];
    const phone = phones[0];

    // Extract company name from title or meta tags
    const companyName = 
      $('meta[property="og:site_name"]').attr('content') ||
      $('title').text().split('|')[0].split('-')[0].trim() ||
      $('h1').first().text().trim();

    // Extract location (common patterns in text)
    const locationRegex = /(Riyadh|Jeddah|Dammam|Khobar|Al Khobar|Mecca|Medina|Makkah)[,\s]?(Saudi Arabia|KSA)?/gi;
    const locations = $('body').text().match(locationRegex) || [];
    const location = locations[0];

    const extracted: ExtractedData = {
      companyName: companyName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      location: location || undefined,
    };

    // Validate with Zod
    const validated = ExtractedDataSchema.safeParse(extracted);
    if (validated.success) {
      return validated.data;
    }
    
    return extracted;
  } catch (error) {
    console.log(`  ❌ Error extracting from ${domain}:`, error instanceof Error ? error.message : 'Unknown error');
    return {};
  }
}

// Helper: Save extracted data to database
async function saveExtractedData(
  domain: string, 
  data: ExtractedData, 
  keywords: string[]
): Promise<void> {
  try {
    // Check if domain already exists
    const existing = await db
      .select()
      .from(domainLeads)
      .where(eq(domainLeads.domainName, domain))
      .limit(1);

    if (existing.length > 0) {
      // Update existing record
      await db
        .update(domainLeads)
        .set({
          email: data.email || null,
          phone: data.phone || null,
          companyName: data.companyName || null,
          location: data.location || null,
          extractedAt: new Date(),
          status: data.email || data.phone ? 'EXTRACTED' : 'FAILED',
        })
        .where(eq(domainLeads.domainName, domain));
    } else {
      // Insert new record
      await db
        .insert(domainLeads)
        .values({
          domainName: domain,
          keywordsMatched: keywords.join(', '),
          email: data.email || null,
          phone: data.phone || null,
          companyName: data.companyName || null,
          location: data.location || null,
          extractedAt: new Date(),
          status: data.email || data.phone ? 'EXTRACTED' : 'PENDING',
        });
    }
  } catch (error) {
    console.log(`  ❌ Database error for ${domain}:`, error instanceof Error ? error.message : 'Unknown error');
  }
}

// Main batch processing function
export async function runDomainHunt() {
  console.log("🚀 Starting CRM Domain Extractor...");
  console.log(`📊 Processing ${SAMPLE_DOMAINS.length} domains in batches of ${BATCH_SIZE}`);
  console.log("=" .repeat(60));

  let processedCount = 0;
  let successCount = 0;

  // Process domains in batches
  for (let i = 0; i < SAMPLE_DOMAINS.length; i += BATCH_SIZE) {
    const batch = SAMPLE_DOMAINS.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(SAMPLE_DOMAINS.length / BATCH_SIZE);

    console.log(`\n📦 Batch ${batchNumber}/${totalBatches} - Processing ${batch.length} domains...`);

    // Process each domain in the batch
    for (const domain of batch) {
      processedCount++;
      
      // Check if domain matches our keywords
      const matchedKeywords = TARGET_KEYWORDS.filter(kw => 
        domain.toLowerCase().includes(kw)
      );

      if (matchedKeywords.length === 0) {
        console.log(`  ⏭️  [${processedCount}/${SAMPLE_DOMAINS.length}] ${domain} - No keywords matched, skipping`);
        continue;
      }

      console.log(`  🔍 [${processedCount}/${SAMPLE_DOMAINS.length}] Extracting data from: ${domain}`);

      try {
        // Extract company data
        const extractedData = await extractCompanyData(domain);
        
        // Add small delay between requests to avoid rate limiting
        await delay(DELAY_BETWEEN_REQUESTS);

        // Save to database
        await saveExtractedData(domain, extractedData, matchedKeywords);

        const status = extractedData.email || extractedData.phone ? '✅' : '⚠️';
        console.log(`  ${status} [${processedCount}/${SAMPLE_DOMAINS.length}] ${domain} - Saved to CRM`);
        
        if (extractedData.email || extractedData.phone) {
          successCount++;
          console.log(`     📧 Email: ${extractedData.email || 'N/A'} | 📞 Phone: ${extractedData.phone || 'N/A'}`);
        }
      } catch (error) {
        console.log(`  ❌ [${processedCount}/${SAMPLE_DOMAINS.length}] ${domain} - Error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }

    // Delay between batches to prevent rate limiting
    if (i + BATCH_SIZE < SAMPLE_DOMAINS.length) {
      console.log(`  😴 Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
      await delay(DELAY_BETWEEN_BATCHES);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Domain Extraction Complete!");
  console.log(`📊 Total Processed: ${processedCount}`);
  console.log(`✅ Successfully Extracted: ${successCount}`);
  console.log(`⚠️  Partial/Empty: ${processedCount - successCount}`);
  console.log("=".repeat(60));
}

// Run if called directly
runDomainHunt().catch(console.error);

