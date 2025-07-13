# Quick Deploy Solution

The VM production server isn't accessible externally. Here's the immediate fix:

```bash
cd /opt/techpartner

# Check current PM2 status
pm2 list
pm2 logs techpartner-database --lines 10

# Method 1: Restart with external access
pm2 delete techpartner-database
NODE_ENV=production DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" PORT=5000 pm2 start dist/index.js --name "techpartner-database"

# Method 2: Check if dist/public exists
ls -la dist/public/
ls -la dist/public/index.html

# Method 3: Test local access
curl localhost:5000
curl localhost:5000/api/health

# Method 4: Check VM firewall
sudo ufw status
sudo ufw allow 5000
```

## Common Issues:
1. **Firewall blocking port 5000** - VM needs firewall rule
2. **Static files not built** - Need proper dist/public directory
3. **Server binding to localhost only** - Need 0.0.0.0 binding
4. **PM2 process crashed** - Check logs and restart

## Quick Fix Commands:
```bash
# If no dist/public
npm run build

# If firewall issue
sudo ufw allow 5000
sudo systemctl restart ufw

# If binding issue - restart with explicit host
pm2 delete techpartner-database
HOST=0.0.0.0 PORT=5000 NODE_ENV=production DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start dist/index.js --name "techpartner-database"
```