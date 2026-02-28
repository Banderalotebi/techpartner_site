#!/bin/bash

# TechPartner Site - Production Deployment Script (Non-Docker)
# ==============================================================

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

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Build application
print_status "Building application for production..."
node build.js
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Application build failed"
    exit 1
fi

# Step 3: Update database schemas  
print_status "Updating database schemas..."
if [ -d "server/prisma" ]; then
    cd server && npx prisma db push && npx prisma generate
    if [ $? -eq 0 ]; then
        print_success "Database schemas updated"
        cd ..
    else
        print_warning "Database update had issues, continuing..."
        cd ..
    fi
else
    print_warning "No Prisma schema found, skipping database update"
fi

# Step 4: Restart PM2
print_status "Restarting PM2..."
if command -v pm2 &> /dev/null; then
    pm2 restart techpartner || pm2 start dist/index.cjs --name techpartner
    if [ $? -eq 0 ]; then
        print_success "PM2 restarted successfully"
    else
        print_warning "PM2 start failed, starting fresh..."
        pm2 start dist/index.cjs --name techpartner
    fi
else
    print_warning "PM2 not found, please install it: npm install -g pm2"
fi

# Step 5: Check application health
print_status "Checking application health..."
sleep 3
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Application is running at http://localhost:3000"
else
    print_warning "Application health check failed"
    print_status "Check logs with: pm2 logs techpartner"
fi

# Step 6: Deploy to Google Cloud Run (optional)
if command -v gcloud &> /dev/null; then
    print_status "Google Cloud SDK found."
    read -p "Deploy to Google Cloud Run? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deploying to Cloud Run..."
        ./simple-deploy.sh
    fi
else
    print_warning "Google Cloud SDK not found. Skipping cloud deployment."
fi

# Step 7: Deploy to AWS EC2 (optional)
echo ""
print_status "AWS EC2 Deployment Options:"
echo "1. Deploy to EC2 now"
echo "2. Show EC2 deployment commands"
echo "3. Skip EC2 deployment"
echo ""
read -p "Choose option (1/2/3): " EC2_OPTION

case $EC2_OPTION in
    1)
        print_status "Deploying to AWS EC2..."
        ./scripts/deploy-aws-ec2.sh
        ;;
    2)
        echo ""
        echo "To deploy to AWS EC2 manually:"
        echo "  ./scripts/deploy-aws-ec2.sh"
        echo ""
        echo "Or SSH directly:"
        echo "  ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com"
        ;;
    *)
        print_status "Skipping EC2 deployment"
        ;;
esac

print_success "🎉 Deployment process completed!"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "• Check your production deployment"
echo "• Monitor application logs: pm2 logs techpartner"
echo "• Check status: pm2 status"
echo ""

