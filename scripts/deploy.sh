#!/bin/bash

# 🚀 TechPartner Platform - Easy Deployment Script
# ===============================================
# This script provides simple commands for deployment across environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="glossy-agency-448211-s4"
REGION="us-central1"
SERVICE_NAME="techpartner-site"

# Helper functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if gcloud is installed
    if ! command -v gcloud &> /dev/null; then
        print_error "Google Cloud CLI is not installed"
        echo "Install it from: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        echo "Install it from: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        echo "Install Node.js from: https://nodejs.org/"
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Build the application
build_app() {
    print_header "Building Application"
    
    echo "Installing dependencies..."
    npm ci
    
    echo "Running type check..."
    npm run check
    
    echo "Building application..."
    npm run build
    
    print_success "Application built successfully"
}

# Deploy to environment
deploy_to_environment() {
    local env=$1
    local service_suffix=""
    local memory="2Gi"
    local cpu="2"
    local max_instances="10"
    
    if [ "$env" = "staging" ]; then
        service_suffix="-staging"
        memory="1Gi"
        cpu="1"
        max_instances="5"
    fi
    
    print_header "Deploying to ${env^}"
    
    # Build and deploy using gcloud
    echo "Deploying to Cloud Run..."
    gcloud run deploy "${SERVICE_NAME}${service_suffix}" \
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
    
    # Get the service URL
    local service_url=$(gcloud run services describe "${SERVICE_NAME}${service_suffix}" \
        --region=$REGION \
        --format="value(status.url)")
    
    print_success "Deployed to $env successfully!"
    echo -e "${GREEN}🌐 Service URL: $service_url${NC}"
    
    # Health check
    echo "Performing health check..."
    sleep 10
    if curl -f "$service_url/health" > /dev/null 2>&1; then
        print_success "Health check passed!"
    else
        print_warning "Health check failed, but deployment completed"
    fi
}

# Quick deploy function (builds and deploys to production)
quick_deploy() {
    print_header "Quick Deploy to Production"
    check_prerequisites
    build_app
    deploy_to_environment "production"
}

# Deploy to staging
deploy_staging() {
    print_header "Deploy to Staging"
    check_prerequisites
    build_app
    deploy_to_environment "staging"
}

# Deploy to production
deploy_production() {
    print_header "Deploy to Production"
    check_prerequisites
    build_app
    deploy_to_environment "production"
}

# Rollback function
rollback() {
    print_header "Rollback Production"
    
    echo "Getting previous revisions..."
    gcloud run revisions list \
        --service=$SERVICE_NAME \
        --region=$REGION \
        --limit=5
    
    echo ""
    read -p "Enter the revision name to rollback to: " revision_name
    
    if [ -z "$revision_name" ]; then
        print_error "No revision name provided"
        exit 1
    fi
    
    echo "Rolling back to revision: $revision_name"
    gcloud run services update-traffic $SERVICE_NAME \
        --to-revisions=$revision_name=100 \
        --region=$REGION
    
    print_success "Rollback completed!"
}

# Show service status
status() {
    print_header "Service Status"
    
    echo "Production Service:"
    gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format="table(metadata.name,status.url,status.conditions[0].type,status.conditions[0].status)"
    
    echo ""
    echo "Staging Service:"
    gcloud run services describe "${SERVICE_NAME}-staging" \
        --region=$REGION \
        --format="table(metadata.name,status.url,status.conditions[0].type,status.conditions[0].status)" 2>/dev/null || echo "Staging service not found"
}

# Show logs
logs() {
    local env=${1:-production}
    local service_suffix=""
    
    if [ "$env" = "staging" ]; then
        service_suffix="-staging"
    fi
    
    print_header "Viewing ${env^} Logs"
    gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=${SERVICE_NAME}${service_suffix}" \
        --limit=50 \
        --format='table(timestamp,severity,textPayload)'
}

# Show help
show_help() {
    echo -e "${BLUE}TechPartner Platform - Easy Deployment Script${NC}"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  deploy           Quick deploy to production (build + deploy)"
    echo "  staging          Deploy to staging environment"
    echo "  production       Deploy to production environment"
    echo "  build            Build the application only"
    echo "  rollback         Rollback production to a previous revision"
    echo "  status           Show service status"
    echo "  logs [env]       Show logs (env: production|staging)"
    echo "  check            Check prerequisites only"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy        # Quick deploy to production"
    echo "  $0 staging       # Deploy to staging"
    echo "  $0 logs staging  # View staging logs"
    echo "  $0 rollback      # Rollback production"
}

# Main script logic
case "${1:-help}" in
    "deploy")
        quick_deploy
        ;;
    "staging")
        deploy_staging
        ;;
    "production")
        deploy_production
        ;;
    "build")
        check_prerequisites
        build_app
        ;;
    "rollback")
        rollback
        ;;
    "status")
        status
        ;;
    "logs")
        logs $2
        ;;
    "check")
        check_prerequisites
        ;;
    "help"|*)
        show_help
        ;;
esac
