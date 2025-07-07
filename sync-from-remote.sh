#!/bin/bash

# Smart remote sync with conflict detection
# Safely pulls changes from remote repository with conflict detection

set -e  # Exit on any error

echo "🔄 Smart Remote Sync Starting..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Configure git if needed
git config --get user.name > /dev/null || git config user.name "Banderalotebi"
git config --get user.email > /dev/null || git config user.email "banderalotebi@gmail.com"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Uncommitted changes detected"
    echo "📦 Stashing local changes..."
    git stash push -m "Auto-stash before remote sync $(date)"
    STASHED=true
else
    STASHED=false
fi

# Fetch latest changes
echo "⬇️  Fetching latest changes from origin..."
git fetch origin main

# Check for conflicts before merge
BEHIND=$(git rev-list --count HEAD..origin/main)
AHEAD=$(git rev-list --count origin/main..HEAD)

echo "📊 Repository Status:"
echo "   - Local commits ahead: $AHEAD"
echo "   - Remote commits behind: $BEHIND"

if [ "$BEHIND" -gt 0 ]; then
    echo "🔄 Pulling $BEHIND remote commits..."
    
    if [ "$AHEAD" -gt 0 ]; then
        echo "⚡ Using rebase to maintain clean history..."
        if git rebase origin/main; then
            echo "✅ Rebase successful"
        else
            echo "⚠️  Rebase conflicts detected, trying merge..."
            git rebase --abort
            git merge origin/main
        fi
    else
        echo "⚡ Fast-forward merge..."
        git merge origin/main
    fi
else
    echo "✅ Already up to date with remote"
fi

# Restore stashed changes if any
if [ "$STASHED" = true ]; then
    echo "📦 Restoring stashed changes..."
    if git stash pop; then
        echo "✅ Stashed changes restored successfully"
    else
        echo "⚠️  Conflict restoring stashed changes - manual resolution needed"
        echo "🔧 Use 'git stash list' and 'git stash apply' to resolve"
    fi
fi

echo "✅ Smart remote sync completed successfully!"
echo "🎉 Repository is now synchronized with remote"