#!/bin/bash

echo "🚀 Pushing all TechPartner platform changes to main branch..."

# Clear any git locks
rm -f .git/index.lock 2>/dev/null || true

# Check current status
echo "📊 Current git status:"
git status

# Add all new files including deployment scripts
echo "📦 Adding deployment files..."
git add COMPLETE_PLATFORM_CODE.html
git add vm-deploy-script.sh  
git add SIMPLE_DEPLOYMENT_STEPS.md
git add replit.md

# Check if there are changes to commit
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Committing latest changes..."
    git commit -m "feat: Complete TechPartner platform with deployment automation

- Add COMPLETE_PLATFORM_CODE.html with full TechPartner Studio platform
- Include comprehensive deployment scripts and documentation  
- Update CI/CD pipeline documentation in replit.md
- All original design elements preserved with SAR pricing (1,500-25,000 SAR)
- Ready for automated deployment via Google Cloud Build"
else
    echo "✅ All changes already committed"
fi

# Show commits ahead of origin
echo "📈 Commits ready to push:"
git log --oneline origin/main..HEAD

# Push to main branch (will trigger CI/CD pipeline)
echo "🌐 Pushing to main branch..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to main!"
    echo "🔄 Your CI/CD pipeline should now automatically deploy to VM: 34.69.69.182"
    echo "⏰ Deployment typically takes 2-3 minutes"
    echo "🌐 Check deployment status at: http://34.69.69.182"
else
    echo "❌ Push failed. Please try running this script again or push manually:"
    echo "git push origin main"
fi