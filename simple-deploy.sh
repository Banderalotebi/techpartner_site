#!/bin/bash

# 🚀 TechPartner Platform - Easy Deployment Script
# ===============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_ID="glossy-agency-448211-s4"
REGION="us-central1"
SERVICE_NAME="techpartner-site"

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Deploy to environment
deploy_to_environment() {
    local env=$1
    local memory="2Gi"
    local cpu="2"
    local max_instances="10"
    
    print_header "Deploying to $env"
    
    gcloud run deploy "${SERVICE_NAME}" \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8080 \
        --memory $memory \
        --cpu $cpu \
        --min-instances 0 \
        --max-instances $max_instances \
        --set-env-vars="NODE_ENV=$env" \
        --quiet
    
    local service_url=$(gcloud run services describe "${SERVICE_NAME}" \
        --region=$REGION \
        --format="value(status.url)")
    
    print_success "Deployed successfully!"
    echo -e "${GREEN}🌐 Service URL: $service_url${NC}"
}

case "${1:-deploy}" in
    "deploy")
        deploy_to_environment "production"
        ;;
    *)
        echo "Usage: $0 [deploy]"
        ;;
esac
