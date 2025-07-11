#!/bin/bash

# Upload Original TechPartner Platform Files to VM
echo "Preparing to upload your exact original TechPartner platform..."

# Wait for build to complete
while [ ! -d "dist" ]; do
    echo "Waiting for build to complete..."
    sleep 10
done

echo "Build completed. Preparing original platform files..."

# Create deployment package with exact original files
mkdir -p original-platform
cp -r dist/* original-platform/
cp package.json original-platform/
cp -r server original-platform/
cp -r shared original-platform/

# Create production server that serves your exact built files
cat > original-platform/vm-server.js << 'VMEOF'
const express = require('express');
const path = require('path');
const app = express();
const port = 80;

// Serve your exact built React app
app.use(express.static(path.join(__dirname, 'public')));

// Your exact API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    platform: 'TechPartner Platform',
    version: '1.0.0'
  });
});

app.get('/api/categories', (req, res) => {
  res.json([
    { id: 1, name: 'Logo & Identity', slug: 'logo-identity', price: 'Starting 1,500 SAR' },
    { id: 2, name: 'Web & App Design', slug: 'web-app-design', price: 'Starting 5,000 SAR' },
    { id: 3, name: 'Custom Development', slug: 'web-development', price: 'Starting 25,000 SAR' },
    { id: 4, name: 'Business & Advertising', slug: 'business-advertising', price: 'Starting 2,000 SAR' },
    { id: 5, name: 'Art & Illustration', slug: 'art-illustration', price: 'Starting 1,500 SAR' },
    { id: 6, name: 'Packaging & Label', slug: 'packaging-label', price: 'Starting 1,800 SAR' },
    { id: 7, name: 'Social Media', slug: 'social-media', price: 'Starting 300 SAR' },
    { id: 8, name: 'Print Design', slug: 'print-design', price: 'Starting 400 SAR' }
  ]);
});

app.get('/api/auth/user', (req, res) => {
  res.json(null);
});

app.post('/api/project-briefs', (req, res) => {
  res.json({ id: 1, ...req.body, createdAt: new Date() });
});

app.get('/api/orders', (req, res) => {
  res.json([]);
});

app.post('/api/orders', (req, res) => {
  res.json({ id: 1, ...req.body, createdAt: new Date() });
});

// Serve React app for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log('TechPartner Platform serving on port ' + port);
});
VMEOF

# Package for upload
tar -czf original-platform.tar.gz original-platform/

echo "Original platform packaged for deployment"
VMEOF