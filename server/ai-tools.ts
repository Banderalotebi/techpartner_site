import { ChatOllama } from "@langchain/ollama";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { Tool } from "@langchain/core/tools";
import { Memory as Mem0Memory } from "mem0ai/oss";

// Web Search Tool - DuckDuckGo (no API key required)
export const webSearchTool = new DuckDuckGoSearch({ maxResults: 3 });

// Shape of a stored memory used by routes and scripts
interface MemoryDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

// Mem0-backed memory store
export class MemoryStore {
  private client: Mem0Memory;
  private readonly userId: string;

  constructor(userId = "techpartner_global") {
    this.client = new Mem0Memory();
    this.userId = userId;
  }

  private resolveUserId(metadata: Record<string, any>, explicitUserId?: string): string {
    return (
      explicitUserId ||
      (metadata.userEmail as string | undefined) ||
      (metadata.lead as string | undefined) ||
      this.userId
    );
  }

  async add(
    content: string,
    metadata: Record<string, any> = {},
    userId?: string
  ): Promise<void> {
    const resolvedUserId = this.resolveUserId(metadata, userId);
    const messages = [{ role: "user", content }];
    await this.client.add(messages, {
      userId: resolvedUserId,
      metadata,
    });
    console.log(
      `🧠 Memory stored via Mem0 for ${resolvedUserId}: ${content.substring(
        0,
        50
      )}...`
    );
  }

  async search(
    query: string,
    topK: number = 3,
    userId?: string
  ): Promise<Array<{ content: string; score: number; metadata: any }>> {
    const resolvedUserId = userId || this.userId;
    const result: any = await this.client.search(query, {
      userId: resolvedUserId,
    });
    const items: any[] = result?.results ?? result ?? [];

    if (!items.length) {
      return [];
    }

    return items
      .slice(0, topK)
      .map((r: any) => ({
        content: r.memory,
        metadata: r.metadata ?? {},
        score: typeof r.score === "number" ? r.score : 0,
      }));
  }

  async getRecent(days: number = 7, userId?: string): Promise<MemoryDocument[]> {
    const resolvedUserId = userId || this.userId;
    const all: any = await this.client.getAll({ userId: resolvedUserId });
    const items: any[] = all?.results ?? all ?? [];

    const docs: MemoryDocument[] = items.map((r: any) => {
      const ts =
        r.created_at ||
        r.createdAt ||
        r.timestamp ||
        new Date().toISOString();

      return {
        id: r.id,
        content: r.memory,
        metadata: r.metadata ?? {},
        timestamp: new Date(ts),
      };
    });

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return docs.filter((d) => d.timestamp >= cutoff);
  }

  async getStats(userId?: string): Promise<{ total: number; recent: number }> {
    const resolvedUserId = userId || this.userId;
    const all: any = await this.client.getAll({ userId: resolvedUserId });
    const items: any[] = all?.results ?? all ?? [];
    const recent = await this.getRecent(7);

    return {
      total: items.length,
      recent: recent.length,
    };
  }
}

// Custom tool for searching CRM memory using Mem0
export class MemorySearchTool extends Tool {
  name = "search_memory";
  description =
    "Search past conversations and learned insights from the CRM database. Use this when you need to recall what clients have asked for, market trends, or previous interactions.";

  constructor(private memoryStore: MemoryStore) {
    super();
  }

  async _call(query: string): Promise<string> {
    const results = await this.memoryStore.search(query, 3);
    if (results.length === 0) {
      return "No relevant memories found.";
    }
    return results
      .map(
        (r, i) => `${i + 1}. ${r.content} (relevance: ${r.score.toFixed(2)})`
      )
      .join("\n");
  }
}

// Global memory store instance backed by Mem0
export const memoryStore = new MemoryStore();

// Initialize Ollama with tools, including Mem0-backed memory search
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
