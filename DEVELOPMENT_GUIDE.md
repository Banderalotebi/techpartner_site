# Development Environment Setup Guide

This guide explains how to set up and run the TechPartner Platform development environment on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

## Project Structure

```
techpartner_site-2/
├── client/              # React frontend
│   ├── src/            # React components and pages
│   └── index.html      # Main HTML template
├── server/             # Express backend
│   ├── index.ts        # Main server file
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database interface
│   └── storage-sqlite.ts # SQLite implementation
├── shared/             # Shared types and schemas
├── data/              # SQLite database files (auto-created)
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
```

## Quick Start

### 1. Clone and Navigate

```bash
# If you haven't cloned yet
git clone https://github.com/Banderalotebi/techpartner_site.git
cd techpartner_site
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
# Default port (5000) - if available
npm run dev

# Or specify a custom port if 5000 is in use
PORT=3000 npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000 (or your specified port)
- **API**: http://localhost:3000/api/*

## Development Environment Details

### Backend (Express.js)

- **Server**: Express.js with TypeScript
- **Database**: SQLite (auto-created in `data/` directory)
- **API Routes**: RESTful endpoints under `/api/*`
- **Hot Reload**: Automatic restart on file changes

### Frontend (React)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Hot Reload**: Instant updates on file changes

### Database

- **Type**: SQLite (local development)
- **Location**: `data/techpartner.db`
- **Auto-Setup**: Database and tables created automatically
- **Sample Data**: Pre-populated with service categories and packages

## Available Scripts

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database operations
npm run db:push
```

## API Endpoints

Test the backend with these endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Get service categories
curl http://localhost:3000/api/categories

# Get packages for category 1
curl http://localhost:3000/api/categories/1/packages

# User authentication
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password"}'
```

## Environment Configuration

### Development (Default)

The application automatically uses SQLite for local development. No additional setup required.

### Production Database (Optional)

If you want to use PostgreSQL for development:

1. Create `.env` file:
```env
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/techpartner_db
SESSION_SECRET=your-secret-key
PORT=3000
```

2. Set up PostgreSQL database
3. Run database migrations: `npm run db:push`

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Database Issues

```bash
# Delete and recreate database
rm -rf data/
npm run dev  # Database will be recreated
```

### Node.js Version Issues

```bash
# Check Node.js version
node --version

# Should be 18+ for best compatibility
```

### Permission Issues (macOS/Linux)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

## Development Workflow

### 1. Start Development Server

```bash
PORT=3000 npm run dev
```

### 2. Make Changes

- **Frontend**: Edit files in `client/src/`
- **Backend**: Edit files in `server/`
- **Shared**: Edit types in `shared/`

### 3. Test Changes

- **Frontend**: Changes appear instantly in browser
- **Backend**: Server restarts automatically
- **API**: Test with curl or browser

### 4. Check for Errors

- **Terminal**: Watch for TypeScript/runtime errors
- **Browser Console**: Check for frontend errors
- **Network Tab**: Verify API responses

## Production Deployment

### Build the Application

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t techpartner-site .

# Run container
docker run -p 3000:3000 techpartner-site
```

## File Structure Explained

### Key Files

- `server/index.ts` - Main server entry point
- `server/routes.ts` - API endpoint definitions  
- `server/storage-sqlite.ts` - SQLite database operations
- `client/src/main.tsx` - React application entry point
- `vite.config.ts` - Frontend build configuration
- `package.json` - Dependencies and scripts

### Auto-Generated

- `data/` - SQLite database files
- `dist/` - Production build output
- `node_modules/` - npm dependencies

## Getting Help

### Common Issues

1. **Port conflicts**: Use `PORT=3001 npm run dev`
2. **Database errors**: Delete `data/` folder and restart
3. **Module errors**: Run `npm install` again
4. **TypeScript errors**: Run `npm run check`

### Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Next Steps

Once the environment is running:

1. Explore the frontend at http://localhost:3000
2. Test API endpoints with curl or Postman
3. Review the code in `client/src/` and `server/`
4. Start building new features!

---

**Happy Coding! 🚀**
