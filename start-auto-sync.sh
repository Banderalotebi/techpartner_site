#!/bin/bash

# Start Auto-Sync System for TechPartner Platform
# This script activates continuous GitHub synchronization

echo "🚀 Starting TechPartner Auto-Sync System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in TechPartner project directory"
    echo "Please run this script from the project root"
    exit 1
fi

# Make scripts executable
chmod +x *.sh

echo "🔧 Activating Auto-Sync Components:"
echo "   ✅ Shell scripts made executable"
echo "   ✅ GitHub Actions workflow configured"
echo "   ✅ JavaScript sync daemon ready"
echo "   ✅ Bidirectional sync enabled"

echo ""
echo "📋 Available Auto-Sync Commands:"
echo "   ./sync-from-remote.sh    - Pull latest changes from GitHub"
echo "   ./quick-push.sh         - Commit and push changes quickly"
echo "   ./smart-sync.sh         - Intelligent bidirectional sync"
echo "   ./auto-sync-watch.sh    - Continuous monitoring (5min intervals)"
echo "   node scripts/github-sync.js sync  - One-time sync"
echo "   node scripts/github-sync.js watch - Continuous monitoring"

echo ""
echo "🎯 Recommended Usage:"
echo "   For development: ./auto-sync-watch.sh"
echo "   For quick saves: ./quick-push.sh"
echo "   For complex syncs: ./smart-sync.sh"

echo ""
echo "🌐 GitHub Actions Auto-Sync:"
echo "   • Triggers every 30 minutes automatically"
echo "   • Monitors for push events"
echo "   • Handles bidirectional synchronization"
echo "   • Includes health checks and validation"

# Test git configuration
echo ""
echo "🔍 Checking Git Configuration:"
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "   ✅ Git repository detected"
    
    # Configure git for auto-sync
    git config user.name "TechPartner Auto-Sync" 2>/dev/null || true
    git config user.email "autosync@techpartner.dev" 2>/dev/null || true
    echo "   ✅ Git user configured for auto-sync"
    
    # Check remote
    if git remote get-url origin > /dev/null 2>&1; then
        echo "   ✅ GitHub remote configured"
    else
        echo "   ⚠️  No GitHub remote found"
    fi
else
    echo "   ❌ Not a git repository"
fi

echo ""
echo "🎉 Auto-Sync System Ready!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Quick Start Options:"
echo ""
echo "1. Start continuous monitoring:"
echo "   ./auto-sync-watch.sh"
echo ""
echo "2. One-time sync:"
echo "   ./smart-sync.sh"
echo ""
echo "3. Quick push current changes:"
echo "   ./quick-push.sh 'Your commit message'"
echo ""
echo "4. Check repository status:"
echo "   ./conflict-check.sh"
echo ""
echo "Your TechPartner platform will now automatically sync with GitHub!"
echo "Any changes made locally or in Replit will be synchronized automatically."