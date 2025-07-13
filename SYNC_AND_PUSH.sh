#!/bin/bash

echo "🔄 Syncing with remote and pushing database integration..."

# Clear git locks
rm -f .git/index.lock 2>/dev/null || true

echo "📥 Step 1: Pulling remote changes..."
git pull origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pulled remote changes"
    
    echo ""
    echo "📤 Step 2: Pushing your database integration work..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! Database integration pushed to main branch!"
        echo "🚀 CI/CD pipeline will now deploy your enhanced platform"
        echo "⏰ Deployment takes 3-5 minutes"
        echo "🌐 Monitor at: http://34.69.69.182"
        echo ""
        echo "✅ What was deployed:"
        echo "   • PostgreSQL database integration"
        echo "   • Enhanced CI/CD pipeline"
        echo "   • JWT authentication system"
        echo "   • Database-powered API server"
    else
        echo "❌ Push failed after pull. You may have merge conflicts."
        echo "💡 Check git status and resolve conflicts manually."
    fi
else
    echo "❌ Pull failed. Trying alternative approach..."
    echo ""
    echo "🔧 Alternative: Force push (use with caution)"
    echo "git push origin main --force"
    echo ""
    echo "⚠️  This will overwrite remote changes. Use only if you're sure."
fi

echo ""
echo "📊 Current status:"
git status