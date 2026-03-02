// scripts/domain-hunter.ts - The Domain Radar Scanner
// Scans for newly registered domains matching target keywords

import { db } from "../server/db";
import { domainLeads } from "../shared/schema";

const TARGET_KEYWORDS = [
  "riyadh", "jeddah", "dammam", "saudi", "ksa", 
  "clinic", "dental", "realestate", "properties", 
  "tech", "saas", "app", "web", "design", "marketing"
];

export async function runDomainHunt() {
  console.log("🌍 Starting Domain Hunt...");
  
  // Simulating a daily NRD (Newly Registered Domain) feed
  // In production, this would connect to a real NRD API like:
  // - WhoisXML API
  // - Domainr API
  // - Real-time domain registration feeds
  
  const sampleDomains = [
    "riyadh-dental-care.com",
    "cheap-shoes-online.net",
    "jeddah-luxury-realestate.sa",
    "techpartner-clone.com",
    "saudi-ai-solutions.org",
    "dammam-clinic.sa",
    "ksa-properties.com",
    "riyadh-tech-startup.io",
    "jeddah-web-design.sa",
    "saudi-marketing-agency.com"
  ];

  let foundCount = 0;

  for (const domain of sampleDomains) {
    const matchedKeywords = TARGET_KEYWORDS.filter(kw => 
      domain.toLowerCase().includes(kw)
    );
    
    if (matchedKeywords.length > 0) {
      try {
        // Check if db is available (Drizzle)
        if (db) {
          await db.insert(domainLeads).values({
            domainName: domain,
            keywordsMatched: matchedKeywords.join(', ')
          });
        } else {
          // SQLite fallback - create table if not exists and insert
          const Database = (await import("better-sqlite3")).default;
          const sqliteDb = new Database('data/techpartner.db');
          
          // Ensure table exists
          sqliteDb.exec(`
            CREATE TABLE IF NOT EXISTS domain_leads (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              domain_name TEXT UNIQUE NOT NULL,
              keywords_matched TEXT NOT NULL,
              status TEXT DEFAULT 'NEW',
              discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
          `);
          
          // Insert domain
          try {
            sqliteDb.prepare(`
              INSERT INTO domain_leads (domain_name, keywords_matched, status)
              VALUES (?, ?, 'NEW')
            `).run(domain, matchedKeywords.join(', '));
          } catch (insertErr: any) {
            if (!insertErr.message?.includes('UNIQUE constraint failed')) {
              throw insertErr;
            }
            // Duplicate - silently skip
          }
          
          sqliteDb.close();
        }
        
        foundCount++;
        console.log(`🎯 TARGET ACQUIRED: ${domain} [${matchedKeywords.join(', ')}]`);
      } catch (e: any) {
        // 23505 is PostgreSQL unique violation code
        if (e.code !== '23505' && !e.message?.includes('UNIQUE constraint failed')) {
          console.error(`Error saving ${domain}:`, e.message);
        } else {
          console.log(`⏭️  Skipping duplicate: ${domain}`);
        }
      }
    }
  }
  
  console.log(`✅ Hunt Complete. Added ${foundCount} new leads.`);
  return foundCount;
}

// Allow running directly from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runDomainHunt()
    .then((count) => {
      console.log(`\n🏁 Final count: ${count} domains discovered`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Domain hunt failed:", err);
      process.exit(1);
    });
}
