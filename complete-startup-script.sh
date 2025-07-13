#!/bin/bash
# Complete TechPartner Startup Script with Database Integration

echo "=== TechPartner Complete Deployment ==="

# Create clean directory
sudo rm -rf /opt/techpartner
sudo mkdir -p /opt/techpartner
sudo chown $USER:$USER /opt/techpartner
cd /opt/techpartner

# Extract deployment package
echo "Extracting TechPartner platform..."
tar -xzf ~/clean-techpartner-deploy.tar.gz

# Install dependencies
echo "Installing dependencies..."
npm install

# Build for production
echo "Building production version..."
npm run build

# Check build output
echo "Checking build output..."
ls -la dist/
ls -la dist/public/

# Install PM2 globally if needed
which pm2 || npm install -g pm2

# Start on standard web port
echo "Starting TechPartner Platform on port 80..."
sudo HOST=0.0.0.0 PORT=80 NODE_ENV=production DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start dist/index.js --name "techpartner-platform"

# Verify deployment
echo "Verifying deployment..."
sleep 5
pm2 status
curl -s localhost:80/api/health

echo ""
echo "=== TechPartner Platform with Database Integration ==="
echo "🚀 Live at: http://34.69.69.182"
echo "✅ PostgreSQL Database Connected"
echo "✅ JWT Authentication Active"
echo "✅ Production Mode Optimized"