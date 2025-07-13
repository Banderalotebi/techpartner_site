# Google Cloud Database Quickstart

## Option 1: Quick Setup with Existing VM
```bash
# On your VM, install Cloud SQL Proxy
cd /opt/techpartner
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy

# Create Cloud SQL instance (run from local machine with gcloud)
gcloud sql instances create techpartner-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1

# Get instance connection name
gcloud sql instances describe techpartner-db --format="value(connectionName)"
```

## Option 2: Use Cloud SQL with Connection String
```bash
# Create instance with public IP
gcloud sql instances create techpartner-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --authorized-networks=34.69.69.182

# Create database and user
gcloud sql databases create techpartner --instance=techpartner-db
gcloud sql users create techpartner --instance=techpartner-db --password=TechPartner2025!

# Get public IP
gcloud sql instances describe techpartner-db --format="value(ipAddresses[0].ipAddress)"
```

## Option 3: Keep Current Neon Database
Your Neon database is working fine. We can continue with it if you prefer:
```bash
cd /opt/techpartner
NODE_ENV=development DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pm2 start server/index.ts --name "techpartner-database" --interpreter tsx
```

Which option would you prefer?