#!/bin/bash
# Complete SSH fix script

set -e

cd ~/techpartner

echo "=== STEP 1: Git Operations ==="
git stash
git pull origin main || echo "Git pull completed with issues"

echo ""
echo "=== STEP 2: Check Current State ==="
echo "Looking for index.html..."
find dist -name "index.html" 2>/dev/null || echo "Not found in dist/"

echo ""
echo "=== STEP 3: Install & Build ==="
npm install
npm run build

echo ""
echo "=== STEP 4: Verify Build ==="
echo "Files in dist/public/:"
ls -la dist/public/ 2>/dev/null | head -10

echo ""
echo "Looking for index.html:"
find dist -name "index.html" 2>/dev/null

echo ""
echo "=== STEP 5: Fix Static Handler ==="
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
  
  // Serve static files
  app.use(express.static(distPath));
  app.use(express.static(clientPath));

  // SPA Fallback
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

echo "Static handler updated"

echo ""
echo "=== STEP 6: Restart Server ==="
pm2 restart techpartner

echo ""
echo "=== STEP 7: Wait & Test ==="
sleep 5
pm2 status

echo ""
echo "Testing site..."
curl -s http://localhost:8080 | head -10

echo ""
echo "=== DONE ==="
echo "Check your site at http://techpartner.sa"
