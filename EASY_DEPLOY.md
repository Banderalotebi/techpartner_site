# 🚀 TechPartner Platform - Easy Deployment Guide

This repository now includes automated deployment tools to make pushing updates across Git and servers much easier.

## 🎯 Quick Commands

### Super Simple One-Liners
```bash
# Deploy to production (everything automated)
./scripts/git-deploy.sh production "Your commit message"

# Deploy to staging
./scripts/git-deploy.sh staging "Testing new feature"

# Just push to git
./scripts/git-deploy.sh push "Quick fix"

# Interactive mode (guided setup)
./scripts/git-deploy.sh
```

## 🛠️ Available Scripts

### 1. Git + Deploy Automation (`scripts/git-deploy.sh`)
**One command does everything: commit → push → deploy**

```bash
# Interactive mode (best for beginners)
./scripts/git-deploy.sh

# Quick examples
./scripts/git-deploy.sh production "Release v2.1"
./scripts/git-deploy.sh staging "Test new feature"
./scripts/git-deploy.sh push "Bug fix"
```

### 2. Cloud Deployment Only (`scripts/deploy.sh`)
**For when you just want to deploy (code already pushed)**

```bash
# Quick deploy to production
./scripts/deploy.sh deploy

# Deploy to staging
./scripts/deploy.sh staging

# Check service status
./scripts/deploy.sh status

# View logs
./scripts/deploy.sh logs

# Rollback if needed
./scripts/deploy.sh rollback
```

## 🔄 Automated GitHub Actions

The system automatically deploys when you push to specific branches:

- **Push to `main`** → Automatically deploys to **Production**
- **Push to `develop`** → Automatically deploys to **Staging**
- **Pull Requests** → Runs tests and builds

## 📋 Deployment Workflow

### Option 1: Fully Automated (Recommended)
```bash
# 1. Make your changes
# 2. Run one command
./scripts/git-deploy.sh production "Describe your changes"

# That's it! The script will:
# ✅ Commit your changes
# ✅ Push to GitHub
# ✅ Trigger automatic deployment
# ✅ Monitor deployment status
```

### Option 2: Step by Step
```bash
# 1. Traditional git workflow
git add .
git commit -m "Your changes"
git push origin main

# 2. GitHub Actions automatically deploys
# 3. Monitor at: https://github.com/YOUR_REPO/actions
```

### Option 3: Manual Deployment
```bash
# If you want to deploy manually
./scripts/deploy.sh deploy
```

## 🌍 Environments

| Environment | URL | Branch | Auto-Deploy |
|-------------|-----|---------|-------------|
| **Production** | https://techpartner.sa | `main` | ✅ Yes |
| **Staging** | https://staging-techpartner.sa | `develop` | ✅ Yes |
| **Local** | http://localhost:3000 | any | Manual |

## 🔧 Setup Instructions

### First Time Setup
1. **Make scripts executable** (already done):
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Test the setup**:
   ```bash
   ./scripts/deploy.sh check
   ```

3. **Try interactive mode**:
   ```bash
   ./scripts/git-deploy.sh
   ```

### Required Secrets (GitHub)
These are already configured in your repository:
- `GCP_SA_KEY` - Google Cloud Service Account key
- `GITHUB_TOKEN` - Automatic GitHub token

## 🚨 Emergency Procedures

### Quick Rollback
```bash
# Rollback production to previous version
./scripts/deploy.sh rollback

# Follow the prompts to select a revision
```

### Check Service Status
```bash
# See if services are running
./scripts/deploy.sh status

# View recent logs
./scripts/deploy.sh logs production
./scripts/deploy.sh logs staging
```

### Debug Failed Deployment
```bash
# Check GitHub Actions
# Go to: https://github.com/YOUR_REPO/actions

# Check Cloud Run logs
./scripts/deploy.sh logs

# Manual deployment
./scripts/deploy.sh build  # Test build first
./scripts/deploy.sh deploy # Then deploy
```

## 💡 Best Practices

### Recommended Workflow
1. **Work on feature branch**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   ./scripts/git-deploy.sh branch "Feature work" feature/new-feature
   ```

2. **Test on staging**:
   ```bash
   git checkout develop
   git merge feature/new-feature
   ./scripts/git-deploy.sh staging "Test new feature"
   ```

3. **Deploy to production**:
   ```bash
   git checkout main
   git merge develop
   ./scripts/git-deploy.sh production "Release new feature"
   ```

### Commit Message Format
Use clear, descriptive commit messages:
```bash
./scripts/git-deploy.sh production "Fix order flow display issue"
./scripts/git-deploy.sh staging "Add user authentication validation"
./scripts/git-deploy.sh push "Update README documentation"
```

## 📊 Monitoring

### Real-time Monitoring
- **GitHub Actions**: https://github.com/YOUR_REPO/actions
- **Google Cloud Console**: https://console.cloud.google.com/run
- **Service URLs**: 
  - Production: https://techpartner.sa
  - Staging: https://staging-techpartner.sa

### Health Checks
The system automatically:
- ✅ Tests builds before deployment
- ✅ Performs health checks after deployment
- ✅ Creates release notes
- ✅ Sends notifications on failures

## 🆘 Getting Help

### Common Issues
1. **Build fails**: Run `./scripts/deploy.sh build` to test locally
2. **Deployment fails**: Check `./scripts/deploy.sh logs`
3. **Service down**: Try `./scripts/deploy.sh rollback`

### Support Commands
```bash
# Check everything is working
./scripts/deploy.sh check

# View service status
./scripts/deploy.sh status

# Interactive help
./scripts/git-deploy.sh help
./scripts/deploy.sh help
```

---

**🎉 That's it! Your deployment process is now super simple:**
- One command deploys everything
- Automatic monitoring and rollback
- Multi-environment support
- No more manual steps!
