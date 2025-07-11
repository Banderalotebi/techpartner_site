# 🛠 Google Cloud VM Deployment - Permission Fix

## Current Blocker
The service account `replit-deployer@glossy-agency-448211-s4.iam.gserviceaccount.com` lacks VM creation permissions.

## Required Action (5 minutes)

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/iam-admin/iam?project=glossy-agency-448211-s4

### Step 2: Find Service Account
Look for: `replit-deployer@glossy-agency-448211-s4.iam.gserviceaccount.com`

### Step 3: Add These Roles
Click "Edit" (pencil icon) and add:
- **Compute Engine Admin** 
- **Compute Network Admin**
- **Service Account User**

### Step 4: Enable APIs
Visit: https://console.cloud.google.com/apis/library?project=glossy-agency-448211-s4

Enable:
- Compute Engine API
- Cloud Resource Manager API

## After Permission Grant

Once you grant these permissions, tell me and I will:

1. **Create VM** - `e2-medium` instance with Ubuntu 20.04
2. **Setup Environment** - Node.js 20, PM2, Nginx
3. **Deploy Platform** - Your complete TechPartner application
4. **Configure SSL** - Free Let's Encrypt certificate
5. **Provide URL** - Live public IP address

## VM Specifications
- **Type**: e2-medium (2 vCPU, 4GB RAM)
- **OS**: Ubuntu 20.04 LTS
- **Storage**: 30GB SSD
- **Region**: us-central1-a
- **Network**: HTTP/HTTPS ports open

Your platform will be fully deployed and live within 10 minutes of granting permissions!