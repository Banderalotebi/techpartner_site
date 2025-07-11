#!/bin/bash

echo "🚀 Deploying TechPartner Platform to Google Cloud App Engine"
echo "========================================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
fi

# Check if app.yaml exists
if [ ! -f "app.yaml" ]; then
    echo "❌ app.yaml not found. Please create it first."
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to App Engine
echo "🚀 Deploying to Google Cloud App Engine..."
gcloud app deploy app.yaml --quiet

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live at:"
    gcloud app browse
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi