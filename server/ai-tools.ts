import { ChatOllama } from "@langchain/ollama";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { Tool } from "@langchain/core/tools";
import fs from "fs";
import path from "path";

// Web Search Tool - DuckDuckGo (no API key required)
export const webSearchTool = new DuckDuckGoSearch({ maxResults: 3 });

// Custom tool for searching CRM memory
export class MemorySearchTool extends Tool {
  name = "search_memory";
  description = "Search past conversations and learned insights from the CRM database. Use this when you need to recall what clients have asked for, market trends, or previous interactions.";

  constructor(private memoryStore: MemoryStore) {
    super();
  }

  async _call(query: string): Promise<string> {
    const results = await this.memoryStore.search(query, 3);
    if (results.length === 0) {
      return "No relevant memories found.";
    }
    return results.map((r, i) => `${i + 1}. ${r.content} (relevance: ${r.score.toFixed(2)})`).join("\n");
  }
}

// Simple in-memory vector store with persistence
interface MemoryDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
  timestamp: Date;
}

export class MemoryStore {
  private documents: MemoryDocument[] = [];
  private readonly storagePath: string;

  constructor(storagePath = "./data/ai-memory.json") {
    this.storagePath = storagePath;
    this.load();
  }

  // Simple cosine similarity
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Create simple embedding using word hashing (works without native deps)
  private async createEmbedding(text: string): Promise<number[]> {
    // Simple but effective: character n-gram frequencies
    const vector = new Array(256).fill(0);
    const normalized = text.toLowerCase();
    
    for (let i = 0; i < normalized.length - 2; i++) {
      const triplet = normalized.slice(i, i + 3);
      let hash = 0;
      for (let j = 0; j < triplet.length; j++) {
        hash = ((hash << 5) - hash) + triplet.charCodeAt(j);
        hash = hash & hash;
      }
      vector[Math.abs(hash) % 256] += 1;
    }
    
    // Normalize
    const magnitude = Math.sqrt(vector.reduce((a, b) => a + b * b, 0));
    return vector.map(v => v / (magnitude || 1));
  }

  async add(content: string, metadata: Record<string, any> = {}): Promise<void> {
    const embedding = await this.createEmbedding(content);
    const doc: MemoryDocument = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      embedding,
      metadata,
      timestamp: new Date(),
    };
    this.documents.push(doc);
    this.save();
    console.log(`🧠 Memory stored: ${content.substring(0, 50)}...`);
  }

  async search(query: string, topK: number = 3): Promise<Array<{ content: string; score: number; metadata: any }>> {
    if (this.documents.length === 0) {
      return [];
    }

    const queryEmbedding = await this.createEmbedding(query);
    
    const scored = this.documents.map(doc => ({
      content: doc.content,
      metadata: doc.metadata,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  async getRecent(days: number = 7): Promise<MemoryDocument[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return this.documents.filter(d => d.timestamp >= cutoff);
  }

  private save(): void {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storagePath, JSON.stringify(this.documents, null, 2));
    } catch (error) {
      console.error("Failed to save memory:", error);
    }
  }

  private load(): void {
    try {
      if (fs.existsSync(this.storagePath)) {
        const data = JSON.parse(fs.readFileSync(this.storagePath, "utf-8"));
        this.documents = data.map((d: any) => ({
          ...d,
          timestamp: new Date(d.timestamp),
        }));
        console.log(`🧠 Loaded ${this.documents.length} memories from storage`);
      }
    } catch (error) {
      console.error("Failed to load memory:", error);
    }
  }

  async getStats(): Promise<{ total: number; recent: number }> {
    const recent = await this.getRecent(7);
    return {
      total: this.documents.length,
      recent: recent.length,
    };
  }
}

// Global memory store instance
export const memoryStore = new MemoryStore();

// Initialize Ollama with tools
export function createAIAgent() {
  const llm = new ChatOllama({
    baseUrl: process.env.OLLAMA_HOST || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "llama3.1:8b",
    temperature: 0.7,
  });

  return {
    llm,
    tools: [webSearchTool, new MemorySearchTool(memoryStore)],
    memory: memoryStore,
  };
}
