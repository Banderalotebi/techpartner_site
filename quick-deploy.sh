#!/bin/bash

echo "🚀 Quick Deploy to Cloud Run"
echo "Building and deploying TechPartner platform..."

# Build the application
echo "📦 Building application..."
npm run build

# Deploy to Cloud Run with updated image
echo "🌐 Deploying to Cloud Run..."
gcloud run deploy techpartner-site \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,DATABASE_URL=postgresql://techpartner_user:TechPartner2025!@db.techpartner.cloud:5432/techpartner_db,SESSION_SECRET=TechPartnerSecureSessionKey2025MinimumLength32Characters,PORT=8080" \
  --memory=1Gi \
  --cpu=1 \
  --timeout=300 \
  --max-instances=10 \
  --min-instances=1

echo "✅ Deployment complete!"
echo "🌍 Your app is live at: https://techpartner-site-flxd6wf2jq-uc.a.run.app"