# 🔐 Google Cloud Permission Setup Guide

## Current Issue
The service account `replit-deployer@glossy-agency-448211-s4.iam.gserviceaccount.com` lacks the necessary permissions for VM deployment.

## Required Permissions for VM Deployment

### Go to Google Cloud Console:
1. Visit: https://console.cloud.google.com/iam-admin/iam?project=glossy-agency-448211-s4
2. Find the service account: `replit-deployer@glossy-agency-448211-s4.iam.gserviceaccount.com`
3. Click "Edit" (pencil icon)

### Add These Roles:
- **Compute Engine Admin** (`roles/compute.admin`)
- **Compute Network Admin** (`roles/compute.networkAdmin`) 
- **Service Account User** (`roles/iam.serviceAccountUser`)
- **Cloud Build Editor** (`roles/cloudbuild.builds.editor`)

### Alternative: Quick Grant Commands
If you have gcloud access with owner permissions:

```bash
# Grant VM creation permissions
gcloud projects add-iam-policy-binding glossy-agency-448211-s4 \
  --member="serviceAccount:replit-deployer@glossy-agency-448211-s4.iam.gserviceaccount.com" \
  --role="roles/compute.admin"

gcloud projects add-iam-policy-binding glossy-agency-448211-s4 \
  --member="serviceAccount:replit-deployer@glossy-agency-448211-s4.iam.gserviceaccount.com" \
  --role="roles/compute.networkAdmin"
```

## After Granting Permissions

Once permissions are granted, I can:
1. Create the VM instance
2. Set up firewall rules
3. Deploy your TechPartner platform
4. Configure nginx and SSL
5. Provide the live URL

## Alternative: Immediate Deployment

**Replit Deploy** remains the fastest option - click the Deploy button for instant deployment while we resolve Google Cloud permissions separately.

Your platform is production-ready and waiting for deployment!