#!/bin/bash

echo "Pushing all local changes to GitHub to trigger CI/CD deployment..."

# Remove git lock if exists
rm -f .git/index.lock 2>/dev/null || true

# Show what we're about to push
echo "Local commits ready to push:"
git log --oneline origin/main..HEAD | head -10

echo ""
echo "Pushing to GitHub..."

# Push all commits to main branch
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🔄 CI/CD pipeline should now deploy your database integration"
    echo "⏰ Check deployment progress in 2-3 minutes"
    echo "🌐 Monitor at: http://34.69.69.182"
else
    echo "❌ Push failed. You may need to handle this manually."
fi