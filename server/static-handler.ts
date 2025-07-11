import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStaticFixed(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files from the build directory
  app.use(express.static(distPath));

  // Only serve index.html for non-API routes (SPA fallback)
  app.use((req, res, next) => {
    // Don't interfere with API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // Serve index.html for all other routes (SPA fallback)
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}