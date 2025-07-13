# Auto-Sync Setup Guide

## Quick Setup for Automatic GitHub Sync

### 1. Configure Git (One-time setup)
```bash
cd /home/bander/techpartner_site

# Set your GitHub credentials
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Set up GitHub token for authentication
git config credential.helper store
```

### 2. Enable Auto-Sync
```bash
# Start the auto-sync daemon
nohup node auto-sync-daemon.js > sync.log 2>&1 &

# Or use the watch script
nohup ./auto-sync-watch.sh > sync.log 2>&1 &
```

### 3. Manual Sync Commands
```bash
# Quick push current changes
./quick-push.sh "Updated TechPartner features"

# Smart sync with conflict detection
./smart-sync.sh

# Sync from remote (pull updates)
./sync-from-remote.sh
```

### 4. Check Sync Status
```bash
# View sync logs
tail -f sync.log

# Check git status
git status

# View recent commits
git log --oneline -5
```

## How It Works
1. **File Monitoring**: Scripts watch for changes in your project
2. **Auto-Commit**: Changes are automatically committed with timestamps
3. **Push to GitHub**: Commits are pushed to your GitHub repository
4. **Conflict Prevention**: Smart sync detects and resolves conflicts

Your changes will automatically appear in GitHub within minutes of making them on the VM.