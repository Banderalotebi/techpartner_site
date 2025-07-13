# Server Update Guide

Your GitHub push was successful, but the server needs to pull the new changes. Here are the methods to update the production server:

## Option 1: Automatic Script

Run this to trigger server update:
```bash
./TRIGGER_SERVER_UPDATE.sh
```

## Option 2: Manual VM Update

Connect to your VM and update manually:
```bash
# SSH to the VM
gcloud compute ssh techpartner-exact --zone=us-central1-a

# On the VM, run:
cd /opt/techpartner-platform
git pull origin main
npm install
npm run build
pm2 restart all
```

## Option 3: Trigger Cloud Build

Force a new deployment:
```bash
gcloud builds submit --config=cloudbuild-with-secrets.yaml .
```

## Current Status

- ✅ GitHub: Updated with database integration (commit: cc0ac8d)
- ❓ Server: Needs to pull latest changes from GitHub
- 🎯 Goal: Deploy PostgreSQL database integration to production

## What Should Happen

After update:
1. Server pulls your database integration code
2. PostgreSQL database goes live
3. JWT authentication activates
4. Enhanced API server starts
5. Production platform with persistent storage

The server currently shows version 2.0.0 but may not have the latest database features until it pulls from GitHub.

Run the update script to sync your production server with the latest GitHub changes.