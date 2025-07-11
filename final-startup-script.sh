#!/bin/bash

# Final TechPartner Studio Deployment Script
exec > >(tee /var/log/startup-script.log)
exec 2>&1

echo "=== TechPartner Studio Deployment Starting ==="

# Update system
apt update -y
apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Stop and disable nginx
systemctl stop nginx
systemctl disable nginx

# Create application directory
rm -rf /opt/techpartner
mkdir -p /opt/techpartner
cd /opt/techpartner

# Create the complete TechPartner Studio application
cat > app.js << 'APPEOF'
const express = require('express');
const app = express();
const port = 80;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    platform: 'TechPartner Studio',
    version: '1.0.0',
    ip: req.get('host'),
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

// Main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TechPartner Studio - Digital Agency Platform</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 20px; 
        }
        .header { 
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          padding: 20px 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 2rem;
          font-weight: bold;
          color: #01a1c1;
          text-decoration: none;
        }
        .nav {
          display: flex;
          gap: 30px;
        }
        .nav a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          padding: 10px 15px;
          border-radius: 25px;
          transition: all 0.3s;
        }
        .nav a:hover {
          background: #01a1c1;
          color: white;
        }
        .hero {
          text-align: center;
          padding: 100px 0;
          color: white;
        }
        .hero h1 {
          font-size: 3.5rem;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .hero p {
          font-size: 1.3rem;
          margin-bottom: 40px;
          opacity: 0.9;
        }
        .status-banner {
          background: rgba(40, 167, 69, 0.9);
          color: white;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 30px;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          padding: 15px 35px;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary {
          background: #01a1c1;
          color: white;
        }
        .btn-primary:hover {
          background: #0186a0;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(1, 161, 193, 0.3);
        }
        .btn-secondary {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid white;
        }
        .btn-secondary:hover {
          background: white;
          color: #333;
        }
        .services {
          padding: 100px 0;
          background: white;
        }
        .services h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 60px;
          color: #333;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        .service-card {
          background: #f8f9fa;
          padding: 40px 30px;
          border-radius: 15px;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
          border: 2px solid transparent;
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-color: #01a1c1;
        }
        .service-card h3 {
          color: #01a1c1;
          margin-bottom: 15px;
          font-size: 1.4rem;
        }
        .service-card p {
          margin-bottom: 20px;
          color: #666;
        }
        .price {
          font-weight: bold;
          color: #333;
          font-size: 1.1rem;
          margin-bottom: 20px;
        }
        .stats {
          background: #01a1c1;
          color: white;
          padding: 80px 0;
          text-align: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
        }
        .stat h3 {
          font-size: 3rem;
          margin-bottom: 10px;
        }
        .stat p {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        .api-section {
          background: #f8f9fa;
          padding: 80px 0;
          text-align: center;
        }
        .api-section h2 {
          margin-bottom: 40px;
          color: #333;
        }
        .api-links {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .footer {
          background: #333;
          color: white;
          padding: 50px 0;
          text-align: center;
        }
        .footer p {
          opacity: 0.8;
          margin-bottom: 10px;
        }
        @media (max-width: 768px) {
          .hero h1 { font-size: 2.5rem; }
          .hero p { font-size: 1.1rem; }
          .cta-buttons { flex-direction: column; align-items: center; }
          .nav { display: none; }
        }
      </style>
    </head>
    <body>
      <header class="header">
        <div class="container">
          <div class="header-content">
            <a href="/" class="logo">TechPartner Studio</a>
            <nav class="nav">
              <a href="#services">Services</a>
              <a href="#api">API</a>
              <a href="#stats">About</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section class="hero">
          <div class="container">
            <div class="status-banner">
              ✅ Platform Successfully Deployed on Google Cloud VM
            </div>
            <h1>TechPartner Studio</h1>
            <p>Your Complete Digital Agency Platform - Now Live and Running</p>
            <div class="cta-buttons">
              <a href="#services" class="btn btn-primary">View Services</a>
              <a href="/api/categories" class="btn btn-secondary">Explore API</a>
            </div>
          </div>
        </section>

        <section class="services" id="services">
          <div class="container">
            <h2>Our Digital Services</h2>
            <div class="services-grid">
              <div class="service-card">
                <h3>Logo & Identity</h3>
                <p>Professional brand identity and logo design services</p>
                <div class="price">Starting 1,500 SAR</div>
              </div>
              <div class="service-card">
                <h3>Web & App Design</h3>
                <p>Modern web and mobile application design</p>
                <div class="price">Starting 5,000 SAR</div>
              </div>
              <div class="service-card">
                <h3>Custom Development</h3>
                <p>Full-stack web development solutions</p>
                <div class="price">Starting 25,000 SAR</div>
              </div>
              <div class="service-card">
                <h3>Business & Advertising</h3>
                <p>Marketing and advertising design services</p>
                <div class="price">Starting 2,000 SAR</div>
              </div>
              <div class="service-card">
                <h3>Art & Illustration</h3>
                <p>Custom artwork and illustration services</p>
                <div class="price">Starting 1,500 SAR</div>
              </div>
              <div class="service-card">
                <h3>Print Design</h3>
                <p>Professional print design services</p>
                <div class="price">Starting 400 SAR</div>
              </div>
            </div>
          </div>
        </section>

        <section class="stats" id="stats">
          <div class="container">
            <div class="stats-grid">
              <div class="stat">
                <h3>500+</h3>
                <p>Projects Completed</p>
              </div>
              <div class="stat">
                <h3>150+</h3>
                <p>Happy Clients</p>
              </div>
              <div class="stat">
                <h3>8</h3>
                <p>Service Categories</p>
              </div>
              <div class="stat">
                <h3>24/7</h3>
                <p>Support Available</p>
              </div>
            </div>
          </div>
        </section>

        <section class="api-section" id="api">
          <div class="container">
            <h2>API Endpoints</h2>
            <p>Access our platform data programmatically</p>
            <div class="api-links">
              <a href="/api/health" class="btn btn-primary">Health Check</a>
              <a href="/api/categories" class="btn btn-primary">Service Categories</a>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 TechPartner Studio. All rights reserved.</p>
          <p>Professional Digital Agency Platform - Successfully Deployed on Google Cloud</p>
          <p>Server IP: ${req.get('host')} | Status: Production Ready</p>
        </div>
      </footer>
    </body>
    </html>
  `);
});

// Handle all other routes
app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 TechPartner Studio Platform running on port ${port}`);
  console.log(`📍 Server accessible at: http://localhost:${port}`);
});
APPEOF

# Create package.json
cat > package.json << 'PKGEOF'
{
  "name": "techpartner-studio",
  "version": "1.0.0",
  "description": "TechPartner Studio - Digital Agency Platform",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "keywords": ["techpartner", "digital-agency", "platform"],
  "author": "TechPartner Studio",
  "license": "MIT"
}
PKGEOF

# Install dependencies
npm install

# Setup PM2 to run the application
pm2 delete all 2>/dev/null || true
pm2 start app.js --name techpartner-studio
pm2 startup
pm2 save

# Set up log rotation
pm2 install pm2-logrotate

echo "=== TechPartner Studio Platform Deployment Complete ==="
echo "✅ Platform running on port 80"
echo "✅ PM2 process management configured"
echo "✅ Auto-restart enabled"
echo "🌐 Platform accessible at VM IP address"
APPEOF

# Create package.json
cat > package.json << 'PKGEOF'
{
  "name": "techpartner-studio",
  "version": "1.0.0",
  "description": "TechPartner Studio - Digital Agency Platform",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "keywords": ["techpartner", "digital-agency", "platform"],
  "author": "TechPartner Studio",
  "license": "MIT"
}
PKGEOF

# Install dependencies
npm install

# Setup PM2 to run the application
pm2 delete all 2>/dev/null || true
pm2 start app.js --name techpartner-studio
pm2 startup
pm2 save

# Set up log rotation
pm2 install pm2-logrotate

echo "=== TechPartner Studio Platform Deployment Complete ==="
echo "✅ Platform running on port 80"
echo "✅ PM2 process management configured"
echo "✅ Auto-restart enabled"
echo "🌐 Platform accessible at VM IP address"