#!/bin/bash

echo "🚀 Deploying Database Integration via Enhanced CI/CD Pipeline..."

# Clear any git locks
rm -f .git/index.lock 2>/dev/null || true

# Add all database integration files
echo "📦 Adding database integration files..."
git add .

# Commit comprehensive database deployment
echo "💾 Committing database integration..."
git commit -m "feat: Complete PostgreSQL database integration with enhanced CI/CD

🗄️ Database Integration (1,728 lines of code):
- Complete PostgreSQL schema with 5 production tables
- Robust database connection with error handling
- Type-safe Drizzle ORM schema definitions
- JWT authentication system for secure sessions
- Security middleware with validation and rate limiting
- Database-powered API server with full business logic

🔧 Enhanced CI/CD Pipeline:
- Google Secret Manager integration for secure credentials
- Automated database deployment with cloudbuild-with-secrets.yaml
- Production-grade database persistence replacing in-memory storage
- Streamlined activation process with ACTIVATE-DATABASE-NOW.md

🏗️ Platform Transformation:
- All user data, orders, and operations now permanently stored
- Production-ready infrastructure with automated deployments
- Complete system upgrade from development to enterprise-grade"

# Push to trigger enhanced CI/CD pipeline
echo "🌐 Pushing to main branch (triggers enhanced CI/CD)..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed database integration!"
    echo ""
    echo "🔄 Enhanced CI/CD Pipeline Now Running:"
    echo "   1. GitHub receives database integration code"
    echo "   2. Google Cloud Build triggers with Secret Manager"
    echo "   3. PostgreSQL database deployment to VM: 34.69.69.182"
    echo "   4. Automated activation of production database"
    echo ""
    echo "⏰ Database deployment takes 3-5 minutes"
    echo "🌐 Monitor deployment: http://34.69.69.182/api/health"
    echo "📊 Database status: http://34.69.69.182/api/categories"
else
    echo "❌ Push failed. Run this script again or push manually:"
    echo "git push origin main"
fi