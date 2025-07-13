# Server Update Guide

## Current Issue
- Project built successfully at `/home/bander/techpartner_site`
- Server not accessible on domain/IP
- Need to check which server is running and on which port

## Debugging Steps
```bash
cd /home/bander/techpartner_site

# Check what's currently running
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :5000
ps aux | grep node

# Check if server started correctly
npm start

# Check logs
pm2 logs

# If server needs to run on port 80
sudo PORT=80 npm start

# Or use PM2 with port 80
sudo PORT=80 pm2 start ecosystem.config.js --name techpartner-platform
```

## Port Configuration
The server might be running on a different port. Check which port your domain is configured for and ensure the TechPartner server runs on that port.

## Alternative: Direct Server Start
```bash
cd /home/bander/techpartner_site

# Stop all conflicting processes
sudo pkill -f node
sudo pkill -f "/opt/techpartner"

# Start on port 80 (standard web port)
sudo PORT=80 NODE_ENV=production npm start
```