# Update Server Methods

You need to ensure the TechPartner server is running on the correct port that your domain points to.

## Method 1: Check Current Server Status
```bash
cd /home/bander/techpartner_site

# See what's running on which ports
sudo netstat -tlnp | grep LISTEN
ps aux | grep node

# If nothing on port 80, start there
sudo PORT=80 NODE_ENV=production npm start
```

## Method 2: Force Server Update
```bash
cd /home/bander/techpartner_site

# Kill all node processes
sudo pkill -f node

# Start fresh on port 80
sudo PORT=80 NODE_ENV=production node dist/index.js
```

## Method 3: Use PM2 Production Management
```bash
cd /home/bander/techpartner_site

# Start with PM2 on port 80
sudo PORT=80 pm2 start dist/index.js --name techpartner-platform
pm2 startup
pm2 save
```

Your domain/server IP needs the TechPartner platform running on the correct port (likely 80 or 443).