# Google Cloud App Engine Deployment Guide

## Prerequisites

1. **Google Cloud CLI installed**: Download from [cloud.google.com/sdk](https://cloud.google.com/sdk)
2. **Google Cloud Project**: Create a project in Google Cloud Console
3. **App Engine enabled**: Enable App Engine in your project
4. **Database**: Set up a Cloud SQL PostgreSQL instance or use external database

## Environment Setup

### 1. Set your environment variables in `app.yaml`:

```yaml
env_variables:
  NODE_ENV: production
  DATABASE_URL: "postgresql://username:password@host:port/database"
  SESSION_SECRET: "your-secure-session-secret-here"
```

### 2. Database Options:

**Option A: Google Cloud SQL (Recommended)**
```bash
# Create Cloud SQL instance
gcloud sql instances create techpartner-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1

# Create database
gcloud sql databases create techpartner --instance=techpartner-db

# Get connection string
gcloud sql instances describe techpartner-db
```

**Option B: External Database (Neon, Supabase, etc.)**
- Use your existing DATABASE_URL
- Ensure the database is accessible from Google Cloud

## Deployment Steps

### 1. Authenticate with Google Cloud
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Build the application
```bash
npm run build
```

### 3. Deploy to App Engine
```bash
gcloud app deploy app.yaml --quiet
```

### 4. View your deployed app
```bash
gcloud app browse
```

## Production Configuration

### Security Considerations:
- Use Google Secret Manager for sensitive data
- Enable HTTPS (automatically handled by App Engine)
- Configure proper CORS settings
- Set up monitoring and logging

### Performance Optimizations:
- Enable automatic scaling
- Configure CPU and memory limits
- Use CDN for static assets
- Enable compression

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are production-ready
   - Review build logs for errors

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database credentials are correct

3. **Memory/CPU Limits**
   - Adjust instance class in app.yaml
   - Monitor performance metrics
   - Optimize application code

### Debug Commands:
```bash
# View logs
gcloud app logs tail -s default

# Check app status
gcloud app instances list

# View app versions
gcloud app versions list
```

## Cost Optimization

- Use automatic scaling with appropriate min/max instances
- Set up billing alerts
- Monitor usage with Cloud Monitoring
- Consider regional deployment for better performance

## Maintenance

### Regular Tasks:
- Monitor application logs
- Update dependencies
- Backup database regularly
- Review security settings
- Monitor performance metrics