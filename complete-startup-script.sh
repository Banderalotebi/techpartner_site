#!/bin/bash

# Complete TechPartner Platform Startup Script
exec > >(tee /var/log/startup-script.log)
exec 2>&1

echo "Starting TechPartner Platform deployment..."

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 and other tools
npm install -g pm2 tsx
apt install -y nginx git

# Create app directory
mkdir -p /opt/techpartner
cd /opt/techpartner

# Create complete TechPartner platform
cat > server.js << 'EOF'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 80;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    platform: 'TechPartner',
    version: '1.0.0'
  });
});

app.get('/api/categories', (req, res) => {
  res.json([
    { id: 1, name: 'Logo & Identity', slug: 'logo-identity', price: '1500+ SAR' },
    { id: 2, name: 'Web & App Design', slug: 'web-app-design', price: '5000+ SAR' },
    { id: 3, name: 'Custom Development', slug: 'web-development', price: '25000+ SAR' },
    { id: 4, name: 'Business & Advertising', slug: 'business-advertising', price: '2000+ SAR' },
    { id: 5, name: 'Art & Illustration', slug: 'art-illustration', price: '1500+ SAR' },
    { id: 6, name: 'Packaging & Label', slug: 'packaging-label', price: '1800+ SAR' },
    { id: 7, name: 'Social Media', slug: 'social-media', price: '300+ SAR' },
    { id: 8, name: 'Print Design', slug: 'print-design', price: '400+ SAR' }
  ]);
});

// Main TechPartner Platform Page
app.get('*', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TechPartner - Digital Agency Platform</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          min-height: 100vh; 
        }
        .header { 
          background: rgba(255,255,255,0.95); 
          padding: 20px 0; 
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .nav { 
          max-width: 1200px; 
          margin: 0 auto; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 0 20px;
        }
        .logo { 
          font-size: 24px; 
          font-weight: 700; 
          color: #01a1c1; 
        }
        .nav-links { 
          display: flex; 
          gap: 30px; 
          list-style: none; 
        }
        .nav-links a { 
          color: #333; 
          text-decoration: none; 
          font-weight: 500; 
          transition: color 0.3s;
        }
        .nav-links a:hover { 
          color: #01a1c1; 
        }
        .hero { 
          text-align: center; 
          padding: 80px 20px; 
          color: white; 
          max-width: 1200px; 
          margin: 0 auto;
        }
        .hero h1 { 
          font-size: 3.5em; 
          margin-bottom: 20px; 
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .hero p { 
          font-size: 1.3em; 
          margin-bottom: 40px; 
          opacity: 0.9;
        }
        .status { 
          background: rgba(40, 167, 69, 0.9); 
          padding: 20px; 
          border-radius: 10px; 
          margin: 40px 0; 
          backdrop-filter: blur(10px);
        }
        .services { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 30px; 
          margin: 60px 0; 
        }
        .service-card { 
          background: rgba(255,255,255,0.1); 
          padding: 30px; 
          border-radius: 15px; 
          text-align: center; 
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: transform 0.3s;
        }
        .service-card:hover { 
          transform: translateY(-5px); 
        }
        .service-card h3 { 
          color: #01a1c1; 
          margin-bottom: 15px; 
          font-size: 1.4em;
        }
        .service-card p { 
          opacity: 0.8; 
          margin-bottom: 10px;
        }
        .price { 
          font-weight: 700; 
          color: #ffd700; 
          font-size: 1.2em;
        }
        .btn { 
          display: inline-block; 
          background: #01a1c1; 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: 600; 
          transition: all 0.3s;
          border: none;
          cursor: pointer;
        }
        .btn:hover { 
          background: #0186a0; 
          transform: translateY(-2px);
        }
        .footer { 
          background: rgba(0,0,0,0.8); 
          padding: 40px 20px; 
          text-align: center; 
          color: white; 
          margin-top: 80px;
        }
        .stats { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 20px; 
          margin: 40px 0; 
        }
        .stat { 
          text-align: center; 
        }
        .stat-number { 
          font-size: 2.5em; 
          font-weight: 700; 
          color: #01a1c1; 
        }
        .stat-label { 
          opacity: 0.8; 
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <header class="header">
        <nav class="nav">
          <div class="logo">TechPartner</div>
          <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main class="hero">
        <h1>TechPartner Platform</h1>
        <p>Complete Digital Agency Solution - Successfully Deployed on Google Cloud</p>
        
        <div class="status">
          <h2>✅ Platform Successfully Deployed!</h2>
          <p>Your comprehensive digital agency platform is now live and running on Google Cloud VM</p>
          <p><strong>Server IP:</strong> ${req.get('host')}</p>
        </div>

        <div class="stats">
          <div class="stat">
            <div class="stat-number">500+</div>
            <div class="stat-label">Projects Completed</div>
          </div>
          <div class="stat">
            <div class="stat-number">150+</div>
            <div class="stat-label">Happy Clients</div>
          </div>
          <div class="stat">
            <div class="stat-number">8</div>
            <div class="stat-label">Service Categories</div>
          </div>
          <div class="stat">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Support Available</div>
          </div>
        </div>

        <div class="services">
          <div class="service-card">
            <h3>Logo & Identity</h3>
            <p>Professional brand identity design with comprehensive logo packages</p>
            <div class="price">Starting 1,500 SAR</div>
          </div>
          <div class="service-card">
            <h3>Web & App Design</h3>
            <p>Modern web and mobile app design with user-centered approach</p>
            <div class="price">Starting 5,000 SAR</div>
          </div>
          <div class="service-card">
            <h3>Custom Development</h3>
            <p>Full-stack web development with modern technologies</p>
            <div class="price">Starting 25,000 SAR</div>
          </div>
          <div class="service-card">
            <h3>Business & Advertising</h3>
            <p>Complete marketing and advertising solutions for your business</p>
            <div class="price">Starting 2,000 SAR</div>
          </div>
        </div>

        <a href="/api/categories" class="btn">View All Services</a>
        <a href="/api/health" class="btn">Health Check</a>
      </main>

      <footer class="footer">
        <p>&copy; 2025 TechPartner Platform. All rights reserved.</p>
        <p>Professional Digital Agency Services | Saudi Arabia</p>
      </footer>
    </body>
    </html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(\`TechPartner Platform running on port \${port}\`);
});
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "techpartner-platform",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
EOF

# Install dependencies
npm install

# Stop nginx (we'll run directly on port 80)
systemctl stop nginx
systemctl disable nginx

# Start with PM2
pm2 start server.js --name techpartner-platform
pm2 startup
pm2 save

echo "✅ TechPartner Platform deployed successfully!"
echo "Platform available at: http://$(curl -s ifconfig.me)"