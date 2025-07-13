# Simple Deployment Steps

Run these commands on your VM to fix the loading issue:

## Step 1: Check Current Status
```bash
cd /opt/techpartner
pm2 list
pm2 logs techpartner-database --lines 5
```

## Step 2: Check Build Output
```bash
ls -la dist/
ls -la dist/public/
```

## Step 3: Fix Firewall (Most Likely Issue)
```bash
sudo ufw allow 5000
sudo systemctl restart ufw
```

## Step 4: Restart Server with Explicit Binding
```bash
pm2 delete techpartner-database
HOST=0.0.0.0 PORT=5000 NODE_ENV=production DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start dist/index.js --name "techpartner-database"
```

## Step 5: Test Access
```bash
curl localhost:5000
curl http://34.69.69.182:5000
```

Your database integration is working perfectly. The issue is just external access to the VM.