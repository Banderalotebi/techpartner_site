#!/bin/bash
# Complete CloudFront Setup Script for TechPartner
# Uses AWS ACM certificate for all subdomains

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="techpartner.sa"
ACM_CERT_ARN="arn:aws:acm:us-east-1:597284493757:certificate/535f75d7-d8f9-48af-81de-c737f5df74b2"
EC2_IP="54.227.243.191"
EC2_HOST="ec2-54-227-243-191.compute-1.amazonaws.com"
ORIGIN_ID="techpartner-ec2-origin"

echo -e "${GREEN}🚀 Setting up CloudFront for $DOMAIN with ACM certificate${NC}"
echo -e "${YELLOW}Certificate ARN: $ACM_CERT_ARN${NC}"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
    echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Create CloudFront distribution config
cat > /tmp/cloudfront-config.json << 'EOF'
{
  "CallerReference": "techpartner-$(date +%s)",
  "Comment": "TechPartner - SSL for all subdomains",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "techpartner-ec2-origin",
        "DomainName": "ec2-54-227-243-191.compute-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only",
          "OriginSslProtocols": {
            "Quantity": 2,
            "Items": ["TLSv1.2", "TLSv1.1"]
          }
        },
        "CustomHeaders": {
          "Quantity": 0
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "techpartner-ec2-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 7,
      "Items": ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": true,
      "Cookies": {
        "Forward": "all"
      },
      "Headers": {
        "Quantity": 5,
        "Items": ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Authorization", "Content-Type"]
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 0,
    "MaxTTL": 31536000,
    "Compress": true,
    "SmoothStreaming": false
  },
  "CacheBehaviors": {
    "Quantity": 2,
    "Items": [
      {
        "PathPattern": "/api/*",
        "TargetOriginId": "techpartner-ec2-origin",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
          "Quantity": 7,
          "Items": ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
          "CachedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"]
          }
        },
        "ForwardedValues": {
          "QueryString": true,
          "Cookies": {
            "Forward": "all"
          },
          "Headers": {
            "Quantity": 5,
            "Items": ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Authorization", "Content-Type"]
          }
        },
        "MinTTL": 0,
        "DefaultTTL": 0,
        "MaxTTL": 0,
        "Compress": true
      },
      {
        "PathPattern": "/web-design/*",
        "TargetOriginId": "techpartner-ec2-origin",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
          "Quantity": 2,
          "Items": ["GET", "HEAD"],
          "CachedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"]
          }
        },
        "ForwardedValues": {
          "QueryString": false,
          "Cookies": {
            "Forward": "none"
          }
        },
        "MinTTL": 86400,
        "DefaultTTL": 2592000,
        "MaxTTL": 31536000,
        "Compress": true
      }
    ]
  },
  "Aliases": {
    "Quantity": 2,
    "Items": ["techpartner.sa", "*.techpartner.sa"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:597284493757:certificate/535f75d7-d8f9-48af-81de-c737f5df74b2",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "CertificateSource": "acm"
  },
  "HttpVersion": "http2",
  "PriceClass": "PriceClass_100",
  "Restrictions": {
    "GeoRestriction": {
      "RestrictionType": "none",
      "Quantity": 0
    }
  },
  "WebACLId": ""
}
EOF

echo -e "${YELLOW}📋 Creating CloudFront distribution...${NC}"

# Create the distribution
DISTRIBUTION_RESULT=$(aws cloudfront create-distribution --distribution-config file:///tmp/cloudfront-config.json 2>&1)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create CloudFront distribution:${NC}"
    echo "$DISTRIBUTION_RESULT"
    exit 1
fi

DISTRIBUTION_ID=$(echo "$DISTRIBUTION_RESULT" | grep -o '"Id": "[^"]*"' | head -1 | cut -d'"' -f4)
CLOUDFRONT_DOMAIN=$(echo "$DISTRIBUTION_RESULT" | grep -o '"DomainName": "[^"]*"' | head -1 | cut -d'"' -f4)

echo -e "${GREEN}✅ CloudFront Distribution created!${NC}"
echo -e "   Distribution ID: $DISTRIBUTION_ID"
echo -e "   CloudFront Domain: $CLOUDFRONT_DOMAIN"
echo ""

# Save configuration
cat > cloudfront-config.json << EOF
{
  "distributionId": "$DISTRIBUTION_ID",
  "domainName": "$CLOUDFRONT_DOMAIN",
  "origin": "$EC2_HOST",
  "certificateArn": "$ACM_CERT_ARN",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo -e "${YELLOW}📄 Configuration saved to cloudfront-config.json${NC}"
echo ""

# Update nginx on EC2
echo -e "${YELLOW}🔧 Updating nginx configuration on EC2...${NC}"

# Create the nginx config for CloudFront
cat > /tmp/nginx-cloudfront.conf << 'EOF'
# TechPartner Nginx Configuration for CloudFront
# CloudFront handles HTTPS, EC2 only handles HTTP

# HTTP server (CloudFront will proxy HTTPS requests to HTTP)
server {
    listen 80;
    listen [::]:80;
    server_name techpartner.sa www.techpartner.sa *.techpartner.sa;
    
    # Trust CloudFront IP ranges
    set_real_ip_from 13.113.196.0/22;
    set_real_ip_from 13.113.203.0/22;
    set_real_ip_from 52.124.128.0/21;
    set_real_ip_from 52.222.128.0/21;
    set_real_ip_from 54.182.0.0/16;
    set_real_ip_from 54.192.0.0/16;
    set_real_ip_from 64.252.128.0/18;
    set_real_ip_from 70.132.0.0/18;
    set_real_ip_from 99.86.0.0/16;
    set_real_ip_from 130.176.0.0/16;
    set_real_ip_from 143.204.0.0/16;
    set_real_ip_from 144.217.64.0/18;
    set_real_ip_from 157.240.0.0/16;
    set_real_ip_from 158.227.0.0/16;
    set_real_ip_from 204.246.0.0/18;
    real_ip_header X-Forwarded-For;

    # Root directory for static files
    root /var/www/techpartner/dist/public;
    index index.html;

    # 1. THE pSEO ENGINE (Static Astro Pages)
    location /web-design/ {
        alias /var/www/techpartner/pseo-engine/dist/web-design/;
        try_files $uri $uri/ /web-design/index.html =404;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Proxy to Node.js application
    location / {
        try_files $uri $uri/ @proxy;
    }

    location @proxy {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:8080/api/health;
        access_log off;
    }
}
EOF

# Copy to EC2 and update nginx
echo -e "${YELLOW}📤 Copying nginx config to EC2...${NC}"
scp -i ~/Downloads/kimi-key.pem /tmp/nginx-cloudfront.conf ubuntu@$EC2_HOST:/tmp/nginx-cloudfront.conf

echo -e "${YELLOW}🔧 Installing nginx config on EC2...${NC}"
ssh -i ~/Downloads/kimi-key.pem ubuntu@$EC2_HOST << 'REMOTE_COMMANDS'
    # Backup current config
    sudo cp /etc/nginx/sites-available/techpartner /etc/nginx/sites-available/techpartner.backup.$(date +%s) 2>/dev/null || true
    
    # Install new config
    sudo cp /tmp/nginx-cloudfront.conf /etc/nginx/sites-available/techpartner
    sudo ln -sf /etc/nginx/sites-available/techpartner /etc/nginx/sites-enabled/techpartner 2>/dev/null || true
    
    # Remove default site if exists
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload
    sudo nginx -t && sudo systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx configuration updated successfully"
    else
        echo "❌ Nginx configuration test failed"
        exit 1
    fi
REMOTE_COMMANDS

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to update nginx on EC2${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Nginx configuration updated on EC2${NC}"
echo ""

# Wait for distribution to deploy
echo -e "${YELLOW}⏳ Waiting for CloudFront distribution to deploy...${NC}"
echo -e "   This may take 5-15 minutes...${NC}"

aws cloudfront wait distribution-deployed --id $DISTRIBUTION_ID

echo -e "${GREEN}✅ CloudFront distribution is now deployed!${NC}"
echo ""

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Summary:${NC}"
echo -e "   CloudFront Domain: $CLOUDFRONT_DOMAIN"
echo -e "   Distribution ID: $DISTRIBUTION_ID"
echo -e "   SSL Certificate: $ACM_CERT_ARN"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT - Next Steps:${NC}"
echo -e "   1. Update your DNS records to point to CloudFront:"
echo -e "      - A record: techpartner.sa → $CLOUDFRONT_DOMAIN"
echo -e "      - CNAME record: *.techpartner.sa → $CLOUDFRONT_DOMAIN"
echo ""
echo -e "   2. If using Route 53, run:"
echo -e "      ./scripts/update-route53.sh $CLOUDFRONT_DOMAIN"
echo ""
echo -e "   3. Test your SSL:"
echo -e "      curl -vI https://techpartner.sa"
echo -e "      curl -vI https://www.techpartner.sa"
echo -e "      curl -vI https://api.techpartner.sa"
echo ""
echo -e "${GREEN}✅ All subdomains will now use the AWS ACM SSL certificate!${NC}"
