# AWS SSH Key Setup Guide for GitHub Actions

## Step 1: Create Key Pair in AWS Console

Fill in these settings:

| Field | Value | Why |
|-------|-------|-----|
| **Name** | `github-actions-deploy` | Descriptive name |
| **Key pair type** | **RSA** | Compatible with GitHub Actions |
| **Private key file format** | **.pem** | For OpenSSH (Linux/Mac/WSL) |

✅ **Click "Create key pair"** - This will download `github-actions-deploy.pem` to your computer

---

## Step 2: Add Public Key to Your EC2 Instance

### Option A: Using AWS Console (Easiest)
1. Go to EC2 → Instances → Select your instance
2. Click **Actions** → **Security** → **Modify IAM role** (or use Instance Connect)
3. Or use **EC2 Instance Connect** to open a browser-based SSH session

### Option B: Using Terminal (If you have current SSH access)
```bash
# SSH into your EC2 instance (using your current key)
ssh -i your-current-key.pem ubuntu@54.227.243.191

# Once logged in, create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add the new public key (you'll paste the public key here)
nano ~/.ssh/authorized_keys
# Paste the public key, then Ctrl+X, Y, Enter to save

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys

# Exit
exit
```

### Get the Public Key from .pem file:
```bash
# On your local machine, run:
ssh-keygen -y -f github-actions-deploy.pem
# This outputs the public key - copy it and paste into authorized_keys
```

---

## Step 3: Add Secrets to GitHub

1. **Go to GitHub** → Your repo → **Settings** → **Secrets and variables** → **Actions**
2. **Click "New repository secret"**
3. Add these 3 secrets:

| Secret Name | Value | How to Get It |
|-------------|-------|---------------|
| `EC2_HOST` | `54.227.243.191` | Your EC2 instance IP |
| `EC2_USER` | `ubuntu` | Default Ubuntu username |
| `EC2_SSH_KEY` | (paste entire .pem content) | `cat github-actions-deploy.pem` |

### ⚠️ Important for EC2_SSH_KEY:
Copy the ENTIRE content including:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----
```

---

## Step 4: Generate New GitHub PAT with Workflow Scope

1. Go to https://github.com/settings/tokens
2. **Click "Generate new token (classic)"**
3. **Note**: `TechPartner Deploy Token`
4. **Expiration**: 90 days (or as needed)
5. **Select scopes**:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflow files)
6. **Generate token** and **copy it immediately**

### Update Your Local Git Remote:
```bash
# Replace YOUR_NEW_TOKEN with the actual token
git remote set-url origin https://YOUR_NEW_TOKEN@github.com/Banderalotebi/techpartner_site.git

# Verify it worked
git remote -v
```

---

## Step 5: Test the Deployment

Once all secrets are set and PAT is configured:

```bash
# Add the workflow file
git add .github/workflows/deploy.yml

# Commit
git commit -m "Add deployment workflow with secret validation"

# Push (this will use your new PAT)
git push origin main
```

---

## Quick Checklist:

- [ ] Created key pair `github-actions-deploy` in AWS
- [ ] Downloaded `.pem` file to your computer
- [ ] Added public key to EC2 `~/.ssh/authorized_keys`
- [ ] Added `EC2_HOST` secret to GitHub (value: `54.227.243.191`)
- [ ] Added `EC2_USER` secret to GitHub (value: `ubuntu`)
- [ ] Added `EC2_SSH_KEY` secret to GitHub (entire .pem content)
- [ ] Generated new PAT with `repo` and `workflow` scopes
- [ ] Updated local git remote with new PAT
- [ ] Pushed workflow file to trigger deployment

---

## Troubleshooting

### If SSH still fails:
1. Check EC2 security group allows SSH (port 22) from GitHub Actions IPs
2. Verify file permissions on EC2: `~/.ssh` should be 700, `authorized_keys` should be 600
3. Check that you're using the correct username (`ubuntu` for Ubuntu AMIs)

### If GitHub Actions still shows "refusing to allow a Personal Access Token":
Your local git is still using the old PAT. Make sure you ran:
```bash
git remote set-url origin https://NEW_TOKEN@github.com/Banderalotebi/techpartner_site.git
```

---

**Need help with a specific step? Let me know which one!**
# Deployment test Sun Mar  1 18:55:37 +03 2026
