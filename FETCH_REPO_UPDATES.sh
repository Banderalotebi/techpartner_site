#!/bin/bash

echo "🔄 Fetching latest repository updates..."

# Clear any git locks
rm -f .git/index.lock 2>/dev/null || true

# Fetch latest changes from origin
echo "📥 Fetching from origin..."
git fetch origin

# Check current status
echo "📊 Current repository status:"
git status

# Show commits ahead of origin
echo "📈 Local commits ahead of origin/main:"
git log --oneline origin/main..HEAD

# Show commits behind origin
echo "📉 Remote commits not yet pulled:"
git log --oneline HEAD..origin/main

# Check if we need to pull
if [ "$(git rev-list HEAD..origin/main --count)" -gt 0 ]; then
    echo "🔄 Remote changes detected. You may want to pull:"
    echo "git pull origin main"
else
    echo "✅ Local repository is up to date with remote"
fi

# Check if we need to push
if [ "$(git rev-list origin/main..HEAD --count)" -gt 0 ]; then
    echo "📤 Local changes ready to push:"
    echo "git push origin main"
else
    echo "✅ No local changes to push"
fi

echo ""
echo "🌐 Repository sync complete"