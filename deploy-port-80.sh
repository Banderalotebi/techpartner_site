#!/bin/bash
# Deploy TechPartner on Standard HTTP Port 80

echo "=== TechPartner Deployment on Port 80 ==="

cd /opt/techpartner

echo "1. Stopping current server..."
pm2 delete techpartner-database 2>/dev/null || true

echo "2. Checking build files..."
if [ ! -f "dist/public/index.html" ]; then
    echo "Building frontend..."
    npm run build
fi

echo "3. Starting server on port 80 (requires sudo)..."
sudo HOST=0.0.0.0 PORT=80 NODE_ENV=production DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start dist/index.js --name "techpartner-database"

echo "4. Checking deployment status..."
sleep 3
pm2 status

echo "5. Testing health endpoint..."
curl -s localhost:80/api/health

echo ""
echo "=== TechPartner Platform with Database Integration ==="
echo "Access: http://34.69.69.182"
echo "(Standard web port - no port number needed!)"