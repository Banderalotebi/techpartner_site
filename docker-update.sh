#!/bin/bash

# Quick Docker Update Script
echo "🐳 Quick Docker Update for TechPartner Site"

# Stop containers
echo "Stopping containers..."
docker-compose down

# Remove old images (optional - uncomment if you want to clean up)
# docker image prune -f

# Build and start
echo "Building and starting containers..."
docker-compose up -d --build

# Show status
echo "Container status:"
docker-compose ps

echo "✅ Docker update complete!"
echo "🌐 Application should be available at http://localhost:3000"
