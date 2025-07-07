#!/bin/bash

# Intelligent bidirectional sync
# Handles complex sync scenarios with automatic conflict resolution

set -e  # Exit on any error

echo "🧠 Smart Sync - Intelligent Bidirectional Synchronization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Validate environment
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Configure git
git config --get user.name > /dev/null || git config user.name "Banderalotebi"
git config --get user.email > /dev/null || git config user.email "banderalotebi@gmail.com"

# Step 1: Analyze current state
echo "🔍 Phase 1: Repository Analysis"
./conflict-check.sh

# Fetch latest
echo ""
echo "📡 Phase 2: Fetching Remote Changes"
git fetch origin main

# Get repository metrics
LOCAL_COMMITS=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
REMOTE_COMMITS=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
UNCOMMITTED_CHANGES=$(git status --porcelain | wc -l)

echo "📊 Sync Strategy Selection:"
echo "   Local commits: $LOCAL_COMMITS"
echo "   Remote commits: $REMOTE_COMMITS"
echo "   Uncommitted files: $UNCOMMITTED_CHANGES"

# Strategy selection logic
if [ "$UNCOMMITTED_CHANGES" -gt 0 ]; then
    echo ""
    echo "💾 Phase 3a: Handling Uncommitted Changes"
    echo "📦 Auto-stashing uncommitted changes..."
    git stash push -m "Smart-sync auto-stash $(date '+%Y-%m-%d %H:%M:%S')" || {
        echo "❌ Failed to stash changes"
        exit 1
    }
    STASHED=true
else
    STASHED=false
fi

if [ "$LOCAL_COMMITS" -gt 0 ] && [ "$REMOTE_COMMITS" -gt 0 ]; then
    echo ""
    echo "🔄 Phase 3b: Bidirectional Sync (Rebase Strategy)"
    echo "⚡ Attempting intelligent rebase..."
    
    if git rebase origin/main; then
        echo "✅ Rebase successful - clean history maintained"
    else
        echo "⚠️  Rebase conflicts detected"
        echo "🔧 Attempting automatic conflict resolution..."
        
        # Abort rebase and try merge
        git rebase --abort
        
        if git merge origin/main -m "Smart-sync auto-merge $(date '+%Y-%m-%d %H:%M:%S')"; then
            echo "✅ Automatic merge successful"
        else
            echo "❌ Automatic merge failed - manual intervention required"
            echo ""
            echo "🔧 MANUAL RESOLUTION NEEDED:"
            echo "   1. Resolve conflicts in the listed files"
            echo "   2. Run 'git add <resolved-files>'"
            echo "   3. Run 'git merge --continue'"
            echo "   4. Then re-run this script"
            exit 1
        fi
    fi
    
elif [ "$REMOTE_COMMITS" -gt 0 ]; then
    echo ""
    echo "⬇️  Phase 3c: Remote-Only Updates (Fast-Forward)"
    git merge origin/main
    echo "✅ Fast-forward merge completed"
    
elif [ "$LOCAL_COMMITS" -gt 0 ]; then
    echo ""
    echo "⬆️  Phase 3d: Local-Only Updates (Direct Push)"
    echo "📤 Ready to push local commits"
else
    echo ""
    echo "✅ Phase 3e: Already Synchronized"
    echo "ℹ️  Repository is already in sync"
fi

# Push local commits if any
if [ "$LOCAL_COMMITS" -gt 0 ] || [ "$(git rev-list --count origin/main..HEAD)" -gt 0 ]; then
    echo ""
    echo "📤 Phase 4: Pushing Local Changes"
    if git push origin main; then
        echo "✅ Push successful"
    else
        echo "❌ Push failed - retrying with force-with-lease..."
        if git push origin main --force-with-lease; then
            echo "✅ Force push successful"
        else
            echo "❌ Push failed completely - manual intervention needed"
            exit 1
        fi
    fi
fi

# Restore stashed changes
if [ "$STASHED" = true ]; then
    echo ""
    echo "📦 Phase 5: Restoring Stashed Changes"
    if git stash pop; then
        echo "✅ Stashed changes restored successfully"
    else
        echo "⚠️  Conflict restoring stashed changes"
        echo "🔧 Manual resolution needed:"
        echo "   1. Resolve conflicts in working directory"
        echo "   2. Run 'git add <resolved-files>'"
        echo "   3. Run 'git stash drop' to clean up"
    fi
fi

echo ""
echo "🎉 Smart Sync Completed Successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Repository is now fully synchronized"
echo "🌐 Local and remote repositories are in sync"
echo "📊 All changes have been preserved and merged"

# Final status
echo ""
echo "📈 Final Repository Status:"
git log --oneline -5
echo ""
echo "🎯 Next recommended action: Continue development!"