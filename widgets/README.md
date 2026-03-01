# Digital Astrolabe Widget - Trojan Horse SEO Tool

## Overview
The Digital Astrolabe is an embeddable widget that calculates real-time lunar triangulation from Jeddah, Saudi Arabia. It's designed as a "Trojan Horse" for backlink generation - other websites embed it for free, and it includes a do-follow backlink to TechPartner.

## Features
- Real-time lunar altitude calculation
- Moon phase display
- Live time updates (AST - Arabia Standard Time)
- Beautiful dark theme with glowing accents
- Zero dependencies - vanilla JavaScript Web Component
- SEO-friendly backlink in footer

## Usage

### For Website Owners (Embedding)
Add this single line to any HTML page:

```html
<script src="https://techpartner.sa/widgets/astrolabe.min.js" defer></script>
<digital-astrolabe></digital-astrolabe>
```

### For TechPartner (Deployment)

1. Build the widget:
```bash
cd widgets
npm install
npm run build
```

2. Deploy to CDN:
```bash
cp dist/astrolabe.min.js /var/www/techpartner.sa/widgets/
```

3. Update Nginx config to serve widgets (already included in nginx-websocket.conf):
```nginx
location /widgets/ {
    alias /var/www/techpartner.sa/widgets/;
    expires 30d;
    add_header Access-Control-Allow-Origin "*";
}
```

## Backlink Strategy
The widget includes a subtle footer link:
```html
<a href="https://techpartner.sa/labs/astrolabe" rel="dofollow">Widget by TechPartner Engineering</a>
```

When astronomy blogs, educational sites, or science communities embed this widget:
- They get a beautiful, functional lunar calculator
- TechPartner gets a high-quality, contextual backlink
- Google indexes the link as it's in the Shadow DOM but still crawlable

## Technical Details
- **Size**: ~3KB minified
- **Format**: IIFE (Immediately Invoked Function Expression)
- **Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **No dependencies**: Pure vanilla JavaScript
- **Shadow DOM**: Isolated styles won't conflict with host site

## Customization
The widget accepts an optional API key attribute for enhanced features:
```html
<digital-astrolabe api-key="your_key_here"></digital-astrolabe>
```

## Mathematics
The altitude calculation uses spherical trigonometry:
```
sin(h) = sin(φ)sin(δ) + cos(φ)cos(δ)cos(H)
```
Where:
- φ = Observer latitude (Jeddah: 21.5433°N)
- δ = Lunar declination (calculated from moon phase)
- H = Hour angle (based on local time)

## License
Proprietary - TechPartner Engineering
