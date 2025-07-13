#!/bin/bash
# Trigger Server Update Script

echo "=== Starting TechPartner Database Integration ==="

cd /opt/techpartner

# Create ecosystem config directly on VM
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'techpartner-database',
    script: 'server/index.ts',
    interpreter: 'tsx',
    env: {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      PORT: 5000
    },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true
  }]
}
EOF

# Start server with proper configuration
pm2 start ecosystem.config.js

echo "Server started, checking status..."
sleep 3
pm2 status

echo "Checking logs..."
pm2 logs techpartner-database --lines 10

echo "Testing endpoints..."
curl localhost:5000/api/health
echo ""
curl http://34.69.69.182:5000/api/health

echo "=== TechPartner Platform Active at http://34.69.69.182:5000 ==="