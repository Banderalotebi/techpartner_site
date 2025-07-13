#!/bin/bash
# Automated Server Update Script

cd /home/bander/techpartner_site

echo "=== Updating TechPartner Server from GitHub ==="

# Stop current server
echo "Stopping current server..."
sudo pkill -f "node dist/index.js"

# Pull latest changes
echo "Pulling latest changes from GitHub..."
git pull origin main

# Check if there are new changes
if [ $? -eq 0 ]; then
    echo "✅ Successfully pulled updates"
else
    echo "❌ Git pull failed"
    exit 1
fi

# Rebuild project
echo "Rebuilding project..."
npm run build

# Check if build succeeded
if [ -f "dist/index.js" ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Restart server
echo "Restarting TechPartner server on port 80..."
nohup sudo PORT=80 DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPX@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require" NODE_ENV=production node dist/index.js > server.log 2>&1 &

echo "✅ TechPartner server updated and restarted!"
echo "Check server.log for status"