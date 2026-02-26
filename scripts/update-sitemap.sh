#!/bin/bash

# Sitemap Update Script for TechPartner Platform
# This script updates the sitemap.xml with current date and uploads to production

echo "🗺️  Updating TechPartner Sitemap..."

# Get current date in ISO format
CURRENT_DATE=$(date -u +"%Y-%m-%d")

# Update sitemap.xml with current date
sed -i.bak "s/<lastmod>[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}<\/lastmod>/<lastmod>$CURRENT_DATE<\/lastmod>/g" public/sitemap.xml

echo "✅ Updated sitemap dates to: $CURRENT_DATE"

# Validate XML format
if command -v xmllint > /dev/null; then
    echo "🔍 Validating XML format..."
    if xmllint --noout public/sitemap.xml 2>/dev/null; then
        echo "✅ Sitemap XML is valid"
    else
        echo "❌ Sitemap XML validation failed"
        exit 1
    fi
else
    echo "⚠️  xmllint not available, skipping validation"
fi

# If in production or staging, ping search engines
if [[ "$NODE_ENV" == "production" || "$ENVIRONMENT" == "production" ]]; then
    echo "🌐 Pinging search engines about sitemap update..."
    
    # Google
    curl -s "https://www.google.com/ping?sitemap=https://techpartner.sa/sitemap.xml" > /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Notified Google about sitemap update"
    else
        echo "⚠️  Failed to notify Google"
    fi
    
    # Bing
    curl -s "https://www.bing.com/ping?sitemap=https://techpartner.sa/sitemap.xml" > /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Notified Bing about sitemap update"
    else
        echo "⚠️  Failed to notify Bing"
    fi
else
    echo "🔧 Development environment - skipping search engine notifications"
fi

# Clean up backup file
rm -f public/sitemap.xml.bak

echo "🎉 Sitemap update complete!"

# Optional: Display sitemap info
echo ""
echo "📊 Sitemap Statistics:"
echo "URLs: $(grep -c '<url>' public/sitemap.xml)"
echo "Last updated: $CURRENT_DATE"
echo "Location: https://techpartner.sa/sitemap.xml"
