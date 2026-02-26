# TechPartner Platform

## Overview

TechPartner is a full-stack business platform for a Saudi Arabian tech/design agency. It provides service listings (logo design, web development, branding, etc.), an order/payment flow with TAP Payments integration, user authentication, and an admin dashboard. The platform supports Arabic/English content and targets the Saudi market (SAR currency).

The application follows a monorepo structure with a React frontend, Express.js backend, and PostgreSQL database via Drizzle ORM. It was originally built with SQLite for local development and has been migrated toward PostgreSQL (Neon serverless) for production.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (client/)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui patterns (configured in `components.json`)
- **State Management**: TanStack React Query for server state, React Context for auth state (`AuthContext`)
- **Build Tool**: Vite with `@replit/vite-plugin-runtime-error-modal`
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (server/)
- **Framework**: Express.js with TypeScript, run via `tsx`
- **Entry Point**: `server/index.ts` — sets up Express, registers routes, serves static files
- **Route Organization**: Main routes in `server/routes.ts`, with sub-routers in `server/routes/` (auth, payments, admin, inquiry, email-test)
- **Authentication**: JWT-based auth with bcryptjs for password hashing. Middleware in `server/middleware/auth.ts` provides `requireAuth` and `requireAdmin` guards. Roles stored in the `users` table (`client` or `admin`).
- **Static Serving**: In production, `server/static-handler.ts` serves built files from `dist/public/` with image optimization via Sharp (`server/image-optimizer.ts`). In development, Vite dev server middleware is used (`server/vite.ts`).

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using `drizzle-orm/pg-core`
- **Connection**: `server/db.ts` uses `pg` Pool with `DATABASE_URL` environment variable
- **Config**: `drizzle.config.ts` points to PostgreSQL, migrations output to `./migrations`
- **Key Tables**: `users`, `service_categories`, `service_packages`, `project_briefs`, `quiz_responses`, `orders`, `payments`, `activities`
- **Legacy SQLite**: `server/storage-sqlite.ts` contains a SQLite fallback using `better-sqlite3` — this is legacy code from local development. The primary path now uses PostgreSQL via Drizzle.
- **Note**: There's also legacy Prisma references in some files (`seed-users-prisma.js`, copilot instructions) but the active ORM is Drizzle with PostgreSQL.

### Storage Abstraction
- `server/storage.ts` defines an `IStorage` interface and conditionally loads PostgreSQL or SQLite storage
- The interface covers CRUD for users, service categories, service packages, project briefs, quiz responses, orders, and payments

### Build System
- **Development**: `npm run dev` runs `tsx server/index.ts` with `NODE_ENV=development`
- **Production Build**: `npm run build` runs `build.js` which uses Vite for frontend and esbuild for server bundling
- **Database Migrations**: `npm run db:push` runs `drizzle-kit push`

### Key Design Decisions
1. **Dual storage layer (SQLite + PostgreSQL)**: Originally built for zero-cost local dev with SQLite, then extended to PostgreSQL for production. The PostgreSQL path via Drizzle is the primary one now.
2. **JWT auth over sessions**: Chose JWT tokens with role claims for stateless API authentication, enabling easy admin/client role separation.
3. **Monorepo with shared types**: `shared/schema.ts` provides both database schema and TypeScript types used by both client and server, ensuring type safety across the stack.
4. **Image optimization middleware**: Server-side Sharp-based image optimization with caching to improve performance for design-heavy pages.

## External Dependencies

### Database
- **PostgreSQL** via Neon serverless (`@neondatabase/serverless` in dependencies)
- **Drizzle ORM** for schema management and queries
- **Connection**: Requires `DATABASE_URL` environment variable

### Payment Processing
- **TAP Payments** (Saudi payment gateway) — handles charges, webhooks, payment verification
- **Endpoints**: `/api/payments`, `/api/payments/webhooks/tap`, `/api/create-payment`, `/api/verify-payment`
- **Environment Variable**: `TAP_SECRET_KEY` for API authentication

### Email
- **Nodemailer** with Zoho SMTP for production email sending
- **Environment Variables**: `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`

### AI Services (Optional)
- **Google Generative AI (Gemini)** via `@google/generative-ai` for content generation
- **Environment Variable**: `GOOGLE_AI_API_KEY`

### Cloud Storage (Optional)
- **Google Cloud Storage** via `@google-cloud/storage` for file uploads
- **Environment Variables**: `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_CLOUD_STORAGE_BUCKET`

### Analytics
- **Google Tag Manager** (GTM-KHV9SP5N) and **Google Analytics** (G-6X1LQ695SK) embedded in `client/index.html`

### Key NPM Packages
- **Frontend**: React, wouter, @tanstack/react-query, Radix UI components, lucide-react, tailwindcss, zod
- **Backend**: Express, pg, drizzle-orm, bcryptjs, jsonwebtoken, nodemailer, sharp, axios
- **Dev**: Vite, tsx, esbuild, drizzle-kit, TypeScript

### Environment Variables Required
- `DATABASE_URL` — PostgreSQL connection string (required)
- `JWT_SECRET` or `SESSION_SECRET` — for token signing
- `TAP_SECRET_KEY` — for payment processing
- `SMTP_USER`, `SMTP_PASS` — for email (optional in dev)
- `GOOGLE_AI_API_KEY` — for AI features (optional)
- `GOOGLE_CLOUD_*` — for cloud storage (optional)

## Recent Changes

### SEO Improvements (Feb 2026)
- Added meta title, description, canonical URLs, hreflang tags for en/ar
- Added Open Graph and Twitter Card social media tags
- Added JSON-LD structured data (Organization + WebSite schemas)
- Added favicon served at /favicon.ico
- Enabled GZIP compression via Express middleware
- Added www-to-non-www 301 redirect for URL canonicalization
- Improved 404 page with helpful navigation links (Go Home, Browse Services, Go Back)
- Converted all images from PNG to WebP format (~60-76% size reduction)
- Made Replit dev banner script `defer` to reduce render-blocking
- Obfuscated plaintext email addresses across pages
- Added rel="noopener noreferrer" to external links

### i18n Full Translation Integration (Feb 2026)
- URL-based language routing: / for English, /ar for Arabic
- LocalizedLink component auto-prefixes /ar when in Arabic mode
- LanguageSwitcher replaces Google Translate widget
- RTL layout support for Arabic pages
- hreflang tags for SEO multi-language support
- react-i18next with useTranslation hook integrated across all active page/component files
- Translation files: `client/i18n/locales/en.json` (380+ keys) and `ar.json` (Gemini-translated)
- All 7 active UI files use t() calls: Header.tsx, Footer.tsx, home.tsx, about.tsx, contact.tsx, portfolio.tsx, blog.tsx
- Active codebase is in `client/` (NOT `client/src/`): main.tsx → App.tsx → pages/*.tsx → components/*.tsx
- Arrays with content data (portfolioItems, blogPosts) use key mapping pattern for translateable titles/labels while keeping data structure intact