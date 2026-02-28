import { Router } from "express";
import * as fs from "fs";
import * as path from "path";

export const chatRouter = Router();

// Path to the AI knowledge base (condensed info for faster responses)
const AI_KNOWLEDGE_PATH = path.join(__dirname, "../data/ai-knowledge.txt");

// Fallback system prompt if knowledge file doesn't exist
const DEFAULT_SYSTEM_PROMPT = `
You are the elite AI Sales Assistant and Strategist for "TechPartner", a top-tier SaaS design and development agency in Saudi Arabia. 

Your Goals:
1. Answer customer questions about our services warmly and professionally.
2. Suggest brilliant project ideas based on their industry.
3. Convince them why TechPartner is the best choice (we combine futuristic tech with premium design).
4. If they want a quote or want to start a project, ask them for their Email, Phone Number, and a brief project description.

Our Core Services:
- Web & App Design and Development
- Logo and Branding Design
- Business Advertising & Packaging

Rules:
- Be concise. Do not write massive essays. 
- Speak in the language the user speaks to you (Arabic or English).
- Never make up fake pricing. Say "Our team will provide a custom quote based on your exact needs."
- Always be helpful and guide users toward starting a project with us.
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
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Get the system prompt with AI knowledge
    const systemPrompt = getSystemPrompt();

    // Format the messages for Ollama (injecting the system prompt first)
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    console.log("Sending chat to Qwen2.5 7B...");

    // Call your local CPU-based Ollama model
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5:7b",
        messages: formattedMessages,
        stream: false, // Set to false to wait for the full response on CPU
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama response error:", errorText);
      throw new Error("Failed to communicate with local AI");
    }

    const data = await response.json();
    
    console.log("AI Response received:", data.message?.content?.substring(0, 100) + "...");
    
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
chatRouter.get("/health", async (req, res) => {
  try {
    // Check if Ollama is running
    const response = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
    });
    
    if (response.ok) {
      const models = await response.json();
      res.json({ 
        status: "healthy", 
        ollamaConnected: true,
        availableModels: models.models?.map((m: any) => m.name) || []
      });
    } else {
      res.json({ 
        status: "degraded", 
        ollamaConnected: false 
      });
    }
  } catch (error) {
    res.json({ 
      status: "unhealthy", 
      ollamaConnected: false,
      error: "Cannot connect to Ollama"
    });
  }
});
