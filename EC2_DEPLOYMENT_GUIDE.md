# 🚀 TechPartner Platform - AWS EC2 Deployment Guide

This guide covers deploying the TechPartner platform to AWS EC2 using PM2.

## 📋 Quick Start

### Option 1: One-Click Deploy from Local Machine
```bash
# Deploy to AWS EC2 directly from your local machine
./scripts/deploy-aws-ec2.sh
```

### Option 2: Manual SSH Deploy
```bash
# SSH into your EC2 server
ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com

# On the server, run:
cd /home/ubuntu/techpartner
git pull origin main
npm install
node build.js
pm2 restart techpartner
```

### Option 3: Local Update Script (for local development)
```bash
# Update and run locally with PM2
./update.sh
```

## 🔧 Server Configuration

### EC2 Instance Details
- **Host**: `ec2-54-227-243-191.compute-1.amazonaws.com`
- **User**: `ubuntu`
- **App Directory**: `/home/ubuntu/techpartner/`
- **Port**: `8080`
- **Process Manager**: PM2

### SSH Connection
```bash
ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com
```

## 📝 Available Scripts

| Script | Purpose |
|--------|---------|
| `./update.sh` | Local server update script (installs deps, builds, restarts PM2) |
| `./scripts/deploy-aws-ec2.sh` | Deploy to AWS EC2 from local machine |
| `./deploy-production.sh` | Full production deployment (local + optional cloud) |

## 🔄 Deployment Workflow

### From EC2:

1. **Make your code changes**
2. **Test locally**: Local Machine to `npm run dev`
3. **Build locally**: `node build.js`
4. **Deploy to EC2**:
   ```bash
   ./scripts/deploy-aws-ec2.sh
   ```

The script will:
- ✅ Build the application locally
- ✅ Commit changes to git (if needed)
- ✅ Push to remote repository
- ✅ Connect to EC2 via SSH
- ✅ Pull latest changes
- ✅ Install dependencies
- ✅ Build the application
- ✅ Restart PM2
- ✅ Verify the application is running

## 🔍 Troubleshooting

### Check PM2 Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs techpartner
```

### Check Application Health
```bash
curl http://localhost:8080
```

### Restart Application
```bash
pm2 restart techpartner
```

### If Connection Refused Error Occurs

1. **Check if PM2 is running**:
   ```bash
   pm2 list
   ```

2. **Check PM2 logs**:
   ```bash
   pm2 logs techpartner --lines 50
   ```

3. **Verify build files exist**:
   ```bash
   ls -la dist/
   ```

4. **If dist folder is missing, rebuild**:
   ```bash
   node build.js
   ```

5. **Restart PM2**:
   ```bash
   pm2 restart techpartner
   ```

## 🌐 Production URLs

- **EC2**: http://ec2-54-227-243-191.compute-1.amazonaws.com:8080

## 📦 Project Structure

```
techpartnersite/
├── client/           # React frontend
├── server/           # Express backend
├── shared/           # Shared types
├── dist/             # Production build
├── data/             # SQLite database
├── scripts/          # Deployment scripts
│   └── deploy-aws-ec2.sh  # AWS EC2 deployment
├── update.sh         # Local update script
└── build.js          # Build script
```

## ✅ Verification Commands

After deployment, verify:

```bash
# 1. Check PM2 is running
pm2 status
# Should show "techpartner" with status "online"

# 2. Check logs for errors
pm2 logs techpartner --lines 20

# 3. Test locally
curl http://localhost:8080

# 4. Test from outside (if port is open)
curl http://ec2-54-227-243-191.compute-1.amazonaws.com:8080
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Your repository now has **automatic deployment** set up via GitHub Actions!

### How It Works

1. **You push code** (from VS Code, Replit, or anywhere)
2. **GitHub catches the push** and runs the CI/CD pipeline
3. **Build test** - GitHub attempts to build (`node build.js`)
   - If build fails → GitHub sends error notification, live site is NOT affected
4. **Deploy** - If build succeeds, GitHub SSHs into EC2 and:
   - Pulls latest code
   - Runs `npm install`
   - Runs `node build.js`
   - Restarts PM2

### Setting Up GitHub Secrets

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `HOST` | `54.227.243.191` |
| `USERNAME` | `ubuntu` |
| `SSH_PRIVATE_KEY` | *(Contents of your kimi-key.pem file)* |

### Testing the CI/CD

```bash
# Make a small change
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

Then watch the deployment at: **https://github.com/YOUR_USERNAME/techpartner_site/actions**

### Benefits

- ✅ **Broken code never goes live** - Build is tested before deploy
- ✅ **No manual server access needed** - Everything is automated
- ✅ **Instant notifications** - GitHub emails you if deployment fails
- ✅ **Rollback easy** - Just revert commit and push

