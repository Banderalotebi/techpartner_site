#!/bin/bash
# Simple Server Update Script

echo "=== Fixing TechPartner Platform Loading Issue ==="

cd /opt/techpartner

echo "Building frontend..."
npm run build

echo "Checking build output..."
ls -la dist/public/

echo "Restarting server..."
pm2 restart techpartner-database

sleep 3

echo "Checking server status..."
pm2 logs techpartner-database --lines 10

echo "Testing server..."
curl -I localhost:5000

echo "=== Server Update Complete ==="
echo "Visit: http://34.69.69.182:5000"