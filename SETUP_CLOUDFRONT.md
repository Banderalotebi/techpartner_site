# AWS SSL Certificate Setup Guide for TechPartner

## Overview
This guide explains how to use your AWS ACM SSL certificate (`arn:aws:acm:us-east-1:597284493757:certificate/535f75d7-d8f9-48af-81de-c737f5df74b2`) to secure all subdomains of `techpartner.sa`.

Since AWS ACM certificates cannot be downloaded or installed directly on EC2 instances, we'll use **AWS CloudFront** as a CDN in front of your EC2 instance.

## Architecture
```
User → CloudFront (HTTPS with ACM cert) → EC2 (HTTP only) → Node.js App
```

## Step 1: Create CloudFront Distribution

### Option A: Using the Setup Script
```bash
cd /Users/bander/techpartnersite
chmod +x scripts/setup-cloudfront.sh
./scripts/setup-cloudfront.sh
```

### Option B: Manual Setup via AWS Console

1. Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click "Create Distribution"
3. Configure:
   - **Origin Domain**: `ec2-54-227-243-191.compute-1.amazonaws.com` (your EC2)
   - **Protocol**: HTTP only (we'll handle HTTPS at CloudFront)
   - **Name**: techpartner-origin
   - **Cache Policy**: CachingOptimized
4. Under **Settings**:
   - **Alternate Domain Names (CNAMEs)**: 
     - `techpartner.sa`
     - `*.techpartner.sa`
   - **Custom SSL Certificate**: Select `535f75d7-d8f9-48af-81de-c737f5df74b2`
   - **Security Policy**: TLSv1.2_2021
5. **Default Root Object**: `index.html`
6. Click "Create Distribution"
7. Note the CloudFront Domain Name (e.g., `d1234567890.cloudfront.net`)

## Step 2: Update DNS Records

In your DNS provider (Route 53 or other), create:

| Record Type | Name | Value |
|-------------|------|-------|
| A | techpartner.sa | d1234567890.cloudfront.net |
| CNAME | *.techpartner.sa | d1234567890.cloudfront.net |

### If using Route 53:
```bash
# Get hosted zone ID
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='techpartner.sa.'].Id" --output text | cut -d'/' -f3)

# Create record
aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch file://dns-config.json
```

Create `dns-config.json`:
```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "techpartner.sa",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d1234567890.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "*.techpartner.sa",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "d1234567890.cloudfront.net"}]
      }
    }
  ]
}
```

## Step 3: Update Nginx on EC2

SSH to your EC2 instance and update nginx configuration:

```bash
ssh -i your-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com

# Copy the new nginx config (from this repo: nginx-techpartner-cloudfront.conf)
sudo cp /etc/nginx/sites-available/techpartner /etc/nginx/sites-available/techpartner.backup
sudo cp ~/techpartner/nginx-techpartner-cloudfront.conf /etc/nginx/sites-available/techpartner
sudo nginx -t
sudo systemctl reload nginx
```

The new config:
- Listens on HTTP only (port 80)
- Handles CloudFront IP ranges properly for real IP forwarding
- Removes SSL configuration (now handled by CloudFront)

## Step 4: Configure CloudFront Caching (Optional but Recommended)

Create a cache policy for dynamic content:

```json
{
  "Name": "TechPartner-Dynamic",
  "DefaultTTL": 0,
  "MinTTL": 0,
  "MaxTTL": 31536000,
  "ParametersInCacheKeyAndForwardedToOrigin": {
    "CookiesConfig": {
      "CookieBehavior": "all"
    },
    "HeadersConfig": {
      "HeaderBehavior": "whitelist",
      "Headers": {
        "Items": ["Origin", "Authorization", "Content-Type"]
      }
    },
    "QueryStringsConfig": {
      "QueryStringBehavior": "all"
    }
  }
}
```

## Covered Subdomains

With `*.techpartner.sa` in your ACM certificate, these will all be secured:
- `techpartner.sa`
- `www.techpartner.sa`
- `api.techpartner.sa`
- `admin.techpartner.sa`
- `blog.techpartner.sa`
- `shop.techpartner.sa`
- Any other subdomain you create

## Testing

After setup, test your SSL:
```bash
# Test main domain
curl -vI https://techpartner.sa

# Test subdomain
curl -vI https://www.techpartner.sa
curl -vI https://api.techpartner.sa

# Check SSL certificate
openssl s_client -connect techpartner.sa:443 -servername techpartner.sa
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| SSL not working | Verify ACM certificate is in `us-east-1` (required for CloudFront) |
| Too many redirects | Ensure CloudFront is set to HTTP (not HTTPS) origin |
| 502 Bad Gateway | Check EC2 nginx is running: `sudo systemctl status nginx` |
| Static files not loading | Clear CloudFront cache after deployment |
| Subdomains not resolving | Check DNS CNAME points to CloudFront domain |

## Files Created

- `scripts/setup-cloudfront.sh` - Automated CloudFront setup script
- `nginx-techpartner-cloudfront.conf` - Nginx config for use with CloudFront
- `SETUP_CLOUDFRONT.md` - This file

## Cost Estimate

- CloudFront: ~$0.085/GB transfer + requests
- Route53: $0.50/month per hosted zone
- Data transfer from CloudFront to EC2 is free

