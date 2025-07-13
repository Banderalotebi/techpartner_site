# Server Update Methods

Your GitHub push was successful, but the production server needs to pull the changes. Since gcloud authentication is not available, here are alternative methods:

## Current Status
- ✅ GitHub: Updated with database integration (commit: cc0ac8d)
- ❓ Production Server: Running v2.0.0, needs latest changes
- 🎯 Goal: Deploy PostgreSQL database integration

## Method 1: VM Console Access (Recommended)

1. Go to Google Cloud Console
2. Navigate to Compute Engine > VM instances
3. Click "SSH" next to `techpartner-exact`
4. Run these commands in the VM terminal:

```bash
cd /opt/techpartner-platform
git pull origin main
npm install --production
pm2 restart all
pm2 status
```

## Method 2: GitHub Actions/Webhooks

If you have a GitHub webhook configured, you can:
1. Go to your GitHub repository
2. Go to Settings > Webhooks
3. Find the deployment webhook
4. Click "Redeliver" to trigger deployment

## Method 3: Manual File Upload

1. Download your latest code from GitHub
2. Use Google Cloud Console to upload files to the VM
3. Replace the files in `/opt/techpartner-platform`
4. Restart the application

## Method 4: Redeploy VM

If other methods fail:
1. Create a new VM with the latest code
2. Update DNS to point to the new VM
3. This ensures clean deployment

## What Should Happen After Update

Once the server pulls your changes:
- PostgreSQL database replaces in-memory storage
- JWT authentication system activates
- Enhanced security middleware starts
- Database-powered API operations begin
- All user data becomes persistent

The easiest method is accessing the VM through Google Cloud Console and running the git pull commands directly.