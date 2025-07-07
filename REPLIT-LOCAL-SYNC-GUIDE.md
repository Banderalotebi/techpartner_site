# 🔄 Replit ↔ Local Development Sync Guide

## Complete Workflow for Seamless Development

This guide provides a comprehensive workflow for developing your TechPartner platform across Replit and local environments without conflicts.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Daily Workflow](#daily-workflow)
3. [Sync Scripts Overview](#sync-scripts-overview)
4. [Conflict Resolution](#conflict-resolution)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### First Time Setup

1. **In Replit:**
   ```bash
   # Make scripts executable
   chmod +x *.sh
   
   # Verify sync system
   ./conflict-check.sh
   ```

2. **In Local Environment:**
   ```bash
   # Clone/pull latest
   git clone <repository-url>  # OR git pull origin main
   
   # Install dependencies
   npm install
   
   # Start development
   npm run dev
   ```

### Daily Startup Routine

**Option A: Start from Replit**
```bash
# Check current state
./conflict-check.sh

# Sync with remote
./sync-from-remote.sh

# Start coding...
```

**Option B: Start from Local**
```bash
# Pull latest changes
git pull origin main

# Start development
npm run dev
```

---

## 📅 Daily Workflow

### 🌅 Morning Setup (Choose One)

**Replit First:**
1. Open Replit
2. Run `./sync-from-remote.sh`
3. Start development
4. When ready to test locally: run `./quick-push.sh`
5. Switch to local: `git pull origin main`

**Local First:**
1. Open local terminal
2. Run `git pull origin main`
3. Start development with `npm run dev`
4. When ready to test in Replit: `git push origin main`
5. Switch to Replit: run `./sync-from-remote.sh`

### 🔄 During Development

**Continuous Sync (Recommended):**
```bash
# In Replit - start auto-sync watch
./auto-sync-watch.sh
```

**Manual Sync Points:**
- Before switching environments
- After completing a feature
- Before taking breaks
- End of development session

### 🌙 End of Day

**From Replit:**
```bash
# Final push
./quick-push.sh "End of day - [describe changes]"
```

**From Local:**
```bash
# Final push
git add .
git commit -m "End of day - [describe changes]"
git push origin main
```

---

## 🛠️ Sync Scripts Overview

### `conflict-check.sh`
**Purpose:** Analyze potential conflicts before sync operations
**When to use:** Before any sync operation, when unsure about repository state
```bash
./conflict-check.sh
```
**Output:** Risk assessment and recommended actions

### `sync-from-remote.sh`
**Purpose:** Smart remote sync with conflict detection
**When to use:** When starting work, need latest changes from team/other environment
```bash
./sync-from-remote.sh
```
**Features:**
- Auto-stashes local changes
- Intelligent merge/rebase
- Conflict detection and resolution

### `quick-push.sh`
**Purpose:** Fast commit and push with validation
**When to use:** Quick saves, sharing changes, switching environments
```bash
./quick-push.sh                    # Auto-generated commit message
./quick-push.sh "Custom message"   # Custom commit message
```
**Features:**
- Auto-commits all changes
- Pull before push
- Conflict prevention

### `smart-sync.sh`
**Purpose:** Intelligent bidirectional sync
**When to use:** Complex sync scenarios, when other scripts fail
```bash
./smart-sync.sh
```
**Features:**
- Advanced conflict resolution
- Bidirectional sync
- Strategy selection based on state

### `auto-sync-watch.sh`
**Purpose:** Automated file watching and sync
**When to use:** Continuous development sessions
```bash
./auto-sync-watch.sh
```
**Features:**
- Monitors file changes
- Auto-commits every 5 minutes
- Background sync operations
- Session management

---

## ⚠️ Conflict Resolution

### Common Conflict Scenarios

**1. Both environments have new commits**
```bash
# Run smart sync for automatic resolution
./smart-sync.sh
```

**2. Uncommitted changes + remote updates**
```bash
# Stash, pull, restore
git stash
./sync-from-remote.sh
git stash pop
```

**3. Merge conflicts**
```bash
# Manual resolution required
git status                    # See conflicted files
# Edit files to resolve conflicts
git add <resolved-files>
git commit
./quick-push.sh
```

### Conflict Prevention

1. **Always run conflict-check first**
2. **Commit frequently**
3. **Pull before pushing**
4. **Use descriptive commit messages**
5. **Coordinate with team on major changes**

---

## 🎯 Best Practices

### Development Patterns

**Feature Development:**
1. `./conflict-check.sh` - Check state
2. `./sync-from-remote.sh` - Get latest
3. Develop feature
4. `./quick-push.sh "Feature: [description]"` - Share progress
5. Test in other environment
6. `./quick-push.sh "Complete: [feature]"` - Final commit

**Bug Fixes:**
1. `./sync-from-remote.sh` - Ensure latest code
2. Reproduce and fix bug
3. `./quick-push.sh "Fix: [bug description]"` - Quick fix push
4. Test in both environments

**End of Session:**
1. `./quick-push.sh "Session end: [summary]"` - Save all work
2. Verify with `./conflict-check.sh`

### Commit Message Conventions

- `Feature: [description]` - New features
- `Fix: [description]` - Bug fixes  
- `Update: [description]` - Updates/improvements
- `Sync: [description]` - Sync-related commits
- `WIP: [description]` - Work in progress

### File Organization

**Always sync these directories:**
- `client/` - Frontend code
- `server/` - Backend code
- `shared/` - Shared types/schemas
- `scripts/` - Sync scripts
- `*.md` - Documentation
- `package.json` - Dependencies

---

## 🔧 Troubleshooting

### Common Issues

**"Not in a git repository"**
```bash
# Initialize git if needed
git init
git remote add origin <repository-url>
git pull origin main
```

**"Permission denied" on scripts**
```bash
# Make scripts executable
chmod +x *.sh
```

**"Failed to push some refs"**
```bash
# Force sync with smart-sync
./smart-sync.sh
```

**Scripts not working in Replit**
```bash
# Check if bash is available
which bash

# Use alternative method
node scripts/sync-now.js
```

### Emergency Recovery

**If everything breaks:**
1. Backup current work: `cp -r . ../backup`
2. Fresh clone: `git clone <repo> ../fresh && cd ../fresh`
3. Copy your changes from backup
4. Run `./smart-sync.sh`

**Lost commits:**
```bash
# Find lost commits
git reflog

# Recover specific commit
git cherry-pick <commit-hash>
```

---

## 🎉 Success Indicators

### You'll know the sync system is working when:

✅ **Seamless environment switching** - Switch between Replit and local without losing work

✅ **Automatic conflict prevention** - Scripts catch issues before they become problems

✅ **Consistent development** - Same code, same results in both environments

✅ **Team synchronization** - Multiple developers can work without conflicts

✅ **Backup protection** - All work automatically backed up to GitHub

---

## 📞 Support

If you encounter issues:

1. **Check script output** - Scripts provide detailed feedback
2. **Run conflict-check.sh** - Diagnose repository state
3. **Use smart-sync.sh** - Most comprehensive sync solution
4. **Manual git operations** - Fall back to standard git commands
5. **Fresh start** - Clone fresh repository if needed

**Remember:** The sync system is designed to be safe - it will warn you before any potentially destructive operations.

---

*Happy coding! 🚀*