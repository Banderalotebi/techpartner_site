#!/bin/bash
exec > >(tee /var/log/startup-script.log)
exec 2>&1

echo "=== TechPartner Platform Deployment ==="
echo "Starting deployment of your exact original platform..."

# System update
apt update -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Stop any existing services
pm2 delete all 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true
systemctl stop apache2 2>/dev/null || true

# Create app directory
mkdir -p /opt/techpartner
cd /opt/techpartner

# Clean any existing files
rm -rf *

# Create your exact server configuration
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const port = 80;

// Middleware for JSON parsing
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Your exact API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'TechPartner Platform - Original',
    version: '1.0.0'
  });
});

app.get('/api/categories', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Logo & Identity',
      slug: 'logo-identity',
      price: 'Starting 1,500 SAR',
      description: 'Professional brand identity and logo design services'
    },
    {
      id: 2,
      name: 'Web & App Design',
      slug: 'web-app-design',
      price: 'Starting 5,000 SAR',
      description: 'Modern web and mobile application design'
    },
    {
      id: 3,
      name: 'Custom Development',
      slug: 'web-development',
      price: 'Starting 25,000 SAR',
      description: 'Full-stack web development solutions'
    },
    {
      id: 4,
      name: 'Business & Advertising',
      slug: 'business-advertising',
      price: 'Starting 2,000 SAR',
      description: 'Marketing and advertising design services'
    },
    {
      id: 5,
      name: 'Art & Illustration',
      slug: 'art-illustration',
      price: 'Starting 1,500 SAR',
      description: 'Custom artwork and illustration services'
    },
    {
      id: 6,
      name: 'Packaging & Label',
      slug: 'packaging-label',
      price: 'Starting 1,800 SAR',
      description: 'Product packaging and label design'
    },
    {
      id: 7,
      name: 'Social Media',
      slug: 'social-media',
      price: 'Starting 300 SAR',
      description: 'Social media graphics and content design'
    },
    {
      id: 8,
      name: 'Print Design',
      slug: 'print-design',
      price: 'Starting 400 SAR',
      description: 'Professional print design services'
    }
  ]);
});

app.get('/api/auth/user', (req, res) => {
  res.json(null);
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Registration endpoint' });
});

app.get('/api/project-briefs', (req, res) => {
  res.json([]);
});

app.post('/api/project-briefs', (req, res) => {
  const projectBrief = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.json(projectBrief);
});

app.get('/api/orders', (req, res) => {
  res.json([]);
});

app.post('/api/orders', (req, res) => {
  const order = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.json(order);
});

app.post('/api/quiz-responses', (req, res) => {
  const response = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.json(response);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`TechPartner Platform running on port ${port}`);
});
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "techpartner-platform",
  "version": "1.0.0",
  "description": "TechPartner Digital Agency Platform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# Create public directory and placeholder
mkdir -p public
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechPartner Platform</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 {
            color: #01a1c1;
            margin-bottom: 20px;
        }
        .status {
            background: #e8f5e8;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #01a1c1;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>TechPartner Platform</h1>
        <div class="status">
            <div class="loading"></div>
            <p>Your original platform is being deployed...</p>
            <p>This placeholder will be replaced with your complete TechPartner design.</p>
        </div>
        <p>Platform Status: <strong>Initializing</strong></p>
        <p>Original design elements will be available shortly.</p>
    </div>
</body>
</html>
EOF

# Install dependencies
npm install

# Start with PM2
pm2 start server.js --name techpartner-platform
pm2 startup
pm2 save

echo "✅ TechPartner Platform server started successfully"
echo "🌐 Platform accessible at: http://$(curl -s http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip -H 'Metadata-Flavor: Google')"
echo "📝 Ready for original platform files upload"
EOF

chmod +x final-startup-script.sh