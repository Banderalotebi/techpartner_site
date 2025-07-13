# Resolve Server Git Conflict

The server update failed due to divergent branches. Here's how to fix it:

## Run These Commands on the VM:

```bash
# Configure git to merge divergent branches
git config pull.rebase false

# Force pull the latest changes
git pull origin main

# If conflicts occur, reset to match GitHub exactly
git reset --hard origin/main

# Install dependencies and restart
npm install --production
pm2 restart all
pm2 status
```

## Alternative - Clean Reset:

If pull still fails:
```bash
# Backup current state
cp -r . ../backup-$(date +%Y%m%d)

# Reset to exact GitHub state
git fetch origin
git reset --hard origin/main

# Clean install and restart
npm install --production
pm2 restart all
```

## Verify Update:

After restart, check:
```bash
# Check git status
git status
git log --oneline -3

# Test server
curl localhost:3000/api/health
```

The server should now have your database integration with PostgreSQL, JWT authentication, and enhanced security features.