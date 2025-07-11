#!/bin/bash

# Quick Cloud Permission Fix Script
echo "🔧 Attempting to grant necessary permissions..."

PROJECT_ID="glossy-agency-448211-s4"
SERVICE_ACCOUNT="replit-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Project: $PROJECT_ID"
echo "Service Account: $SERVICE_ACCOUNT"

# Try to grant compute permissions
echo "Granting Compute Engine permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/compute.admin" || echo "❌ Failed to grant compute.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/compute.networkAdmin" || echo "❌ Failed to grant network admin"

# Try to enable required APIs
echo "Enabling required APIs..."
gcloud services enable compute.googleapis.com || echo "❌ Failed to enable Compute API"
gcloud services enable cloudbuild.googleapis.com || echo "❌ Failed to enable Cloud Build API"

echo "✅ Permission setup attempt complete!"
echo "If errors occurred, manual permission grant is required."