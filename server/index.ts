// server/index.ts - Refactored to load AWS Secrets BEFORE any database imports
// This ensures all environment variables are available before modules read process.env

import { loadSecrets, verifyRequiredEnvVars } from "./aws-secrets";

// Main bootstrap function - loads secrets first, then initializes the app
async function bootstrap() {
  // PHASE 1: Load secrets from AWS Secrets Manager or .env file
  // This MUST complete before any other imports that use process.env
  await loadSecrets();
  
  // Verify critical environment variables are present
  // DATABASE_URL is optional - SQLite fallback available in CRM
  const hasRequiredVars = verifyRequiredEnvVars([
    "ADMIN_SECRET"
  ]);
  
  if (!hasRequiredVars) {
    console.error("❌ [Bootstrap] Missing required environment variables. Exiting.");
    process.exit(1);
  }
  
  // Log database mode
  if (process.env.DATABASE_URL) {
    console.log("✅ [Bootstrap] PostgreSQL mode (DATABASE_URL set)");
  } else {
    console.log("ℹ️  [Bootstrap] SQLite fallback mode (DATABASE_URL not set)");
  }
  
  // PHASE 2: Now that secrets are loaded, import modules that depend on process.env
  const [{ default: express }, { registerRoutes }, { setupVite, log }, { serveStaticFixed }] = await Promise.all([
    import("express"),
    import("./routes"),
    import("./vite"),
    import("./static-handler")
  ]);
  
  const app = express();
  
  // Enable gzip/brotli compression for all responses
  const { default: compression } = await import("compression");
  app.use(compression());
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  // PHASE 3: Register routes and start server
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite in development, static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStaticFixed(app);
  }

  // Start server
  const port = Number(process.env.PORT) || 8080;
  const host = "0.0.0.0";
  
  server.listen({
    port,
    host,
    reusePort: true,
  }, () => {
    log(`TechPartner Platform serving on port ${port}`);
    if (process.env.NODE_ENV === 'production') {
      log('Running in production mode with AWS Secrets Manager');
    }
  });
}

// Start the bootstrap process
bootstrap().catch((error) => {
  console.error("❌ [Bootstrap] Fatal error during startup:", error);
  process.exit(1);
});
