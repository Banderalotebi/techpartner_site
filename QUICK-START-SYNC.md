# ⚡ Quick Start Sync Reference

## 🚀 Essential Commands

### Check Before Sync
```bash
./conflict-check.sh     # Analyze conflicts
```

### Get Latest Changes
```bash
./sync-from-remote.sh   # Pull from GitHub
```

### Save & Share Changes
```bash
./quick-push.sh         # Commit & push
./quick-push.sh "msg"   # Custom message
```

### Smart Auto-Sync
```bash
./smart-sync.sh         # Handle complex syncs
```

### Continuous Monitoring
```bash
./auto-sync-watch.sh    # Auto-sync every 5min
```

---

## 🔄 Daily Workflows

### Morning Start
```bash
./conflict-check.sh && ./sync-from-remote.sh
```

### Quick Save
```bash
./quick-push.sh
```

### End of Day
```bash
./quick-push.sh "End of day progress"
```

### Emergency Sync
```bash
./smart-sync.sh
```

---

## 🎯 When to Use Each Script

| Scenario | Command | Why |
|----------|---------|-----|
| Starting work | `./sync-from-remote.sh` | Get latest changes |
| Unsure about state | `./conflict-check.sh` | Check for conflicts |
| Quick save | `./quick-push.sh` | Fast commit & push |
| Complex conflicts | `./smart-sync.sh` | Advanced resolution |
| Long development | `./auto-sync-watch.sh` | Automated syncing |

---

## 🚨 Common Issues & Quick Fixes

**Scripts not executable:**
```bash
chmod +x *.sh
```

**Merge conflicts:**
```bash
./smart-sync.sh
```

**Uncommitted changes:**
```bash
./quick-push.sh "Save progress"
```

**Remote ahead:**
```bash
./sync-from-remote.sh
```

**Everything broken:**
```bash
./smart-sync.sh
```

---

## 💡 Pro Tips

- Always run `./conflict-check.sh` first when unsure
- Use descriptive messages with `./quick-push.sh "message"`
- Start continuous sync with `./auto-sync-watch.sh` for long sessions
- Scripts are safe - they warn before destructive operations
- Each script provides detailed feedback about what it's doing

---

## 🔗 Environment Switching

**Replit → Local:**
1. `./quick-push.sh` (in Replit)
2. `git pull origin main` (in Local)

**Local → Replit:**
1. `git push origin main` (in Local)  
2. `./sync-from-remote.sh` (in Replit)

---

*For detailed instructions, see [REPLIT-LOCAL-SYNC-GUIDE.md](./REPLIT-LOCAL-SYNC-GUIDE.md)*