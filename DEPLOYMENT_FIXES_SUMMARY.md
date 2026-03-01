# Deployment Fixes Summary

## ✅ Issues Fixed in Code

### 1. Port Configuration Mismatch (FIXED)
**Problem:** App ran on port 3000, nginx proxied to 8080
**Solution:** Changed default port in `server/index.ts` from 3000 to 8080

### 2. Node.js Version (FIXED)
**Problem:** GitHub Actions used Node 18, but SEO packages require Node 20+
**Solution:** Updated `.github/workflows/deploy-aws-ec2.yml` to use Node 20

### 3. Admin User Script (FIXED)
**Problem:** Database import failing, wrong Drizzle ORM syntax
**Solution:** 
- Added `import 'dotenv/config'` at top
- Fixed ORM syntax: `eq(users.email, email)` instead of `users.email === email`

### 4. GitHub Actions Workflow (IMPROVED)
**Problem:** Missing error handling, poor deployment logic
**Solution:** 
- Added better SSH error handling
- Improved deployment script with backups
- Added health checks after deployment
- Better PM2 management

---

## 🔴 CRITICAL: You Must Fix These GitHub Secrets

### 1. EC2_HOST (URGENT)
```
Current (WRONG):  ec2-54-227-243-191.
Should be:        ec2-54-227-243-191.compute-1.amazonaws.com
```

**How to verify your actual hostname:**
```bash
ssh ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com
curl -s http://169.254.169.254/latest/meta-data/public-hostname
```

### 2. EC2_SSH_KEY
Must contain the FULL private key including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
[all the key lines]
-----END OPENSSH PRIVATE KEY-----
```

### 3. EC2_USER
```
Should be: ubuntu
```

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Fix GitHub Secrets (5 minutes)
1. Go to: https://github.com/Banderalotebi/techpartner_site/settings/secrets/actions
2. Update `EC2_HOST` with full hostname
3. Verify `EC2_SSH_KEY` has complete private key
4. Ensure `EC2_USER` is `ubuntu`

### Step 2: Setup EC2 Server (One-time, 10 minutes)
SSH into your EC2 and run:
```bash
curl -fsSL https://raw.githubusercontent.com/Banderalotebi/techpartner_site/main/scripts/setup-ec2-server.sh | bash
```

Or manually:
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and Nginx
sudo npm install -g pm2
sudo apt-get install -y nginx

# Create app directory
mkdir -p /home/ubuntu/techpartner
```

### Step 3: Configure Environment Variables on EC2
Create `/home/ubuntu/techpartner/.env`:
```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_3w1U0RKL8Vem@ep-cool-snowflake-a4pok1e7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# Application
NODE_ENV=production
PORT=8080

# JWT
JWT_SECRET=your-jwt-secret-here

# Email (Zoho)
ZOHO_USER=hello@techpartner.sa
ZOHO_PASS=your-zoho-password

# Google Analytics (for tracking)
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_API_SECRET=your-api-secret

# API Keys for syndication
DEVTO_API_KEY=your-devto-key
MEDIUM_API_KEY=your-medium-key
MEDIUM_AUTHOR_ID=your-medium-id
```

### Step 4: Deploy via GitHub Actions
1. Push the latest code to main branch
2. Go to Actions tab: https://github.com/Banderalotebi/techpartner_site/actions
3. Watch the deployment

### Step 5: Verify Deployment
```bash
# On EC2, check if app is running
curl http://localhost:8080/api/health

# Should return: {"status":"healthy",...}

# Check PM2 status
pm2 status
pm2 logs techpartner
```

### Step 6: Setup Nginx
```bash
# Copy nginx config
sudo cp /home/ubuntu/techpartner/nginx-techpartner.conf /etc/nginx/sites-available/techpartner

# Enable site
sudo ln -sf /etc/nginx/sites-available/techpartner /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx

# Enable SSL
sudo certbot --nginx -d techpartner.sa -d www.techpartner.sa
```

### Step 7: Create Admin User
```bash
cd /home/ubuntu/techpartner
npx tsx scripts/create-admin-user.ts
```

---

## 🔧 Testing Checklist

### ✅ Already Tested:
- [x] TypeScript compilation passes
- [x] Git push successful
- [x] Port configuration fixed (3000 → 8080)
- [x] Node.js version updated (18 → 20)
- [x] Admin script syntax fixed

### ❌ Needs Testing After Deployment:
- [ ] GitHub Actions workflow runs successfully
- [ ] App deploys to EC2
- [ ] Health check passes: `curl http://localhost:8080/api/health`
- [ ] Nginx serves site: `curl https://techpartner.sa/api/health`
- [ ] Admin user creation works
- [ ] Admin dashboard accessible at `/admin/seo`
- [ ] Database connectivity (Neon PostgreSQL)
- [ ] SEO Command Center API endpoints
- [ ] Email notifications (Zoho SMTP)

---

## 🆘 Troubleshooting

### If GitHub Actions still fails:
```bash
# Test SSH manually from your local machine
ssh -i ~/.ssh/your-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com

# If that works, the secrets are correct
# If not, check your key file and hostname
```

### If app doesn't start on EC2:
```bash
# Check logs
pm2 logs techpartner

# Check if port 8080 is in use
sudo lsof -i :8080

# Kill existing process if needed
sudo kill -9 $(sudo lsof -t -i:8080)
pm2 restart techpartner
```

### If nginx shows 502 error:
```bash
# Check if app is running
curl http://localhost:8080/api/health

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Verify nginx config
sudo nginx -t
```

---

## 📞 Need Help?

If deployment still fails after fixing secrets:
1. Check the exact error in GitHub Actions logs
2. SSH into EC2 and check: `pm2 logs`
3. Verify all environment variables are set: `cat /home/ubuntu/techpartner/.env`
4. Test database connection: `curl $DATABASE_URL` (should not timeout)

