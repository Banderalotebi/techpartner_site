#!/bin/bash

# Deploy TechPartner to VM
VM_NAME="techpartner-vm"
ZONE="us-central1-a"
VM_IP="35.188.154.142"

echo "🚀 Deploying TechPartner Platform to VM..."

# Create deployment script for VM
cat > vm-setup.sh << 'EOF'
#!/bin/bash
echo "Setting up TechPartner Platform..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and other tools
sudo npm install -g pm2 tsx
sudo apt install -y nginx git

# Create app directory
sudo mkdir -p /opt/techpartner
sudo chown $USER:$USER /opt/techpartner

echo "✅ VM setup complete!"
EOF

# Copy setup script to VM
echo "📤 Copying setup script to VM..."
gcloud compute scp vm-setup.sh $VM_NAME:/tmp/vm-setup.sh --zone=$ZONE

# Execute setup script
echo "⚙️  Running setup on VM..."
gcloud compute ssh $VM_NAME --zone=$ZONE --command="chmod +x /tmp/vm-setup.sh && /tmp/vm-setup.sh"

echo "🎯 VM IP: $VM_IP"
echo "✅ Setup complete! Ready for application deployment."