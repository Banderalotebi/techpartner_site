# VM Update Commands - Find Git Repository First

You need to navigate to the git repository directory first. Run these commands on your VM:

## Step 1: Find the Git Repository
```bash
# Find where the git repository is located
find / -name ".git" -type d 2>/dev/null
# or
find /opt -name "*techpartner*" -type d 2>/dev/null
find /home -name "*techpartner*" -type d 2>/dev/null
find /var -name "*techpartner*" -type d 2>/dev/null
```

## Step 2: Navigate to Repository
```bash
# Most likely locations:
cd /opt/techpartner-platform
# or
cd ~/techpartner_site
# or
cd /home/bander/techpartner_site
```

## Step 3: Update the Repository
Once in the correct directory:
```bash
# Check you're in a git repo
git status

# Configure git and pull latest changes
git config pull.rebase false
git pull origin main

# If conflicts, force reset to GitHub state
git reset --hard origin/main

# Install and restart
npm install --production
pm2 restart all
```

## Step 4: Verify Update
```bash
# Check latest commits
git log --oneline -3

# Test the server (check what port it's running on)
curl localhost:3000/api/health
curl localhost:5000/api/health
curl localhost:8080/api/health

# Check PM2 status
pm2 status
```

The error shows you're in the home directory (~), but the git repository is elsewhere on the server.