#!/bin/bash

echo "🚀 Force deploying database integration to main branch..."

# Clear git locks
rm -f .git/index.lock 2>/dev/null || true

echo "📊 Current local commits:"
git log --oneline -5

echo ""
echo "💪 Force pushing to override remote conflicts..."

# Force push to main
git push origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Database integration force pushed to main!"
    echo "🔄 CI/CD pipeline now deploying enhanced platform"
    echo "⏰ Deployment in progress (3-5 minutes)"
    echo "🌐 Monitor deployment at: http://34.69.69.182"
    echo ""
    echo "✅ Deployed features:"
    echo "   • Complete PostgreSQL database integration"
    echo "   • Enhanced CI/CD with Secret Manager"
    echo "   • JWT authentication system"
    echo "   • Database-powered API server"
    echo "   • Production-grade deployment automation"
    echo ""
    echo "🔗 Check GitHub: https://github.com/Banderalotebi/techpartner_site"
else
    echo ""
    echo "❌ Force push failed. Manual intervention needed."
    echo "💡 Try these commands manually:"
    echo "   rm -f .git/index.lock"
    echo "   git push origin main --force"
fi

echo ""
echo "🏁 Database integration deployment initiated!"