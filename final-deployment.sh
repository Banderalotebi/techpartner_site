#!/bin/bash
# Final Deployment Script for TechPartner Database Integration

echo "=== TechPartner Final Deployment ==="

cd /opt/techpartner

echo "Building frontend..."
npm run build

echo "Checking build output..."
ls -la dist/

echo "Stopping current server..."
pm2 delete techpartner-database

echo "Starting production server with database..."
if [ -d "dist/public" ]; then
    echo "Production build available, starting production mode..."
    NODE_ENV=production DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start dist/index.js --name "techpartner-database"
else
    echo "No production build, starting development mode..."
    NODE_ENV=development DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start server/index.ts --name "techpartner-database" --interpreter tsx
fi

echo "Checking server status..."
sleep 3
pm2 status
pm2 logs techpartner-database --lines 10

echo "Testing deployment..."
curl -I localhost:5000
curl localhost:5000/api/health

echo "=== TechPartner Platform Live at http://34.69.69.182:5000 ==="