import { Storage } from '@google-cloud/storage';
import { Pool } from 'pg';

class GoogleCloudService {
  private storage: Storage;
  private pool: Pool | null = null;
  private bucketName: string;

  constructor() {
    // Initialize Google Cloud Storage
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    
    this.bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'techpartner-site-storage';
  }

  // Initialize PostgreSQL connection pool
  async initializeDatabase() {
    if (!process.env.DATABASE_URL) {
      console.log('No DATABASE_URL provided, skipping cloud database connection');
      return;
    }

    try {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test the connection
      const client = await this.pool.connect();
      console.log('✅ Connected to Google Cloud SQL Database');
      client.release();
    } catch (error) {
      console.error('❌ Failed to connect to Google Cloud SQL:', error);
      this.pool = null;
    }
  }

  // Database methods
  async query(text: string, params?: any[]) {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }
    
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      console.log('📊 Database connection pool closed');
    }
  }

  // Storage methods
  async createBucket() {
    try {
      const [bucket] = await this.storage.bucket(this.bucketName).create();
      console.log(`✅ Bucket ${bucket.name} created successfully`);
      return bucket;
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`📦 Bucket ${this.bucketName} already exists`);
        return this.storage.bucket(this.bucketName);
      }
      console.error('❌ Failed to create bucket:', error);
      throw error;
    }
  }

  async uploadFile(fileName: string, fileBuffer: Buffer, contentType?: string) {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: contentType || 'application/octet-stream',
        },
        public: true,
      });

      return new Promise<string>((resolve, reject) => {
        stream.on('error', (error) => {
          console.error('❌ Upload failed:', error);
          reject(error);
        });

        stream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
          console.log(`✅ File uploaded: ${publicUrl}`);
          resolve(publicUrl);
        });

        stream.end(fileBuffer);
      });
    } catch (error) {
      console.error('❌ Failed to upload file:', error);
      throw error;
    }
  }

  async deleteFile(fileName: string) {
    try {
      await this.storage.bucket(this.bucketName).file(fileName).delete();
      console.log(`🗑️ File ${fileName} deleted successfully`);
    } catch (error) {
      console.error('❌ Failed to delete file:', error);
      throw error;
    }
  }

  async listFiles(prefix?: string) {
    try {
      const [files] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: prefix
      });
      
      return files.map(file => ({
        name: file.name,
        size: file.metadata.size,
        updated: file.metadata.updated,
        contentType: file.metadata.contentType,
        publicUrl: `https://storage.googleapis.com/${this.bucketName}/${file.name}`
      }));
    } catch (error) {
      console.error('❌ Failed to list files:', error);
      throw error;
    }
  }

  async getFileUrl(fileName: string) {
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }

  // Backup database to storage
  async backupDatabase() {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `database-backup-${timestamp}.sql`;
      
      // This is a simplified backup - in production you'd use pg_dump
      const tables = ['users', 'orders', 'project_briefs', 'quiz_responses', 'payments'];
      let backupContent = `-- Database Backup ${timestamp}\n\n`;
      
      for (const table of tables) {
        try {
          const result = await this.query(`SELECT * FROM ${table}`);
          backupContent += `-- Table: ${table}\n`;
          backupContent += `DELETE FROM ${table};\n`;
          
          for (const row of result.rows) {
            const columns = Object.keys(row).join(', ');
            const values = Object.values(row).map(v => 
              v === null ? 'NULL' : 
              typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : 
              v
            ).join(', ');
            backupContent += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
          }
          backupContent += '\n';
        } catch (error) {
          console.log(`⚠️ Table ${table} might not exist, skipping...`);
        }
      }

      const buffer = Buffer.from(backupContent, 'utf8');
      const url = await this.uploadFile(backupFileName, buffer, 'text/plain');
      
      console.log(`✅ Database backup completed: ${url}`);
      return url;
    } catch (error) {
      console.error('❌ Database backup failed:', error);
      throw error;
    }
  }
}

export const googleCloudService = new GoogleCloudService();
