# Simple Deployment Steps

The build failed due to corrupted node_modules. Here's how to fix it:

## Step 1: Clean Install Dependencies
```bash
cd /home/bander/techpartner_site
rm -rf node_modules package-lock.json
npm install
```

## Step 2: Build and Deploy
```bash
npm run build
sudo rm -rf /opt/techpartner
sudo mkdir -p /opt/techpartner
sudo cp -r dist/* /opt/techpartner/
sudo cp -r node_modules /opt/techpartner/
sudo cp package*.json /opt/techpartner/
sudo chown -R bander:bander /opt/techpartner
cd /opt/techpartner
```

## Step 3: Start Production Server
```bash
pm2 delete all
NODE_ENV=production pm2 start index.js --name "techpartner-database"
pm2 status
pm2 logs
```

## Step 4: Test Database Integration
```bash
curl localhost:5000/api/health
curl http://34.69.69.182:5000/api/health
```

## Alternative: Use Existing Build
If build keeps failing, you can deploy without building:
```bash
cd /home/bander/techpartner_site
sudo rm -rf /opt/techpartner
sudo mkdir -p /opt/techpartner
sudo cp -r . /opt/techpartner/
sudo chown -R bander:bander /opt/techpartner
cd /opt/techpartner
pm2 delete all
pm2 start server/index.ts --name "techpartner-database" --interpreter tsx
```

This will fix the dependency corruption and deploy your database integration.