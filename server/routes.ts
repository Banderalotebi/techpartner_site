import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectBriefSchema, 
  insertQuizResponseSchema,
  insertOrderSchema,
  insertPaymentSchema,
  insertUserSchema
} from "../shared/schema";
import { logActivity } from "./activityLogger";
import { z } from "zod";
import inquiryRoutes from "./routes/inquiry";
import emailTestRoutes from "./routes/email-test";
import paymentRoutes from "./routes/payments";
import adminRoutes from "./routes/admin";
import blogRoutes from "./routes/blog";
import i18nRoutes from "./routes/i18n";
import { chatRouter } from "./routes/chat";
import { crmRouter } from "./routes/crm";
import { reportsRouter } from "./routes/reports";
import { generateToken, verifyToken, requireAuth, requireAdmin, type AuthRequest } from "./middleware/auth";
import bcrypt from 'bcryptjs';
import { seoOrchestrator } from "./seo-agent";
import { trackingRouter } from "./routes/tracking";
import Database from 'better-sqlite3';

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Google Cloud App Engine
  app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'TechPartner Platform'
    });
  });

  // SEO routes
  app.get('/sitemap.xml', (req, res) => {
    const publicPath = process.env.NODE_ENV === 'production' ? 'dist/public' : 'public';
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile('sitemap.xml', { root: publicPath });
  });

  app.get('/sitemap', (req, res) => {
    const publicPath = process.env.NODE_ENV === 'production' ? 'dist/public' : 'public';
    res.setHeader('Content-Type', 'text/html');
    res.sendFile('sitemap.html', { root: publicPath });
  });

  app.get('/robots.txt', (req, res) => {
    const publicPath = process.env.NODE_ENV === 'production' ? 'dist/public' : 'public';
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile('robots.txt', { root: publicPath });
  });

  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile('robots.txt', { root: 'public' });
  });

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email!);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(data.password, 12);
      const userData = { ...data, password: hashedPassword };

      const user = await storage.createUser(userData);
      
      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username
      });

      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        user: userWithoutPassword, 
        token,
        message: 'Registration successful'
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt:', { email, passwordLength: password?.length });
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email);
      console.log('User found:', user ? { id: user.id, email: user.email, isActive: user.isActive } : 'No user found');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ error: 'Account is deactivated. Please contact support.' });
      }

      // Update last login time
      await storage.updateUserLastLogin(user.id);

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username
      });

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ 
        user: userWithoutPassword, 
        token,
        message: 'Login successful'
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/auth/user', requireAuth, async (req: AuthRequest, res) => {
    try {
      // Return current user info from token
      if (req.user) {
        // Get fresh user data from database
        const user = await storage.getUserByEmail(req.user.email);
        if (user && user.isActive) {
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        }
      }
      res.status(401).json({ error: 'User not found or inactive' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/logout', requireAuth, async (req: AuthRequest, res) => {
    // For JWT, logout is handled client-side by removing the token
    // Optionally, you could implement a token blacklist here
    res.json({ message: 'Logout successful' });
  });

  // Update profile endpoint
  app.put('/api/auth/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { firstName, lastName, email, phone, address } = req.body;
      const userId = req.user!.id;

      // Check if email is being changed and if it's already in use
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: 'Email already in use' });
        }
      }

      // Update user profile
      const updatedUser = await storage.updateUser(userId, {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address })
      });

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        address: updatedUser.address
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Change password endpoint
  app.put('/api/auth/password', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user!.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      // Get current user
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await storage.updateUser(userId, { password: hashedNewPassword });

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  });

  // Get all service categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get service packages by category
  app.get("/api/categories/:categoryId/packages", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const packages = await storage.getServicePackagesByCategory(categoryId);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // Get all service packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getServicePackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // Get specific package
  app.get("/api/packages/:packageId", async (req, res) => {
    try {
      const packageId = parseInt(req.params.packageId);
      if (isNaN(packageId)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      
      const package_ = await storage.getServicePackage(packageId);
      if (!package_) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.json(package_);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });

  // Submit project brief
  app.post("/api/project-briefs", async (req, res) => {
    try {
      const validatedData = insertProjectBriefSchema.parse(req.body);
      
      // Verify package exists
      const package_ = await storage.getServicePackage(validatedData.packageId);
      if (!package_) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      
      const brief = await storage.createProjectBrief(validatedData);
      res.status(201).json(brief);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create project brief" });
    }
  });

  // Submit quiz response
  app.post("/api/quiz-responses", async (req, res) => {
    try {
      const validatedData = insertQuizResponseSchema.parse(req.body);
      const response = await storage.createQuizResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create quiz response" });
    }
  });

  // Get all project briefs (admin endpoint)
  app.get("/api/project-briefs", requireAdmin, async (req: AuthRequest, res) => {
    try {
      console.log('🔍 Admin accessing project briefs:', { email: req.user?.email, role: req.user?.role });
      const briefs = await storage.getProjectBriefs();
      res.json(briefs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project briefs" });
    }
  });

  // TPOS Integration - Orders API
  app.get("/api/orders", requireAdmin, async (req: AuthRequest, res) => {
    try {
      console.log('🔍 Admin accessing orders:', { email: req.user?.email, role: req.user?.role });
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validation = insertOrderSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validation.error.issues 
        });
      }

      const order = await storage.createOrder(validation.data);
      // Log activity for order creation
      await logActivity({
        userId: order.userId || null,
        event: "ORDER_CREATED",
        entity: "order",
        entityId: order.id,
        metadata: { ...order }
      });
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/orders/:id", requireAdmin, async (req: AuthRequest, res) => {
    try {
      console.log('🔍 Admin updating order:', { email: req.user?.email, role: req.user?.role, orderId: req.params.id });
      const id = parseInt(req.params.id);
      const order = await storage.updateOrder(id, req.body);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      // Log activity for order update
      await logActivity({
        userId: order.userId || null,
        event: "ORDER_UPDATED",
        entity: "order",
        entityId: order.id,
        metadata: { ...order }
      });
      res.json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PATCH endpoint for partial order updates (like status updates)
  app.patch("/api/orders/:id", requireAdmin, async (req: AuthRequest, res) => {
    try {
      console.log('🔍 Admin patching order:', { email: req.user?.email, role: req.user?.role, orderId: req.params.id });
      const id = parseInt(req.params.id);
      const { status, paymentStatus } = req.body;
      
      const updateData: any = {};
      if (status && ["pending", "processing", "completed", "cancelled"].includes(status)) {
        updateData.status = status;
      }
      if (paymentStatus && ["pending", "completed", "failed", "refunded"].includes(paymentStatus)) {
        updateData.paymentStatus = paymentStatus;
      }
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No valid update fields provided" });
      }
      
      const order = await storage.updateOrder(id, updateData);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      // Log activity for order patch/update
      await logActivity({
        userId: order.userId || null,
        event: "ORDER_UPDATED",
        entity: "order",
        entityId: order.id,
        metadata: { ...order }
      });
      res.json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User-specific order endpoints
  app.get("/api/orders/my", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/stats", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const orders = await storage.getOrdersByUser(userId);
      
      // Calculate statistics
      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status.toLowerCase() === 'pending').length,
        paid: orders.filter(o => o.status.toLowerCase() === 'paid' || o.status.toLowerCase() === 'completed').length,
        failed: orders.filter(o => o.status.toLowerCase() === 'failed').length,
        cancelled: orders.filter(o => o.status.toLowerCase() === 'cancelled').length,
        totalSpent: orders
          .filter(o => o.status.toLowerCase() === 'paid' || o.status.toLowerCase() === 'completed')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching order stats:', error);
      res.status(500).json({ error: "Failed to fetch order statistics" });
    }
  });

  // TPOS Integration - Payments API
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const validation = insertPaymentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validation.error.issues 
        });
      }

      const payment = await storage.createPayment(validation.data);
      res.status(201).json(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin API routes
  app.get("/api/users", requireAdmin, async (req: AuthRequest, res) => {
    try {
      console.log('🔍 Admin accessing users:', { email: req.user?.email, role: req.user?.role });
      // For demo, create some sample users if none exist
      const user1 = await storage.getUserByEmail("ahmed@sauditech.com");
      if (!user1) {
        await storage.createUser({
          username: "ahmed_salem",
          email: "ahmed@sauditech.com",
          password: "password123",
          firstName: "Ahmed",
          lastName: "Salem",
          phone: "+966501234567"
        });
        await storage.createUser({
          username: "layla_mohammed", 
          email: "layla@fashionboutique.sa",
          password: "password456",
          firstName: "Layla",
          lastName: "Mohammed",
          phone: "+966509876543"
        });
      }
      
      // Return sample users for demo
      const sampleUsers = [
        {
          id: 1,
          username: "ahmed_salem",
          email: "ahmed@sauditech.com",
          firstName: "Ahmed",
          lastName: "Salem",
          phone: "+966501234567",
          isActive: true,
          createdAt: new Date('2024-01-15'),
          lastLoginAt: new Date('2024-12-07')
        },
        {
          id: 2,
          username: "layla_mohammed",
          email: "layla@fashionboutique.sa",
          firstName: "Layla",
          lastName: "Mohammed",
          phone: "+966509876543",
          isActive: true,
          createdAt: new Date('2024-02-20'),
          lastLoginAt: new Date('2024-12-06')
        }
      ];
      res.json(sampleUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/orders/:id", requireAdmin, async (req: AuthRequest, res) => {
    try {
      console.log('🔍 Admin patching order (duplicate route):', { email: req.user?.email, role: req.user?.role, orderId: req.params.id });
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedOrder = await storage.updateOrder(orderId, { status });
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Services endpoint — returns categories with their packages
  app.get("/api/services", async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      const packages = await storage.getServicePackages();

      const services = categories.map((cat: any) => ({
        ...cat,
        packages: packages.filter((pkg: any) => pkg.categoryId === cat.id),
      }));

      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Register blog routes
  app.use('/api', blogRoutes);

  // Register inquiry routes
  app.use('/api', inquiryRoutes);

  // Register email test routes (development only)
  app.use('/api', emailTestRoutes);

  // Register payment routes
  app.use('/api', paymentRoutes);

  // Register admin routes
  app.use('/api', adminRoutes);

  // Register i18n routes
  app.use('/api/i18n', i18nRoutes);

  // Register chat routes
  app.use("/api/chat", chatRouter);

  // Register CRM routes (AI Sales Closer)
  app.use("/api/crm", crmRouter);

  // Register Reports routes (Phase 4)
  app.use("/api/reports", reportsRouter);

  // Initialize SEO Database
  const db = new Database('seo-prospects.db');
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS prospects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT UNIQUE,
      approved BOOLEAN,
      reason TEXT,
      draft_email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  const insertProspect = db.prepare(`
    INSERT OR IGNORE INTO prospects (url, approved, reason, draft_email) 
    VALUES (?, ?, ?, ?)
  `);

  // SEO Analysis endpoint
  app.post("/api/seo/analyze", async (req, res) => {
    try {
      const { url, content } = req.body;

      if (!url || !content) {
        return res.status(400).json({ error: "Missing url or content" });
      }

      // Trigger the LangGraph State Machine
      const finalState = await seoOrchestrator.invoke({
        prospectUrl: url,
        scrapedContent: content,
        isRelevant: false,
        analysisReason: "",
        draftEmail: "",
      });

      // Save to database
      insertProspect.run(
        finalState.prospectUrl, 
        finalState.isRelevant ? 1 : 0, 
        finalState.analysisReason, 
        finalState.draftEmail || null
      );

      // Return the AI's decision and the drafted email (if applicable)
      res.json({
        url: finalState.prospectUrl,
        approved: finalState.isRelevant,
        reason: finalState.analysisReason,
        draft: finalState.draftEmail || null,
      });

    } catch (error) {
      console.error("SEO Agent Error:", error);
      res.status(500).json({ error: "Agent execution failed." });
    }
  });

  // Register tracking router for /go/ links
  app.use("/go", trackingRouter);

  const httpServer = createServer(app);
  return httpServer;
}
