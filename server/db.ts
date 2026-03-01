import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

// Note: DATABASE_URL is now loaded by aws-secrets.ts BEFORE this module is imported
// The bootstrap process in server/index.ts ensures secrets are loaded first
// DATABASE_URL is optional - SQLite fallback is available in CRM (server/db/crm.ts)

let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
  console.log('✅ [Database] Neon PostgreSQL connection initialized');
} else {
  console.log('ℹ️  [Database] DATABASE_URL not set - PostgreSQL disabled, SQLite fallback active');
}

export { pool, db };
