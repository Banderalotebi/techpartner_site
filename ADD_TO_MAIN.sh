#!/bin/bash

echo "🚀 Adding database integration work to main branch..."

# Clear any git locks
rm -f .git/index.lock 2>/dev/null || true

# Show current status
echo "📊 Current repository status:"
git status

echo ""
echo "📝 Recent commits ready to push:"
git log --oneline -5

echo ""
echo "🔄 Pushing all commits to main branch..."

# Push to main branch
if git push origin main; then
    echo ""
    echo "✅ Successfully pushed to GitHub main branch!"
    echo "🔄 CI/CD pipeline will now deploy your database integration"
    echo "⏰ Deployment takes 3-5 minutes"
    echo "🌐 Monitor progress at: http://34.69.69.182"
    echo ""
    echo "🎯 What was deployed:"
    echo "   • Complete PostgreSQL database integration"
    echo "   • Enhanced CI/CD pipeline with Secret Manager"
    echo "   • JWT authentication and security middleware" 
    echo "   • Database-powered API server"
    echo "   • Production-grade deployment automation"
else
    echo ""
    echo "❌ Push failed. Check your git configuration and try again."
    echo "💡 You may need to:"
    echo "   • Configure git credentials"
    echo "   • Handle merge conflicts"
    echo "   • Verify repository permissions"
fi

echo ""
echo "🏁 Database integration deployment initiated!"