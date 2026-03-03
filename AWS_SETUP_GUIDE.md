# AWS Credentials Setup Guide

## The Issue
You entered `kimi-key` as the AWS Access Key ID, but that's your SSH key filename. AWS requires different credentials.

## Option 1: Get AWS Credentials (Recommended)

### Step 1: Create AWS Access Keys
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click **"Users"** → Select your user
3. Go to **"Security credentials"** tab
4. Click **"Create access key"**
5. Choose **"Command Line Interface (CLI)"**
6. Click **"Next"** → **"Create access key"**
7. **IMPORTANT**: Copy the **Access key ID** and **Secret access key** (you can't see the secret key again!)

### Step 2: Configure AWS CLI
```bash
aws configure
```

Enter:
- **AWS Access Key ID**: (the one you just copied, starts with AKIA...)
- **AWS Secret Access Key**: (the secret key you just copied)
- **Default region name**: `us-east-1` (required for CloudFront)
- **Default output format**: `json`

### Step 3: Verify
```bash
aws sts get-caller-identity
```
Should show your account info.

### Step 4: Run Setup
```bash
./scripts/setup-cloudfront-complete.sh
```

---

## Option 2: Manual CloudFront Setup (No AWS CLI Needed)

If you prefer not to use AWS CLI, follow the manual steps in `SSL_SETUP_GUIDE.md`:

1. Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **"Create Distribution"**
3. Configure as documented in the guide

---

## Option 3: Use EC2 Instance Profile (If on EC2)

If you're SSH'd into the EC2 instance, it might already have an IAM role:

```bash
# Check if EC2 has instance profile
curl http://169.254.169.254/latest/meta-data/iam/info
```

If this returns data, the EC2 has IAM permissions and you can run AWS commands without configuring credentials!

---

## Security Note

⚠️ **Never commit AWS credentials to git!** The `.gitignore` already ignores:
- `cloudfront-config.json`
- Any files with credentials

Always keep your credentials secure.

---

## Quick Test After Setup

Once CloudFront is created:
```bash
# Test main domain
curl -vI https://techpartner.sa

# Test subdomain
curl -vI https://www.techpartner.sa
