#!/bin/bash
# Simple Server Update Script

cd /home/bander/techpartner_site

echo "=== TechPartner Server Update ==="

# Kill all node processes
sudo pkill -f node
echo "Stopped all node processes"

# Build the project
echo "Building project..."
npm run build

# Check if build succeeded
if [ -d "dist" ]; then
    echo "✅ Build successful - dist/ directory created"
    ls -la dist/
else
    echo "❌ Build failed - dist/ directory not found"
    echo "Checking package.json scripts..."
    cat package.json | grep -A 10 "scripts"
    exit 1
fi

# Start server on port 80
echo "Starting TechPartner server on port 80..."
sudo PORT=80 NODE_ENV=production npm start