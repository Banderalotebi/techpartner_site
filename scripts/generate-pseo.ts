import { db } from "../server/db";
import { programmaticPages } from "../shared/schema";
import fetch from "node-fetch";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

const CITIES = ["Jeddah", "Riyadh", "Dammam", "Khobar", "Mecca", "Medina"];
const INDUSTRIES = ["Real Estate", "Healthcare", "E-commerce", "SaaS", "Finance", "Retail", "Education", "Hospitality"];
const SERVICES = [
    "AI Web Development",
    "Custom Software Development", 
    "Mobile App Development",
    "Digital Transformation",
    "Cloud Solutions",
    "UI/UX Design"
];

interface GeneratedContent {
    h1_title: string;
    markdown_content: string;
    json_ld: object;
}

async function generateWithOllama(prompt: string): Promise<GeneratedContent> {
    const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    const data = await response.json() as { response: string };
    return JSON.parse(data.response) as GeneratedContent;
}

async function generatePages() {
    console.log("🚀 Starting Programmatic SEO Generator...");
    console.log(`📍 Cities: ${CITIES.join(", ")}`);
    console.log(`🏢 Industries: ${INDUSTRIES.join(", ")}`);
    console.log(`🔧 Services: ${SERVICES.join(", ")}`);

    let generated = 0;
    let failed = 0;

    for (const city of CITIES) {
        for (const industry of INDUSTRIES) {
            for (const service of SERVICES.slice(0, 2)) { // Limit to 2 services per run to avoid overload
                const keyword = `${service} for ${industry} in ${city}`;
                const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                
                // Check if page already exists
                const existing = await db.select({ id: programmaticPages.id })
                    .from(programmaticPages)
                    .where(sql`${programmaticPages.slug} = ${slug}`)
                    .limit(1);
                
                if (existing.length > 0) {
                    console.log(`⏭️  Skipping (exists): ${keyword}`);
                    continue;
                }

                console.log(`\n📝 Generating: ${keyword}...`);
                
                const prompt = `
You are an elite SEO copywriter and Technical SEO Architect in Saudi Arabia.
Target Keyword: ${keyword}
City: ${city}
Industry: ${industry}
Service: ${service}

Write a highly converting, 600-word landing page in Markdown formatting. Include:
1. A catchy H1 that includes the keyword naturally
2. Local business context for ${city} and the ${industry} sector
3. Specific benefits for ${industry} companies
4. A clear call-to-action
5. FAQ section with 3-4 questions

Also generate valid JSON-LD FAQ schema.

Output strictly in this JSON format:
{
  "h1_title": "The H1 title here",
  "markdown_content": "# The H1\\n\\nParagraph content...\\n\\n## Why ${industry} in ${city} Needs ${service}\\n\\nMore content...",
  "json_ld": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [...]
  }
}

Do not include any text outside the JSON block.`;
                
                try {
                    const result = await generateWithOllama(prompt);
                    
                    await db.insert(programmaticPages).values({
                        slug,
                        targetKeyword: keyword,
                        city,
                        industry,
                        h1Title: result.h1_title,
                        aiGeneratedContent: result.markdown_content,
                        jsonLdSchema: result.json_ld,
                        isPublished: true
                    });
                    
                    console.log(`✅ Saved: /p/${slug}`);
                    generated++;
                    
                    // Small delay to not overwhelm Ollama
                    await new Promise(r => setTimeout(r, 500));
                    
                } catch (e) {
                    console.error(`❌ Failed on ${slug}:`, e);
                    failed++;
                }
            }
        }
    }
    
    console.log(`\n🎉 Generation complete!`);
    console.log(`✅ Generated: ${generated} pages`);
    console.log(`❌ Failed: ${failed} pages`);
    process.exit(0);
}

// Need to import sql for the check
import { sql } from "drizzle-orm";

generatePages().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
