# 🔐 Google Cloud Permissions Setup Required

## Current Issue
The service account `replit-deployer@glossy-agency-448211-s4.iam.gserviceaccount.com` needs additional permissions to deploy to App Engine.

## Required Steps (To be done in Google Cloud Console)

### 1. Grant App Engine Permissions
Go to [Google Cloud Console IAM](https://console.cloud.google.com/iam-admin/iam?project=glossy-agency-448211-s4)

Find the service account: `replit-deployer@glossy-agency-448211-s4.iam.gserviceaccount.com`

Add these roles:
- ✅ **App Engine Admin** (`roles/appengine.appAdmin`)
- ✅ **App Engine Deployer** (`roles/appengine.deployer`) 
- ✅ **Cloud Build Editor** (`roles/cloudbuild.builds.editor`)
- ✅ **Storage Admin** (`roles/storage.admin`)

### 2. Enable APIs
Ensure these APIs are enabled:
```bash
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Create App Engine Application (if needed)
```bash
gcloud app create --region=us-central1
```

## Alternative: Cloud Run Deployment

If App Engine permissions are difficult to obtain, we can deploy to Cloud Run instead:

### Cloud Run Permissions Needed:
- ✅ **Cloud Run Admin** (`roles/run.admin`)
- ✅ **Cloud Build Editor** (`roles/cloudbuild.builds.editor`)
- ✅ **Storage Admin** (`roles/storage.admin`)

### Deploy to Cloud Run:
```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/glossy-agency-448211-s4/techpartner .
gcloud run deploy techpartner \
  --image gcr.io/glossy-agency-448211-s4/techpartner \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,DATABASE_URL=postgresql://techpartner_user:TechPartner2025!@db.techpartner.cloud:5432/techpartner_db,SESSION_SECRET=TechPartnerSecureSessionKey2025MinimumLength32Characters"
```

## Ready for Deployment

Once permissions are granted, we can deploy with:
```bash
# For App Engine:
gcloud app deploy app.yaml --quiet

# For Cloud Run:
gcloud builds submit --tag gcr.io/glossy-agency-448211-s4/techpartner .
gcloud run deploy techpartner --image gcr.io/glossy-agency-448211-s4/techpartner --platform managed --region us-central1 --allow-unauthenticated
```

## Current Status
- ✅ Google Cloud CLI authenticated
- ✅ Project configured: `glossy-agency-448211-s4`
- ✅ Service account active
- ✅ Application build-ready
- ⏳ **Waiting for App Engine permissions**

The TechPartner platform is fully prepared for deployment once the service account has the required permissions.