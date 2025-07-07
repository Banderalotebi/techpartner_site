import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectBriefSchema, 
  insertQuizResponseSchema,
  insertOrderSchema,
  insertPaymentSchema,
  insertUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

      const user = await storage.createUser(data);
      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/auth/user', async (req, res) => {
    // For demo purposes, return null (no authentication session)
    res.json(null);
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
  app.get("/api/project-briefs", async (req, res) => {
    try {
      const briefs = await storage.getProjectBriefs();
      res.json(briefs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project briefs" });
    }
  });

  // TPOS Integration - Orders API
  app.get("/api/orders", async (req, res) => {
    try {
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
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.updateOrder(id, req.body);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PATCH endpoint for partial order updates (like status updates)
  app.patch("/api/orders/:id", async (req, res) => {
    try {
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
      
      res.json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: "Internal server error" });
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
  app.get("/api/users", async (_req, res) => {
    try {
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

  app.patch("/api/orders/:id", async (req, res) => {
    try {
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

  const httpServer = createServer(app);
  return httpServer;
}
