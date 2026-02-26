# Google Cloud Integration - Usage Examples

Your TechPartner platform now includes Google Cloud integration! Here's how to use it:

## Current Status

✅ **Local Development (Current)**: 
- Uses PostgreSQL database (Neon)
- Files stored locally
- Drizzle ORM for database operations

🌍 **Production (When Configured)**:
- Uses Google Cloud SQL PostgreSQL
- Files stored in Google Cloud Storage
- Automated backups

## Quick Start with Google Cloud

### 1. Run the Setup Script

```bash
./scripts/setup-google-cloud.sh
```

This will create:
- ✅ PostgreSQL database instance
- ✅ Storage bucket for files
- ✅ Service account with proper permissions
- ✅ Authentication credentials

### 2. Update Environment

After running the setup, update your `.env` file:

```env
# Add these from .env.cloud (created by setup script)
DATABASE_URL=postgresql://username:password@/database?host=/cloudsql/project:region:instance&sslmode=require
GOOGLE_CLOUD_STORAGE_BUCKET=techpartner-site-storage
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-service-account-key.json
```

### 3. Initialize Database Schema

```bash
npm run db:push
```

## New Features Available

### 1. Cloud Storage Manager (Admin Dashboard)

Access via: Admin Dashboard → Cloud Tab

Features:
- 📤 Upload files to Google Cloud Storage
- 📋 List all stored files
- 🗑️ Delete files
- 💾 Database backup to cloud storage
- 🔗 Get public URLs for files

### 2. API Endpoints

#### Upload File
```http
POST /api/cloud/upload
Content-Type: application/json

{
  "fileName": "document.pdf",
  "fileData": "base64_encoded_data",
  "contentType": "application/pdf"
}
```

#### List Files
```http
GET /api/cloud/files
```

#### Delete File
```http
DELETE /api/cloud/files/document.pdf
```

#### Backup Database
```http
POST /api/cloud/backup
```

## Cost Estimation

**Monthly costs for small business usage:**

- **Cloud SQL (db-f1-micro)**: ~$7-10/month
- **Cloud Storage**: ~$0.50-2/month (depending on usage)
- **Total**: ~$8-12/month

**Free tier includes:**
- 30GB storage per month (free)
- Some database usage (free)

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Database | PostgreSQL (Neon) | PostgreSQL (Cloud SQL) |
| File Storage | Local filesystem | Google Cloud Storage |
| Backups | Manual | Automated + Cloud |
| Scalability | Single machine | Auto-scaling |
| Cost | ~$0-5/month (Neon free tier) | ~$8-12/month |

## Testing the Integration

1. **Without Google Cloud** (current):
   - Everything works normally
   - Uses Neon PostgreSQL database
   - Files stored locally
   - Low cost (Neon free tier)

2. **With Google Cloud** (after setup):
   - Same functionality
   - Data stored in cloud
   - Accessible from anywhere
   - Automatic backups

## Next Steps

1. **Continue Development**: No changes needed, everything works locally
2. **When Ready for Production**: Run `./scripts/setup-google-cloud.sh`
3. **Deploy to Cloud**: Use the included deployment scripts

## Support

- 📖 Full documentation: `GOOGLE_CLOUD_SETUP.md`
- 🛠️ Setup script: `./scripts/setup-google-cloud.sh`
- 🆘 Issues: Check server logs for detailed error messages

The beauty of this integration is that it's **completely optional** - your app works perfectly without Google Cloud, but scales seamlessly when you're ready!
