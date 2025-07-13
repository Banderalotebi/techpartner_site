# VM Update Commands

Direct commands to get TechPartner database integration running:

```bash
cd /opt/techpartner

# Method 1: Direct PM2 start with environment
NODE_ENV=development DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start server/index.ts --name "techpartner-database" --interpreter tsx

# Check status
pm2 status
pm2 logs techpartner-database
curl localhost:5000/api/health
curl http://34.69.69.182:5000
```

This will activate your PostgreSQL database integration with React frontend serving.