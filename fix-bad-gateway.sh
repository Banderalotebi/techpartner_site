#!/bin/bash
# Fix script for bad gateway error on EC2

echo "=== Diagnosing Bad Gateway Issue ==="

echo ""
echo "1. Checking Node.js version..."
node -v

echo ""
echo "2. Checking PM2 status..."
pm2 status

echo ""
echo "3. Checking recent PM2 logs..."
pm2 logs techpartner --lines 30

echo ""
echo "4. Testing server health endpoint..."
curl -s http://localhost:8080/api/health

echo ""
echo "5. Checking nginx configuration..."
sudo nginx -t

echo ""
echo "6. Checking if dist folder exists..."
ls -la /home/ubuntu/techpartner/dist/public/ 2>/dev/null || echo "dist/public folder not found!"

echo ""
echo "=== Fix Instructions ==="
echo ""
echo "The issue is likely Node.js v24 incompatibility. Run these commands:"
echo ""
echo "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
echo "sudo apt-get install -y nodejs"
echo "node -v  # Should show v20.x.x"
echo "pm2 restart techpartner"
echo "pm2 logs techpartner --lines 20"
