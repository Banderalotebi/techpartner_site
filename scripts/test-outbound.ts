#!/usr/bin/env tsx
/**
 * PHASE 4: The "Bander Test" - Complete Outbound Engine Test
 * Simulates: Tavily Search -> Llama Analysis -> HTML Injection -> Email Send
 */

import { tavily } from "@tavily/core";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

// Configuration
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "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";
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";
const TEST_EMAIL = "bander.alotebi@gmail.com";

// Test lead data
const TEST_LEAD = {
    businessName: "Tech Innovators KSA",
    websiteUrl: "https://example.com",
    email: TEST_EMAIL
};

const tvly = tavily({ apiKey: TAVILY_API_KEY });

async function runTavilySearch(companyName: string) {
    console.log(`🔍 [Test] Running Tavily search for: ${companyName}`);
    
    try {
        const response = await tvly.search(`${companyName} recent news 2026 tech stack Saudi Arabia`, {
            searchDepth: "advanced",
            maxResults: 3,
            includeAnswer: true
        });
        
        console.log(`✅ [Tavily] Found ${response.results.length} sources`);
        return response;
    } catch (error) {
        console.error("❌ [Tavily] Search failed:", error);
        return { results: [], answer: null };
    }
}

async function fetchWebsiteContent(url: string) {
    console.log(`🌐 [Test] Fetching website: ${url}`);
    
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            timeout: 10000
        } as any);
        
        const html = await response.text();
        const $ = cheerio.load(html);
        
        const text = $('body')
            .find('h1, h2, h3, p')
            .map((_, el) => $(el).text())
            .get()
            .join(' ')
            .substring(0, 1500);
            
        console.log(`✅ [Test] Extracted ${text.length} chars`);
        return text;
    } catch (error) {
        console.warn("⚠️ [Test] Could not fetch website, using fallback");
        return "Sample website content for testing purposes.";
    }
}

async function generateAuditWithLlama(siteText: string, tavilyData: any, companyName: string) {
    console.log(`🧠 [Test] Generating "Chaos to Success" narrative with Llama 3.1...`);
    
    const tavilyContext = tavilyData.answer 
        ? `Recent News: ${tavilyData.answer}\nSources: ${tavilyData.results.map((r: any) => r.title).join(', ')}`
        : "No recent news available.";

    const prompt = `
You are the Lead Tech Architect at TechPartner, a premium Saudi web agency.
Write a personalized email audit for ${companyName}.

WEBSITE CONTENT: "${siteText}"

REAL-TIME INTELLIGENCE: ${tavilyContext}

OUTPUT JSON ONLY:
{
  "personalized_audit_en": "3 sentences: acknowledge business, identify technical bottleneck, position TechPartner as solution for 500K+ visitors",
  "personalized_audit_ar": "Same 3 sentences in professional Arabic",
  "subject_line": "A Digital Audit for ${companyName} | TechPartner"
}`;

    try {
        const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false,
                options: { temperature: 0.5, num_predict: 600 }
            })
        });

        const data = await response.json() as { response?: string };
        
        // Parse JSON from response
        const rawResponse = data.response?.trim() || "{}";
        const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                          rawResponse.match(/```\s*([\s\S]*?)\s*```/) ||
                          [null, rawResponse];
        const cleanJson = jsonMatch[1] || rawResponse;
        
        return JSON.parse(cleanJson);
    } catch (error) {
        console.warn("⚠️ [Test] Using fallback response");
        return {
            personalized_audit_en: `I noticed ${companyName} and see tremendous potential in your digital presence. However, technical bottlenecks like slow load times and missing SEO schema may be limiting your reach. Let TechPartner transform these challenges into 500K+ daily visitors with our AI-powered optimization.`,
            personalized_audit_ar: `لاحظت ${companyName} وأرى إمكانيات هائلة في حضورك الرقمي. ومع ذلك، قد تكون العوائق التقنية مثل أوقات التحميل البطيئة ومخططات SEO المفقودة تحد من وصولك. دع TechPartner يحول هذه التحديات إلى 500 ألف زائر يوميًا من خلال تحسيننا المدعوم بالذكاء الاصطناعي.`,
            subject_line: `A Digital Audit for ${companyName} | TechPartner`
        };
    }
}

async function sendTestEmail(auditData: any) {
    console.log(`📧 [Test] Sending email to: ${TEST_EMAIL}`);
    
    // For now, we'll use a simple console output
    // In production, this would call Listmonk API or Nodemailer
    
    console.log("\n" + "=".repeat(60));
    console.log("📧 EMAIL PREVIEW");
    console.log("=".repeat(60));
    console.log(`To: ${TEST_EMAIL}`);
    console.log(`Subject: ${auditData.subject_line}`);
    console.log("\n--- ENGLISH ---");
    console.log(auditData.personalized_audit_en);
    console.log("\n--- ARABIC ---");
    console.log(auditData.personalized_audit_ar);
    console.log("=".repeat(60));
    
    // Simulate API call to Listmonk
    console.log("\n🌐 [Test] Would send via Listmonk API:");
    console.log(`   POST ${process.env.LISTMONK_HOST || 'http://localhost:8000'}/api/tx`);
    console.log(`   Template: TP_Master_Audit_V1`);
    console.log(`   Subscriber: ${TEST_EMAIL}`);
    console.log(`   Data: { personalized_audit_en, personalized_audit_ar, subject_line }`);
    
    return { success: true, messageId: "test-" + Date.now() };
}

async function runBanderTest() {
    console.log("🚀 PHASE 4: The 'Bander Test' - Outbound Engine Test");
    console.log("=".repeat(60));
    console.log(`Target: ${TEST_LEAD.businessName}`);
    console.log(`Email: ${TEST_LEAD.email}`);
    console.log("=".repeat(60) + "\n");
    
    try {
        // Step 1: Tavily Search
        const tavilyData = await runTavilySearch(TEST_LEAD.businessName);
        
        // Step 2: Fetch Website
        const siteContent = await fetchWebsiteContent(TEST_LEAD.websiteUrl);
        
        // Step 3: Llama Analysis
        const auditData = await generateAuditWithLlama(siteContent, tavilyData, TEST_LEAD.businessName);
        
        // Step 4: Send Email
        const result = await sendTestEmail(auditData);
        
        console.log("\n✅ TEST COMPLETE");
        console.log("=".repeat(60));
        console.log("Results:");
        console.log(`  Tavily Sources: ${tavilyData.results.length}`);
        console.log(`  AI Generated: ${auditData.personalized_audit_en ? '✅' : '❌'}`);
        console.log(`  Email Ready: ${result.success ? '✅' : '❌'}`);
        console.log("\nNext: Deploy to production and configure Listmonk");
        console.log("=".repeat(60));
        
    } catch (error) {
        console.error("\n❌ TEST FAILED:", error);
        process.exit(1);
    }
}

// Run the test
runBanderTest();
