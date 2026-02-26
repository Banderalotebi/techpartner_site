# TechPartner Platform - Site Map

## Overview
This document outlines the complete site structure for the TechPartner platform, including user flows, authentication requirements, and page hierarchy.

## Main Navigation Structure

### 1. Public Pages (No Authentication Required)
```
├── Home (/)
├── About (/about)
├── Services (/services)
│   ├── Logo & Identity Design (/services/logo-identity)
│   ├── Web & App Design (/services/web-app-design)
│   ├── Web Development (/services/web-development)
│   ├── UI/UX Design (/services/ui-ux-design)
│   ├── Mobile App Development (/services/mobile-app-development)
│   ├── Branding & Marketing (/services/branding-marketing)
│   ├── Digital Marketing (/services/digital-marketing)
│   └── Content Creation (/services/content-creation)
├── Portfolio (/portfolio)
├── Case Studies (/case-studies)
├── Blog (/blog)
├── Contact (/contact)
├── Privacy Policy (/privacy-policy)
├── Terms of Service (/terms-of-service)
└── Refund Policy (/refund-policy)
```

### 2. Authentication Pages
```
├── Login (/login) - JWT-based authentication
├── Register (/register) - User registration with email verification
├── Forgot Password (/forgot-password)
└── Reset Password (/reset-password/:token)
```

### 3. Protected User Pages (Authentication Required)
```
├── Dashboard (/dashboard) - User overview & recent orders
├── Profile (/profile) - Account settings & personal info
├── Orders (/orders) - Order history & status tracking
├── Order Details (/orders/:id) - Individual order details
├── New Order (/order/new) - Service selection & project brief
├── Payment (/payment/:orderId) - Payment processing via TAP
├── Payment Success (/payment-success) - Order confirmation
└── Payment Cancelled (/payment-cancelled) - Payment failure handling
```

### 4. Admin Pages (Admin Role Required)
```
├── Admin Dashboard (/admin) - Overview & analytics
├── Admin Login (/admin/login) - Separate admin authentication
├── User Management (/admin/users) - User accounts & roles
├── Order Management (/admin/orders) - All orders & status updates
├── Content Management (/admin/content) - Site content editing
├── Cloud Storage (/admin/cloud) - File management
└── Settings (/admin/settings) - System configuration
```

### 5. API Routes Structure
```
├── Authentication APIs
│   ├── POST /api/auth/register - User registration
│   ├── POST /api/auth/login - User login
│   ├── POST /api/auth/logout - User logout
│   ├── GET /api/auth/me - Get current user
│   └── POST /api/auth/verify-email - Email verification
│
├── User APIs (Protected)
│   ├── GET /api/users/profile - User profile
│   ├── PUT /api/users/profile - Update profile
│   └── DELETE /api/users/account - Delete account
│
├── Order APIs (Protected)
│   ├── GET /api/orders - User's orders
│   ├── POST /api/orders - Create new order
│   ├── GET /api/orders/:id - Order details
│   ├── PUT /api/orders/:id - Update order
│   └── DELETE /api/orders/:id - Cancel order
│
├── Payment APIs (Protected)
│   ├── POST /api/payment/create - Initialize payment with TAP
│   ├── POST /api/payment/webhook - TAP webhook handler
│   └── GET /api/payment/status/:id - Payment status
│
├── Admin APIs (Admin Only)
│   ├── GET /api/admin/users - All users
│   ├── PUT /api/admin/users/:id/role - Update user role
│   ├── GET /api/admin/orders - All orders
│   ├── PUT /api/admin/orders/:id/status - Update order status
│   ├── GET /api/admin/analytics - Dashboard analytics
│   └── POST /api/admin/content - Update site content
│
└── Public APIs
    ├── GET /api/services - Available services
    ├── POST /api/contact - Contact form submission
    └── GET /api/health - System health check
```

## User Flow Diagrams

### 1. New User Registration Flow
```
Visit Site → Browse Services → Register → Email Verification → 
Login → Create Order → Fill Project Brief → Payment → Dashboard
```

### 2. Returning User Flow
```
Login → Dashboard → View Orders → Create New Order → Payment → 
Order Tracking → Profile Management
```

### 3. Admin Workflow
```
Admin Login → Dashboard → Manage Orders → Update Status → 
User Management → Content Updates → System Settings
```

## Authentication & Authorization

### Role-Based Access Control
- **Public**: Anonymous users can browse services and content
- **Client**: Registered users can create orders and manage profile
- **Admin**: Full system access including user and order management

### Security Implementation
- JWT tokens with 7-day expiration
- Role claims in token payload
- Middleware protection for all protected routes
- Password hashing with bcrypt
- Rate limiting on authentication endpoints

## Multilingual Support

### Language Structure
```
├── English (Default)
│   └── All pages available at root paths
└── Arabic
    ├── Home (/ar/)
    ├── Services (/ar/services)
    ├── About (/ar/about)
    └── Contact (/ar/contact)
```

## Payment Integration

### TAP Payments Flow
```
Order Creation → Payment Initialization → TAP Gateway → 
Webhook Processing → Order Status Update → User Notification
```

### Payment Pages
- `/payment/:orderId` - Payment processing
- `/payment-success` - Success confirmation
- `/payment-cancelled` - Payment cancellation
- Webhook endpoint: `/api/payment/webhook`

## Technical Implementation

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter with localization support
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Query + Context API
- **Authentication**: JWT with httpOnly cookies option

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: Dual ORM system (Drizzle + Prisma)
- **Authentication**: JWT with role-based middleware
- **Payment**: TAP Payments API integration
- **Storage**: Local (dev) / Google Cloud Storage (prod)

### Database Schema
- Users table with role-based access
- Orders with status tracking
- Project briefs with service details
- Payment records with TAP integration
- Activity logging for admin oversight

## SEO Considerations

### Meta Tags & Schema
- Service-specific meta descriptions
- Open Graph tags for social sharing
- JSON-LD structured data for services
- Canonical URLs for multilingual content

### Performance Optimization
- Server-side rendering for public pages
- Image optimization and lazy loading
- CDN integration for assets
- Compression and minification

This sitemap represents the complete structure of the TechPartner platform with role-based authentication, payment integration, and multilingual support.
