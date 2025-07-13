# Server Update Guide

The PM2 process is running but not accessible. Here's how to debug and fix:

## Check Server Logs and Port
```bash
cd /opt/techpartner
pm2 logs techpartner-database --lines 20
pm2 describe techpartner-database
netstat -tlnp | grep :5000
```

## Check Server Configuration
```bash
# View the server startup
cat server/index.ts | head -20
env | grep PORT
```

## Restart with Explicit Port
```bash
pm2 delete techpartner-database
PORT=5000 pm2 start server/index.ts --name "techpartner-database" --interpreter tsx
pm2 logs techpartner-database
curl localhost:5000/api/health
```

## Check External Access
```bash
# Test internal first
curl localhost:5000/api/health
curl 127.0.0.1:5000/api/health

# Then external
curl http://34.69.69.182:5000/api/health
```

This will identify why the server isn't responding and get your database integration accessible.