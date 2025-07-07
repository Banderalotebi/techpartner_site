#!/bin/bash

# Pre-sync conflict detection
# Analyzes potential conflicts before sync operations

set -e  # Exit on any error

echo "🔍 Conflict Detection Analysis..."

# Validate git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Fetch latest without merging
echo "📡 Fetching latest remote information..."
git fetch origin main 2>/dev/null || {
    echo "⚠️  Unable to fetch from remote - check network connection"
    exit 1
}

# Analyze repository state
LOCAL_COMMITS=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
REMOTE_COMMITS=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
UNCOMMITTED=$(git status --porcelain | wc -l)

echo ""
echo "📊 Repository Analysis:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Local commits ahead of remote: $LOCAL_COMMITS"
echo "   Remote commits ahead of local: $REMOTE_COMMITS"
echo "   Uncommitted changes: $UNCOMMITTED"
echo ""

# Conflict risk assessment
RISK_LEVEL="LOW"
WARNINGS=()

if [ "$LOCAL_COMMITS" -gt 0 ] && [ "$REMOTE_COMMITS" -gt 0 ]; then
    RISK_LEVEL="HIGH"
    WARNINGS+=("Both local and remote have new commits - merge/rebase needed")
fi

if [ "$UNCOMMITTED" -gt 0 ]; then
    if [ "$REMOTE_COMMITS" -gt 0 ]; then
        RISK_LEVEL="MEDIUM"
        WARNINGS+=("Uncommitted changes with remote updates - stashing recommended")
    else
        WARNINGS+=("Uncommitted changes detected - consider committing first")
    fi
fi

# Check for conflicting files
if [ "$LOCAL_COMMITS" -gt 0 ] && [ "$REMOTE_COMMITS" -gt 0 ]; then
    echo "🔍 Analyzing potential file conflicts..."
    
    LOCAL_FILES=$(git diff --name-only origin/main..HEAD)
    REMOTE_FILES=$(git diff --name-only HEAD..origin/main)
    
    echo "📝 Files changed locally:"
    echo "$LOCAL_FILES" | sed 's/^/   /'
    echo ""
    echo "📝 Files changed remotely:"
    echo "$REMOTE_FILES" | sed 's/^/   /'
    echo ""
    
    # Check for overlapping files
    CONFLICTS=$(comm -12 <(echo "$LOCAL_FILES" | sort) <(echo "$REMOTE_FILES" | sort))
    if [ -n "$CONFLICTS" ]; then
        RISK_LEVEL="HIGH"
        echo "⚠️  POTENTIAL CONFLICTS in files:"
        echo "$CONFLICTS" | sed 's/^/   ⚠️  /'
        WARNINGS+=("File conflicts detected - manual resolution may be needed")
    fi
fi

# Risk level display
echo ""
case $RISK_LEVEL in
    "LOW")
        echo "🟢 CONFLICT RISK: LOW"
        echo "✅ Safe to proceed with any sync operation"
        ;;
    "MEDIUM")
        echo "🟡 CONFLICT RISK: MEDIUM"
        echo "⚠️  Proceed with caution - consider stashing or committing first"
        ;;
    "HIGH")
        echo "🔴 CONFLICT RISK: HIGH"
        echo "⚠️  High probability of conflicts - manual intervention may be needed"
        ;;
esac

# Display warnings
if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  WARNINGS:"
    for warning in "${WARNINGS[@]}"; do
        echo "   • $warning"
    done
fi

echo ""
echo "📋 RECOMMENDED ACTIONS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$UNCOMMITTED" -gt 0 ]; then
    echo "   1. Run './quick-push.sh' to commit and push local changes"
    echo "   2. Or use 'git stash' to temporarily store changes"
fi

if [ "$REMOTE_COMMITS" -gt 0 ]; then
    echo "   3. Run './sync-from-remote.sh' to pull remote changes"
fi

if [ "$RISK_LEVEL" = "HIGH" ]; then
    echo "   4. Consider using './smart-sync.sh' for automated conflict resolution"
fi

echo "   5. Run './conflict-check.sh' again after any sync operation"

echo ""
echo "✅ Conflict analysis completed"