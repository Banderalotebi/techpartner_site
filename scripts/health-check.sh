#!/bin/bash

# 🔍 TechPartner Platform - Health Check Script
# ==============================================

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PRODUCTION_URL="https://techpartner-site-flxd6wf2jq-uc.a.run.app"
STAGING_URL="https://techpartner-site-staging-flxd6wf2jq-uc.a.run.app"

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

# Check service health
check_service() {
    local url=$1
    local name=$2
    
    echo "Checking $name..."
    
    # Test main endpoint
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    if [ "$status" = "200" ]; then
        print_success "$name is responding (HTTP $status)"
    else
        print_error "$name is not responding (HTTP $status)"
        return 1
    fi
    
    # Test health endpoint if exists
    local health_status=$(curl -s -o /dev/null -w "%{http_code}" "$url/health" || echo "000")
    if [ "$health_status" = "200" ]; then
        print_success "$name health check passed"
    else
        print_warning "$name health endpoint not available"
    fi
    
    # Test response time
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "$url")
    echo "Response time: ${response_time}s"
    
    return 0
}

# Main health check
main() {
    print_header "TechPartner Platform Health Check"
    
    local all_good=true
    
    echo "Checking production environment..."
    if ! check_service "$PRODUCTION_URL" "Production"; then
        all_good=false
    fi
    
    echo ""
    echo "Checking staging environment..."
    if ! check_service "$STAGING_URL" "Staging"; then
        print_warning "Staging check failed (this might be expected if staging is not deployed)"
    fi
    
    echo ""
    if [ "$all_good" = true ]; then
        print_success "All systems operational!"
    else
        print_error "Some systems are down!"
        exit 1
    fi
}

main "$@"
