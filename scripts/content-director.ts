// scripts/content-director.ts - Autonomous Content Director (Phase 3)
// Runs weekly via PM2 cron to generate pSEO content automatically

import { db } from "../server/db";
import { programmaticPages } from "../shared/schema";
import { eq } from "drizzle-orm";
import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

// Saudi cities and industries for pSEO generation
const CITIES = ["Riyadh", "Jeddah", "Dammam", "Khobar", "Makkah", "Madinah"];
const INDUSTRIES = [
  "Real Estate", "Healthcare", "E-commerce", "SaaS", "Finance", 
  "Retail", "Education", "Hospitality", "Construction", "Technology"
];
const SERVICES = [
  "AI Web Development", "Digital Marketing", "SEO Optimization", 
  "Cloud Solutions", "Mobile App Development", "UI/UX Design"
];

function generateSlug(keyword: string): string {
  return keyword.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function generateWithOllama(prompt: string): Promise<any> {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5:7b",
        prompt: prompt,
        stream: false,
        format: "json"
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json() as any;
    return JSON.parse(data.response);
  } catch (error) {
    console.error("Ollama generation failed:", error);
    return null;
  }
}

async function runContentDirector() {
  console.log("🎬 Content Director: Starting autonomous content generation...");
  console.log(`⏰ Started at: ${new Date().toISOString()}`);

  try {
    // Check if we already have enough pages this week
    const existingPages = await db.select({ count: programmaticPages.id }).from(programmaticPages);
    const currentCount = existingPages.length;
    
    if (currentCount >= 50) {
      console.log(`📊 Already have ${currentCount} pages. Skipping generation to avoid bloat.`);
      return;
    }

    // Generate 1-2 new pages per run (conservative approach)
    const pagesToGenerate = Math.min(2, 50 - currentCount);
    let generated = 0;

    for (let i = 0; i < pagesToGenerate; i++) {
      // Randomly select city, industry, service
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const industry = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)];
      const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
      
      const keyword = `${service} for ${industry} in ${city}`;
      const slug = generateSlug(keyword);

      // Check if this slug already exists
      const existing = await db.select().from(programmaticPages).where(eq(programmaticPages.slug, slug));
      if (existing.length > 0) {
        console.log(`⏭️ Skipping duplicate: ${slug}`);
        continue;
      }

      console.log(`🎯 Generating: ${keyword}`);

      const prompt = `
You are an elite SEO copywriter for TechPartner, a leading digital agency in Saudi Arabia.
Write a highly engaging, professional 600-word landing page targeting the exact keyword: "${keyword}".

City: ${city}
Industry: ${industry}
Service: ${service}

Format the output as valid JSON with these fields:
{
  "h1_title": "Compelling H1 title including the keyword",
  "meta_description": "SEO meta description under 160 characters",
  "markdown_content": "Full article in markdown with ## H2 headings and ### H3 subheadings. Include: introduction, 3 main sections with benefits for ${industry} in ${city}, local context about Saudi market, and CTA to contact TechPartner.",
  "json_ld": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Same as h1_title",
    "description": "Same as meta_description",
    "author": {"@type": "Organization", "name": "TechPartner"},
    "datePublished": "${new Date().toISOString()}"
  }
}

Write in professional English suitable for Saudi business executives. Include local context about ${city} and the ${industry} sector in Saudi Arabia.`;

      const result = await generateWithOllama(prompt);
      
      if (!result) {
        console.error(`❌ Failed to generate content for ${keyword}`);
        continue;
      }

      // Insert into database
      await db.insert(programmaticPages).values({
        slug,
        targetKeyword: keyword,
        city,
        industry,
        h1Title: result.h1_title || keyword,
        aiGeneratedContent: result.markdown_content || "Content generation failed.",
        jsonLdSchema: result.json_ld || {},
        isPublished: true
      });

      console.log(`✅ Published: /p/${slug}`);
      generated++;
    }

    console.log(`🎉 Content Director completed. Generated ${generated} new pages.`);
    console.log(`📊 Total pSEO pages: ${currentCount + generated}`);

  } catch (error) {
    console.error("❌ Content Director Error:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  runContentDirector();
}

export { runContentDirector };
