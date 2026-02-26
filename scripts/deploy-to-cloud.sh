#!/bin/bash

# Google Cloud Deployment Script for TechPartner Platform
# This script deploys your application to Google Cloud Run

set -e

echo "🚀 Deploying TechPartner Platform to Google Cloud..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI (gcloud) is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set variables
PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-glossy-agency-448211-s4}"
REGION="${GOOGLE_CLOUD_REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-techpartner-platform}"

echo "📋 Deployment Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service Name: $SERVICE_NAME"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔌 Enabling Cloud Run API..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Build the application
echo "🔧 Building application..."
npm run build

# Create Cloud Run deployment
echo "☁️ Deploying to Cloud Run..."

# Check if Cloud SQL connection is configured
if [ -n "$GOOGLE_CLOUD_SQL_CONNECTION_NAME" ]; then
    echo "🗄️  Using Cloud SQL connection: $GOOGLE_CLOUD_SQL_CONNECTION_NAME"
    # Set the Cloud SQL database URL for production
    CLOUD_SQL_DATABASE_URL="postgresql://techpartner_user:/MUxsiuMWDUEzxDsC4mqrrFKRoiHSolTu1qqmRc2/70=@//techpartner?host=/cloudsql/glossy-agency-448211-s4:us-central1:techpartner-db&sslmode=require"
    
    gcloud run deploy $SERVICE_NAME \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8080 \
        --memory 1Gi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --set-env-vars NODE_ENV=production,DATABASE_URL="$CLOUD_SQL_DATABASE_URL" \
        --set-cloudsql-instances $GOOGLE_CLOUD_SQL_CONNECTION_NAME
else
    echo "🗄️  No Cloud SQL connection configured, deploying without database connection"
    gcloud run deploy $SERVICE_NAME \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8080 \
        --memory 1Gi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --set-env-vars NODE_ENV=production
fi

echo "✅ Deployment completed!"
echo "🌍 Your application is available at:"
gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)"
