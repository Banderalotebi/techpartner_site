#!/bin/bash

# Deploy TechPartner Platform to VM
# Connect using your SSH key: ssh -i ~/.ssh/techpartner-server bander@34.69.69.182

echo "Deploying TechPartner Platform..."

# Backup existing file
sudo cp /var/www/html/index.html /var/www/html/index.html.backup

# Create the complete TechPartner platform
sudo tee /var/www/html/index.html > /dev/null << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechPartner Studio - Digital Agency Services</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        header { 
            background: linear-gradient(135deg, #01a1c1 0%, #0081a1 100%);
            color: white; padding: 20px 0; position: sticky; top: 0; z-index: 1000;
        }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.8rem; font-weight: bold; }
        nav ul { display: flex; list-style: none; gap: 30px; }
        nav a { color: white; text-decoration: none; font-weight: 500; }
        nav a:hover { opacity: 0.8; }
        
        .hero { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 80px 0; text-align: center;
        }
        .hero h1 { 
            font-size: 3rem; margin-bottom: 20px; color: #01a1c1;
            background: linear-gradient(45deg, #01a1c1, #0081a1);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero p { font-size: 1.2rem; margin-bottom: 30px; color: #666; }
        .cta-button { 
            background: linear-gradient(45deg, #01a1c1, #0081a1);
            color: white; padding: 15px 30px; border: none; border-radius: 8px;
            font-size: 1.1rem; cursor: pointer; text-decoration: none; display: inline-block;
            transition: transform 0.3s ease; margin: 10px;
        }
        .cta-button:hover { transform: translateY(-2px); }
        
        .services { padding: 80px 0; }
        .services h2 { text-align: center; font-size: 2.5rem; margin-bottom: 50px; color: #01a1c1; }
        .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .service-card { 
            background: white; padding: 30px; border-radius: 12px; text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: transform 0.3s ease;
        }
        .service-card:hover { transform: translateY(-5px); }
        .service-card h3 { color: #01a1c1; margin-bottom: 15px; font-size: 1.5rem; }
        .service-card p { color: #666; margin-bottom: 20px; }
        .price { font-weight: bold; color: #28a745; font-size: 1.2rem; }
        
        .stats { 
            background: linear-gradient(135deg, #01a1c1 0%, #0081a1 100%);
            color: white; padding: 60px 0; text-align: center;
        }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; }
        .stat-item h3 { font-size: 2.5rem; margin-bottom: 10px; }
        .stat-item p { font-size: 1.1rem; }
        
        footer { background: #333; color: white; padding: 40px 0; text-align: center; }
        
        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .service-grid { grid-template-columns: 1fr; }
            nav ul { display: none; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">TechPartner Studio</div>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#portfolio">Portfolio</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero" id="home">
        <div class="container">
            <h1>Design personalized to fit your needs perfectly</h1>
            <p>Professional digital agency services from brand identity to custom development</p>
            <a href="#services" class="cta-button">Start Your Project</a>
            <a href="#portfolio" class="cta-button">View Portfolio</a>
        </div>
    </section>

    <section class="services" id="services">
        <div class="container">
            <h2>Our Design and Development Services</h2>
            <div class="service-grid">
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
                    <h3>Packaging & Label</h3>
                    <p>Product packaging and label design</p>
                    <div class="price">Starting 1,800 SAR</div>
                </div>
                <div class="service-card">
                    <h3>Social Media</h3>
                    <p>Social media graphics and content design</p>
                    <div class="price">Starting 300 SAR</div>
                </div>
                <div class="service-card">
                    <h3>Print Design</h3>
                    <p>Professional print design services</p>
                    <div class="price">Starting 400 SAR</div>
                </div>
            </div>
        </div>
    </section>

    <section class="stats">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-item">
                    <h3>500+</h3>
                    <p>Projects Completed</p>
                </div>
                <div class="stat-item">
                    <h3>150+</h3>
                    <p>Happy Clients</p>
                </div>
                <div class="stat-item">
                    <h3>99%</h3>
                    <p>Satisfaction Rate</p>
                </div>
                <div class="stat-item">
                    <h3>24/7</h3>
                    <p>Support Available</p>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2025 TechPartner Studio. Professional digital agency services in Saudi Arabia.</p>
            <p>Contact: info@techpartner.studio | +966 XX XXX XXXX</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Stats animation
        function animateStats() {
            const stats = document.querySelectorAll('.stat-item h3');
            stats.forEach(stat => {
                const target = parseInt(stat.textContent);
                const increment = target / 100;
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                        stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                        stat.textContent = stat.textContent.includes('%') ? target + '%' : stat.textContent;
                        stat.textContent = stat.textContent.includes('/') ? '24/7' : stat.textContent;
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 20);
            });
        }

        // Trigger animation when stats section is visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateStats();
                observer.disconnect();
            }
        });
        observer.observe(document.querySelector('.stats'));
    </script>
</body>
</html>
EOF

# Reload nginx to serve the new platform
sudo systemctl reload nginx

echo "✅ TechPartner Platform deployed successfully!"
echo "🌐 Visit: http://34.69.69.182"