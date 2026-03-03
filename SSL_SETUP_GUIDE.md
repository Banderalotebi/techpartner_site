# SSL Certificate Setup Guide for TechPartner.sa

## Certificate Details
- **ARN**: `arn:aws:acm:us-east-1:597284493757:certificate/535f75d7-d8f9-48af-81de-c737f5df74b2`
- **Covers**: `techpartner.sa` and `*.techpartner.sa` (all subdomains)
- **Source**: AWS Certificate Manager (Amazon issued)

## Architecture Overview

```
User → CloudFront (HTTPS with ACM cert) → EC2 (HTTP) → Node.js App
```

Since AWS ACM certificates **cannot be downloaded**, we use CloudFront as a CDN in front of your EC2 instance.

---

## Option 1: Automated Setup (Recommended)

### Step 1: Configure AWS CLI

```bash
# Install AWS CLI if not installed
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configure AWS CLI
aws configure

# Enter your credentials:
# - AWS Access Key ID: [Your Access Key]
# - AWS Secret Access Key: [Your Secret Key]
# - Default region name: us-east-1 (required for CloudFront)
# - Default output format: json
```

### Step 2: Run the Setup Script

```bash
cd /Users/bander/techpartnersite
./scripts/setup-cloudfront-complete.sh
```

This script will:
1. ✅ Create CloudFront distribution with your ACM certificate
2. ✅ Configure nginx on EC2 to work with CloudFront
3. ✅ Save configuration details
4. ⏳ Wait for distribution to deploy (5-15 minutes)

### Step 3: Update DNS (if using Route 53)

```bash
# Get the CloudFront domain from the output, then:
./scripts/update-route53.sh d1234567890.cloudfront.net
```

---

## Option 2: Manual Setup via AWS Console

### Step 1: Create CloudFront Distribution

1. Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **"Create Distribution"**
3. Configure **Origin**:
   - **Origin domain**: `ec2-54-227-243-191.compute-1.amazonaws.com`
   - **Protocol**: HTTP only
   - **Name**: `techpartner-ec2`
4. Configure **Default Cache Behavior**:
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE
   - **Cache policy**: CachingOptimized (for static files)
5. Configure **Settings**:
   - **Alternate domain names (CNAMEs)**:
     - `techpartner.sa`
     - `*.techpartner.sa`
   - **Custom SSL certificate**: Select `535f75d7-d8f9-48af-81de-c737f5df74b2`
   - **Security policy**: TLSv1.2_2021
   - **Default root object**: `index.html`
6. Click **"Create Distribution"**
7. Note the **CloudFront Domain Name** (e.g., `d1234567890.cloudfront.net`)

### Step 2: Update Nginx on EC2

SSH to your EC2 instance:

```bash
ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com
```

Update nginx configuration:

```bash
# Backup current config
sudo cp /etc/nginx/sites-available/techpartner /etc/nginx/sites-available/techpartner.backup.$(date +%s)

# Copy the CloudFront-ready config
sudo cp /var/www/techpartner/nginx-techpartner-cloudfront.conf /etc/nginx/sites-available/techpartner

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```

### Step 3: Update DNS Records

In your DNS provider (Route 53, GoDaddy, etc.):

| Record Type | Name | Value |
|-------------|------|-------|
| A (Alias) | techpartner.sa | [CloudFront Domain] |
| CNAME | *.techpartner.sa | [CloudFront Domain] |

**For Route 53**:
1. Go to Route 53 → Hosted Zones → techpartner.sa
2. Create record:
   - **Record name**: (blank for root)
   - **Record type**: A
   - **Alias**: Yes
   - **Route traffic to**: CloudFront distribution
   - **Choose distribution**: Select your distribution
3. Create another record:
   - **Record name**: *
   - **Record type**: A
   - **Alias**: Yes
   - **Route traffic to**: Same CloudFront distribution

---

## Covered Subdomains

With `*.techpartner.sa` in your certificate, these are all secured:

- ✅ `techpartner.sa` (main domain)
- ✅ `www.techpartner.sa`
- ✅ `api.techpartner.sa`
- ✅ `admin.techpartner.sa`
- ✅ `blog.techpartner.sa`
- ✅ `shop.techpartner.sa`
- ✅ `app.techpartner.sa`
- ✅ Any other subdomain you create

---

## Testing

After setup (allow 5-15 minutes for CloudFront deployment):

```bash
# Test main domain
curl -vI https://techpartner.sa

# Test subdomain
curl -vI https://www.techpartner.sa
curl -vI https://api.techpartner.sa

# Check SSL certificate details
openssl s_client -connect techpartner.sa:443 -servername techpartner.sa </dev/null | openssl x509 -text | grep -A2 "Subject Alternative Name"

# Should show:
# DNS:techpartner.sa
# DNS:*.techpartner.sa
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **SSL not working** | Verify ACM certificate is in `us-east-1` (required for CloudFront) |
| **Too many redirects** | Ensure CloudFront origin protocol is HTTP (not HTTPS) |
| **502 Bad Gateway** | Check EC2 nginx is running: `sudo systemctl status nginx` |
| **Static files not loading** | Clear CloudFront cache after deployment |
| **Subdomains not resolving** | Check DNS CNAME points to CloudFront domain |
| **Certificate error** | Verify domain names in CloudFront match certificate |

---

## Files Created

- `scripts/setup-cloudfront-complete.sh` - Automated setup
- `scripts/update-route53.sh` - DNS update helper
- `nginx-techpartner-cloudfront.conf` - Nginx config for CloudFront
- `cloudfront-config.json` - Saved configuration (after setup)

---

## Cost Estimate

- **CloudFront**: ~$0.085/GB data transfer + $0.01 per 10,000 requests
- **Route 53**: $0.50/month per hosted zone + $0.40/million queries
- **Data transfer**: From CloudFront to EC2 is free (same region)

Typical cost for a small site: **$1-5/month**

---

## Next Steps After Setup

1. ✅ Test all subdomains with HTTPS
2. ✅ Set up automatic cache invalidation on deploy
3. ✅ Configure CloudFront error pages (optional)
4. ✅ Enable CloudFront logging (optional)
