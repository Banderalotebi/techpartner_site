#!/bin/bash
# Update Route 53 DNS records to point to CloudFront

CLOUDFRONT_DOMAIN=$1

if [ -z "$CLOUDFRONT_DOMAIN" ]; then
    echo "Usage: $0 <cloudfront-domain>"
    echo "Example: $0 d1234567890.cloudfront.net"
    exit 1
fi

DOMAIN="techpartner.sa"
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='$DOMAIN.'].Id" --output text | cut -d'/' -f3)

if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "❌ Could not find hosted zone for $DOMAIN"
    echo "Please create the hosted zone in Route 53 first"
    exit 1
fi

echo "📝 Updating Route 53 DNS records..."
echo "   Hosted Zone ID: $HOSTED_ZONE_ID"
echo "   CloudFront Domain: $CLOUDFRONT_DOMAIN"

# Create DNS change batch
cat > /tmp/route53-changes.json << EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "$CLOUDFRONT_DOMAIN",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "*.$DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "$CLOUDFRONT_DOMAIN",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
EOF

# Apply changes
aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file:///tmp/route53-changes.json

if [ $? -eq 0 ]; then
    echo "✅ DNS records updated successfully"
    echo ""
    echo "📋 Updated records:"
    echo "   $DOMAIN → $CLOUDFRONT_DOMAIN"
    echo "   *.$DOMAIN → $CLOUDFRONT_DOMAIN"
    echo ""
    echo "⏳ DNS propagation may take a few minutes..."
else
    echo "❌ Failed to update DNS records"
    exit 1
fi
