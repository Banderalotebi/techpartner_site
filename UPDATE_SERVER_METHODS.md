# Update Server Methods

The server is running but environment variables need proper configuration. Here's how to fix it:

## Method 1: Use PM2 Ecosystem File
```bash
cd /opt/techpartner
pm2 delete techpartner-database
pm2 start ecosystem.config.js
pm2 logs techpartner-database
curl localhost:5000/api/health
curl http://34.69.69.182:5000
```

## Method 2: Direct Environment Variable
```bash
cd /opt/techpartner
pm2 delete techpartner-database

# Create environment file
echo 'NODE_ENV=development
DATABASE_URL=postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=5000' > .env

pm2 start server/index.ts --name "techpartner-database" --interpreter tsx --env .env
```

## Method 3: Check Current Status
```bash
cd /opt/techpartner
pm2 describe techpartner-database
curl localhost:5000
curl localhost:5000/api/categories
```

This will ensure proper environment variable handling and resolve the database connection issue.