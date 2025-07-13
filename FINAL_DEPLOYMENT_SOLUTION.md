# Final Deployment Solution

The issue is that the build creates `dist/public/` but PM2 expects `/opt/techpartner/public/`. Here's the fix:

## VM Commands to Run:

```bash
# Go to your repo
cd /home/bander/techpartner_site/techpartner_site

# Build the application
npm run build

# Check what was built
ls -la dist/
ls -la dist/public/

# Deploy to correct location
sudo rm -rf /opt/techpartner
sudo mkdir -p /opt/techpartner
sudo cp -r dist/* /opt/techpartner/
sudo cp -r node_modules /opt/techpartner/
sudo cp package*.json /opt/techpartner/
sudo chown -R bander:bander /opt/techpartner

# Navigate to production directory
cd /opt/techpartner

# Verify structure
ls -la
ls -la public/

# Stop old processes and start database server
pm2 delete all
NODE_ENV=production pm2 start index.js --name "techpartner-database"

# Test
pm2 logs
curl localhost:5000/api/health
curl http://34.69.69.182:5000/api/health
```

This copies the built files to the exact location PM2 expects while deploying your database integration.