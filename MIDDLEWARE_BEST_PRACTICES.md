# Express + Vite Middleware Best Practices

## 🚨 Common Pitfall: Multiple `app.use("*")` Routes

### ❌ What Causes ERR_EMPTY_RESPONSE
- Multiple catch-all routes (`app.use("*", ...)`) 
- Middleware calling `next()` without a proper response handler
- Environment-specific middleware running simultaneously

### ✅ Solution: Conditional Middleware Registration

## Best Practices Implemented

### 1. **Environment-Driven Middleware Setup**
```typescript
// Only register ONE catch-all route based on environment
if (isDev) {
  await setupVite(app, server); // Dev mode with Vite transforms
} else {
  serveStatic(app); // Production mode with static files
}
```

### 2. **Request Logging for Debugging**
```typescript
app.use((req, res, next) => {
  console.log(`➡️ Request: ${req.method} ${req.url}`);
  next();
});
```

### 3. **Proper Error Handling**
```typescript
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error caught:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});
```

### 4. **Single Route Registration Function**
- Centralized route setup in `registerRoutes()`
- Clear separation between API routes and SPA fallback
- Environment-specific middleware only

### 5. **API Route Protection**
```typescript
// Skip SPA routes for API endpoints
if (req.originalUrl.startsWith('/api')) {
  return next();
}
```

## Performance Benefits

### Before (Dev Mode Issues):
- Vite transforming HTML on every request
- Multiple middleware handlers interfering
- Requests hanging/timing out
- External scripts causing delays

### After (Production Mode):
- Static file serving (instant response)
- Single catch-all route
- Built and optimized assets
- No middleware conflicts

## Environment Setup

### Development Mode:
```bash
npm run dev  # Uses Vite middleware for hot reload
```

### Production Mode (Recommended):
```bash
cd client && npm run build  # Build static assets
NODE_ENV=production npm run start  # Serve static files
```

## Key Learnings

1. **Never have multiple `app.use("*")` without conditional guards**
2. **Always use environment flags to separate dev/prod middleware**
3. **Add error handlers to catch uncaught middleware issues**
4. **Log requests during development to trace routing issues**
5. **Build for production to eliminate dev-mode delays**

## Tools for Prevention

- Request logging middleware
- Error boundary at the end of middleware chain
- Environment-specific route registration
- Static analysis to detect multiple catch-all routes
