#!/bin/bash
# CloudFront Setup Script for TechPartner
# This script creates the CloudFront distribution with your AWS ACM certificate

# Variables
CLOUDFRONT_ORIGIN="ec2-54-227-243-191.compute-1.amazonaws.com"  # Your EC2 Elastic IP domain
DOMAIN="techpartner.sa"
ACM_CERT_ARN="arn:aws:acm:us-east-1:597284493757:certificate/535f75d7-d8f9-48af-81de-c737f5df74b2"

echo "🚀 Setting up CloudFront for $DOMAIN with ACM certificate..."

# Create CloudFront distribution
echo "📋 Creating CloudFront distribution..."

DISTRIBUTION_ID=$(aws cloudfront create-distribution \
  --origin-domain-name $CLOUDFRONT_ORIGIN \
  --default-root-object index.html \
  --comment "TechPartner CloudFront Distribution" \
  --enabled \
  --viewer-certificate acm-certificate-arn=$ACM_CERT_ARN,ssl-support-method=sni-only,minimum-protocol-version=TLSv1.2_2021 \
  --default-cache-behavior "TargetOriginId=$CLOUDFRONT_ORIGIN,ViewerProtocolPolicy=redirect-to-https,AllowedMethods=GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE,CachePolicyId=658327ea-f89d-4fab-a63d-7e88639e58f6" \
  --query 'Distribution.Id' \
  --output text)

echo "✅ CloudFront Distribution created: $DISTRIBUTION_ID"

# Wait for distribution to deploy
echo "⏳ Waiting for distribution to deploy..."
aws cloudfront wait distribution-deployed --id $DISTRIBUTION_ID

# Get CloudFront domain
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)

echo "✅ CloudFront Domain: $CLOUDFRONT_DOMAIN"

# Save configuration
cat > cloudfront-config.json << EOF
{
  "distributionId": "$DISTRIBUTION_ID",
  "domainName": "$CLOUDFRONT_DOMAIN",
  "origin": "$CLOUDFRONT_ORIGIN",
  "ACM_CERT_ARN": "$ACM_CERT_ARN"
}
EOF

echo "📄 Configuration saved to cloudfront-config.json"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your DNS records to point $DOMAIN to $CLOUDFRONT_DOMAIN"
echo "2. Create CNAME records for subdomains (*.$DOMAIN) pointing to $CLOUDFRONT_DOMAIN"
echo "3. Update nginx on EC2 to listen on HTTP only (CloudFront handles HTTPS)"

