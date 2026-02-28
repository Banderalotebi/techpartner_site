#!/bin/bash

# TechPartner Site - AWS EC2 Deployment Script
# =============================================
# This script connects to your EC2 instance and deploys the application

# Configuration - Update these values for your EC2 instance
EC2_HOST="ec2-54-227-243-191.compute-1.amazonaws.com"
EC2_USER="ubuntu"
SSH_KEY_PATH="~/Downloads/kimi-key.pem"
APP_DIR="/home/ubuntu/techpartner"

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

# Check if SSH key exists
if [ ! -f "$SSH_KEY_PATH" ]; then
    print_error "SSH key not found at: $SSH_KEY_PATH"
    echo "Please update the SSH_KEY_PATH in this script"
    exit 1
fi

# Fix SSH key path (expand ~)
SSH_KEY_PATH=$(eval echo $SSH_KEY_PATH)

echo "🚀 Starting AWS EC2 Deployment..."
echo "=================================="
echo "Host: $EC2_HOST"
echo "User: $EC2_USER"
echo "App Directory: $APP_DIR"
echo ""

# Step 1: Build locally first
print_status "Building application locally..."
npm install
if [ $? -ne 0 ]; then
    print_error "Local build failed"
    exit 1
fi

print_status "Running build script..."
node build.js
if [ $? -ne 0 ]; then
    print_error "Build script failed"
    exit 1
fi
print_success "Local build completed"

# Step 2: Check git status and commit if needed
print_status "Checking git status..."
if [ -d ".git" ]; then
    git status --short
    echo ""
    read -p "Do you want to commit changes? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " COMMIT_MSG
        git add -f dist/
        git add -f public/
        git add -f server/
        git add -f shared/
        git add -f client/
        git add -f package*.json
        git add -f tsconfig.json
        git add -f vite.config.ts
        git add -f build.js
        git commit -m "$COMMIT_MSG"
        print_success "Changes committed"
        
        read -p "Push to remote? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push origin main
            print_success "Changes pushed to remote"
        fi
    fi
fi

# Step 3: Connect to EC2 and deploy
echo ""
print_status "Connecting to EC2 and deploying..."
echo ""

ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << 'ENDSSH'
    # Colors for remote output
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'
    
    print_status() {
        echo -e "${BLUE}[INFO]${NC} $1"
    }
    
    print_success() {
        echo -e "${GREEN}[SUCCESS]${NC} $1"
    }
    
    print_error() {
        echo -e "${RED}[ERROR]${NC} $1"
    }

    cd /home/ubuntu/techpartner
    
    print_status "Pulling latest changes from git..."
    git fetch origin
    git reset --hard origin/main
    
    print_status "Installing dependencies..."
    npm install
    
    print_status "Building application..."
    node build.js
    
    print_status "Restarting PM2..."
    pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs
    
    print_status "Waiting for application to start..."
    sleep 5
    
    print_status "Checking PM2 status..."
    pm2 status
    
    print_status "Checking application health..."
    curl -f http://localhost:8080/api/health > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_success "Application is running on port 8080!"
    else
        print_error "Application health check failed"
        pm2 logs techpartner --lines 20
    fi
    
    echo ""
    echo "=================================="
    echo "Deployment completed!"
    echo "=================================="
ENDSSH

if [ $? -eq 0 ]; then
    print_success "🎉 EC2 Deployment completed successfully!"
    echo ""
    echo -e "${BLUE}Your application should be live at:${NC}"
    echo -e "${GREEN}http://${EC2_HOST}${NC} (via nginx on port 80)"
    echo -e "${BLUE}Direct access:${NC} http://${EC2_HOST}:8080"
else
    print_error "EC2 deployment failed"
    exit 1
fi
