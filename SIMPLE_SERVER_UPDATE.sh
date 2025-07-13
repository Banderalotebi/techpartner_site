#!/bin/bash

echo "Updating production server with latest GitHub changes..."

# Check current server
echo "Current server status:"
curl -s http://34.69.69.182/api/health

echo ""
echo "Connecting to VM to update..."

# SSH to VM and update
gcloud compute ssh techpartner-exact --zone=us-central1-a --command="
    echo 'Updating TechPartner platform...'
    cd /opt/techpartner-platform
    git pull origin main
    npm install --production
    npm run build 2>/dev/null || echo 'Build step skipped'
    pm2 restart all
    echo 'Update completed!'
    pm2 status
"

echo ""
echo "Waiting for server restart..."
sleep 20

echo "Updated server status:"
curl -s http://34.69.69.182/api/health

echo ""
echo "Server update completed!"