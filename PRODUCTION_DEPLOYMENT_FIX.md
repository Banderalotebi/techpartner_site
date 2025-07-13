# Production Deployment Fix - Google Cloud Standard Ports

Google Cloud VMs use standard web ports. Let's deploy on port 80:

## Quick Fix Commands:

```bash
cd /opt/techpartner

# Stop current server
pm2 delete techpartner-database

# Start on port 80 (standard HTTP port)
sudo HOST=0.0.0.0 PORT=80 NODE_ENV=production DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start dist/index.js --name "techpartner-database"

# Check deployment
pm2 status
curl localhost:80/api/health
```

## Test Access:
Your platform will be accessible at:
- **http://34.69.69.182** (no port needed!)

## Alternative - Standard Web Port 8080:
```bash
sudo HOST=0.0.0.0 PORT=8080 NODE_ENV=production DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start dist/index.js --name "techpartner-database"
```
Access: **http://34.69.69.182:8080**

Port 80 requires sudo but provides standard web access without port numbers.