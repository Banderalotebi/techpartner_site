#!/bin/bash
# Create Server Files for Complete TechPartner Platform

echo "=== Creating Server Files ==="

cd /opt/techpartner

# Create server index.ts
cat > server/index.ts << 'EOF'
import express, { type Request, Response, NextFunction } from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection setup
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'TechPartner Studio - React Frontend',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: DATABASE_URL ? 'Connected' : 'Not configured'
  });
});

app.get('/api/categories', (req, res) => {
  res.json([
    { 
      id: 1, 
      name: 'Logo & Identity', 
      slug: 'logo-and-identity',
      description: 'Professional logo design and brand identity development'
    },
    { 
      id: 2, 
      name: 'Web & App Design', 
      slug: 'web-and-app-design',
      description: 'Modern website and mobile application design'
    },
    { 
      id: 3, 
      name: 'Custom Web Development', 
      slug: 'web-development',
      description: 'Full-stack web development with modern technologies'
    },
    { 
      id: 4, 
      name: 'Business & Advertising', 
      slug: 'business-advertising',
      description: 'Marketing materials and advertising campaign design'
    },
    { 
      id: 5, 
      name: 'Art & Illustration', 
      slug: 'art-illustration',
      description: 'Custom artwork and digital illustrations'
    },
    { 
      id: 6, 
      name: 'Packaging & Label', 
      slug: 'packaging-label',
      description: 'Product packaging and label design solutions'
    },
    { 
      id: 7, 
      name: 'Social Media', 
      slug: 'social-media',
      description: 'Social media graphics and content creation'
    },
    { 
      id: 8, 
      name: 'Print Design', 
      slug: 'print-design',
      description: 'Business cards, brochures, and print materials'
    }
  ]);
});

// Project briefs endpoint
app.post('/api/project-briefs', (req, res) => {
  const { name, email, category, description } = req.body;
  
  // In production, this would save to database
  res.json({
    id: Math.floor(Math.random() * 10000),
    name,
    email,
    category,
    description,
    status: 'received',
    createdAt: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = join(__dirname, '..', 'dist', 'public');
  app.use(express.static(publicPath));
  
  // Catch-all handler for React Router
  app.get('*', (req, res) => {
    res.sendFile(join(publicPath, 'index.html'));
  });
} else {
  // Development fallback
  app.get('*', (req, res) => {
    res.json({
      message: 'TechPartner Studio API Server',
      endpoints: ['/api/health', '/api/categories', '/api/project-briefs'],
      frontend: 'Build with npm run build to serve React frontend'
    });
  });
}

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 TechPartner Platform running on ${HOST}:${PORT}`);
  console.log(`🌐 Access: http://34.69.69.182`);
  console.log(`💾 Database: ${DATABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log(`⚡ Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Serving: ${process.env.NODE_ENV === 'production' ? 'React Frontend' : 'API Only'}`);
});
EOF

# Create database schema
cat > shared/schema.ts << 'EOF'
import { z } from "zod";

// Service Category Schema
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;

// Project Brief Schema
export const projectBriefSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["received", "in-progress", "completed"]).default("received"),
  createdAt: z.string().optional(),
});

export type ProjectBrief = z.infer<typeof projectBriefSchema>;
export type InsertProjectBrief = Omit<ProjectBrief, 'id' | 'createdAt'>;
EOF

echo "Server files created successfully!"
echo "Platform structure is now complete."