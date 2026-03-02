import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStaticFixed(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const clientPath = path.join(distPath, "client");
  const indexPath = path.join(clientPath, "index.html");

  console.log("Current working directory:", process.cwd());
  console.log("Looking for static files at:", distPath);
  console.log("Client path:", clientPath);
  console.log("Index path:", indexPath);
  console.log("Directory exists:", fs.existsSync(distPath));
  
  if (fs.existsSync(distPath)) {
    console.log("Files in dist/public:", fs.readdirSync(distPath));
    const assetsPath = path.join(distPath, "assets");
    if (fs.existsSync(assetsPath)) {
      console.log("Files in assets:", fs.readdirSync(assetsPath).slice(0, 5));
    }
  }

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
    
    console.log("Serving SPA fallback for:", req.path);
    
    // Serve index.html from client folder for all other routes (SPA fallback)
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not built. index.html not found.');
    }
  });
}
