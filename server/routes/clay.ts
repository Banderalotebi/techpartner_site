// server/routes/clay.ts - Clay.com B2B Outbound Engine Integration
// The "Sniper Audit" Workflow - AI-powered website analysis and lead injection
// PHASE 1: Tavily Real-Time Intelligence Integration

import { Router } from "express";
import { 
  createLead, 
  updateLeadScore, 
  getLeadByEmail, 
  createInteraction 
} from "../db/crm";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { tavily } from "@tavily/core";

// Tavily client initialization
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY || "" });

export const clayRouter = Router();

// Ollama configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

// Tavily search function for real-time intelligence
async function searchCompanyIntelligence(companyName: string, websiteUrl: string) {
    try {
        console.log(`🔍 [Tavily] Searching intelligence for: ${companyName}`);
        
        const searchQuery = `${companyName} recent news 2026 tech stack competitors Saudi Arabia`;
        
        const response = await tvly.search(searchQuery, {
            searchDepth: "advanced",
            maxResults: 5,
            includeAnswer: true,
            includeDomains: ["saudigazette.com.sa", "arabnews.com", "zawya.com", " Bloomberg.com", "linkedin.com"]
        });
        
        console.log(`✅ [Tavily] Found ${response.results.length} intelligence sources`);
        
        return {
            searchResults: response.results,
            answer: response.answer,
            query: searchQuery
        };
    } catch (error) {
        console.error("❌ [Tavily] Search error:", error);
        return {
            searchResults: [],
            answer: null,
            query: companyName
        };
    }
}

// Secure Middleware: Only Clay can call these endpoints
const requireClayAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const expectedKey = `Bearer ${process.env.CLAY_API_KEY || 'tp_clay_secure_webhook_key_2026'}`;
    
    if (authHeader !== expectedKey) {
        console.warn(`🚫 [Clay] Unauthorized access attempt from: ${req.ip}`);
        return res.status(401).json({ error: "Unauthorized. Invalid Clay API Key." });
    }
    next();
};

// ENDPOINT 1: The AI Website Analyzer (Clay sends URL -> Gets personalized audit)
clayRouter.post("/analyze", requireClayAuth, async (req, res) => {
    try {
        const { targetUrl, companyName } = req.body;
        
        if (!targetUrl) {
            return res.status(400).json({ error: "targetUrl is required" });
        }

        console.log(`🔍 [Clay] Analyzing website: ${targetUrl} for ${companyName || 'Unknown Company'}`);

        // 1. Fetch basic site content
        let siteText = "";
        try {
            const response = await fetch(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            } as any);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const html = await response.text();
            const $ = cheerio.load(html);
            
            // Extract meaningful text content
            siteText = $('body')
                .find('h1, h2, h3, p, meta[name="description"]')
                .map((_, el) => $(el).text())
                .get()
                .join(' ')
                .replace(/\s+/g, ' ')
                .substring(0, 2000); // Grab first 2000 chars
        } catch (fetchError) {
            console.warn(`⚠️ [Clay] Could not fetch ${targetUrl}:`, fetchError);
            siteText = "Website content unavailable for analysis.";
        }

        // 2. Tavily Real-Time Intelligence (PHASE 1)
        console.log(`🌐 [Clay] Gathering real-time intelligence via Tavily...`);
        const tavilyIntel = await searchCompanyIntelligence(companyName || "Unknown Company", targetUrl);
        
        // Format Tavily results for the prompt
        const tavilyContext = tavilyIntel.answer 
            ? `Recent News & Intelligence: ${tavilyIntel.answer}\n\nTop Findings:\n${tavilyIntel.searchResults.slice(0, 3).map((r: any, i: number) => `${i + 1}. ${r.title}: ${r.content.substring(0, 150)}...`).join('\n')}`
            : "No recent news found.";

        // 3. Feed to Llama 3.1 to generate the "Chaos to Success" narrative (PHASE 2)
        const prompt = `
You are the Lead Tech Architect at TechPartner, a premium design & web development agency in Saudi Arabia.
You are writing a personalized email audit for ${companyName || 'this company'} (${targetUrl}).

WEBSITE CONTENT:
"${siteText}"

REAL-TIME INTELLIGENCE (Tavily Search):
${tavilyContext}

TASK: Write a personalized "Chaos to Success" narrative. The recipient just registered a domain and needs to see both their current technical bottleneck AND the vision of massive traffic success.

OUTPUT FORMAT - Return ONLY a valid JSON object:
{
  "personalized_audit_en": "3 sentences in English. Sentence 1: Acknowledge their business from the website text. Sentence 2: Identify ONE specific technical bottleneck (slow load, missing schema, mobile issues) using the Tavily intel as a hook. Sentence 3: Position TechPartner as the solution that transforms this chaos into 500K+ daily visitors.",
  "personalized_audit_ar": "The exact same 3-sentence message translated into high-level, professional Arabic (Saudi dialect preferred).",
  "subject_line": "A Digital Audit for ${companyName || 'Your Company'} | TechPartner"
}

RULES:
- Be specific about their industry based on website content
- Use the Tavily news as a hook (e.g., 'Given the recent expansion in your sector...')
- English version: Professional, authoritative, under 100 words
- Arabic version: Same meaning, professional tone, compelling
- Output MUST be valid JSON only, no markdown, no extra text`;

        console.log(`🧠 [Clay] Sending to Llama 3.1 for "Chaos to Success" narrative...`);
        
        const aiResponse = await fetch(`${OLLAMA_HOST}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.5,
                    num_predict: 800
                }
            })
        });

        if (!aiResponse.ok) {
            throw new Error(`Ollama API error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json() as { response?: string };
        let parsedResponse;
        
        try {
            // Try to parse the JSON response
            const rawResponse = aiData.response?.trim() || "{}";
            // Extract JSON if it's wrapped in markdown code blocks
            const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                              rawResponse.match(/```\s*([\s\S]*?)\s*```/) ||
                              [null, rawResponse];
            const cleanJson = jsonMatch[1] || rawResponse;
            parsedResponse = JSON.parse(cleanJson);
        } catch (parseError) {
            console.warn("⚠️ [Clay] Could not parse AI response as JSON, using fallback");
            parsedResponse = {
                personalized_audit_en: "I noticed your website and think we could help enhance your digital presence. Our team at TechPartner specializes in building high-performance web solutions for businesses like yours. Let us transform your digital chaos into success.",
                personalized_audit_ar: "لاحظت موقعك الإلكتروني وأعتقد أننا يمكن أن نساعد في تحسين حضورك الرقمي. فريقنا في TechPartner متخصص في بناء حلول ويب عالية الأداء للشركات مثل شركتك. دعنا نحول فوضاك الرقمية إلى نجاح.",
                subject_line: `A Digital Audit for ${companyName || 'Your Company'} | TechPartner`
            };
        }

        console.log(`✅ [Clay] Generated "Chaos to Success" narrative for ${companyName || 'company'}`);

        res.status(200).json({ 
            success: true, 
            personalized_audit_en: parsedResponse.personalized_audit_en,
            personalized_audit_ar: parsedResponse.personalized_audit_ar,
            subject_line: parsedResponse.subject_line,
            tavily_intelligence: tavilyIntel.searchResults.length > 0 ? {
                sources_found: tavilyIntel.searchResults.length,
                summary: tavilyIntel.answer?.substring(0, 200) + "..."
            } : null,
            analyzed_url: targetUrl,
            company_name: companyName || null,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ [Clay] Analyze Error:", error);
        res.status(500).json({ 
            error: "Failed to analyze target website.",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// ENDPOINT 2: Push Hot Leads to CRM (Clay sends CEO data -> Saves to Neon DB)
clayRouter.post("/push-lead", requireClayAuth, async (req, res) => {
    try {
        const { name, email, company, linkedin, aiScore, source = "Clay Outbound Engine" } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "Email is required to create a lead" });
        }

        console.log(`📥 [Clay] Pushing lead to CRM: ${email} (${aiScore || 'HOT'})`);

        // Check if lead already exists
        const existingLead = await getLeadByEmail(email);
        
        if (existingLead) {
            // Update existing lead score
            await updateLeadScore(email, aiScore || "HOT");
            
            console.log(`🔄 [Clay] Updated existing lead: ${email}`);
            
            // Log the re-enrichment interaction
            await createInteraction(
                email,
                "Clay Re-enrichment",
                `Lead re-enriched via Clay. Company: ${company || 'N/A'}, LinkedIn: ${linkedin || 'N/A'}`,
                `Score updated to ${aiScore || 'HOT'}`
            );
            
            return res.status(200).json({ 
                success: true, 
                message: "Lead updated successfully",
                lead: existingLead,
                isNew: false
            });
        }

        // Create new lead using CRM function (handles both Drizzle and SQLite)
        const newLead = await createLead(name, email, source);
        
        // Update the score if it's not PENDING
        if (aiScore && aiScore !== "PENDING") {
            await updateLeadScore(email, aiScore);
        }

        console.log(`✅ [Clay] New lead created: ${email} (ID: ${newLead.id})`);

        // Log the interaction
        await createInteraction(
            email,
            "Lead Created via Clay",
            `New lead from Clay outbound. Company: ${company || 'N/A'}, LinkedIn: ${linkedin || 'N/A'}`,
            `Initial score: ${aiScore || 'HOT'}`
        );

        res.status(201).json({ 
            success: true, 
            lead: newLead,
            isNew: true,
            message: "Lead successfully saved to TechPartner CRM"
        });

    } catch (error) {
        console.error("❌ [Clay] CRM Push Error:", error);
        res.status(500).json({ 
            error: "Failed to push lead to TechPartner CRM.",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Health check endpoint for Clay integration
clayRouter.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "Clay Integration API",
        ollamaHost: OLLAMA_HOST,
        model: MODEL,
        timestamp: new Date().toISOString()
    });
});
