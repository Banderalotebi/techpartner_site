#!/bin/bash
# EC2 Server Setup Script for TechPartner
# Run this on your EC2 instance as ubuntu user

set -e

echo "🚀 Setting up TechPartner on EC2..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20
echo "⬇️ Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js version
node --version  # Should show v20.x.x
npm --version

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt-get install -y nginx

# Install Certbot for SSL
echo "🔒 Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

# Create app directory
echo "📁 Creating app directory..."
mkdir -p /home/ubuntu/techpartner
cd /home/ubuntu/techpartner

# Clone repository (or you can use rsync from GitHub Actions)
# git clone https://github.com/Banderalotebi/techpartner_site.git .

echo "✅ Basic setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure your code is deployed to /home/ubuntu/techpartner"
echo "2. Create .env file with DATABASE_URL and other secrets"
echo "3. Run: npm install && npm run build"
echo "4. Start with: pm2 start ecosystem.config.cjs"
echo "5. Configure Nginx with: sudo cp nginx-techpartner.conf /etc/nginx/sites-available/techpartner"
echo "6. Enable SSL with: sudo certbot --nginx -d techpartner.sa"

