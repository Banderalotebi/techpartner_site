import Database from "better-sqlite3";
import { memoryStore } from "../server/ai-tools";

const CRM_DB_PATH = "./data/crm-vault.db";

interface ChatInteraction {
  id: number;
  lead_email: string;
  interaction_type: string;
  content: string;
  ai_summary: string;
  created_at: string;
  name?: string;
  lead_score?: string;
}

async function runNightlyReflection() {
  console.log("🧠 [Nightly Reflection] Starting AI learning process...");
  console.log(`⏰ ${new Date().toISOString()}`);

  try {
    // 1. Connect to CRM database
    const db = new Database(CRM_DB_PATH);
    
    // 2. Get yesterday's chat interactions
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const interactions = db.prepare(`
      SELECT i.*, l.name, l.lead_score 
      FROM interactions i
      JOIN leads l ON i.lead_email = l.email
      WHERE date(i.created_at) >= ?
      AND i.interaction_type IN ('Chat Transcript', 'Chat Summary & Draft')
      ORDER BY i.created_at DESC
    `).all(yesterdayStr) as ChatInteraction[];

    console.log(`📊 Found ${interactions.length} interactions from yesterday`);

    if (interactions.length === 0) {
      console.log("😴 No new data to learn from. Going back to sleep.");
      db.close();
      return;
    }

    // 3. Extract insights from each interaction
    const insights: string[] = [];
    
    for (const interaction of interactions) {
      // Store the raw conversation as a memory
      await memoryStore.add(interaction.content, {
        type: "chat_transcript",
        lead: interaction.lead_email,
        leadScore: interaction.lead_score,
        date: interaction.created_at,
      });

      // If there's an AI summary, store it as a market insight
      if (interaction.ai_summary) {
        insights.push(interaction.ai_summary);
      }
    }

    // 4. Create a consolidated market insight
    if (insights.length > 0) {
      const consolidatedInsight = `
Market Analysis - ${yesterdayStr}:
${insights.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

Key Patterns:
- Total HOT leads: ${interactions.filter(i => i.lead_score === 'HOT').length}
- Total WARM leads: ${interactions.filter(i => i.lead_score === 'WARM').length}
- Most common requests: ${extractCommonRequests(interactions)}
      `.trim();

      await memoryStore.add(consolidatedInsight, {
        type: "daily_market_insight",
        date: yesterdayStr,
        totalInteractions: interactions.length,
      });

      console.log(`💡 Stored market insight: ${consolidatedInsight.substring(0, 100)}...`);
    }

    // 5. Extract pricing intelligence
    const pricingMentions = interactions.filter(i => 
      i.content.toLowerCase().includes('price') || 
      i.content.toLowerCase().includes('budget') ||
      i.content.toLowerCase().includes('cost') ||
      i.content.toLowerCase().includes('sar') ||
      i.content.toLowerCase().includes('riyal')
    );

    if (pricingMentions.length > 0) {
      const pricingInsight = `
Pricing Intelligence - ${yesterdayStr}:
${pricingMentions.map(p => `- ${p.lead_email}: ${extractPricingContext(p.content)}`).join('\n')}

Note: These are client-mentioned figures, not final quotes.
      `.trim();

      await memoryStore.add(pricingInsight, {
        type: "pricing_intelligence",
        date: yesterdayStr,
        mentions: pricingMentions.length,
      });

      console.log(`💰 Stored pricing intelligence (${pricingMentions.length} mentions)`);
    }

    // 6. Close database
    db.close();

    // 7. Report stats
    const stats = await memoryStore.getStats();
    console.log("✅ [Nightly Reflection] Complete!");
    console.log(`🧠 Total memories: ${stats.total}`);
    console.log(`🧠 Recent memories (7 days): ${stats.recent}`);

  } catch (error) {
    console.error("❌ [Nightly Reflection] Error:", error);
    process.exit(1);
  }
}

// Helper: Extract common service requests
function extractCommonRequests(interactions: ChatInteraction[]): string {
  const keywords = ['website', 'app', 'logo', 'branding', 'e-commerce', 'marketing', 'design'];
  const counts: Record<string, number> = {};
  
  for (const interaction of interactions) {
    const text = interaction.content.toLowerCase();
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        counts[keyword] = (counts[keyword] || 0) + 1;
      }
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, v]) => `${k} (${v})`)
    .join(', ') || 'none detected';
}

// Helper: Extract pricing context
function extractPricingContext(text: string): string {
  // Look for numbers followed by SAR, riyal, or price mentions
  const sentences = text.split(/[.!?]/);
  const relevant = sentences.find(s => 
    /(\d+.*sar|\d+.*riyal|price.*\d|budget.*\d)/i.test(s)
  );
  return relevant ? relevant.trim().substring(0, 100) : "pricing mentioned";
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  runNightlyReflection();
}

export { runNightlyReflection };
