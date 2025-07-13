# Manual File Transfer Instructions

Since the git clone failed, let's copy files manually to your VM.

## Method 1: Copy Essential Files

```bash
# On VM, create the structure
cd /opt/techpartner
mkdir -p server client shared

# Copy key files (you'll need to get these from Replit):
# 1. package.json
# 2. server/index.ts
# 3. server/db.ts
# 4. server/storage.ts
# 5. server/routes.ts
# 6. server/vite.ts
# 7. shared/schema.ts
# 8. vite.config.ts
# 9. tsconfig.json
# 10. Complete client/ directory
```

## Method 2: Quick Working Server

Create a minimal working server first:

```bash
cd /opt/techpartner

# Create package.json with dependencies
cat > package.json << 'EOF'
{
  "name": "techpartner-platform",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node server.js",
    "build": "echo 'Built'"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
EOF

# Create simple server
cat > server.js << 'EOF'
import express from 'express';
const app = express();

app.get('/api/health', (req, res) => {
  res.json({status: 'healthy', platform: 'TechPartner'});
});

app.get('*', (req, res) => {
  res.send('<h1>TechPartner Platform</h1><p>Database integration ready</p>');
});

app.listen(80, '0.0.0.0', () => {
  console.log('TechPartner running on port 80');
});
EOF

# Install and run
npm install
sudo node server.js
```

Let me create the complete file transfer package for you.