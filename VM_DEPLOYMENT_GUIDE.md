# VM Deployment Guide

The server requires DATABASE_URL. Here are the options:

## Option 1: Set Database URL and Start
```bash
cd /opt/techpartner
pm2 delete techpartner-database

# Start with database URL (replace with your actual database)
DATABASE_URL="postgresql://user:password@localhost:5432/techpartner" pm2 start server/index.ts --name "techpartner-database" --interpreter tsx

pm2 logs techpartner-database
curl localhost:5000/api/health
```

## Option 2: Use Memory Storage (Quick Fix)
```bash
cd /opt/techpartner

# Temporarily switch to memory storage
sed -i 's/import { DatabaseStorage }/\/\/ import { DatabaseStorage }/g' server/storage.ts
sed -i 's/export const storage = new DatabaseStorage();/export const storage = new MemStorage();/g' server/storage.ts

pm2 delete techpartner-database
pm2 start server/index.ts --name "techpartner-database" --interpreter tsx
curl localhost:5000/api/health
```

## Option 3: Use SQLite Database
```bash
cd /opt/techpartner

# Install sqlite and use local database
npm install better-sqlite3
DATABASE_URL="file:./techpartner.db" pm2 start server/index.ts --name "techpartner-database" --interpreter tsx
```

## Check External Access
```bash
curl http://34.69.69.182:5000/api/health
curl http://34.69.69.182:5000/api/categories
```

This will get your database integration running on the production server.