# VM Navigation and Update Commands

Based on the search results, try these locations in order:

## Option 1: Check /opt/techpartner
```bash
cd /opt/techpartner
pwd
ls -la
git status
```

## Option 2: Check /home/bander/techpartner_site  
```bash
cd /home/bander/techpartner_site
pwd
ls -la
git status
```

## Option 3: Check nested directory
```bash
cd /home/bander/techpartner_site/techpartner_site
pwd
ls -la
git status
```

## Once you find the git repository, run:
```bash
# Verify you're in the right place
git status
git remote -v

# Update with your database integration
git config pull.rebase false
git reset --hard origin/main

# Install dependencies and restart
npm install --production
pm2 restart all

# Verify the update
git log --oneline -3
pm2 status
curl localhost:3000/api/health
```

## Find which port the server is running on:
```bash
pm2 status
netstat -tlnp | grep node
```

Run these commands on your VM to locate the correct repository and update it with your database integration.