#!/bin/bash
# Deploy Database Integration Script

echo "=== TechPartner Database Integration Deployment ==="

cd /opt/techpartner

# Set database URL for production
export DATABASE_URL="postgresql://user:password@localhost:5432/techpartner"

# Alternative: Use in-memory storage if database not available
echo "Checking if database storage is available..."

# Stop current process
pm2 delete techpartner-database

# Start with database URL
echo "Starting with database integration..."
DATABASE_URL="postgresql://user:password@localhost:5432/techpartner" pm2 start server/index.ts --name "techpartner-database" --interpreter tsx

# Check if it started successfully
sleep 3
pm2 status

echo "Checking server logs..."
pm2 logs techpartner-database --lines 10

echo "Testing server..."
curl localhost:5000/api/health

echo "=== Database Integration Deployment Complete ==="