import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

// Note: DATABASE_URL is now loaded by aws-secrets.ts BEFORE this module is imported
// The bootstrap process in server/index.ts ensures secrets are loaded first
if (!process.env.DATABASE_URL) {
  console.error('❌ [Database] DATABASE_URL environment variable is not set.');
  console.error('   This should have been loaded by AWS Secrets Manager or .env file.');
  console.error('   Ensure server/index.ts is calling loadSecrets() before importing this module.');
  throw new Error('DATABASE_URL not configured. Check AWS Secrets Manager configuration.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

console.log('✅ [Database] Neon PostgreSQL connection initialized');

export { pool, db };
