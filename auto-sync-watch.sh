#!/bin/bash

# Automated file watching and sync
# Continuously monitors file changes and syncs automatically

set -e  # Exit on any error

# Configuration
WATCH_INTERVAL=300  # 5 minutes
MAX_AUTO_COMMITS=10  # Maximum auto-commits per session
WATCH_DIRS=("client" "server" "shared" "scripts" "*.md" "*.json" "*.ts")

echo "👁️  Auto-Sync Watch - Continuous File Monitoring"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏱️   Watch interval: ${WATCH_INTERVAL}s"
echo "📁  Watching directories: ${WATCH_DIRS[*]}"
echo "🔄  Max auto-commits: $MAX_AUTO_COMMITS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Validate environment
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Configure git
git config --get user.name > /dev/null || git config user.name "Banderalotebi"
git config --get user.email > /dev/null || git config user.email "banderalotebi@gmail.com"

# Initialize counters
COMMIT_COUNT=0
SESSION_START=$(date '+%Y-%m-%d %H:%M:%S')
LAST_SYNC_HASH=$(git rev-parse HEAD)

echo "🚀 Auto-sync watch started at $SESSION_START"
echo "📋 Session ID: auto-sync-$(date '+%Y%m%d-%H%M%S')"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Auto-sync watch stopping..."
    echo "📊 Session Summary:"
    echo "   • Start time: $SESSION_START"
    echo "   • End time: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "   • Auto-commits made: $COMMIT_COUNT"
    echo "   • Final commit: $(git rev-parse --short HEAD)"
    echo "🎯 Thank you for using auto-sync watch!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Function to check for changes
check_and_sync() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo "[$timestamp] 📝 Changes detected"
        
        # Show changed files
        CHANGED_FILES=$(git status --porcelain | wc -l)
        echo "[$timestamp] 📊 $CHANGED_FILES files modified"
        
        # Check commit limit
        if [ $COMMIT_COUNT -ge $MAX_AUTO_COMMITS ]; then
            echo "[$timestamp] ⚠️  Maximum auto-commits reached ($MAX_AUTO_COMMITS)"
            echo "[$timestamp] 🔄 Switching to manual mode - changes will accumulate"
            return
        fi
        
        # Add and commit changes
        git add .
        
        # Create descriptive commit message
        local commit_msg="Auto-sync: TechPartner updates [$timestamp] (#$((COMMIT_COUNT + 1)))"
        
        if git commit -m "$commit_msg"; then
            COMMIT_COUNT=$((COMMIT_COUNT + 1))
            echo "[$timestamp] ✅ Auto-commit #$COMMIT_COUNT successful"
            
            # Try to push (non-blocking)
            if git push origin main &>/dev/null; then
                echo "[$timestamp] 📤 Push successful"
                LAST_SYNC_HASH=$(git rev-parse HEAD)
            else
                echo "[$timestamp] ⚠️  Push failed - will retry next cycle"
            fi
        else
            echo "[$timestamp] ❌ Commit failed"
        fi
    else
        # Check for unpushed commits
        local current_hash=$(git rev-parse HEAD)
        if [ "$current_hash" != "$LAST_SYNC_HASH" ]; then
            echo "[$timestamp] 📤 Attempting to push unpushed commits..."
            if git push origin main &>/dev/null; then
                echo "[$timestamp] ✅ Push successful"
                LAST_SYNC_HASH=$current_hash
            else
                echo "[$timestamp] ⚠️  Push failed - will retry next cycle"
            fi
        fi
    fi
}

# Function to pull remote changes
check_remote_updates() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Fetch quietly
    if git fetch origin main &>/dev/null; then
        local behind=$(git rev-list --count HEAD..origin/main)
        if [ "$behind" -gt 0 ]; then
            echo "[$timestamp] ⬇️  $behind remote commits detected"
            
            # If we have local changes, stash them
            local has_changes=false
            if ! git diff-index --quiet HEAD --; then
                echo "[$timestamp] 📦 Stashing local changes..."
                git stash push -m "Auto-watch stash $timestamp" &>/dev/null
                has_changes=true
            fi
            
            # Pull changes
            if git merge origin/main --no-edit &>/dev/null; then
                echo "[$timestamp] ✅ Remote changes merged"
                
                # Restore stashed changes
                if [ "$has_changes" = true ]; then
                    if git stash pop &>/dev/null; then
                        echo "[$timestamp] 📦 Stashed changes restored"
                    else
                        echo "[$timestamp] ⚠️  Conflict restoring stash - manual resolution needed"
                    fi
                fi
            else
                echo "[$timestamp] ❌ Merge failed - manual intervention needed"
            fi
        fi
    fi
}

# Main watch loop
echo "👀 Starting continuous monitoring..."
echo "💡 Press Ctrl+C to stop"
echo ""

while true; do
    # Check for local changes and sync
    check_and_sync
    
    # Check for remote updates every few cycles
    if [ $(($(date +%s) % (WATCH_INTERVAL * 3))) -eq 0 ]; then
        check_remote_updates
    fi
    
    # Progress indicator
    echo "[$(date '+%H:%M:%S')] 💤 Waiting $WATCH_INTERVAL seconds..."
    
    # Wait for next check
    sleep $WATCH_INTERVAL
done