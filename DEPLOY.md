# Deploy TechPartner to AWS EC2

## 1. Server Setup (One Time)

```bash
# SSH to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Ollama for AI
curl -fsSL https://ollama.com/install.sh | sh

# Pull AI models
ollama pull qwen2.5:7b
ollama pull llama3.1
ollama cp llama3.1 llama3.1:8b
```

## 2. Deploy Code

```bash
# From your local machine, copy files to server
scp -i your-key.pem -r server package.json ecosystem.config.cjs ubuntu@your-ec2-ip:~/techpartner/

# SSH to server
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
cd ~/techpartner
npm install

# Start with PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Auto-start on boot
```

## 3. Environment Variables

Create `.env` file on the server:

```bash
cd ~/techpartner
cat > .env << 'EOF'
NODE_ENV=production
PORT=8080
ADMIN_SECRET=your_secure_admin_token_here
OLLAMA_HOST=http://localhost:11434
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@techpartner.sa
EOF
```

## 4. Nginx Setup (Optional - for domain)

```bash
sudo apt install nginx -y

# Create config
sudo tee /etc/nginx/sites-available/techpartner << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/techpartner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. Useful Commands

```bash
# Check status
pm2 status
pm2 logs techpartner

# Restart
pm2 restart techpartner

# Update code (after scp new files)
pm2 restart techpartner --update-env

# View logs
pm2 logs techpartner --lines 100

# Monitor
pm2 monit
```

## 6. Test Endpoints

```bash
# Health check
curl http://your-ec2-ip:8080/api/health

# CRM stats (with auth)
curl http://your-ec2-ip:8080/api/crm/stats \
  -H "Authorization: Bearer your_admin_secret"

# AI chat
curl -X POST http://your-ec2-ip:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "I need a website"}]}'
```

## File Structure on Server

```
~/techpartner/
├── server/
│   ├── index.ts          # Main entry
│   ├── routes.ts         # API routes
│   ├── db/
│   │   ├── crm.ts        # CRM database
│   │   └── auth.ts       # Auth helpers
│   ├── routes/
│   │   ├── crm.ts        # AI Sales Closer
│   │   ├── reports.ts    # Dashboard
│   │   ├── chat.ts       # AI Chat
│   │   ├── auth.ts       # Login
│   │   ├── admin.ts      # Admin API
│   │   ├── blog.ts       # Blog
│   │   ├── inquiry.ts    # Contact forms
│   │   ├── orders.ts     # Orders
│   │   └── payments.ts   # Payments
│   └── middleware/
│       └── auth.ts       # Auth middleware
├── package.json
├── ecosystem.config.cjs  # PM2 config
└── .env                  # Secrets (not in git)
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| PM2 won't start | `pm2 delete all && pm2 start ecosystem.config.cjs` |
| AI not responding | Check Ollama: `ollama list` and `ollama ps` |
| Database locked | `rm -f crm-vault.db` (resets CRM) |
| Port in use | `sudo lsof -i :8080` then `kill -9 PID` |
| Out of memory | Add swap: `sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` |

## Quick Deploy Script

Save as `deploy.sh`:

```bash
#!/bin/bash
KEY="~/Downloads/your-key.pem"
SERVER="ubuntu@your-ec2-ip"
LOCAL_PATH="."
REMOTE_PATH="~/techpartner"

echo "Deploying to EC2..."
scp -i $KEY -r $LOCAL_PATH/server $LOCAL_PATH/package.json $LOCAL_PATH/ecosystem.config.cjs $SERVER:$REMOTE_PATH/

echo "Restarting server..."
ssh -i $KEY $SERVER "cd $REMOTE_PATH && npm install && pm2 restart techpartner --update-env"

echo "Done!"
```

Make executable: `chmod +x deploy.sh` then run `./deploy.sh`
