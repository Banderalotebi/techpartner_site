#!/bin/bash

# Fast push with validation
# Quickly commits and pushes changes with safety checks

set -e  # Exit on any error

echo "⚡ Quick Push Starting..."

# Validate git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Configure git if needed
git config --get user.name > /dev/null || git config user.name "Banderalotebi"
git config --get user.email > /dev/null || git config user.email "banderalotebi@gmail.com"

# Check for changes to commit
if git diff-index --quiet HEAD --; then
    echo "ℹ️  No changes to commit"
    
    # Check for unpushed commits
    UNPUSHED=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
    if [ "$UNPUSHED" -gt 0 ]; then
        echo "⬆️  Pushing $UNPUSHED unpushed commits..."
        git push origin main
        echo "✅ Push completed successfully!"
    else
        echo "✅ Everything is already up to date"
    fi
    exit 0
fi

# Show what will be committed
echo "📝 Changes to be committed:"
git status --porcelain

# Add all changes
echo "📦 Adding all changes..."
git add .

# Create commit message with timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MSG="TechPartner platform update - $TIMESTAMP"

# Allow custom commit message via parameter
if [ "$1" ]; then
    COMMIT_MSG="$1"
fi

echo "💾 Committing with message: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG"

# Pull latest changes before push (with rebase)
echo "⬇️  Pulling latest changes..."
if git pull origin main --rebase; then
    echo "✅ Pull successful"
else
    echo "⚠️  Pull failed, attempting merge..."
    git rebase --abort 2>/dev/null || true
    git pull origin main --no-rebase
fi

# Push changes
echo "⬆️  Pushing to remote..."
git push origin main

echo "✅ Quick push completed successfully!"
echo "🎉 Changes are now live on GitHub!"