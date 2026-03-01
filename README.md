# TechPartner - AI-Powered Agency Platform

Autonomous AI Operating System for TechPartner agency. Captures leads, scores them with AI, and sends follow-up emails automatically.

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Deploy to production
npm run deploy
```

## Architecture

```
server/
├── index.ts          # Main entry
├── routes.ts         # All API routes
├── db/
│   ├── crm.ts        # CRM database (SQLite)
│   └── auth.ts       # Auth helpers
├── routes/
│   ├── crm.ts        # AI Sales Closer
│   ├── reports.ts    # Dashboard data
│   └── chat.ts       # AI Chat (Llama 3.1)
└── middleware/
    └── auth.ts       # Simple token auth

client/               # React frontend
├── pages/
│   └── admin/        # Dashboard
└── components/       # UI components

pseo-engine/          # Astro SEO blog
└── src/pages/blog/   # Auto-generated content

scripts/
└── content-director.ts  # Weekly SEO agent
```

## Key Features

1. **AI Sales Closer** (`/api/crm/process-chat`)
   - Analyzes chat transcripts with Qwen 2.5
   - Scores leads: HOT/WARM/COLD
   - Auto-sends emails to HOT leads

2. **CRM Dashboard** (`/api/crm/stats`, `/api/crm/leads`)
   - Real-time lead metrics
   - AI-generated summaries
   - Export capabilities

3. **AI Chat** (`/api/chat`)
   - Llama 3.1 for customer conversations
   - Qualifies prospects automatically

4. **Content Director** (Weekly cron)
   - Finds "striking distance" keywords
   - Auto-generates SEO articles
   - Publishes to Astro blog

## Environment Variables

```bash
# Required
ADMIN_SECRET=your_admin_token
OLLAMA_HOST=http://localhost:11434

# Optional
DATABASE_URL=          # PostgreSQL (fallback to SQLite)
SMTP_USER=             # For email
SMTP_PASS=             # For email
```

## API Endpoints

| Endpoint | Auth | Description |
|----------|------|-------------|
| `POST /api/chat` | No | AI customer chat |
| `POST /api/crm/process-chat` | No | Process lead from chat |
| `GET /api/crm/stats` | Bearer | Lead statistics |
| `GET /api/crm/leads` | Bearer | All leads |
| `GET /api/reports/dashboard` | Bearer | Dashboard metrics |
| `GET /api/health` | No | Health check |

## Deployment

Production runs on AWS EC2 with PM2:

```bash
# Server setup
ssh ubuntu@your-ec2-ip
cd ~/techpartner
npm install
pm2 start ecosystem.config.cjs
pm2 save
```

## Database

- **CRM**: SQLite (`crm-vault.db`) - leads, interactions
- **Auth**: SQLite fallback (or PostgreSQL if configured)
- **SEO**: SQLite (`seo-prospects.db`)

## AI Models

- **Qwen 2.5 7B**: Lead scoring, content generation
- **Llama 3.1 8B**: Customer chat

Both run via Ollama locally on the server.

## File Structure (Simplified)

```
├── server/           # Backend API
├── client/           # React frontend  
├── pseo-engine/      # Astro blog
├── scripts/          # Automation
├── public/           # Static assets
├── ecosystem.config.cjs  # PM2 config
└── package.json      # Dependencies
```

## License

Private - TechPartner
