# Replit to Server Deployment Guide

## Complete Development Flow

### 1. Work in Replit
- Make changes to React components, server code, etc.
- Test using the Replit development server (port 5000)

### 2. Push to GitHub
```bash
# In Replit terminal
git add .
git commit -m "Describe your changes"
git push origin main
```

### 3. Update Your Production Server
**Option A: One Command Update**
```bash
# SSH to your VM and run:
cd /home/bander/techpartner_site
./update-from-github.sh
```

**Option B: Manual Steps**
```bash
# On your VM:
cd /home/bander/techpartner_site
git pull origin main
npm run build
sudo pkill -f "node dist/index.js"
sudo PORT=80 DATABASE_URL="postgresql://..." NODE_ENV=production node dist/index.js
```

### 4. Verify Updates
- Check your domain to see changes live
- Test functionality to ensure everything works

## Development vs Production
- **Replit (Development)**: Port 5000, for testing and development
- **VM Server (Production)**: Port 80, live on your domain with database

## Best Practices
- Test changes in Replit first
- Use clear commit messages
- Update server after each major change
- Monitor server logs for issues

Your changes from Replit will be live on your domain after following these steps!