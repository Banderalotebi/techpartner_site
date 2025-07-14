# Tech Partner Site

A modern full-stack web application built with React, Express, and TypeScript.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Database**: Drizzle ORM with SQLite/PostgreSQL
- **UI Components**: Radix UI, Lucide React
- **Authentication**: Passport.js
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
├── client/           # React frontend application
├── server/           # Express backend API
├── shared/           # Shared types and utilities
├── data/            # Database files and migrations
├── scripts/         # Build and deployment scripts
├── attached_assets/ # Static assets
└── _archived_files/ # Archived/deprecated files
```

## Development

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Set up database
npm run db:push
```

### Running the Application

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

## Deployment

The application can be deployed to various platforms:

- **Google Cloud**: Use `app.yaml` configuration
- **Docker**: Use `Dockerfile` for containerization
- **Traditional VPS**: Use `deploy.sh` script

## Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

MIT
