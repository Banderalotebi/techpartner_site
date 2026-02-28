#!/bin/bash

# TechPartner Site - Server Update Script (Non-Docker/EC2 Deployment)
# =====================================================================

echo "🚀 Starting TechPartner Site Update..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Step 2: Build the application
print_status "Building the application..."
node build.js
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Application build failed"
    exit 1
fi

# Step 3: Update database schemas (if using Prisma)
print_status "Checking database schemas..."
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

# Step 4: Restart PM2 (if running)
print_status "Checking PM2 status..."
if command -v pm2 &> /dev/null; then
    pm2 restart techpartner
    if [ $? -eq 0 ]; then
        print_success "PM2 restarted successfully"
    else
        print_warning "PM2 restart failed, starting fresh..."
        pm2 start dist/index.cjs --name techpartner
    fi
else
    print_warning "PM2 not found, please start the server manually"
fi

# Step 5: Wait for services to be ready
print_status "Waiting for application to start..."
sleep 5

# Step 6: Check if application is running
print_status "Checking application health..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Application is running at http://localhost:3000"
else
    print_warning "Application might still be starting up"
    print_status "Check logs with: pm2 logs techpartner"
fi

# Step 7: Show PM2 status
print_status "Current PM2 status:"
pm2 status

echo ""
print_success "🎉 Update completed successfully!"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Check your application at http://localhost:3000"
echo "2. Monitor logs with: pm2 logs techpartner"
echo "3. Check status with: pm2 status"
echo ""

