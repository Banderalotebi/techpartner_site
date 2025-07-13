# Production Deployment Fix

The PM2 process is looking for files in the wrong directory. Here's how to fix it:

## Step 1: Stop Old Process and Build Application
```bash
cd /home/bander/techpartner_site/techpartner_site
pm2 delete all
npm run build
ls -la dist/
```

## Step 2: Deploy to Production Location
```bash
# Copy built application to production directory
sudo mkdir -p /opt/techpartner-platform
sudo cp -r . /opt/techpartner-platform/
sudo chown -R bander:bander /opt/techpartner-platform
cd /opt/techpartner-platform
```

## Step 3: Start Production Server
```bash
# Install production dependencies
npm install --production

# Start database server (not static server)
pm2 start server/index.js --name "techpartner-database" -- --port=3000

# Check status
pm2 status
pm2 logs
```

## Step 4: Test Database Integration
```bash
curl localhost:3000/api/health
curl localhost:3000/api/categories
curl http://34.69.69.182:3000/api/health
```

## Alternative: Update PM2 Config
If you want to keep current location:
```bash
cd /home/bander/techpartner_site/techpartner_site
npm run build
pm2 start server/index.js --name "techpartner-database" --cwd /home/bander/techpartner_site/techpartner_site
```

This will deploy your PostgreSQL database integration to the production location where PM2 expects it.