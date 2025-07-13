# Direct Deploy Solution

Since there's no git repository on the VM, let's deploy your database integration directly:

## Method 1: Clone Fresh Repository
```bash
# Navigate to opt directory
cd /opt

# Remove old installation
sudo rm -rf techpartner

# Clone your updated repository with database integration
git clone https://github.com/Banderalotebi/techpartner_site.git techpartner-platform

# Navigate to new directory
cd techpartner-platform

# Install dependencies
npm install --production

# Stop old PM2 process
pm2 delete all

# Start new enhanced server
pm2 start npm --name "techpartner-site" -- start

# Check status
pm2 status
```

## Method 2: Direct File Transfer
If git clone doesn't work, transfer files directly:

```bash
# Create new directory for updated platform
sudo mkdir -p /opt/techpartner-updated

# Change ownership
sudo chown -R bander:bander /opt/techpartner-updated

# You'll need to upload the files manually or use wget/curl to download from GitHub
```

## Method 3: Check Current Server Code
First see what's actually running:
```bash
# Check PM2 process details
pm2 show techpartner-site

# Find the actual running directory
pm2 info techpartner-site | grep cwd

# Navigate to that directory and check contents
```

The VM seems to be running code but without git tracking. Try Method 1 first to get a fresh deployment with your database integration.