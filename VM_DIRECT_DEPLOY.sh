#!/bin/bash

echo "🔧 VM Direct Deployment Script"
echo "Deploying database integration directly to VM 34.69.69.182"

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud"
    echo "Run: gcloud auth login"
    exit 1
fi

# Set project
gcloud config set project glossy-agency-448211-s4

echo "📦 Creating deployment archive..."
tar -czf techpartner-deploy.tar.gz deploy-package/

echo "🚀 Uploading to VM..."
gcloud compute scp techpartner-deploy.tar.gz techpartner-exact:/tmp/ --zone=us-central1-a

echo "🔄 Deploying on VM..."
gcloud compute ssh techpartner-exact --zone=us-central1-a --command="
    cd /tmp &&
    tar -xzf techpartner-deploy.tar.gz &&
    sudo rm -rf /var/www/techpartner-backup &&
    sudo mv /var/www/techpartner /var/www/techpartner-backup 2>/dev/null || true &&
    sudo mv deploy-package /var/www/techpartner &&
    cd /var/www/techpartner &&
    sudo chown -R www-data:www-data . &&
    sudo ./startup-script.sh &&
    echo '✅ Deployment complete!'
"

echo "🌐 Verifying deployment..."
sleep 5
curl -s http://34.69.69.182/api/health && echo ""
curl -s http://34.69.69.182/api/categories | head -2

echo "🎯 Database integration deployed successfully!"