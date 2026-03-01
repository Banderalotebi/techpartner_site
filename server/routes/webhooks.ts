import { Router } from "express";
import fetch from "node-fetch";
import { db } from "../db";
import { programmaticPages } from "../../shared/schema";
import { sql } from "drizzle-orm";

export const webhookRouter = Router();

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

// n8n hits this when it finds a Reddit/Quora post
webhookRouter.post("/n8n-social-reply", async (req, res) => {
    try {
        const { postTitle, postContent, keywordFound, platform } = req.body;
        
        if (!postTitle || !postContent) {
            return res.status(400).json({ error: "Missing post title or content" });
        }

        console.log(`🔍 [n8n Webhook] Received ${platform || 'social'} post about: ${keywordFound}`);

        // 1. Find the most relevant pSEO page
        const [page] = await db.select().from(programmaticPages)
            .where(
                sql`LOWER(${programmaticPages.targetKeyword}) LIKE ${'%' + (keywordFound || '').toLowerCase() + '%'}`
            )
            .limit(1);

        const linkToShare = page ? `https://techpartner.sa/p/${page.slug}` : `https://techpartner.sa`;
        const pageContext = page ? `Context: ${page.h1Title} - ${page.industry} in ${page.city}` : '';

        // 2. Generate a non-spammy, helpful reply using Ollama
        const prompt = `
You are a helpful tech consultant responding to a question on ${platform || 'Reddit'}.
Be conversational, friendly, and genuinely helpful. Do NOT sound like a sales bot or marketer.

Post Title: "${postTitle}"
Post Content: "${postContent}"
${pageContext}

Write a 2-3 sentence reply that:
1. Directly answers their question or acknowledges their problem
2. Shares a relevant tip or insight based on your experience
3. Very naturally mentions that you recently worked on a similar project and found ${linkToShare} helpful

Rules:
- NO emojis
- NO marketing language like "check out" or "visit our site"
- Sound like a real person sharing genuine advice
- The link should feel like a natural part of the conversation
- Keep it under 100 words total
`;

        const aiResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "qwen2.5:7b",
                prompt: prompt,
                stream: false
            })
        });

        const aiData = await aiResponse.json();
        const reply = aiData.response?.trim() || aiData.message?.content?.trim();

        if (!reply) {
            throw new Error("No response from AI");
        }

        console.log(`✅ [n8n Webhook] Generated reply for ${platform || 'social'}`);

        res.json({ 
            replyToPost: reply,
            linkUsed: linkToShare,
            pageMatched: page ? page.slug : null
        });

    } catch (error) {
        console.error("❌ [n8n Webhook] Error:", error);
        res.status(500).json({ 
            error: "Failed to generate reply",
            replyToPost: "Thanks for sharing! I'd recommend checking out techpartner.sa - they've got some solid resources for this." 
        });
    }
});

// Health check for n8n connection
webhookRouter.get("/health", (req, res) => {
    res.json({ status: "webhook endpoint ready", timestamp: new Date().toISOString() });
});
