#!/bin/bash
# Final fix for white page issue

set -e

cd ~/techpartner

echo "🔧 Step 1: Fixing static handler..."
cat > server/static-handler.ts << 'EOF'
import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStaticFixed(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const clientPath = path.join(distPath, "client");
  const indexPath = path.join(clientPath, "index.html");

  console.log("[Static] Serving from:", distPath);
  console.log("[Static] Client path:", clientPath);
  console.log("[Static] Index at:", indexPath);
  
  // Serve static files from both locations
  app.use(express.static(distPath));
  app.use(express.static(clientPath));

  // SPA Fallback for all non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not built. index.html not found at: ' + indexPath);
    }
  });
}
EOF

echo "🔧 Step 2: Checking build..."
if [ ! -f "dist/public/client/index.html" ]; then
  echo "⚠️  Build not found, running npm run build..."
  npm run build
fi

echo "🔧 Step 3: Restarting server..."
pm2 restart techpartner

echo "⏳ Step 4: Waiting for server..."
sleep 3

echo "✅ Step 5: Status check..."
pm2 status

echo ""
echo "🧪 Step 6: Testing..."
curl -s http://localhost:8080 | head -5

echo ""
echo "🎉 Done! Check your site now."
