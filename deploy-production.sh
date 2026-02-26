#!/bin/bash

# TechPartner Site - Production Deployment Script
echo "🚀 Starting Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Build application
print_status "Building application for production..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Application build failed"
    exit 1
fi

# Step 2: Update database schemas  
print_status "Updating database schemas..."
cd server && npx prisma db push && npx prisma generate
if [ $? -eq 0 ]; then
    print_success "Database schemas updated"
    cd ..
else
    print_warning "Database update had issues, continuing..."
    cd ..
fi

# Step 3: Deploy to Google Cloud Run (if available)
if command -v gcloud &> /dev/null; then
    print_status "Google Cloud SDK found. Deploying to Cloud Run..."
    
    # Build and deploy with Cloud Build
    gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/techpartner-site
    
    if [ $? -eq 0 ]; then
        print_status "Deploying to Cloud Run..."
        gcloud run deploy techpartner-site \
            --image gcr.io/$(gcloud config get-value project)/techpartner-site \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated \
            --port 3000 \
            --memory 1Gi \
            --cpu 1
        
        if [ $? -eq 0 ]; then
            print_success "Deployed to Google Cloud Run successfully!"
        else
            print_error "Cloud Run deployment failed"
        fi
    else
        print_error "Cloud Build failed"
    fi
else
    print_warning "Google Cloud SDK not found. Skipping cloud deployment."
    print_status "To deploy to cloud, install gcloud CLI and run: gcloud auth login"
fi

# Step 4: Local Docker deployment option
read -p "Deploy locally with Docker? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Deploying locally with Docker..."
    ./docker-update.sh
fi

print_success "🎉 Deployment process completed!"
echo ""
print_status "Next steps:"
echo "• Check your production deployment"
echo "• Monitor application logs"
echo "• Update DNS records if needed"
echo ""
