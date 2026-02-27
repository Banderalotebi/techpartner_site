import express, { Express, Request, Response, NextFunction } from "express";
import { Server } from "http";
import { log } from "./utils";

/**
 * Central middleware registration function
 * Ensures only one catch-all route is active based on environment
 */
export async function registerMiddleware(app: Express, server: Server) {
  const isDev = process.env.NODE_ENV === "development";
  
  // Add request logging in development
  if (isDev) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      log(`➡️  ${req.method} ${req.url}`);
      next();
    });
  }

  // Environment-specific middleware setup
  if (isDev) {
    try {
      const { setupVite } = await import("./vite");
      await setupVite(app, server);
      log("✅ Vite development middleware registered");
    } catch (error) {
      log("❌ Failed to setup Vite middleware:", String(error));
      // Fallback to static serving if Vite fails
      const { serveStatic } = await import("./vite");
      serveStatic(app);
      log("✅ Fallback to static serving");
    }
  } else {
    const { serveStatic } = await import("./vite");
    serveStatic(app);
    log("✅ Production static middleware registered");
  }
}

/**
 * Global error handler - must be registered last
 */
export function registerErrorHandler(app: Express) {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    log(`❌ Error ${status}: ${message} - ${req.method} ${req.url}`);
    
    if (res.headersSent) {
      return next(err);
    }
    
    res.status(status).json({ 
      error: message,
      timestamp: new Date().toISOString(),
      path: req.url
    });
  });
}

/**
 * 404 handler for unmatched routes
 */
export function register404Handler(app: Express) {
  app.use("*", (req: Request, res: Response) => {
    log(`❌ 404: ${req.method} ${req.url}`);
    res.status(404).json({
      error: "Not Found",
      message: `Route ${req.method} ${req.url} not found`,
      timestamp: new Date().toISOString()
    });
  });
}
