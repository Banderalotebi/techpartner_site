#!/bin/bash

# TechPartner Site - Server & Docker Update Script
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

# Step 1: Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Step 2: Build latest application
print_status "Building latest application..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Application build failed"
    exit 1
fi

# Step 3: Update database schemas
print_status "Updating database schemas..."
cd server && npx prisma db push && npx prisma generate
if [ $? -eq 0 ]; then
    print_success "Database schemas updated"
    cd ..
else
    print_warning "Database update had issues, continuing..."
    cd ..
fi

# Step 4: Build new Docker image
print_status "Building new Docker image..."
docker-compose build --no-cache
if [ $? -eq 0 ]; then
    print_success "Docker image built successfully"
else
    print_error "Docker build failed"
    exit 1
fi

# Step 5: Start updated containers
print_status "Starting updated containers..."
docker-compose up -d
if [ $? -eq 0 ]; then
    print_success "Containers started successfully"
else
    print_error "Failed to start containers"
    exit 1
fi

# Step 6: Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Step 7: Check if application is running
print_status "Checking application health..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Application is running at http://localhost:3000"
else
    print_warning "Application might still be starting up"
fi

# Step 8: Show running containers
print_status "Current running containers:"
docker-compose ps

echo ""
print_success "🎉 Update completed successfully!"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Check your application at http://localhost:3000"
echo "2. Monitor logs with: docker-compose logs -f"
echo "3. Stop services with: docker-compose down"
echo ""
