// scripts/content-director.ts - The Autonomous Content Director (Phase 3)
// This script runs on a weekly PM2 cron schedule to auto-generate SEO content

import { google } from 'googleapis';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const OLLAMA_URL = process.env.OLLAMA_HOST || 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
const ASTRO_BLOG_DIR = path.join(__dirname, '../pseo-engine/src/pages/blog');
const GSC_SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:techpartner.sa';

// Google Search Console Authentication
let searchconsole: any;
try {
    const gscAuth = new google.auth.GoogleAuth({
        keyFile: './google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    searchconsole = google.searchconsole({ version: 'v1', auth: gscAuth });
} catch (error) {
    console.warn('⚠️ [Director] Google credentials not found. GSC integration disabled.');
}

interface GSCKeyword {
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

interface ContentAnalysis {
    keyword: string;
    position: number;
    impressions: number;
    potential: 'HIGH' | 'MEDIUM' | 'LOW';
}

async function runContentDirector() {
    console.log("🤖 [Content Director] Waking up to analyze search gaps...");
    console.log(`📅 ${new Date().toISOString()}`);

    try {
        // Check if GSC is configured
        if (!searchconsole) {
            console.log("⚠️ [Director] Running in demo mode - no GSC credentials");
            await runDemoMode();
            return;
        }

        // --- STEP 1: Find "Striking Distance" Keywords in GSC ---
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        console.log(`🔍 [Director] Querying GSC for ${GSC_SITE_URL}...`);
        
        const response = await searchconsole.searchanalytics.query({
            siteUrl: GSC_SITE_URL,
            requestBody: {
                startDate: thirtyDaysAgo.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0],
                dimensions: ['query'],
                rowLimit: 100,
            }
        });

        const keywords: GSCKeyword[] = response.data.rows || [];
        
        if (keywords.length === 0) {
            console.log("📈 [Director] No keywords found in GSC. Going back to sleep.");
            return;
        }

        console.log(`📊 [Director] Analyzing ${keywords.length} keywords...`);

        // Analyze keywords for striking distance opportunities
        const opportunities: ContentAnalysis[] = keywords
            .map(kw => ({
                keyword: kw.keys?.[0] || "",
                position: kw.position || 0,
                impressions: kw.impressions || 0,
                potential: calculatePotential(kw)
            }))
            .filter(kw => kw.potential === 'HIGH' && kw.keyword.length > 3)
            .sort((a, b) => b.impressions - a.impressions);

        if (opportunities.length === 0) {
            console.log("📈 [Director] No striking distance keywords found today. Going back to sleep.");
            return;
        }

        // Select the best opportunity
        const target = opportunities[0];
        console.log(`🎯 [Director] Target acquired: "${target.keyword}"`);
        console.log(`   Position: #${target.position.toFixed(1)}`);
        console.log(`   Impressions: ${target.impressions}`);
        console.log(`   Potential: ${target.potential}`);

        // --- STEP 2: Generate Content with Qwen ---
        await generateAndPublishContent(target.keyword);

    } catch (error) {
        console.error("❌ [Director] Error:", error);
        process.exit(1);
    }
}

function calculatePotential(kw: GSCKeyword): 'HIGH' | 'MEDIUM' | 'LOW' {
    const position = kw.position || 0;
    const impressions = kw.impressions || 0;
    
    // Striking distance: Page 2 or 3 (positions 11-30) with decent impressions
    if (position > 10 && position <= 20 && impressions > 100) return 'HIGH';
    if (position > 20 && position <= 30 && impressions > 50) return 'HIGH';
    if (position > 10 && position <= 30 && impressions > 20) return 'MEDIUM';
    return 'LOW';
}

async function generateAndPublishContent(keyword: string) {
    try {
        console.log("✍️ [Director] Instructing AI to draft the article...");
        
        const prompt = `
You are an elite SEO Content Director for TechPartner, a premium SaaS design agency in Saudi Arabia.

Write a comprehensive, engaging 1000-word blog post targeting the exact keyword: "${keyword}"

Requirements:
1. The keyword must appear naturally in the title, first paragraph, and at least 2 H2 headings
2. Write for a professional audience interested in design, technology, and business growth
3. Include practical tips and actionable insights
4. End with a subtle call-to-action mentioning TechPartner's services

Format the output EXACTLY as a Markdown file with YAML frontmatter for an Astro static site:

---
title: "Your SEO-Optimized Title Here"
description: "Compelling meta description under 160 characters"
pubDate: "${new Date().toISOString().split('T')[0]}"
author: "TechPartner Content Team"
tags: ["${keyword.split(' ')[0]}", "design", "business"]
keyword: "${keyword}"
---

# Your Article Title

Your content here...
`;

        const aiResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false
            })
        });

        if (!aiResponse.ok) {
            throw new Error(`Ollama API error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        let markdownContent = aiData.response?.trim() || '';

        // Clean up markdown code blocks if the LLM wrapped the response
        markdownContent = markdownContent
            .replace(/^```markdown\n/, '')
            .replace(/^```\n/, '')
            .replace(/\n```$/, '');

        // --- STEP 3: Save to Astro File System ---
        const slug = createSlug(keyword);
        const filePath = path.join(ASTRO_BLOG_DIR, `${slug}.md`);

        // Ensure the directory exists
        if (!fs.existsSync(ASTRO_BLOG_DIR)) {
            fs.mkdirSync(ASTRO_BLOG_DIR, { recursive: true });
            console.log(`📁 [Director] Created blog directory: ${ASTRO_BLOG_DIR}`);
        }

        // Check if file already exists (avoid duplicates)
        if (fs.existsSync(filePath)) {
            console.log(`⚠️ [Director] Article already exists: ${slug}.md`);
            console.log(`   Skipping to avoid duplicate content.`);
            return;
        }

        fs.writeFileSync(filePath, markdownContent);
        console.log(`💾 [Director] Article saved: ${slug}.md`);

        // Log the content creation
        logContentCreation(keyword, slug, filePath);

        // --- STEP 4: Trigger Astro Build ---
        console.log("🚀 [Director] Triggering Astro pSEO Engine Build...");
        
        try {
            const { stdout, stderr } = await execAsync('npm run build', {
                cwd: path.join(__dirname, '../pseo-engine'),
                timeout: 300000 // 5 minute timeout
            });
            
            if (stderr && !stderr.includes('warning')) {
                console.warn(`⚠️ [Director] Build warnings: ${stderr}`);
            }
            
            console.log(`✅ [Director] Build successful!`);
            console.log(`🌐 [Director] New page deployed: /blog/${slug}`);
            console.log(`📈 [Director] Targeting keyword: "${keyword}"`);

        } catch (buildError) {
            console.error(`❌ [Director] Build failed:`, buildError);
            // Don't throw - the article is saved and can be built manually
        }

    } catch (error) {
        console.error("❌ [Director] Content generation failed:", error);
        throw error;
    }
}

function createSlug(keyword: string): string {
    return keyword
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Remove consecutive hyphens
        .substring(0, 50);        // Limit length
}

function logContentCreation(keyword: string, slug: string, filePath: string) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        keyword,
        slug,
        filePath,
        status: 'generated'
    };
    
    const logPath = path.join(__dirname, '../content-director-log.json');
    let logs: any[] = [];
    
    if (fs.existsSync(logPath)) {
        try {
            logs = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
        } catch (e) {
            logs = [];
        }
    }
    
    logs.push(logEntry);
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
}

async function runDemoMode() {
    console.log("🎮 [Director] Running in DEMO mode...");
    console.log("   This simulates the content generation without GSC data.");
    
    // Demo keywords for testing
    const demoKeywords = [
        "web design saudi arabia",
        "branding agency jeddah",
        "mobile app development riyadh"
    ];
    
    const randomKeyword = demoKeywords[Math.floor(Math.random() * demoKeywords.length)];
    console.log(`🎯 [Demo] Selected keyword: "${randomKeyword}"`);
    
    // In demo mode, we just show what would happen
    console.log("📋 [Demo] Would generate content for:", randomKeyword);
    console.log("📋 [Demo] Would save to:", path.join(ASTRO_BLOG_DIR, `${createSlug(randomKeyword)}.md`));
    console.log("✅ [Demo] Demo complete. Set up GSC credentials for live mode.");
}

// Run the director
if (require.main === module) {
    runContentDirector().then(() => {
        console.log("🏁 [Director] Mission complete.");
        process.exit(0);
    }).catch(error => {
        console.error("💥 [Director] Fatal error:", error);
        process.exit(1);
    });
}

export { runContentDirector, generateAndPublishContent };
