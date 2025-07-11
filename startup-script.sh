#!/bin/bash

# VM Startup Script for TechPartner Platform
exec > >(tee /var/log/startup-script.log)
exec 2>&1

echo "Starting TechPartner Platform deployment..."

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 and other tools
npm install -g pm2 tsx
apt install -y nginx git unzip

# Create app directory
mkdir -p /opt/techpartner
cd /opt/techpartner

# Create a simple Node.js app for now
cat > server.js << 'EOF'
const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TechPartner Platform</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #01a1c1; }
        .status { color: #28a745; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 TechPartner Platform</h1>
        <p class="status">✅ VM Deployment Successful!</p>
        <p>Your comprehensive digital agency platform is now running on Google Cloud VM.</p>
        <p><strong>Server IP:</strong> 35.188.154.142</p>
        <p><strong>Status:</strong> Online and Ready</p>
        <p><strong>Next Steps:</strong> Complete application deployment in progress...</p>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log('TechPartner Platform running on port 80');
});
EOF

# Install express
npm init -y
npm install express

# Start the application
pm2 start server.js --name techpartner-platform
pm2 startup
pm2 save

echo "TechPartner Platform deployment complete!"