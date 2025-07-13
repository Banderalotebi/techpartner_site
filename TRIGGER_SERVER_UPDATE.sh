#!/bin/bash
# Quick Server Start with Database

cd /home/bander/techpartner_site

echo "=== Starting TechPartner with Database ==="

# Set the Neon database URL (from your previous deployment logs)
export DATABASE_URL="postgresql://neondb_owner:npg_6GmN5JQnPX@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Start server on port 80
echo "Starting TechPartner server with database on port 80..."
sudo PORT=80 DATABASE_URL="$DATABASE_URL" NODE_ENV=production node dist/index.js