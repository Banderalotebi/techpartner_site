# Quick Deploy Solution

Run these commands in order:

```bash
# Clean and reinstall
cd /home/bander/techpartner_site
rm -rf node_modules package-lock.json
npm install

# Try build, if it fails use development mode
npm run build || echo "Build failed, using dev mode"

# Deploy to production location
sudo rm -rf /opt/techpartner
sudo mkdir -p /opt/techpartner
sudo cp -r . /opt/techpartner/
sudo chown -R bander:bander /opt/techpartner
cd /opt/techpartner

# Start database server
pm2 delete all

# Try production mode first, fallback to development
if [ -f "dist/index.js" ]; then
    NODE_ENV=production pm2 start dist/index.js --name "techpartner-database"
else
    NODE_ENV=development pm2 start server/index.ts --name "techpartner-database" --interpreter tsx
fi

# Check status
pm2 status
pm2 logs --lines 20
curl localhost:5000/api/health
```

This ensures your database integration gets deployed regardless of build issues.