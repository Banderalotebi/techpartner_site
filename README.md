# Tech Partner Site

A modern full-stack web application built with React, Express, and TypeScript — deployed on **AWS EC2**.

## 🚀 Live Production

- **URL**: http://ec2-54-227-243-191.compute-1.amazonaws.com:8080
- **Server**: AWS EC2 (Ubuntu) — `ec2-54-227-243-191.compute-1.amazonaws.com`
- **Process Manager**: PM2 (`techpartner` process, port 8080)
- **App Directory on Server**: `/home/ubuntu/techpartner/`
- **Branch**: `main`

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js 18
- **Database**: Drizzle ORM with SQLite
- **UI Components**: Radix UI, Lucide React
- **Authentication**: JWT-based auth
- **Build Tool**: Vite
- **Package Manager**: npm
- **Process Manager**: PM2
- **Hosting**: AWS EC2 (Ubuntu)

## Project Structure

```
├── client/           # React frontend application
├── server/           # Express backend API
├── shared/           # Shared types and utilities
├── data/             # Database files (SQLite)
├── scripts/          # Build and deployment scripts
├── public/           # Static public assets
└── dist/             # Production build output
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

## AWS EC2 Deployment

### Server Access

```bash
ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com
```

### Deploy Latest Changes

```bash
# On EC2 server — pull latest from GitHub and restart
cd /home/ubuntu/techpartner
git pull origin main
pm2 restart techpartner
```

### PM2 Commands

```bash
pm2 list                    # View running processes
pm2 logs techpartner        # View app logs
pm2 restart techpartner     # Restart app
pm2 stop techpartner        # Stop app
pm2 start techpartner       # Start app
```

### GitHub Repository

```
https://github.com/Banderalotebi/techpartner_site.git
```

Push changes from local machine:

```bash
cd "/Users/bander/techpartner_site-main "   # Note: trailing space in dir name
git add -A
git commit -m "your message"
git push origin main
```

Then SSH into EC2 and pull:

```bash
ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com
cd /home/ubuntu/techpartner && git pull origin main && pm2 restart techpartner
```

## Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=production
PORT=8080
DATABASE_URL=./data/techpartner.db
SESSION_SECRET=your_session_secret
TAP_SECRET_KEY=your_tap_payments_key
```

## API Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/categories` | GET | No | List service categories |
| `/api/auth/user` | GET | Yes (JWT) | Get current user |
| `/api/orders` | GET | Yes (JWT) | List user orders |
| `/api/sitemap.xml` | GET | No | XML sitemap |
| `/api/robots.txt` | GET | No | Robots file |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Run type checking: `npm run check`
5. Commit and push: `git push origin feature/my-feature`
6. Submit a pull request to `main`

## License

MIT
