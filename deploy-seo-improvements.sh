#!/bin/bash

# SEO Improvements Deployment Script
# This script deploys all SEO improvements to the production server

set -e

echo "🚀 Starting SEO Improvements Deployment..."

# Configuration
SERVER_USER="ubuntu"
SERVER_HOST="techpartner.sa"
SERVER_PATH="/var/www/techpartner"
NGINX_PATH="/etc/nginx/sites-available"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Building application...${NC}"
npm run build

echo -e "${YELLOW}Step 2: Deploying built files...${NC}"
rsync -avz --delete dist/public/ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/dist/public/

echo -e "${YELLOW}Step 3: Deploying nginx configuration...${NC}"
scp nginx-techpartner.conf ${SERVER_USER}@${SERVER_HOST}:/tmp/techpartner.conf

echo -e "${YELLOW}Step 4: Applying nginx configuration on server...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'EOF'
    # Backup current config
    sudo cp /etc/nginx/sites-available/techpartner /etc/nginx/sites-available/techpartner.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    
    # Apply new config
    sudo mv /tmp/techpartner.conf /etc/nginx/sites-available/techpartner
    
    # Test configuration
    sudo nginx -t
    
    # Reload nginx
    sudo systemctl reload nginx
    
    echo "Nginx configuration updated successfully"
EOF

echo -e "${YELLOW}Step 5: Verifying deployment...${NC}"

# Test URL canonicalization
echo "Testing URL canonicalization..."
curl -s -o /dev/null -w "%{http_code}" http://${SERVER_HOST}/ | grep -q "301\|200" && echo -e "${GREEN}✓ HTTP redirect working${NC}" || echo -e "${RED}✗ HTTP redirect issue${NC}"

# Test HTTPS
echo "Testing HTTPS..."
curl -s -o /dev/null -w "%{http_code}" https://${SERVER_HOST}/ | grep -q "200" && echo -e "${GREEN}✓ HTTPS working${NC}" || echo -e "${RED}✗ HTTPS issue${NC}"

# Test security headers
echo "Testing security headers..."
curl -s -I https://${SERVER_HOST}/ | grep -q "Strict-Transport-Security" && echo -e "${GREEN}✓ HSTS header present${NC}" || echo -e "${RED}✗ HSTS header missing${NC}"

# Test 404 page
echo "Testing 404 page..."
curl -s -o /dev/null -w "%{http_code}" https://${SERVER_HOST}/nonexistent-page | grep -q "404" && echo -e "${GREEN}✓ 404 page working${NC}" || echo -e "${RED}✗ 404 page issue${NC}"

echo ""
echo -e "${GREEN}✅ SEO Improvements Deployment Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update Google Analytics ID in client/index.html (replace G-XXXXXXXXXX)"
echo "2. Run another SEO audit to verify improvements"
echo "3. Monitor Google Search Console for indexing"
echo ""
echo "To verify HTTP/2 is working, run:"
echo "  curl -I --http2 https://${SERVER_HOST}/"
