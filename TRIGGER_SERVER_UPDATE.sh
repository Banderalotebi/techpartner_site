#!/bin/bash

echo "🔄 Triggering server update with new GitHub changes..."

# Check current server status
echo "📊 Current server status:"
curl -s http://34.69.69.182/api/health

echo ""
echo "🚀 Triggering CI/CD pipeline deployment..."

# Method 1: SSH to VM and pull updates
echo "📥 Connecting to VM to pull latest changes..."
gcloud compute ssh techpartner-exact --zone=us-central1-a --command="
    cd /opt/techpartner-platform
    git pull origin main
    npm install
    npm run build
    pm2 restart all
    pm2 status
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Server updated successfully via SSH"
else
    echo "❌ SSH update failed, trying alternative methods..."
    
    # Method 2: Trigger Cloud Build manually
    echo "🔨 Triggering Cloud Build deployment..."
    gcloud builds submit --config=cloudbuild-with-secrets.yaml . 2>/dev/null
fi

echo ""
echo "⏰ Waiting for deployment to complete..."
sleep 30

echo "🔍 Checking updated server status:"
curl -s http://34.69.69.182/api/health

echo ""
echo "🏁 Server update process completed!"