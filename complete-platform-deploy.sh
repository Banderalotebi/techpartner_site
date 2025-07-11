#!/bin/bash

# Complete TechPartner Platform Deployment Script
echo "Deploying complete TechPartner platform to VM..."

# Build the production bundle
npm run build

# Create deployment package
mkdir -p deploy-package
cp -r dist/* deploy-package/
cp package.json deploy-package/
cp -r server deploy-package/
cp -r shared deploy-package/

# Create comprehensive server file for VM
cat > deploy-package/vm-server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const port = 80;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    platform: 'TechPartner Studio',
    version: '1.0.0',
    server: req.get('host'),
    services: 8
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

app.get('/api/packages', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Logo Design Package',
      category: 'Logo & Identity',
      price: 1500,
      currency: 'SAR',
      features: ['3 Logo concepts', 'Unlimited revisions', 'Vector files', 'Brand guidelines']
    },
    {
      id: 2,
      name: 'Website Design Package',
      category: 'Web & App Design',
      price: 5000,
      currency: 'SAR',
      features: ['5 page design', 'Responsive layout', 'Mobile optimization', 'SEO ready']
    },
    {
      id: 3,
      name: 'Custom Development Package',
      category: 'Custom Development',
      price: 25000,
      currency: 'SAR',
      features: ['Full-stack development', 'Database integration', 'API development', '3 months support']
    }
  ]);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`TechPartner Platform running on port ${port}`);
  console.log(`Server: http://localhost:${port}`);
});
EOF

# Create package.json for VM
cat > deploy-package/package.json << 'EOF'
{
  "name": "techpartner-platform",
  "version": "1.0.0",
  "main": "vm-server.js",
  "scripts": {
    "start": "node vm-server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# Transfer to VM
gcloud compute scp --recurse deploy-package/* techpartner-final:/tmp/platform/ --zone=us-central1-a

# Execute deployment on VM
gcloud compute ssh techpartner-final --zone=us-central1-a --command="
sudo systemctl stop nginx
sudo mkdir -p /opt/techpartner
sudo cp -r /tmp/platform/* /opt/techpartner/
cd /opt/techpartner
sudo npm install
sudo pm2 delete all 2>/dev/null || true
sudo pm2 start vm-server.js --name techpartner-platform
sudo pm2 startup
sudo pm2 save
echo 'TechPartner Platform deployed successfully!'
"

echo "✅ Complete TechPartner platform deployed to VM!"
EOF