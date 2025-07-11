# Google Cloud Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Google Cloud CLI Setup
- [ ] Install Google Cloud CLI
- [ ] Run `gcloud auth login`
- [ ] Set project: `gcloud config set project YOUR_PROJECT_ID`
- [ ] Enable App Engine: `gcloud app create --region=us-central`

### 2. Database Configuration
- [ ] Set up PostgreSQL database (Cloud SQL or external)
- [ ] Update `DATABASE_URL` in `app.yaml`
- [ ] Test database connection

### 3. Environment Variables
- [ ] Update `app.yaml` with your values:
  ```yaml
  env_variables:
    DATABASE_URL: "your_actual_database_url"
    SESSION_SECRET: "your_secure_session_secret_32_chars_minimum"
  ```

## 🚀 Deployment Commands

### Quick Deployment
```bash
# 1. Build the application
npm run build

# 2. Deploy to App Engine
gcloud app deploy app.yaml --quiet

# 3. View your live app
gcloud app browse
```

### Alternative: Using the deploy script
```bash
./deploy.sh
```

## 🔧 Configuration Files Created

- ✅ `app.yaml` - App Engine configuration
- ✅ `.gcloudignore` - Files to exclude from deployment
- ✅ `deploy.sh` - Deployment script
- ✅ `cloudbuild.yaml` - Cloud Build configuration (optional)
- ✅ Health check endpoint at `/api/health`

## 📊 Monitoring & Troubleshooting

### View Logs
```bash
gcloud app logs tail -s default
```

### Check App Status
```bash
gcloud app instances list
gcloud app versions list
```

### Performance Monitoring
- Monitor in Google Cloud Console
- Set up alerts for performance issues
- Review cost and scaling metrics

## 🔒 Security Considerations

- ✅ HTTPS automatically enabled
- ✅ Health checks configured
- ✅ Production environment variables
- [ ] Set up monitoring alerts
- [ ] Configure backup strategy
- [ ] Review security settings

## 💰 Cost Optimization

- ✅ Automatic scaling configured
- ✅ Minimum 1 instance, maximum 10
- [ ] Set up billing alerts
- [ ] Monitor usage patterns
- [ ] Optimize for your traffic needs

## 🎯 Post-Deployment Testing

- [ ] Test all main features
- [ ] Verify admin dashboard functionality
- [ ] Test questionnaire flows
- [ ] Check payment processing (if enabled)
- [ ] Verify database operations
- [ ] Test performance under load

## 📋 Maintenance Tasks

### Regular Monitoring
- [ ] Check application logs weekly
- [ ] Monitor performance metrics
- [ ] Review scaling patterns
- [ ] Update dependencies monthly

### Backup Strategy
- [ ] Database backups automated
- [ ] Application code in version control
- [ ] Configuration backups
- [ ] Recovery procedure documented