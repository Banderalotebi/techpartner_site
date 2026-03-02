#!/bin/bash
# Fix and redeploy script for EC2

set -e

echo "🔧 Fixing static handler and redeploying..."

cd ~/techpartner

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building frontend..."
npm run build

echo "🔄 Restarting PM2 server..."
pm2 restart techpartner

echo "⏳ Waiting for server to start..."
sleep 3

echo "✅ Redeployment complete!"
echo "📊 PM2 Status:"
pm2 status

echo "🌐 Testing health endpoint..."
curl -s http://localhost:8080/api/health || echo "Health check failed"

echo ""
echo "📝 Recent logs:"
pm2 logs techpartner --lines 20
