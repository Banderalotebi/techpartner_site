import { Router } from "express";
import * as fs from "fs";
import * as path from "path";
import { memoryStore, webSearchTool } from "../ai-tools";

// Use process.cwd() for CommonJS/ESM compatibility
const __dirname = process.cwd();

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

export const chatRouter = Router();

// Path to the AI knowledge base (condensed info for faster responses)
const AI_KNOWLEDGE_PATH = path.join(__dirname, "../data/ai-knowledge.txt");

// Fallback system prompt if knowledge file doesn't exist
const DEFAULT_SYSTEM_PROMPT = `
You are the elite AI Sales Assistant for TechPartner, a top-tier SaaS agency in Saudi Arabia.

You have access to:
1. Long-term memory of past client conversations
2. Web search for current market trends and competitor analysis

FORMATTING RULES (CRITICAL):
1. Always use short paragraphs (1-2 sentences max).
2. Use markdown bullet points for lists (start lines with "- ").
3. Always leave a blank line between paragraphs for readability.
4. Never write walls of text - break content into digestible chunks.
5. Use emojis occasionally (👋, 💡, 🚀, ✅).

Our Services:
- Web & App Design and Development
- Logo and Branding Design
- Business Advertising & Packaging

Rules:
- Be concise, warm, and professional.
- Speak Arabic or English based on the user.
- Never make up pricing.
- Guide users toward starting a project.
- When you recall past conversations, mention it naturally: "Based on what I've learned from similar clients..."
`;


// Get the system prompt with AI knowledge
function getSystemPrompt(): string {
  try {
    if (fs.existsSync(AI_KNOWLEDGE_PATH)) {
      const knowledge = fs.readFileSync(AI_KNOWLEDGE_PATH, "utf-8");
      return `${DEFAULT_SYSTEM_PROMPT}\n\n# Company Knowledge Base:\n${knowledge}`;
    }
  } catch (error) {
    console.error("Error reading AI knowledge file:", error);
  }
  return DEFAULT_SYSTEM_PROMPT;
}

chatRouter.post("/", async (req, res) => {
  try {
    const { messages, userEmail } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Get the latest user message for memory search
    const latestUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
    
    // 1. Search memory for relevant past conversations
    const relevantMemories = await memoryStore.search(latestUserMessage, 3);
    let memoryContext = "";
    if (relevantMemories.length > 0) {
      memoryContext = "\n\nRELEVANT PAST CONVERSATIONS:\n" + 
        relevantMemories.map(m => `- ${m.content.substring(0, 200)}...`).join("\n");
      console.log(`🧠 Found ${relevantMemories.length} relevant memories`);
    }

    // 2. Check if we should do a web search (for market trends, pricing, etc.)
    let webContext = "";
    const shouldSearchWeb = /trend|market|competitor|price|cost|202[4-9]|latest/i.test(latestUserMessage);
    if (shouldSearchWeb) {
      try {
        console.log("🔍 Searching web for:", latestUserMessage.substring(0, 50));
        const searchResults = await webSearchTool.invoke(latestUserMessage);
        webContext = "\n\nCURRENT MARKET DATA (from web search):\n" + searchResults.substring(0, 500);
      } catch (e) {
        console.log("Web search failed, continuing without it");
      }
    }

    // 3. Build enhanced system prompt with memory and web context
    const systemPrompt = getSystemPrompt() + memoryContext + webContext;
    
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    console.log("🤖 Sending to Llama 3.1 with enhanced context...");
    const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: formattedMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama response error:", errorText);
      throw new Error("Failed to communicate with local AI");
    }

    const data = await response.json();
    const aiResponse = data.message?.content || "";
    
    console.log("✅ AI Response:", aiResponse.substring(0, 100) + "...");

    // 4. Store this conversation in memory for future learning
    const conversationSummary = `
User: ${latestUserMessage}
AI: ${aiResponse.substring(0, 200)}
    `.trim();
    
    await memoryStore.add(conversationSummary, {
      type: "chat_exchange",
      userEmail: userEmail || "anonymous",
      timestamp: new Date().toISOString(),
    });

    // Send the AI's reply back to the React frontend
    res.json({ reply: data.message });

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ 
      error: "The AI assistant is currently taking a coffee break.",
      details: error.message 
    });
  }
});


// Health check for the chat service
// Get memory stats
chatRouter.get("/memory", async (req, res) => {
  try {
    const stats = await memoryStore.getStats();
    const recent = await memoryStore.getRecent(7);
    res.json({
      stats,
      recentMemories: recent.slice(0, 5).map(m => ({
        content: m.content.substring(0, 100),
        timestamp: m.timestamp,
        metadata: m.metadata,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve memory stats" });
  }
});

chatRouter.get("/health", async (req, res) => {
  try {
    const response = await fetch("http://localhost:11434/api/tags", { method: "GET" });
    const memoryStats = await memoryStore.getStats();
    
    if (response.ok) {
      const models = await response.json();
      res.json({ 
        status: "healthy", 
        ollamaConnected: true,
        memoryStats,
        availableModels: models.models?.map((m: any) => m.name) || []
      });
    } else {
      res.json({ status: "degraded", ollamaConnected: false, memoryStats });
    }
  } catch (error) {
    const memoryStats = await memoryStore.getStats().catch(() => ({ total: 0, recent: 0 }));
    res.json({ status: "unhealthy", ollamaConnected: false, memoryStats, error: "Cannot connect to Ollama" });
  }
});
