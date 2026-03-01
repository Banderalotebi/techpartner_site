// server/db/crm.ts - The Unified AI CRM Database
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

// Initialize CRM database (separate from main auth database for isolation)
const crmDb = new Database('crm-vault.db');
crmDb.pragma('journal_mode = WAL');

// Initialize CRM tables
crmDb.exec(`
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lead_email) REFERENCES leads(email)
  );

  CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
  CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score);
  CREATE INDEX IF NOT EXISTS idx_interactions_email ON interactions(lead_email);
`);

console.log('✅ [CRM Vault] Database initialized successfully');

// CRM Database Operations
export const crmOperations = {
  // Lead Operations
  createLead: (name: string, email: string, source: string = 'Chatbot') => {
    const id = randomUUID();
    const stmt = crmDb.prepare(`
      INSERT OR IGNORE INTO leads (id, name, email, source) 
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(id, name || "Unknown", email, source);
  },

  updateLeadScore: (email: string, score: string) => {
    const stmt = crmDb.prepare(`
      UPDATE leads SET lead_score = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?
    `);
    return stmt.run(score, email);
  },

  getLeadByEmail: (email: string) => {
    const stmt = crmDb.prepare('SELECT * FROM leads WHERE email = ?');
    return stmt.get(email);
  },

  getAllLeads: () => {
    const stmt = crmDb.prepare(`
      SELECT 
        l.*,
        (SELECT ai_summary FROM interactions 
         WHERE lead_email = l.email 
         ORDER BY created_at DESC LIMIT 1) as latest_summary
      FROM leads l
      ORDER BY l.created_at DESC
    `);
    return stmt.all();
  },

  getLeadsByScore: (score: string) => {
    const stmt = crmDb.prepare('SELECT * FROM leads WHERE lead_score = ? ORDER BY created_at DESC');
    return stmt.all(score);
  },

  // Interaction Operations
  createInteraction: (leadEmail: string, type: string, content: string, aiSummary?: string) => {
    const stmt = crmDb.prepare(`
      INSERT INTO interactions (lead_email, interaction_type, content, ai_summary) 
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(leadEmail, type, content, aiSummary || null);
  },

  getInteractionsByLead: (email: string) => {
    const stmt = crmDb.prepare(`
      SELECT * FROM interactions 
      WHERE lead_email = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(email);
  },

  getAllInteractions: () => {
    const stmt = crmDb.prepare('SELECT * FROM interactions ORDER BY created_at DESC');
    return stmt.all();
  },

  // Statistics
  getCRMStats: () => {
    const totalLeads = crmDb.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number };
    const hotLeads = crmDb.prepare('SELECT COUNT(*) as count FROM leads WHERE lead_score = ?').get('HOT') as { count: number };
    const warmLeads = crmDb.prepare('SELECT COUNT(*) as count FROM leads WHERE lead_score = ?').get('WARM') as { count: number };
    const coldLeads = crmDb.prepare('SELECT COUNT(*) as count FROM leads WHERE lead_score = ?').get('COLD') as { count: number };
    const pendingLeads = crmDb.prepare('SELECT COUNT(*) as count FROM leads WHERE lead_score = ?').get('PENDING') as { count: number };
    
    return {
      total: totalLeads.count,
      hot: hotLeads.count,
      warm: warmLeads.count,
           cold: coldLeads.count,
      pending: pendingLeads.count
    };
  },

  // Export to CSV format
  exportLeadsToCSV: () => {
    const leads = crmDb.prepare('SELECT * FROM leads ORDER BY created_at DESC').all() as any[];
    
    if (leads.length === 0) return null;

    const headers = ["ID", "Name", "Email", "Source", "Score", "Created At"];
    
    const csvRows = leads.map(lead => {
      return [
        lead.id,
        `"${lead.name || ''}"`,
        `"${lead.email}"`,
        `"${lead.source}"`,
        `"${lead.lead_score}"`,
        `"${new Date(lead.created_at).toISOString()}"`
      ].join(",");
    });

    return [headers.join(","), ...csvRows].join("\n");
  }
};

export { crmDb };
