// server/seo-agent.ts
import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";

// 1. Define the State (The "Memory" of the Agent during a run)
export const AgentState = Annotation.Root({
  prospectUrl: Annotation<string>(),
  scrapedContent: Annotation<string>(),
  isRelevant: Annotation<boolean>(),
  analysisReason: Annotation<string>(),
  draftEmail: Annotation<string>(),
});

// 2. Initialize the Local Qwen Model (Running on your EC2 via Ollama)
const llm = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "qwen2.5:7b",
  temperature: 0.2, // Low temperature for logical analysis
});

// 3. Define Node: Analyze the Prospect
async function analyzeProspect(state: typeof AgentState.State) {
  console.log(`[Agent] Analyzing prospect: ${state.prospectUrl}`);
  
  const prompt = PromptTemplate.fromTemplate(`
    You are the SEO Director for TechPartner (a web design and SaaS agency).
    Review this scraped website content and decide if we should try to get a backlink from them.
    We want tech blogs, business sites, or software directories. We do NOT want spam sites.
    
    Website Content: {content}
    
    Respond in strict JSON format:
    {{
      "isRelevant": true/false,
      "reason": "short explanation"
    }}
  `);

  const chain = prompt.pipe(llm);
  const response = await chain.invoke({ content: state.scrapedContent });
  
  try {
    // Parse the JSON output from Qwen
    const result = JSON.parse(response.content as string);
    return { 
      isRelevant: result.isRelevant, 
      analysisReason: result.reason 
    };
  } catch (e) {
    console.error("Failed to parse LLM JSON", e);
    return { isRelevant: false, analysisReason: "Failed to parse AI output." };
  }
}

// 4. Define Node: Draft Outreach Email
async function draftPitch(state: typeof AgentState.State) {
  console.log(`[Agent] Drafting pitch for: ${state.prospectUrl}`);
  
  const prompt = PromptTemplate.fromTemplate(`
    You are writing an outreach email for TechPartner.
    The target website is about: {reason}
    
    Write a short, highly personalized email asking to collaborate or share our web design tool.
    Do not sound like a bot. Keep it under 4 sentences.
  `);

  const chain = prompt.pipe(llm);
  const response = await chain.invoke({ reason: state.analysisReason });
  
  return { draftEmail: response.content as string };
}

// 5. Define Routing Logic (Conditional Edge)
function routeProspect(state: typeof AgentState.State) {
  if (state.isRelevant) {
    console.log("[Agent] Prospect is relevant. Routing to Draft Pitch.");
    return "draftPitch";
  }
  console.log("[Agent] Prospect rejected. Ending workflow.");
  return END;
}

// 6. Build and Compile the Graph
const builder = new StateGraph(AgentState)
  .addNode("analyzeProspect", analyzeProspect)
  .addNode("draftPitch", draftPitch)
  .addEdge(START, "analyzeProspect")
  .addConditionalEdges("analyzeProspect", routeProspect)
  .addEdge("draftPitch", END);

export const seoOrchestrator = builder.compile();
