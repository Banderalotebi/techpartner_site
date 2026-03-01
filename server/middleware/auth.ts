import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { storage } from '../storage';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
    role?: string;
    isAdmin?: boolean;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// Generate JWT token
export const generateToken = (user: { id: number; email: string; username: string; role?: string }) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      username: user.username,
      role: user.role || 'client'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: number; email: string; username: string; role: string };
};

// Authentication middleware
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    console.log('🔍 Token decoded:', { id: decoded.id, email: decoded.email });

    let user = null;
    
    // Try PostgreSQL first if available and properly initialized
    if (db && typeof db.select === 'function') {
      try {
        const result = await db
          .select({
            id: users.id,
            email: users.email,
            username: users.username,
            role: users.role,
            isActive: users.isActive,
          })
          .from(users)
          .where(eq(users.id, decoded.id))
          .limit(1);
        user = result && result.length > 0 ? result[0] : null;
      } catch (dbError) {
        console.log('PostgreSQL lookup failed, falling back to storage:', dbError);
        user = null;
      }
    }
    
    // Fallback to storage (SQLite/MemStorage) if PostgreSQL not available or failed
    if (!user) {
      try {
        const storageUser = await storage.getUser(decoded.id);
        if (storageUser) {
          user = {
            id: storageUser.id,
            email: storageUser.email,
            username: storageUser.username,
            role: storageUser.role,
            isActive: storageUser.isActive,
          };
        }
      } catch (storageError) {
        console.log('Storage lookup failed:', storageError);
        user = null;
      }
    }

    console.log('🔍 User lookup result:', user || 'No user found');

    if (!user || !user.isActive) {
      console.log('❌ Auth failed:', { userExists: !!user, isActive: user?.isActive });
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Admin authentication middleware - Simple token-based (no DB lookup)
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for token in Authorization header (Bearer admin123) OR x-admin-token
    const authHeader = req.headers.authorization;
    const adminToken = req.headers["x-admin-token"];
    
    const providedToken = (authHeader && authHeader.split(" ")[1]) || adminToken;
    const SECRET = process.env.ADMIN_SECRET || "admin123";

    if (!providedToken || providedToken !== SECRET) {
      console.log('❌ Admin access denied: Invalid or missing token');
      return res.status(401).json({ error: "Access denied. Invalid or missing token." });
    }
    
    console.log('✅ Admin access granted via token');
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

// Simple token-based auth (legacy support)
export const simpleAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  const adminToken = process.env.ADMIN_TOKEN || 'admin123';
  
  if (!token || token !== `Bearer ${adminToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
