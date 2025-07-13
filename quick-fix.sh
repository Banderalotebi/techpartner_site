#!/bin/bash
# Quick Fix for TechPartner Database Deployment

echo "=== TechPartner Database Quick Fix ==="

cd /opt/techpartner

echo "1. Opening firewall for port 5000..."
sudo ufw allow 5000

echo "2. Checking build files..."
if [ -f "dist/public/index.html" ]; then
    echo "✓ Build files found"
else
    echo "Building frontend..."
    npm run build
fi

echo "3. Stopping current server..."
pm2 delete techpartner-database 2>/dev/null || true

echo "4. Starting production server with external access..."
HOST=0.0.0.0 PORT=5000 NODE_ENV=production DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start dist/index.js --name "techpartner-database"

echo "5. Checking deployment..."
sleep 3
pm2 status
echo "Testing health endpoint..."
curl -s localhost:5000/api/health

echo "=== TechPartner Platform with Database Integration Live ==="
echo "Access: http://34.69.69.182:5000"