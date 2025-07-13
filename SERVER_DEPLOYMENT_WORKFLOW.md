# Server Deployment Workflow

## When You Make Changes in Replit

### Step 1: Push Changes from Replit to GitHub
```bash
# In Replit terminal
git add .
git commit -m "Updated TechPartner features"
git push origin main
```

### Step 2: Update Your Server (Choose One Method)

#### Method A: Manual Pull and Restart
```bash
# SSH to your VM
cd /home/bander/techpartner_site

# Pull latest changes from GitHub
git pull origin main

# Rebuild the project
npm run build

# Restart server with database
sudo pkill -f "node dist/index.js"
sudo PORT=80 DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPX@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require" NODE_ENV=production node dist/index.js
```

#### Method B: Use Update Script (Automated)
```bash
# On your VM
cd /home/bander/techpartner_site
./update-from-github.sh
```

#### Method C: PM2 Automated Deployment
```bash
# Set up PM2 ecosystem for auto-restart
pm2 start ecosystem.config.js --name techpartner
pm2 startup
pm2 save

# Update script with PM2
git pull origin main
npm run build
pm2 restart techpartner
```

## Complete Workflow
1. **Develop in Replit** → Make changes, test locally
2. **Push to GitHub** → `git push origin main`
3. **Update Server** → Pull changes and restart
4. **Verify** → Check your domain to see updates live

Your server will be updated with all new features from Replit!