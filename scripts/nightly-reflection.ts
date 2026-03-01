import { db } from "../server/db";
import { leads, interactions } from "../shared/schema";
import { memoryStore } from "../server/ai-tools";
import { eq, gte, desc, sql } from "drizzle-orm";

interface ChatInteraction {
  id: number;
  leadEmail: string;
  interactionType: string;
  content: string;
  aiSummary: string | null;
  createdAt: Date;
  name: string | null;
  leadScore: string | null;
}

async function runNightlyReflection() {
  console.log("🧠 [Nightly Reflection] Starting AI learning process...");
  console.log(`⏰ ${new Date().toISOString()}`);

  try {
    // 1. Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 2. Get yesterday's chat interactions using Drizzle ORM
    const interactionsData = await db
      .select({
        id: interactions.id,
        leadEmail: interactions.leadEmail,
        interactionType: interactions.interactionType,
        content: interactions.content,
        aiSummary: interactions.aiSummary,
        createdAt: interactions.createdAt,
        name: leads.name,
        leadScore: leads.leadScore,
      })
      .from(interactions)
      .innerJoin(leads, eq(interactions.leadEmail, leads.email))
      .where(
        sql`date(${interactions.createdAt}) >= ${yesterdayStr} AND ${interactions.interactionType} IN ('Chat Transcript', 'Chat Summary & Draft')`
      )
      .orderBy(desc(interactions.createdAt));

    const typedInteractions = interactionsData as ChatInteraction[];

    console.log(`📊 Found ${typedInteractions.length} interactions from yesterday`);

    if (typedInteractions.length === 0) {
      console.log("😴 No new data to learn from. Going back to sleep.");
      return;
    }

    // 3. Extract insights from each interaction
    const insights: string[] = [];
    
    for (const interaction of typedInteractions) {
      // Store the raw conversation as a memory
      await memoryStore.add(interaction.content, {
        type: "chat_transcript",
        lead: interaction.leadEmail,
        leadScore: interaction.leadScore,
        date: interaction.createdAt.toISOString(),
      });

      // If there's an AI summary, store it as a market insight
      if (interaction.aiSummary) {
        insights.push(interaction.aiSummary);
      }
    }

    // 4. Create a consolidated market insight
    if (insights.length > 0) {
      const consolidatedInsight = `
Market Analysis - ${yesterdayStr}:
${insights.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

Key Patterns:
- Total HOT leads: ${typedInteractions.filter(i => i.leadScore === 'HOT').length}
- Total WARM leads: ${typedInteractions.filter(i => i.leadScore === 'WARM').length}
- Most common requests: ${extractCommonRequests(typedInteractions)}
      `.trim();

      await memoryStore.add(consolidatedInsight, {
        type: "daily_market_insight",
        date: yesterdayStr,
        totalInteractions: typedInteractions.length,
      });

      console.log(`💡 Stored market insight: ${consolidatedInsight.substring(0, 100)}...`);
    }

    // 5. Extract pricing intelligence
    const pricingMentions = typedInteractions.filter(i => 
      i.content.toLowerCase().includes('price') || 
      i.content.toLowerCase().includes('budget') ||
      i.content.toLowerCase().includes('cost') ||
      i.content.toLowerCase().includes('sar') ||
      i.content.toLowerCase().includes('riyal')
    );

    if (pricingMentions.length > 0) {
      const pricingInsight = `
Pricing Intelligence - ${yesterdayStr}:
${pricingMentions.map(p => `- ${p.leadEmail}: ${extractPricingContext(p.content)}`).join('\n')}

Note: These are client-mentioned figures, not final quotes.
      `.trim();

      await memoryStore.add(pricingInsight, {
        type: "pricing_intelligence",
        date: yesterdayStr,
        mentions: pricingMentions.length,
      });

      console.log(`💰 Stored pricing intelligence (${pricingMentions.length} mentions)`);
    }

    // 6. Report stats
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
