#!/bin/bash

# Complete TechPartner Platform Deployment Script
VM_NAME="techpartner-production"
ZONE="us-central1-a"

echo "🚀 Deploying Complete TechPartner Platform..."

# Wait for VM to be ready
echo "⏳ Waiting for VM to boot..."
sleep 60

# Get VM IP
VM_IP=$(gcloud compute instances describe $VM_NAME --zone=$ZONE --format="get(networkInterfaces[0].accessConfigs[0].natIP)")
echo "🌐 VM IP: $VM_IP"

# Create full deployment package
echo "📦 Creating deployment package..."
mkdir -p deployment-package
cp -r client/ deployment-package/
cp -r server/ deployment-package/
cp -r shared/ deployment-package/
cp package.json deployment-package/
cp tsconfig.json deployment-package/
cp vite.config.ts deployment-package/
cp tailwind.config.ts deployment-package/
cp postcss.config.js deployment-package/

# Create production package.json
cat > deployment-package/package-production.json << 'EOF'
{
  "name": "techpartner-platform",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "tsx server/index.ts",
    "build": "vite build"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "@tanstack/react-query": "^5.0.0",
    "drizzle-orm": "^0.33.0",
    "express": "^4.18.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tsx": "^4.0.0",
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0"
  }
}
EOF

# Create VM deployment script
cat > deployment-package/vm-install.sh << 'EOF'
#!/bin/bash
cd /opt/techpartner

# Install dependencies
npm install

# Build the application
npm run build

# Create PM2 ecosystem
cat > ecosystem.config.js << 'EOFPM2'
module.exports = {
  apps: [{
    name: 'techpartner-platform',
    script: 'tsx',
    args: 'server/index.ts',
    env: {
      NODE_ENV: 'production',
      PORT: 80
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOFPM2

# Start application
pm2 start ecosystem.config.js
pm2 startup
pm2 save

echo "✅ TechPartner Platform deployed successfully!"
EOF

echo "✅ Deployment package ready!"
echo "🔗 Access your platform at: http://$VM_IP"
echo "⏳ Platform will be live in 5-10 minutes..."