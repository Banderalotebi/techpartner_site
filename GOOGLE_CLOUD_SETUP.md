# Google Cloud Setup Guide

This guide will help you set up Google Cloud SQL (PostgreSQL) and Google Cloud Storage for your TechPartner platform.

## Prerequisites

1. **Google Cloud Account**: Make sure you have a Google Cloud account
2. **Google Cloud CLI**: Install the `gcloud` command-line tool
3. **Project Access**: Ensure you have owner/editor access to the project `glossy-agency-448211-s4`

## Quick Setup (Automated)

Run the automated setup script:

```bash
./scripts/setup-google-cloud.sh
```

This script will:
- ✅ Enable required Google Cloud APIs
- ✅ Create a Cloud SQL PostgreSQL instance
- ✅ Create a database and user
- ✅ Create a Cloud Storage bucket
- ✅ Set up service account with proper permissions
- ✅ Generate service account credentials
- ✅ Update your environment configuration

## Manual Setup (Step by Step)

### 1. Enable APIs

```bash
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage-api.googleapis.com
```

### 2. Create Cloud SQL Instance

```bash
gcloud sql instances create techpartner-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --storage-type=SSD \
    --storage-size=10GB \
    --backup
```

### 3. Create Database and User

```bash
# Create database
gcloud sql databases create techpartner --instance=techpartner-db

# Create user (replace YOUR_PASSWORD with a secure password)
gcloud sql users create techpartner_user \
    --instance=techpartner-db \
    --password=YOUR_PASSWORD
```

### 4. Create Storage Bucket

```bash
gsutil mb -l us-central1 gs://techpartner-site-storage
gsutil iam ch allUsers:objectViewer gs://techpartner-site-storage
```

### 5. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create techpartner-app \
    --display-name="TechPartner Application"

# Grant permissions
gcloud projects add-iam-policy-binding glossy-agency-448211-s4 \
    --member="serviceAccount:techpartner-app@glossy-agency-448211-s4.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding glossy-agency-448211-s4 \
    --member="serviceAccount:techpartner-app@glossy-agency-448211-s4.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"

# Create key file
gcloud iam service-accounts keys create google-cloud-service-account-key.json \
    --iam-account=techpartner-app@glossy-agency-448211-s4.iam.gserviceaccount.com
```

## Environment Configuration

Update your `.env` file with the following:

```env
# Database URL (replace with your actual credentials)
DATABASE_URL=postgresql://techpartner_user:YOUR_PASSWORD@/techpartner?host=/cloudsql/glossy-agency-448211-s4:us-central1:techpartner-db&sslmode=require

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=glossy-agency-448211-s4
GOOGLE_CLOUD_STORAGE_BUCKET=techpartner-site-storage
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-service-account-key.json
GOOGLE_CLOUD_SQL_CONNECTION_NAME=glossy-agency-448211-s4:us-central1:techpartner-db
```

## Database Schema Setup

After setting up the database, create the tables:

```bash
npm run db:push
```

## API Endpoints

Your application now has these new endpoints:

### File Upload
```http
POST /api/cloud/upload
Content-Type: application/json

{
  "fileName": "example.jpg",
  "fileData": "base64_encoded_file_data",
  "contentType": "image/jpeg"
}
```

### List Files
```http
GET /api/cloud/files?prefix=uploads/
```

### Delete File
```http
DELETE /api/cloud/files/example.jpg
```

### Database Backup
```http
POST /api/cloud/backup
```

## Local Development vs Production

### Local Development
- Uses SQLite database (default)
- Files stored locally
- No Google Cloud services required

### Production
- Uses Google Cloud SQL (PostgreSQL)
- Files stored in Google Cloud Storage
- Requires service account credentials

## Testing the Setup

1. Start your development server:
```bash
npm run dev
```

2. Check the logs for Google Cloud initialization messages:
   - ✅ "Google Cloud services initialized" = Success
   - ⚠️ "Google Cloud services not available" = Using local fallback

3. Test file upload via the admin dashboard or API

## Cost Considerations

**Cloud SQL (db-f1-micro):**
- ~$7-10/month for basic usage
- Includes automated backups
- Can be paused when not in use

**Cloud Storage:**
- $0.020 per GB per month
- $0.005 per 1,000 operations
- Very cost-effective for small to medium usage

**Free Tier Benefits:**
- 30GB of storage per month (free)
- Some SQL usage included in free tier

## Backup and Recovery

### Automated Backups
- Cloud SQL automatically backs up daily
- 7-day retention by default

### Manual Backup
```bash
# Via API
curl -X POST http://localhost:3000/api/cloud/backup

# Via gcloud
gcloud sql export sql techpartner-db gs://techpartner-site-storage/manual-backup.sql \
    --database=techpartner
```

### Restore from Backup
```bash
gcloud sql import sql techpartner-db gs://techpartner-site-storage/backup-file.sql \
    --database=techpartner
```

## Monitoring

### Check Instance Status
```bash
gcloud sql instances describe techpartner-db
```

### View Logs
```bash
gcloud sql operations list --instance=techpartner-db
```

### Storage Usage
```bash
gsutil du -sh gs://techpartner-site-storage
```

## Security Best Practices

1. **Service Account Key**: Never commit the JSON key file to version control
2. **Database Password**: Use strong, randomly generated passwords
3. **IAM Permissions**: Grant minimum required permissions only
4. **SSL**: Always use SSL connections in production
5. **VPC**: Consider using VPC for additional network security

## Troubleshooting

### Common Issues

**"Cannot connect to database"**
- Check if Cloud SQL instance is running
- Verify connection string format
- Ensure service account has Cloud SQL Client role

**"Storage bucket not found"**
- Verify bucket exists: `gsutil ls gs://techpartner-site-storage`
- Check service account has Storage Object Admin role

**"Service account authentication failed"**
- Ensure JSON key file exists and path is correct
- Verify GOOGLE_APPLICATION_CREDENTIALS environment variable

### Useful Commands

```bash
# Test database connection
gcloud sql connect techpartner-db --user=techpartner_user --database=techpartner

# Check bucket permissions
gsutil iam get gs://techpartner-site-storage

# View service account details
gcloud iam service-accounts describe techpartner-app@glossy-agency-448211-s4.iam.gserviceaccount.com

# Monitor SQL operations
gcloud sql operations list --instance=techpartner-db --limit=10
```

## Support

If you encounter issues:

1. Check the application logs for error details
2. Verify all environment variables are set correctly
3. Ensure Google Cloud APIs are enabled
4. Confirm service account permissions are correct

For Google Cloud specific issues, refer to the [Google Cloud Documentation](https://cloud.google.com/docs).
