#!/bin/bash

echo "🔧 Alternative Deployment: Direct Cloud Build Trigger"
echo "Bypassing Git issues using Google Cloud Build manual trigger"

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud"
    echo "Run: gcloud auth login"
    exit 1
fi

# Set project
gcloud config set project glossy-agency-448211-s4

echo "🚀 Triggering Cloud Build manually..."
gcloud builds submit --config=cloudbuild.yaml .

echo "🌐 Manual Cloud Build triggered successfully!"
echo "⏰ Build takes 3-5 minutes"  
echo "📊 Monitor build: https://console.cloud.google.com/cloud-build/builds"
echo "🎯 Platform: http://34.69.69.182"