#!/bin/bash
# Complete fix for white page issue

set -e

cd ~/techpartner

echo "🔧 Step 1: Fixing Express Static Handler..."
cat > server/static-handler.ts << 'EOF'
import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStaticFixed(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const indexPath = path.join(distPath, "index.html");

  console.log("Serving static files from:", distPath);
  console.log("Index path:", indexPath);
  
  // Serve static files
  app.use(express.static(distPath));

  // SPA Fallback for React Router
  app.use('*', (req, res) => {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not built. index.html not found.');
    }
  });
}
EOF

echo "🔧 Step 2: Fixing Vite Config..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared')
    }
  }
});
EOF

echo "🗑️ Step 3: Nuking corrupted build folder..."
rm -rf dist/public

echo "🏗️ Step 4: Clean Build..."
npm run build

echo "🔄 Step 5: Restarting Server..."
pm2 restart techpartner

echo "⏳ Step 6: Waiting for server..."
sleep 3

echo "✅ Step 7: System Status..."
pm2 status

echo ""
echo "🧪 Step 8: Testing..."
curl -s http://localhost:8080 | head -20

echo ""
echo "🎉 Fix complete! Check your site now."
