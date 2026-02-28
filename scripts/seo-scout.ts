// scripts/seo-scout.ts
import { CheerioCrawler, log } from 'crawlee';
import fetch from 'node-fetch';

// Type definition for AI decision response
interface AIDecision {
  approved: boolean;
  reason: string;
  draft?: string;
}

// Set logging level to see what the bot is doing
log.setLevel(log.LEVELS.INFO);

// The local endpoint of your Phase 1 LangGraph Brain
const AI_BRAIN_URL = 'http://localhost:8080/api/seo/analyze';

// Define the crawler
const crawler = new CheerioCrawler({
    // Maximum number of pages to crawl at the same time (saves EC2 CPU)
    maxConcurrency: 5,
    
    // How many times to retry a failed request
    maxRequestRetries: 2,

    // The core function that runs on EVERY page we visit
    async requestHandler({ request, $, html }) {
        log.info(`[Scout] Inspecting: ${request.url}`);

        // 1. Extract only the meaningful text (ignore scripts, styles, navbars)
        // We target the main body or article tags, then fall back to body
        let pageText = $('article, main, .content, .post').text();
        if (!pageText.trim()) {
            pageText = $('body').text();
        }

        // Clean up the text (remove excessive whitespace and newlines)
        const cleanText = pageText.replace(/\s+/g, ' ').trim().substring(0, 4000); // Send only first 4k chars to save LLM tokens

        if (cleanText.length < 200) {
            log.warning(`[Scout] Skipping ${request.url} - Not enough content.`);
            return;
        }

        try {
            // 2. Send the extracted text to your Phase 1 LangGraph AI Brain
            log.info(`[Scout] Sending ${request.url} to AI Brain for analysis...`);
            
            const aiResponse = await fetch(AI_BRAIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: request.url,
                    content: cleanText
                })
            });

            if (!aiResponse.ok) {
                throw new Error(`AI Brain returned ${aiResponse.status}`);
            }

            const decision = await aiResponse.json() as AIDecision;

            // 3. Log the AI's Decision
            if (decision.approved) {
                log.info(`✅ [WIN] AI Approved Prospect: ${request.url}`);
                log.info(`Reason: ${decision.reason}`);
                log.info(`Drafted Pitch: \n${decision.draft ?? 'No draft generated'}\n`);
                
                // TODO: Here you could save 'decision' directly to SQLite
                // or fire a webhook to n8n to alert your Slack/Discord.
            } else {
                log.info(`❌ [REJECTED] AI passed on: ${request.url} - ${decision.reason}`);
            }

        } catch (error) {
            log.error(`[Scout] Failed to communicate with AI Brain for ${request.url}`, { error: String(error) });
        }
    },

    // What to do if a page completely fails to load
    failedRequestHandler({ request, error }) {
        log.error(`[Scout] Request ${request.url} failed completely: ${String(error)}`);
    },
});

// === RUNNING THE BOT ===
async function runScout() {
    // These are your "Footprint" URLs. 
    // In a production system, you would use a SERP API to dynamically generate 
    // this list by searching Google for things like: "top 10 web design tools"
    const targetUrls = [
        'https://example-tech-blog.com/top-saas-tools',
        'https://another-design-agency.com/resources',
        // Add real target URLs here
    ];

    log.info('🚀 Starting the TechPartner SEO Scout...');
    
    // Start the crawler
    await crawler.run(targetUrls);
    
    log.info('🏁 Scout run completed.');
}

// Execute the script
runScout();
