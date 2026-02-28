// server/routes/tracking.ts
import { Router } from "express";
import crypto from "crypto";
import fetch from "node-fetch";

export const trackingRouter = Router();

// Your mapping of "vanity" links to actual destinations
const linkDatabase: Record<string, string> = {
  "medium-astrolabe": "https://techpartner.sa/blog/digital-astrolabe",
  "devto-beit-alfanous": "https://techpartner.sa/portfolio/beit-alfanous",
  "widget-timer": "https://techpartner.sa/tools/live-coaching",
  "default": "https://techpartner.sa/"
};

trackingRouter.get("/:campaign", async (req, res) => {
  const campaign = req.params.campaign;
  const userAgent = req.headers["user-agent"] || "unknown";
  
  // Extract real IP (Bypassing Nginx proxy if you have x-forwarded-for set up)
  const userIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "0.0.0.0"; 
  const referrer = req.headers.referer || "direct";

  // 1. Determine where the user is actually trying to go
  const destinationUrl = linkDatabase[campaign] || linkDatabase["default"];

  // 2. THE PRO MOVE: Execute tracking ASYNCHRONOUSLY.
  // We do NOT use 'await' here. The user gets redirected instantly while the server does the heavy lifting in the background.
  trackClickAsynchronously({
    campaign,
    userIp,
    userAgent,
    referrer
  }).catch(err => console.error("Background tracking failed:", err));

  // 3. SEO-Friendly 301 Redirect (Passes 100% of the Domain Authority)
  return res.redirect(301, destinationUrl);
});

// --- THE BACKGROUND WORKER ---
async function trackClickAsynchronously(data: { campaign: string, userIp: string, userAgent: string, referrer: string }) {
  
  // Create a privacy-safe unique Client ID by hashing the IP and User-Agent
  const clientId = crypto.createHash('sha256').update(`${data.userIp}-${data.userAgent}`).digest('hex');

  console.log(`[Tracker] Logging click for campaign: ${data.campaign} | Client: ${clientId.substring(0,8)}`);

  // To use Google Analytics 4 Measurement Protocol, you need your Measurement ID and API Secret
  const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID; 
  const GA_API_SECRET = process.env.GA_API_SECRET;

  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
      console.log("[Tracker] GA credentials missing, skipping API call.");
      return;
  }

  // Send the data directly to Google Analytics server-to-server
  await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      events: [{
        name: "syndicate_link_click", // Custom GA4 event
        params: {
          campaign_id: data.campaign,
          source: data.referrer,
          engagement_time_msec: "100" 
        }
      }]
    })
  });
}
