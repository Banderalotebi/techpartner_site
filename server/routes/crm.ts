D// server/routes/crm.ts - The AI Sales Closer (Phase 2)
import { Router } from "express";
import {
  createLead,
  updateLeadScore,
  createInteraction,
  getAllLeads,
  getLeadsByScore,
  getInteractionsByLead,
  getCRMStats,
  exportLeadsToCSV
} from "../db/crm";
import { randomUUID } from "crypto";
import { emailService } from "../email";
import { requireAdmin, simpleAuth } from "../middleware/auth";

export const crmRouter = Router();

const OLLAMA_URL = process.env.OLLAMA_HOST || 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

// Process chat transcript and analyze with AI
crmRouter.post("/process-chat", async (req, res) => {
    const { userEmail, userName, chatTranscript, source = 'Chatbot' } = req.body;

    if (!userEmail || !chatTranscript) {
        return res.status(400).json({ error: "Email and transcript required." });
    }

    try {
        // 1. Save the raw lead to the CRM database
        console.log(`📝 [CRM] Saving lead: ${userEmail}`);
        createLead(userName, userEmail, source);

        // 2. Ask Qwen 2.5 to act as your VP of Sales
        const aiPrompt = `
You are the VP of Sales for TechPartner, a premium SaaS design and development agency in Saudi Arabia.
Analyze this chat transcript with a potential client and provide strategic insights.

Transcript:
${chatTranscript}

Provide a strictly formatted JSON response with these exact fields:
{
  "score": "HOT" | "WARM" | "COLD",
  "summary": "One sentence summary of what the client wants",
  "draftEmail": "A personalized, warm follow-up email (2-3 paragraphs) based on their specific questions",
  "reasoning": "Brief explanation of why this lead scored this way"
}

Scoring Criteria:
- HOT: High intent, urgent need, budget mentioned, ready to buy
- WARM: Interested but needs nurturing, comparing options, asking questions
- COLD: Just browsing, no clear intent, vague questions
`;

        console.log(`🧠 [AI CRM] Analyzing chat for lead: ${userEmail}...`);

        const aiResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                prompt: aiPrompt,
                stream: false,
                format: "json"
            })
        });

        if (!aiResponse.ok) {
            throw new Error(`Ollama API error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        let analysis;
        
        try {
            analysis = JSON.parse(aiData.response);
        } catch (parseError) {
            // Fallback if JSON parsing fails
            console.warn('AI response was not valid JSON, using fallback');
            analysis = {
                score: "WARM",
                summary: "Lead showed interest in TechPartner services",
                draftEmail: `Hi ${userName || 'there'},\n\nThank you for chatting with us today! I wanted to follow up on our conversation about your project.\n\nAt TechPartner, we specialize in helping businesses like yours achieve their digital goals. I'd love to schedule a quick call to discuss how we can help.\n\nBest regards,\nThe TechPartner Team`,
                reasoning: "Default scoring due to parsing error"
            };
        }

        // 3. Update the Lead Score in the CRM
        updateLeadScore(userEmail, analysis.score);
        console.log(`📊 [CRM] Lead scored: ${analysis.score}`);

        // 4. Save the Interaction and the AI's drafted email
        createInteraction(
            userEmail,
            'Chat Summary & Draft',
            analysis.draftEmail,
            analysis.summary
        );

        // 5. AUTONOMOUS MODE: If HOT lead, send email immediately
        let emailSent = false;
        if (analysis.score === "HOT") {
            console.log(`🔥 [AUTONOMOUS] HOT LEAD DETECTED! Sending email...`);
            
            try {
                await emailService.sendEmail({
                    to: userEmail,
                    subject: "Following up on our chat - Let's get started!",
                    text: analysis.draftEmail,
                    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #01A1C1;">TechPartner</h2>
                        <div style="white-space: pre-wrap;">${analysis.draftEmail.replace(/\n/g, '<br>')}</div>
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #666;">
                            This email was personalized by our AI based on your conversation.
                        </p>
                    </div>`
                });

                // Log autonomous action
                createInteraction(
                    userEmail,
                    'Autonomous Email Sent',
                    analysis.draftEmail,
                    'AI automatically sent follow-up email to HOT lead'
                );
                
                emailSent = true;
                console.log(`✅ [AUTONOMOUS] Email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('Failed to send autonomous email:', emailError);
            }
        }

        // Return success to the frontend
        res.json({ 
            success: true,
            message: "Chat processed and AI sales draft generated.",
            analysis: {
                score: analysis.score,
                summary: analysis.summary,
                draftEmail: analysis.draftEmail,
                reasoning: analysis.reasoning
            },
            autonomousAction: analysis.score === "HOT" ? (emailSent ? "Email sent" : "Email failed") : null
        });

    } catch (error) {
        console.error("❌ [AI CRM] Error:", error);
        res.status(500).json({ 
            error: "Failed to process chat.",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get all leads (Admin only)
crmRouter.get("/leads", requireAdmin, async (req, res) => {
    try {
        const leads = getAllLeads();
        res.json(leads);
    } catch (error) {
        console.error("Failed to fetch leads:", error);
        res.status(500).json({ error: "Database error fetching leads." });
    }
});

// Get leads by score (Admin only)
crmRouter.get("/leads/score/:score", requireAdmin, async (req, res) => {
    try {
        const { score } = req.params;
        const validScores = ['HOT', 'WARM', 'COLD', 'PENDING'];
        
        if (!validScores.includes(score.toUpperCase())) {
            return res.status(400).json({ error: "Invalid score. Use HOT, WARM, COLD, or PENDING." });
        }
        
        const leads = getLeadsByScore(score.toUpperCase());
        res.json(leads);
    } catch (error) {
        console.error("Failed to fetch leads by score:", error);
        res.status(500).json({ error: "Database error." });
    }
});

// Get interactions for a specific lead (Admin only)
crmRouter.get("/interactions/:email", requireAdmin, async (req, res) => {
    try {
        const { email } = req.params;
        const interactions = getInteractionsByLead(email);
        res.json(interactions);
    } catch (error) {
        console.error("Failed to fetch interactions:", error);
        res.status(500).json({ error: "Database error." });
    }
});

// Get CRM statistics (Admin token auth for easier access)
crmRouter.get("/stats", simpleAuth, async (req, res) => {
    try {
        const stats = getCRMStats();
        res.json(stats);
    } catch (error) {
        console.error("Failed to fetch CRM stats:", error);
        res.status(500).json({ error: "Database error." });
    }
});

// Export leads to CSV (Admin only)
crmRouter.get("/export/leads", requireAdmin, async (req, res) => {
    try {
        const csvContent = exportLeadsToCSV();
        
        if (!csvContent) {
            return res.status(404).json({ error: "No leads to export." });
        }

        // Set headers for file download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=ai_crm_leads_${new Date().toISOString().split('T')[0]}.csv`);
        
        res.status(200).send(csvContent);
    } catch (error) {
        console.error("CSV Export Error:", error);
        res.status(500).json({ error: "Failed to generate CSV." });
    }
});

// Manual lead creation (Admin only)
crmRouter.post("/leads", requireAdmin, async (req, res) => {
    try {
        const { name, email, source = 'Manual', leadScore = 'PENDING' } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        createLead(name, email, source);
        
        if (leadScore !== 'PENDING') {
            updateLeadScore(email, leadScore);
        }

        res.json({ success: true, message: "Lead created successfully." });
    } catch (error) {
        console.error("Failed to create lead:", error);
        res.status(500).json({ error: "Database error." });
    }
});

// Update lead score manually (Admin only)
crmRouter.patch("/leads/:email/score", requireAdmin, async (req, res) => {
    try {
        const { email } = req.params;
        const { score } = req.body;
        
        const validScores = ['HOT', 'WARM', 'COLD', 'PENDING'];
        if (!validScores.includes(score.toUpperCase())) {
            return res.status(400).json({ error: "Invalid score." });
        }

        updateLeadScore(email, score.toUpperCase());
        
        // Log the manual update
        createInteraction(
            email,
            'Manual Score Update',
            `Lead score manually updated to ${score.toUpperCase()}`,
            'Admin manually adjusted lead scoring'
        );

        res.json({ success: true, message: "Lead score updated." });
    } catch (error) {
        console.error("Failed to update lead score:", error);
        res.status(500).json({ error: "Database error." });
    }
});
