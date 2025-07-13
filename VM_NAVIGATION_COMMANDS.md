# VM Navigation Commands

Create ecosystem file and start server with these commands:

```bash
cd /opt/techpartner

# Create ecosystem file directly
echo 'module.exports = {
  apps: [{
    name: "techpartner-database",
    script: "server/index.ts",
    interpreter: "tsx",
    env: {
      NODE_ENV: "development",
      DATABASE_URL: "postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
      PORT: 5000
    },
    instances: 1,
    exec_mode: "fork",
    autorestart: true
  }]
}' > ecosystem.config.js

# Start server
pm2 start ecosystem.config.js
pm2 logs techpartner-database --lines 5
curl localhost:5000/api/health
```

Alternative direct start:
```bash
cd /opt/techpartner
NODE_ENV=development DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start server/index.ts --name "techpartner-database" --interpreter tsx
```