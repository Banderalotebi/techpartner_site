# Google Cloud Database Integration

Setting up Google Cloud SQL PostgreSQL for TechPartner platform:

## Step 1: Create Cloud SQL Instance
```bash
# Create PostgreSQL instance
gcloud sql instances create techpartner-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --storage-type=SSD \
    --storage-size=10GB \
    --authorized-networks=0.0.0.0/0

# Create database
gcloud sql databases create techpartner --instance=techpartner-db

# Create user
gcloud sql users create techpartner-user \
    --instance=techpartner-db \
    --password=your-secure-password
```

## Step 2: Get Connection String
```bash
# Get connection info
gcloud sql instances describe techpartner-db

# Connection string format:
# postgresql://techpartner-user:your-secure-password@INSTANCE_IP:5432/techpartner
```

## Step 3: Update Server Configuration
```bash
cd /opt/techpartner

# Start with Google Cloud SQL
NODE_ENV=development DATABASE_URL="postgresql://techpartner-user:your-secure-password@GOOGLE_SQL_IP:5432/techpartner" pm2 start server/index.ts --name "techpartner-database" --interpreter tsx
```

## Benefits of Google Cloud SQL:
- Better integration with your VM
- Automatic backups
- High availability
- Better performance in same region
- Integrated with Google Cloud console