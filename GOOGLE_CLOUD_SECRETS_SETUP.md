# Google Cloud Secret Manager Setup Guide

This guide shows how to securely manage secrets for the TechPartner platform using Google Cloud Secret Manager.

## Prerequisites

1. Google Cloud Project created
2. Secret Manager API enabled
3. Service account with Secret Manager permissions

## 1. Enable Secret Manager API

```bash
gcloud services enable secretmanager.googleapis.com
```

## 2. Create Secrets

### JWT Secret
```bash
# Generate a strong JWT secret
openssl rand -base64 32 | gcloud secrets create JWT_SECRET \
  --replication-policy="automatic" \
  --data-file=-
```

### Session Secret
```bash
# Generate a strong session secret
openssl rand -base64 32 | gcloud secrets create SESSION_SECRET \
  --replication-policy="automatic" \
  --data-file=-
```

### Tap Payment Secret
```bash
# Add your live Tap secret key (replace with actual key)
echo -n "sk_live_YOUR_LIVE_TAP_SECRET_KEY" | \
gcloud secrets create TAP_SECRET_KEY \
  --replication-policy="automatic" \
  --data-file=-
```

### Admin Token
```bash
# Generate a secure admin token
openssl rand -base64 32 | gcloud secrets create ADMIN_TOKEN \
  --replication-policy="automatic" \
  --data-file=-
```

### Database URL (if using external database)
```bash
echo -n "postgresql://user:password@host:5432/database" | \
gcloud secrets create DATABASE_URL \
  --replication-policy="automatic" \
  --data-file=-
```

## 3. Grant Service Account Access

Replace `YOUR_SERVICE_ACCOUNT_EMAIL` with your actual service account email:

```bash
# Grant access to all secrets
for secret in JWT_SECRET SESSION_SECRET TAP_SECRET_KEY ADMIN_TOKEN DATABASE_URL; do
  gcloud secrets add-iam-policy-binding $secret \
    --member="serviceAccount:YOUR_SERVICE_ACCOUNT_EMAIL" \
    --role="roles/secretmanager.secretAccessor"
done
```

## 4. Environment Variables for Cloud Run

Set these environment variables in your Cloud Run service:

```bash
gcloud run services update YOUR_SERVICE_NAME \
  --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=YOUR_PROJECT_ID" \
  --region=YOUR_REGION
```

## 5. Local Development

For local development, use the `.env` file with test keys:

```env
NODE_ENV=development
JWT_SECRET=dev-jwt-secret-change-in-production
SESSION_SECRET=dev-session-secret-change-in-production
TAP_SECRET_KEY=sk_test_YOUR_TEST_KEY
ADMIN_TOKEN=admin123
```

## 6. Verify Secret Access

Test that your application can access secrets:

```bash
# Test in Cloud Shell or local with gcloud auth
node -e "
const { Secrets } = require('./server/config/secrets');
(async () => {
  const jwt = await Secrets.getJwtSecret();
  console.log('JWT Secret available:', !!jwt);
})();
"
```

## Security Best Practices

1. **Never commit real secrets to git**
2. **Use test keys for development**
3. **Rotate secrets regularly**
4. **Use least privilege access**
5. **Monitor secret access logs**
6. **Use different secrets for each environment**

## Troubleshooting

### Secret not found error
- Verify secret exists: `gcloud secrets list`
- Check permissions: `gcloud secrets get-iam-policy SECRET_NAME`
- Verify service account has access

### Authentication error
- Ensure `GOOGLE_CLOUD_PROJECT_ID` is set
- Check service account key is properly configured
- In Cloud Run, authentication is automatic
