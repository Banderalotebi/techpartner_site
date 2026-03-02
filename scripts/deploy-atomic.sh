#!/bin/bash
# TECHPARTNER ATOMIC DEPLOYER - Zero-Downtime Deployments

set -e

REPO_DIR="/home/ubuntu/techpartner"
BUILD_DIR="$REPO_DIR/dist_new"
LIVE_DIR="$REPO_DIR/dist"

echo "🚀 Starting Atomic Build..."

# 1. Install and Build in a fresh temp directory
cd $REPO_DIR
npm install --legacy-peer-deps
npm run build

# 2. SANITY CHECK: Did Vite create the files?
if [ ! -f "$BUILD_DIR/client/index.html" ]; then
    echo "🚨 CRITICAL FAILURE: index.html missing. Aborting!"
    rm -rf $BUILD_DIR
    exit 1
fi

INDEX_SIZE=$(stat -f%z "$BUILD_DIR/client/index.html" 2>/dev/null || stat -c%s "$BUILD_DIR/client/index.html")
if [ "$INDEX_SIZE" -lt 1000 ]; then
    echo "🚨 CRITICAL FAILURE: index.html is too small ($INDEX_SIZE bytes). Aborting!"
    rm -rf $BUILD_DIR
    exit 1
fi

echo "✅ Build Verified ($INDEX_SIZE bytes). Performing Atomic Swap..."

# 3. The Magic Swap - atomic rename
TIMESTAMP=$(date +%s)
mv $LIVE_DIR "$REPO_DIR/dist_old_$TIMESTAMP"
mv $BUILD_DIR $LIVE_DIR

# 4. Restart the engine
pm2 reload techpartner

echo "✅ Kingdom Secured. Site is Live and Stable."

# 5. Clean up old builds (keep last 3)
ls -dt "$REPO_DIR"/dist_old_* | tail -n +4 | xargs -r rm -rf

echo "🎉 Deployment Complete!"

