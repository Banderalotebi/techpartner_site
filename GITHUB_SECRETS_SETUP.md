# GitHub Secrets Setup Guide

## 🔴 CRITICAL: Fix These Secrets Immediately

Your GitHub Actions deployment is failing because these secrets are incorrect:

### 1. EC2_HOST (MOST IMPORTANT)

**Current (WRONG):** `ec2-54-227-243-191.`
**Should be:** `ec2-54-227-243-191.compute-1.amazonaws.com`

**How to fix:**
1. Go to GitHub → Your Repository → Settings → Secrets and variables → Actions
2. Find `EC2_HOST` secret
3. Click "Update"
4. Enter the FULL hostname: `ec2-54-227-243-191.compute-1.amazonaws.com`
5. Click "Save"

### 2. EC2_SSH_KEY

**Verify this contains:**
- The FULL private key (starts with `-----BEGIN OPENSSH PRIVATE KEY-----` or `-----BEGIN RSA PRIVATE KEY-----`)
- All lines including the header and footer
- Newlines preserved (not escaped as `\n`)

**How to get your key:**
```bash
# On your local machine where you created the key
cat ~/.ssh/techpartner-key.pem
```

**Copy the ENTIRE output including:**
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACB... (many lines)
-----END OPENSSH PRIVATE KEY-----
```

### 3. EC2_USER

**Should be:** `ubuntu` (for Ubuntu EC2 instances)

---

## How to Add/Update Secrets

1. Go to: https://github.com/Banderalotebi/techpartner_site/settings/secrets/actions
2. Click "New repository secret" or find existing secret and click "Update"
3. Name: `EC2_HOST`
4. Value: `ec2-54-227-243-191.compute-1.amazonaws.com`
5. Click "Add secret"

Repeat for:
- `EC2_USER` = `ubuntu`
- `EC2_SSH_KEY` = (your full private key)

---

## Verify Your EC2 Instance Details

SSH into your EC2 and run:
```bash
# Get the public DNS (hostname)
curl -s http://169.254.169.254/latest/meta-data/public-hostname

# Should output something like:
# ec2-54-227-243-191.compute-1.amazonaws.com
```

Use this exact value for `EC2_HOST` secret.

---

## After Fixing Secrets

1. Go to Actions tab in GitHub
2. Find the failed workflow
3. Click "Re-run jobs" → "Re-run all jobs"

Or push a new commit to trigger deployment.

