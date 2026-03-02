// server/routes/clay.ts - Clay.com B2B Outbound Engine Integration
// The "Sniper Audit" Workflow - AI-powered website analysis and lead injection

import { Router } from "express";
import { 
  createLead, 
  updateLeadScore, 
  getLeadByEmail, 
  createInteraction 
} from "../db/crm";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

export const clayRouter = Router();

// Ollama configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

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

        // 2. Feed to Llama 3.1 to generate an outbound email icebreaker
        const prompt = `
You are the Lead Tech Architect at TechPartner, a premium design & web development agency in Saudi Arabia.
Analyze this text extracted from the website of ${companyName || 'this company'} (${targetUrl}):
"${siteText}"

Write a highly personalized, 2-sentence cold email icebreaker. 
Sentence 1: Compliment something specific about their business based on the text.
Sentence 2: Gently point out a technical, SEO, or design flaw (e.g., outdated design, missing structured data, slow load speed) and position TechPartner as the premium solution to fix it.
DO NOT sound like a bot. Be professional, direct, and authoritative.
Keep it under 150 words total.`;

        console.log(`🧠 [Clay] Sending to Llama 3.1 for analysis...`);
        
        const aiResponse = await fetch(`${OLLAMA_HOST}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.4,
                    num_predict: 200
                }
            })
        });

        if (!aiResponse.ok) {
            throw new Error(`Ollama API error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json() as { response?: string };
        const icebreaker = aiData.response?.trim() || "I noticed your website and think we could help enhance your digital presence. Our team at TechPartner specializes in building high-performance web solutions for businesses like yours.";

        console.log(`✅ [Clay] Generated icebreaker for ${companyName || 'company'}`);

        res.status(200).json({ 
            success: true, 
            personalized_icebreaker: icebreaker,
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
