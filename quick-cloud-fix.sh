#!/bin/bash

# Quick fix for Google Cloud Run deployment
echo "Building application..."
npm run build

echo "Creating fixed Dockerfile..."
cat > Dockerfile.fixed << 'EOF'
FROM node:20-slim
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY dist/ ./dist/
COPY server/ ./server/

# Install tsx for runtime
RUN npm install -g tsx

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start application with tsx
CMD ["tsx", "server/index.ts"]
EOF

echo "Building Docker image..."
gcloud builds submit --tag gcr.io/glossy-agency-448211-s4/techpartner:quick-fix

echo "Deploying to Cloud Run..."
gcloud run deploy techpartner-site \
  --image gcr.io/glossy-agency-448211-s4/techpartner:quick-fix \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port=8080 \
  --set-env-vars="NODE_ENV=production,PORT=8080"

echo "Testing deployment..."
sleep 10
curl "https://techpartner-site-flxd6wf2jq-uc.a.run.app/api/health"