# Apple M2 (ARM) Deployment Guide

This document contains important information for deploying web apps on Apple M2 machines to avoid common issues.

## 🔧 Common Deployment Issues on Apple M2 & Fixes

### 1. **Native Dependencies Failing to Compile (Node.js, Python, etc.)**

**Problem:** Some libraries use native C/C++ bindings that don't support ARM by default.

**Fix:**
- Install Rosetta 2 to emulate x86:
  ```bash
  softwareupdate --install-rosetta
  ```
- Run terminal using Rosetta (right-click → Get Info → "Open using Rosetta")
- Reinstall packages:
  ```bash
  rm -rf node_modules
  npm install --force
  ```

### 2. **Node.js Issues on M2**

**Problem:** Node versions compiled for Intel architecture fail on ARM.

**Fix:** Use a compatible Node.js version:
```bash
nvm install --lts
nvm use --lts
```

Or use Node.js ARM-native builds from [nodejs.org](https://nodejs.org).

### 3. **Docker Not Working as Expected**

**Problem:** Docker images built for x86 architecture may not run properly on ARM chips.

**Fix:** Use multi-architecture base images:
```dockerfile
FROM --platform=linux/amd64 node:18
```

If you want to force architecture during build:
```bash
docker buildx build --platform linux/amd64 -t my-app .
```

### 4. **PostgreSQL / Other DBs Won't Start**

**Problem:** Postgres native binaries may have ARM compatibility issues.

**Fix:**
- Use official ARM-supported Docker images:
```yaml
services:
  db:
    image: postgres:15-alpine
```
- Avoid installing Postgres natively on macOS unless through ARM-aware tools like [Postgres.app](https://postgresapp.com/)

### 5. **Vite or Webpack Crashes During Build**

**Problem:** Sometimes `vite` or `esbuild` binaries aren't built for ARM.

**Fix:**
- Remove and reinstall:
  ```bash
  rm -rf node_modules
  rm package-lock.json
  npm install
  ```
- Install compatible versions of packages

### 6. **Bcrypt, Sharp, Prisma Errors**

**Problem:** Native binary issues again.

**Fix:** Use precompiled binaries or rebuild them:
```bash
npm rebuild bcrypt --build-from-source
```

For Prisma:
```bash
npx prisma generate --binary-target native
```

## ✅ General Recommendations

- Use **Rosetta** when using x86-specific software
- Prefer **Docker** when dealing with complex environments
- Stick with **LTS versions** of Node.js and other tools
- Use **homebrew for ARM**:
  ```bash
  /opt/homebrew/bin/brew install <package>
  ```

## 🔍 Troubleshooting Our Current Project

### Port Issues We've Encountered:
- **Problem**: Server trying to use port 5000 (conflicting with macOS Control Center)
- **Solution**: Updated to use port 3000 consistently
- **M2 Consideration**: Control Center on M2 Macs aggressively uses port 5000

### Vite Setup Issues:
- **Problem**: `setupVite is not a function` error
- **Potential M2 Issue**: Vite's esbuild dependency may have ARM compilation issues
- **Current Workaround**: Using static file serving as fallback

### Recommended Next Steps for M2 Optimization:
1. Check if we're using ARM-native Node.js build
2. Verify all dependencies have ARM support
3. Consider using Docker for consistent environment
4. Update Vite/esbuild to latest ARM-compatible versions
