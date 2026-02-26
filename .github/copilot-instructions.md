# TechPartner Platform - AI Coding Agent Instructions

## Architecture Overview

This is a full-stack business platform with dual-layer architecture:
- **Development**: Local SQLite + file storage (zero cost)
- **Production**: Google Cloud SQL + Cloud Storage (auto-scaling)
- **Frontend**: React + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Express.js with dual database support (Drizzle + Prisma)

## Critical Developer Patterns

### Database Architecture (Dual System)
The project uses **two database systems** simultaneously:
- **Drizzle ORM** (`shared/schema.ts`) for legacy business logic
- **Prisma ORM** (`server/prisma/schema.prisma`) for new auth/order features

**Key Commands:**
```bash
npm run db:push          # Drizzle migrations
npx prisma db push       # Prisma migrations (from server/)
npx prisma generate      # Regenerate Prisma client
```

### Storage Pattern (Environment-Based)
Storage layer automatically switches based on environment:
```typescript
// server/storage.ts - Legacy Drizzle storage
const storage = new SQLiteStorage(); // Development
const storage = new PostgreSQLStorage(); // Production

// server/prisma-client.ts - New Prisma models
import { prisma } from './prisma-client';
```

### Route Organization
Routes are split across multiple files:
- `server/routes.ts` - Main legacy routes (Drizzle-based)
- `server/routes/auth.ts` - JWT authentication (Prisma-based)
- `server/routes/orders.ts` - Enhanced orders (Prisma-based)
- `server/routes/admin.ts` - Admin dashboard + PDF receipts

### Authentication Pattern
**Two auth systems coexist:**
- Legacy: `server/routes.ts` hardcoded admin credentials
- New: JWT-based auth with bcrypt in `server/routes/auth.ts`

Use middleware: `requireAuth`, `requireAdmin` from `server/middleware/auth.ts`

## Google Cloud Integration

### Environment Detection
Cloud services gracefully degrade:
```typescript
// server/google-cloud-service.ts
if (!process.env.DATABASE_URL) {
  console.log('Google Cloud services not available');
  // Falls back to local SQLite
}
```

### Deployment Commands
```bash
./scripts/setup-google-cloud.sh    # One-time cloud setup
./scripts/deploy-to-cloud.sh       # Deploy to Cloud Run
```

## Frontend Patterns

### Component Structure
- `client/src/components/` - Reusable UI components
- `client/src/components/admin/` - Admin dashboard components
- `client/src/components/ui/` - Radix UI base components

### Key Contexts
- `LanguageProvider` - Multi-language support with Google Translate
- `QueryClientProvider` - React Query for API state
- Auth context planned but not yet implemented

### Routing
Uses `wouter` router with localization: `LocalizedRouter` component handles language prefixes.

## Build & Development

### Scripts Explained
```bash
npm run dev     # Development: tsx server/index.ts + Vite frontend
npm run build   # Production: Vite build + esbuild server bundling
npm run start   # Production: Runs bundled server from dist/
```

### Path Aliases (vite.config.ts)
```typescript
"@" → "client/src"
"@shared" → "shared"
"@assets" → "attached_assets"
```

## Integration Points

### Payment Processing
Tap Payments integration with webhook handling:
- Create payment: `server/routes/payment.ts`
- Webhook receiver: `server/routes/webhook.ts`
- Order updates via webhook for reliability

### File Uploads
Dual storage system:
- Development: Local file system
- Production: Google Cloud Storage
- Admin interface: `client/src/components/admin/CloudStorageManager.tsx`

## Common Gotchas

1. **Database Confusion**: Always check if you're working with Drizzle (`shared/schema.ts`) or Prisma (`server/prisma/schema.prisma`)
2. **Path Context**: Server commands must run from `server/` directory (Prisma location)
3. **Environment Variables**: `.env` is in project root, affects both frontend and backend
4. **Build Dependencies**: Server bundling requires both vite and esbuild steps

## Admin Dashboard (6 Tabs)
Access at `/admin` with credentials: `admin@techpartner.com` / `TechPartner2024!`
- Overview, Users, Orders, Content, Cloud, Settings
- PDF receipt generation for paid orders
- Cloud file management interface

When adding new features, determine if you need Drizzle (business logic) or Prisma (auth/orders) models, and follow the existing dual-pattern approach.
