#!/bin/bash
echo "Setting up TechPartner Platform..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and other tools
sudo npm install -g pm2 tsx
sudo apt install -y nginx git

# Create app directory
sudo mkdir -p /opt/techpartner
sudo chown $USER:$USER /opt/techpartner

echo "✅ VM setup complete!"
