#!/bin/bash
# Quick deploy script with CloudFront SSL setup
# This script deploys to EC2 and sets up CloudFront with your AWS ACM certificate

KEY="${SSH_KEY:-$HOME/Downloads/kimi-key.pem}"
SERVER="ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com"
REMOTE_PATH="~/techpartner"

echo "🚀 Deploying TechPartner with AWS CloudFront SSL..."

# Check if key exists
if [ ! -f "$KEY" ]; then
    echo "❌ SSH key not found: $KEY"
    echo "Set SSH_KEY env var or place key at ~/Downloads/kimi-key.pem"
    exit 1
fi

# 1. Copy files to server
echo "📦 Copying files..."
scp -i "$KEY" -r server scripts shared package.json ecosystem.config.cjs nginx-techpartner-cloudfront.conf "$SERVER:$REMOTE_PATH/"

# 2. Update nginx config on server for CloudFront
echo "🔧 Updating nginx configuration for CloudFront..."
ssh -i "$KEY" "$SERVER" << 'EOF'
    sudo cp /etc/nginx/sites-available/techpartner /etc/nginx/sites-available/techpartner.letsencrypt.backup
    sudo cp $REMOTE_PATH/nginx-techpartner-cloudfront.conf /etc/nginx/sites-available/techpartner
    sudo nginx -t && sudo systemctl reload nginx
    echo "✅ Nginx updated for CloudFront"
EOF

# 3. Install dependencies and restart
echo "🔄 Installing dependencies and restarting..."
ssh -i "$KEY" "$SERVER" "cd $REMOTE_PATH && npm install --legacy-peer-deps && pm2 restart techpartner --update-env"

# 4. Test health
echo "🏥 Testing health..."
sleep 3
ssh -i "$KEY" "$SERVER" "curl -s http://localhost:8080/api/health"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create CloudFront distribution in AWS Console with your ACM certificate"
echo "2. Update DNS to point to CloudFront"
echo "3. See SETUP_CLOUDFRONT.md for detailed instructions"

