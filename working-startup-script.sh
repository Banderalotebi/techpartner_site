#!/bin/bash

# Working TechPartner Platform Startup Script
exec > >(tee /var/log/startup-script.log)
exec 2>&1

echo "Starting TechPartner Platform deployment..."

# Update system
apt update -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Stop and disable nginx
systemctl stop nginx
systemctl disable nginx

# Create app directory
mkdir -p /opt/techpartner
cd /opt/techpartner

# Create the TechPartner platform
cat > app.js << 'EOF'
const express = require('express');
const app = express();
const port = 80;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TechPartner - Digital Agency Platform</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          min-height: 100vh; 
          color: white;
        }
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 40px 20px; 
          text-align: center; 
        }
        .header { 
          background: rgba(255,255,255,0.1); 
          backdrop-filter: blur(10px); 
          padding: 20px; 
          border-radius: 15px; 
          margin-bottom: 40px; 
        }
        h1 { 
          font-size: 3em; 
          margin-bottom: 20px; 
          color: #01a1c1; 
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3); 
        }
        .status { 
          background: rgba(40, 167, 69, 0.9); 
          padding: 20px; 
          border-radius: 10px; 
          margin: 30px 0; 
          font-size: 1.2em; 
          font-weight: 600; 
        }
        .services { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 20px; 
          margin: 40px 0; 
        }
        .service { 
          background: rgba(255,255,255,0.1); 
          padding: 25px; 
          border-radius: 12px; 
          backdrop-filter: blur(10px); 
          border: 1px solid rgba(255,255,255,0.2); 
        }
        .service h3 { 
          color: #01a1c1; 
          margin-bottom: 10px; 
          font-size: 1.3em; 
        }
        .price { 
          font-weight: bold; 
          color: #ffd700; 
          font-size: 1.1em; 
          margin-top: 10px; 
        }
        .btn { 
          display: inline-block; 
          background: #01a1c1; 
          color: white; 
          padding: 12px 25px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 10px; 
          font-weight: 600; 
          transition: background 0.3s; 
        }
        .btn:hover { 
          background: #0186a0; 
        }
        .stats { 
          display: flex; 
          justify-content: space-around; 
          margin: 40px 0; 
          flex-wrap: wrap; 
        }
        .stat { 
          text-align: center; 
          margin: 10px; 
        }
        .stat-number { 
          font-size: 2.5em; 
          font-weight: bold; 
          color: #01a1c1; 
        }
        .info { 
          background: rgba(0,0,0,0.3); 
          padding: 20px; 
          border-radius: 10px; 
          margin: 30px 0; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TechPartner Platform</h1>
          <p>Complete Digital Agency Solution - Successfully Deployed on Google Cloud</p>
        </div>

        <div class="status">
          ✅ Platform Successfully Deployed and Running!
        </div>

        <div class="info">
          <p><strong>Server IP:</strong> ${req.get('host')}</p>
          <p><strong>Status:</strong> Production Ready</p>
          <p><strong>Platform:</strong> Google Cloud VM</p>
        </div>

        <div class="stats">
          <div class="stat">
            <div class="stat-number">500+</div>
            <div>Projects</div>
          </div>
          <div class="stat">
            <div class="stat-number">150+</div>
            <div>Clients</div>
          </div>
          <div class="stat">
            <div class="stat-number">8</div>
            <div>Services</div>
          </div>
          <div class="stat">
            <div class="stat-number">24/7</div>
            <div>Support</div>
          </div>
        </div>

        <div class="services">
          <div class="service">
            <h3>Logo & Identity</h3>
            <p>Professional brand identity design</p>
            <div class="price">Starting 1,500 SAR</div>
          </div>
          <div class="service">
            <h3>Web & App Design</h3>
            <p>Modern web and mobile design</p>
            <div class="price">Starting 5,000 SAR</div>
          </div>
          <div class="service">
            <h3>Custom Development</h3>
            <p>Full-stack web development</p>
            <div class="price">Starting 25,000 SAR</div>
          </div>
          <div class="service">
            <h3>Business & Advertising</h3>
            <p>Marketing and advertising solutions</p>
            <div class="price">Starting 2,000 SAR</div>
          </div>
        </div>

        <a href="/api/health" class="btn">Health Check</a>
        <a href="/api/categories" class="btn">View Services</a>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    platform: 'TechPartner',
    version: '1.0.0',
    server: req.get('host')
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

app.listen(port, '0.0.0.0', () => {
  console.log('TechPartner Platform running on port ' + port);
});
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "techpartner-platform",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.18.0"
  }
}
EOF

# Install dependencies
npm install

# Start with PM2
pm2 start app.js --name techpartner-platform
pm2 startup
pm2 save

echo "✅ TechPartner Platform deployed successfully on port 80!"