#!/bin/bash

# Google Cloud Setup Script for TechPartner Platform
# This script sets up the required Google Cloud resources

set -e  # Exit on any error

echo "🌍 Setting up Google Cloud resources for TechPartner Platform..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI (gcloud) is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set variables
PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-glossy-agency-448211-s4}"
REGION="${GOOGLE_CLOUD_REGION:-us-central1}"
ZONE="${GOOGLE_CLOUD_ZONE:-us-central1-a}"
DB_INSTANCE_NAME="${DB_INSTANCE_NAME:-techpartner-db}"
DB_NAME="${DB_NAME:-techpartner}"
DB_USER="${DB_USER:-techpartner_user}"
STORAGE_BUCKET="${STORAGE_BUCKET:-techpartner-site-storage}"

echo "📋 Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Zone: $ZONE"
echo "  Database Instance: $DB_INSTANCE_NAME"
echo "  Database Name: $DB_NAME"
echo "  Storage Bucket: $STORAGE_BUCKET"
echo ""

# Set the project
echo "🔧 Setting Google Cloud project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔌 Enabling required Google Cloud APIs..."
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage-api.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# Create Cloud SQL instance (PostgreSQL)
echo "🗄️ Creating Cloud SQL PostgreSQL instance..."
if gcloud sql instances describe $DB_INSTANCE_NAME --quiet >/dev/null 2>&1; then
    echo "  ✅ Database instance '$DB_INSTANCE_NAME' already exists"
else
    echo "  📝 Creating new database instance..."
    gcloud sql instances create $DB_INSTANCE_NAME \
        --database-version=POSTGRES_14 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-type=SSD \
        --storage-size=10GB \
        --backup \
        --backup-start-time=02:00 \
        --maintenance-window-day=SUN \
        --maintenance-window-hour=03 \
        --maintenance-release-channel=production
    
    echo "  ✅ Database instance created successfully"
fi

# Create database
echo "🗃️ Creating database..."
if gcloud sql databases describe $DB_NAME --instance=$DB_INSTANCE_NAME --quiet >/dev/null 2>&1; then
    echo "  ✅ Database '$DB_NAME' already exists"
else
    gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE_NAME
    echo "  ✅ Database created successfully"
fi

# Create database user
echo "👤 Creating database user..."
if gcloud sql users describe $DB_USER --instance=$DB_INSTANCE_NAME --quiet >/dev/null 2>&1; then
    echo "  ✅ User '$DB_USER' already exists"
else
    # Generate a random password
    DB_PASSWORD=$(openssl rand -base64 32)
    
    gcloud sql users create $DB_USER \
        --instance=$DB_INSTANCE_NAME \
        --password=$DB_PASSWORD
    
    echo "  ✅ Database user created"
    echo "  📝 Database credentials:"
    echo "      Username: $DB_USER"
    echo "      Password: $DB_PASSWORD"
    echo "  ⚠️  Save these credentials securely!"
    
    # Save credentials to a secure file
    echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@//$DB_NAME?host=/cloudsql/$PROJECT_ID:$REGION:$DB_INSTANCE_NAME&sslmode=require" > .env.cloud
    echo "GOOGLE_CLOUD_SQL_CONNECTION_NAME=$PROJECT_ID:$REGION:$DB_INSTANCE_NAME" >> .env.cloud
    echo "  💾 Database URL saved to .env.cloud"
fi

# Create Cloud Storage bucket
echo "🪣 Creating Cloud Storage bucket..."
if gsutil ls -b gs://$STORAGE_BUCKET >/dev/null 2>&1; then
    echo "  ✅ Storage bucket '$STORAGE_BUCKET' already exists"
else
    gsutil mb -l $REGION gs://$STORAGE_BUCKET
    
    # Set bucket permissions for public read access to uploaded files
    gsutil iam ch allUsers:objectViewer gs://$STORAGE_BUCKET
    
    echo "  ✅ Storage bucket created successfully"
fi

# Create service account for application
echo "🔑 Creating service account..."
SERVICE_ACCOUNT_NAME="techpartner-app"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"

if gcloud iam service-accounts describe $SERVICE_ACCOUNT_EMAIL --quiet >/dev/null 2>&1; then
    echo "  ✅ Service account already exists"
else
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
        --display-name="TechPartner Application Service Account" \
        --description="Service account for TechPartner platform"
    
    echo "  ✅ Service account created"
fi

# Grant necessary permissions
echo "🔐 Setting up permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.objectAdmin"

# Create and download service account key
echo "🗝️ Creating service account key..."
KEY_FILE="google-cloud-service-account-key.json"
if [ -f "$KEY_FILE" ]; then
    echo "  ⚠️  Service account key file already exists, skipping..."
else
    gcloud iam service-accounts keys create $KEY_FILE \
        --iam-account=$SERVICE_ACCOUNT_EMAIL
    
    echo "  ✅ Service account key created: $KEY_FILE"
    echo "  ⚠️  Keep this file secure and never commit it to version control!"
fi

# Update environment file
echo "📝 Updating environment configuration..."
{
    echo ""
    echo "# Google Cloud Configuration"
    echo "GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID"
    echo "GOOGLE_CLOUD_STORAGE_BUCKET=$STORAGE_BUCKET"
    echo "GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-service-account-key.json"
    echo "GOOGLE_CLOUD_SQL_CONNECTION_NAME=$PROJECT_ID:$REGION:$DB_INSTANCE_NAME"
} >> .env

echo "  ✅ Environment variables added to .env"

# Display summary
echo ""
echo "🎉 Google Cloud setup completed successfully!"
echo ""
echo "📋 Resources created:"
echo "  ✅ Cloud SQL PostgreSQL instance: $DB_INSTANCE_NAME"
echo "  ✅ Database: $DB_NAME"
echo "  ✅ Storage bucket: gs://$STORAGE_BUCKET"
echo "  ✅ Service account: $SERVICE_ACCOUNT_EMAIL"
echo "  ✅ Service account key: $KEY_FILE"
echo ""
echo "🔧 Next steps:"
echo "  1. Update your .env file with the database URL from .env.cloud"
echo "  2. Run 'npm run db:push' to create database tables"
echo "  3. Test the connection by running 'npm run dev'"
echo ""
echo "💡 Useful commands:"
echo "  gcloud sql connect $DB_INSTANCE_NAME --user=$DB_USER --database=$DB_NAME"
echo "  gsutil ls gs://$STORAGE_BUCKET"
echo "  gcloud sql instances describe $DB_INSTANCE_NAME"
echo ""
