#!/bin/bash

# TechPartner Platform - Development & Production Scripts
# Implements middleware best practices to prevent ERR_EMPTY_RESPONSE

echo "🚀 TechPartner Platform - Environment Setup"
echo "=============================================="

# Function to check if server is running
check_server() {
    curl -s http://localhost:3000/api/health > /dev/null
    return $?
}

# Development Mode
dev_mode() {
    echo "🔧 Starting DEVELOPMENT mode..."
    echo "- Uses Vite middleware for hot reload"
    echo "- Transforms HTML on every request"
    echo "- Slower but with live updates"
    echo ""
    NODE_ENV=development npm run dev
}

# Production Mode (Recommended)
prod_mode() {
    echo "🏗️  Building client for PRODUCTION..."
    echo "- Building optimized static assets"
    echo "- Bundling for fast serving"
    echo ""
    
    cd client
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
        echo ""
        echo "🚀 Starting PRODUCTION mode..."
        echo "- Serves pre-built static files"
        echo "- Fast response times"
        echo "- No middleware conflicts"
        echo ""
        cd ..
        NODE_ENV=production npm run start
    else
        echo "❌ Build failed!"
        exit 1
    fi
}

# Check current status
status_check() {
    echo "📊 Server Status Check"
    echo "====================="
    
    if check_server; then
        echo "✅ Server is running"
        echo "📍 Health check: $(curl -s http://localhost:3000/api/health)"
        echo "🌐 Frontend: http://localhost:3000"
        echo "📡 API Base: http://localhost:3000/api"
    else
        echo "❌ Server is not running"
        echo "Run './scripts/server.sh dev' or './scripts/server.sh prod'"
    fi
}

# Main script logic
case "$1" in
    "dev")
        dev_mode
        ;;
    "prod")
        prod_mode
        ;;
    "status")
        status_check
        ;;
    *)
        echo "Usage: $0 {dev|prod|status}"
        echo ""
        echo "Commands:"
        echo "  dev    - Start development server (Vite middleware)"
        echo "  prod   - Build & start production server (static files)"
        echo "  status - Check if server is running"
        echo ""
        echo "Best Practices Implemented:"
        echo "  ✅ Single catch-all route per environment"
        echo "  ✅ Conditional middleware registration"
        echo "  ✅ Request logging in development"
        echo "  ✅ Proper error handling"
        echo "  ✅ API route protection"
        echo ""
        exit 1
        ;;
esac
