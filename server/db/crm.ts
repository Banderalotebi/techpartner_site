// server/db/crm.ts - The Unified AI CRM Database (Drizzle ORM + Neon PostgreSQL)
// Falls back to SQLite when DATABASE_URL is not set
import { db } from "../db";
import { leads, interactions, type Lead, type Interaction } from "../../shared/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { randomUUID } from "crypto";
import Database from "better-sqlite3";

// SQLite fallback for when Drizzle is not available
let sqliteDb: Database.Database | null = null;

function getSQLiteDB(): Database.Database {
  if (!sqliteDb) {
    sqliteDb = new Database('data/techpartner.db');
    // Ensure tables exist
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        source TEXT DEFAULT 'Chatbot',
        lead_score TEXT DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_email TEXT,
        interaction_type TEXT,
        content TEXT,
        ai_summary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return sqliteDb;
}

// Check if we're using Drizzle or SQLite
const isDrizzleAvailable = db !== null;

console.log(isDrizzleAvailable 
  ? "✅ [CRM Vault] Drizzle ORM initialized for Neon PostgreSQL" 
  : "⚠️ [CRM Vault] Using SQLite fallback");

// Create a new lead
export async function createLead(name: string, email: string, source: string = "Chatbot") {
  const id = randomUUID();
  
  if (isDrizzleAvailable) {
    const result = await db
      .insert(leads)
      .values({
        id,
        name: name || "Unknown",
        email,
        source,
        leadScore: "PENDING",
      })
      .onConflictDoNothing({ target: leads.email })
      .returning();
    
    return result[0];
  } else {
    // SQLite fallback
    const sqlite = getSQLiteDB();
    try {
      sqlite.prepare(`
        INSERT INTO leads (id, name, email, source, lead_score)
        VALUES (?, ?, ?, ?, 'PENDING')
      `).run(id, name || "Unknown", email, source);
    } catch (e) {
      // Lead already exists, fetch existing
    }
    return sqlite.prepare('SELECT * FROM leads WHERE email = ?').get(email);
  }
}

// Update lead score
export async function updateLeadScore(email: string, score: string) {
  if (isDrizzleAvailable) {
    const result = await db
      .update(leads)
      .set({
        leadScore: score,
        updatedAt: new Date(),
      })
      .where(eq(leads.email, email))
      .returning();
    
    return result[0];
  } else {
    const sqlite = getSQLiteDB();
    sqlite.prepare("UPDATE leads SET lead_score = ?, updated_at = datetime('now') WHERE email = ?")
      .run(score, email);
    return sqlite.prepare('SELECT * FROM leads WHERE email = ?').get(email);
  }
}

// Get lead by email
export async function getLeadByEmail(email: string): Promise<Lead | undefined> {
  if (isDrizzleAvailable) {
    const result = await db
      .select()
      .from(leads)
      .where(eq(leads.email, email))
      .limit(1);
    
    return result[0];
  } else {
    const sqlite = getSQLiteDB();
    const row = sqlite.prepare('SELECT * FROM leads WHERE email = ?').get(email);
    return row as Lead | undefined;
  }
}

// Get all leads with latest summary
export async function getAllLeads(): Promise<(Lead & { latestSummary: string | null })[]> {
  if (isDrizzleAvailable) {
    // Get all leads
    const allLeads = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));

    // Get latest summary for each lead
    const leadsWithSummaries = await Promise.all(
      allLeads.map(async (lead) => {
        const latestInteraction = await db
          .select({ aiSummary: interactions.aiSummary })
          .from(interactions)
          .where(eq(interactions.leadEmail, lead.email))
          .orderBy(desc(interactions.createdAt))
          .limit(1);

        return {
          ...lead,
          latestSummary: latestInteraction[0]?.aiSummary || null,
        };
      })
    );

    return leadsWithSummaries;
  } else {
    const sqlite = getSQLiteDB();
    const allLeads = sqlite.prepare('SELECT * FROM leads ORDER BY created_at DESC').all() as Lead[];
    
    return allLeads.map((lead) => {
      const latestInteraction = sqlite.prepare(
        'SELECT ai_summary FROM interactions WHERE lead_email = ? ORDER BY created_at DESC LIMIT 1'
      ).get(lead.email) as { ai_summary: string | null } | undefined;
      
      return {
        ...lead,
        latestSummary: latestInteraction?.ai_summary || null,
      };
    });
  }
}

// Get leads by score
export async function getLeadsByScore(score: string): Promise<Lead[]> {
  if (isDrizzleAvailable) {
    return await db
      .select()
      .from(leads)
      .where(eq(leads.leadScore, score))
      .orderBy(desc(leads.createdAt));
  } else {
    const sqlite = getSQLiteDB();
    return sqlite.prepare("SELECT * FROM leads WHERE lead_score = ? ORDER BY created_at DESC").all(score) as Lead[];
  }
}

// Create an interaction
export async function createInteraction(
  leadEmail: string,
  type: string,
  content: string,
  aiSummary?: string
) {
  if (isDrizzleAvailable) {
    const result = await db
      .insert(interactions)
      .values({
        leadEmail,
        interactionType: type,
        content,
        aiSummary: aiSummary || null,
      })
      .returning();
    
    return result[0];
  } else {
    const sqlite = getSQLiteDB();
    const result = sqlite.prepare(`
      INSERT INTO interactions (lead_email, interaction_type, content, ai_summary)
      VALUES (?, ?, ?, ?)
    `).run(leadEmail, type, content, aiSummary || null);
    
    return sqlite.prepare('SELECT * FROM interactions WHERE id = ?').get(result.lastInsertRowid);
  }
}

// Get interactions by lead email
export async function getInteractionsByLead(email: string): Promise<Interaction[]> {
  if (isDrizzleAvailable) {
    return await db
      .select()
      .from(interactions)
      .where(eq(interactions.leadEmail, email))
      .orderBy(desc(interactions.createdAt));
  } else {
    const sqlite = getSQLiteDB();
    return sqlite.prepare('SELECT * FROM interactions WHERE lead_email = ? ORDER BY created_at DESC').all(email) as Interaction[];
  }
}

// Get all interactions
export async function getAllInteractions(): Promise<Interaction[]> {
  if (isDrizzleAvailable) {
    return await db
      .select()
      .from(interactions)
      .orderBy(desc(interactions.createdAt));
  } else {
    const sqlite = getSQLiteDB();
    return sqlite.prepare('SELECT * FROM interactions ORDER BY created_at DESC').all() as Interaction[];
  }
}

// Get CRM statistics
export async function getCRMStats() {
  try {
    if (isDrizzleAvailable) {
      const [totalResult] = await db
        .select({ count: count() })
        .from(leads);

      const [hotResult] = await db
        .select({ count: count() })
        .from(leads)
        .where(eq(leads.leadScore, "HOT"));

      const [warmResult] = await db
        .select({ count: count() })
        .from(leads)
        .where(eq(leads.leadScore, "WARM"));

      const [coldResult] = await db
        .select({ count: count() })
        .from(leads)
        .where(eq(leads.leadScore, "COLD"));

      const [pendingResult] = await db
        .select({ count: count() })
        .from(leads)
        .where(eq(leads.leadScore, "PENDING"));

      return {
        total: totalResult?.count || 0,
        hot: hotResult?.count || 0,
        warm: warmResult?.count || 0,
        cold: coldResult?.count || 0,
        pending: pendingResult?.count || 0,
      };
    } else {
      const sqlite = getSQLiteDB();
      const total = sqlite.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number };
      const hot = sqlite.prepare("SELECT COUNT(*) as count FROM leads WHERE lead_score = 'HOT'").get() as { count: number };
      const warm = sqlite.prepare("SELECT COUNT(*) as count FROM leads WHERE lead_score = 'WARM'").get() as { count: number };
      const cold = sqlite.prepare("SELECT COUNT(*) as count FROM leads WHERE lead_score = 'COLD'").get() as { count: number };
      const pending = sqlite.prepare("SELECT COUNT(*) as count FROM leads WHERE lead_score = 'PENDING'").get() as { count: number };

      return {
        total: total?.count || 0,
        hot: hot?.count || 0,
        warm: warm?.count || 0,
        cold: cold?.count || 0,
        pending: pending?.count || 0,
      };
    }
  } catch (error) {
    console.error('Error getting CRM stats:', error);
    return { total: 0, hot: 0, warm: 0, cold: 0, pending: 0 };
  }
}

// Export leads to CSV
export async function exportLeadsToCSV(): Promise<string | null> {
  const allLeads = await getAllLeads();

  if (allLeads.length === 0) return null;

  const headers = ["ID", "Name", "Email", "Source", "Score", "Created At", "Latest Summary"];

  const csvRows = allLeads.map((lead) => {
    return [
      lead.id,
      `"${lead.name || ""}"`,
      `"${lead.email}"`,
      `"${lead.source}"`,
      `"${lead.leadScore}"`,
      `"${new Date(lead.createdAt).toISOString()}"`,
      `"${lead.latestSummary || ""}"`,
    ].join(",");
  });

  return [headers.join(","), ...csvRows].join("\n");
}

// Legacy object export for backward compatibility
export const crmOperations = {
  createLead,
  updateLeadScore,
  getLeadByEmail,
  getAllLeads,
  getLeadsByScore,
  createInteraction,
  getInteractionsByLead,
  getAllInteractions,
  getCRMStats,
  exportLeadsToCSV,
};
