# GitHub Sync Workflow Guide

## Current Setup
Your TechPartner platform is running on the VM at `/home/bander/techpartner_site` with PostgreSQL database integration.

## GitHub Sync Options

### Option 1: Manual Sync (Recommended for testing)
```bash
cd /home/bander/techpartner_site

# Check current status
git status

# Add your changes
git add .

# Commit with message
git commit -m "Updated TechPartner platform with new features"

# Push to GitHub
git push origin main
```

### Option 2: Automatic Sync (Set up once)
```bash
cd /home/bander/techpartner_site

# Set up auto-sync script
./auto-sync-watch.sh &

# This will automatically:
# - Monitor file changes every 30 seconds
# - Auto-commit changes
# - Push to GitHub when changes detected
```

### Option 3: Scheduled Sync
```bash
# Set up cron job for automatic sync every hour
crontab -e

# Add this line:
0 * * * * cd /home/bander/techpartner_site && git add . && git commit -m "Auto-sync $(date)" && git push origin main
```

## Deployment Process
1. **Work on VM**: Make changes to your TechPartner platform
2. **Test locally**: Verify changes work on VM
3. **Sync to GitHub**: Push changes using one of the methods above
4. **GitHub Actions**: Automatically deploys to production (if configured)

## Files to Sync
- All React components in `client/`
- Server code in `server/`
- Database schema in `shared/`
- Configuration files

## Best Practices
- Test changes on VM first
- Use descriptive commit messages
- Sync regularly to avoid conflicts
- Keep production and development in sync