import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import type { 
  User, InsertUser, 
  ServiceCategory, InsertServiceCategory,
  ServicePackage, InsertServicePackage,
  ProjectBrief, InsertProjectBrief,
  QuizResponse, InsertQuizResponse,
  Order, InsertOrder,
  Payment, InsertPayment
} from "@shared/schema";
import type { IStorage } from "./storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class SQLiteStorage implements IStorage {
  private db: Database.Database;

  constructor() {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    try {
      require("fs").mkdirSync(dataDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Initialize database
    const dbPath = path.join(dataDir, "techpartner.db");
    this.db = new Database(dbPath);
    
    // Enable foreign keys
    this.db.pragma("foreign_keys = ON");
    
    this.initializeTables();
    this.seedData();
  }

  private initializeTables() {
    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT,
        lastName TEXT,
        phoneNumber TEXT,
        company TEXT,
        industry TEXT,
        role TEXT DEFAULT 'client',
        isEmailVerified BOOLEAN DEFAULT FALSE,
        lastLoginAt TEXT,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Service Categories table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS service_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        isActive BOOLEAN DEFAULT TRUE,
        sortOrder INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Service Packages table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS service_packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoryId INTEGER NOT NULL,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        currency TEXT DEFAULT 'SAR',
        features TEXT, -- JSON string
        deliveryTime INTEGER,
        isActive BOOLEAN DEFAULT TRUE,
        sortOrder INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES service_categories(id)
      )
    `);

    // Project Briefs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS project_briefs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        packageId INTEGER,
        projectName TEXT NOT NULL,
        description TEXT NOT NULL,
        timeline TEXT,
        urgency TEXT DEFAULT 'medium',
        budget TEXT,
        contactPreference TEXT DEFAULT 'email',
        files TEXT, -- JSON string for file paths
        requirements TEXT, -- JSON string
        status TEXT DEFAULT 'pending',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (packageId) REFERENCES service_packages(id)
      )
    `);

    // Quiz Responses table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS quiz_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        brandName TEXT,
        brandValues TEXT, -- JSON string
        targetAudience TEXT,
        preferredStyles TEXT, -- JSON string
        colorPreferences TEXT, -- JSON string
        inspirationBrands TEXT, -- JSON string
        recommendations TEXT, -- JSON string
        completedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Orders table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        packageId INTEGER,
        orderNumber TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'pending',
        totalAmount REAL NOT NULL,
        currency TEXT DEFAULT 'SAR',
        customerInfo TEXT, -- JSON string
        projectDetails TEXT, -- JSON string
        paymentStatus TEXT DEFAULT 'pending',
        estimatedDelivery TEXT,
        actualDelivery TEXT,
        notes TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (packageId) REFERENCES service_packages(id)
      )
    `);

    // Payments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'SAR',
        paymentMethod TEXT,
        paymentProvider TEXT,
        transactionId TEXT,
        status TEXT DEFAULT 'pending',
        paidAt TEXT,
        failureReason TEXT,
        metadata TEXT, -- JSON string
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id)
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);
      CREATE INDEX IF NOT EXISTS idx_service_packages_slug ON service_packages(slug);
      CREATE INDEX IF NOT EXISTS idx_service_packages_category ON service_packages(categoryId);
      CREATE INDEX IF NOT EXISTS idx_project_briefs_user ON project_briefs(userId);
      CREATE INDEX IF NOT EXISTS idx_quiz_responses_user ON quiz_responses(userId);
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(userId);
      CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(orderNumber);
      CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(orderId);
    `);
  }

  private seedData() {
    // Check if data already exists
    const categoryCount = this.db.prepare("SELECT COUNT(*) as count FROM service_categories").get() as { count: number };
    if (categoryCount.count > 0) return;

    // Insert service categories
    const insertCategory = this.db.prepare(`
      INSERT INTO service_categories (name, slug, description, icon, sortOrder)
      VALUES (?, ?, ?, ?, ?)
    `);

    const categories = [
      { name: "Logo & Identity", slug: "logo-and-identity", description: "Professional logo design and brand identity creation", icon: "palette", sortOrder: 1 },
      { name: "Web & App Design", slug: "web-and-app-design", description: "Modern website and mobile app design services", icon: "monitor", sortOrder: 2 },
      { name: "Business & Advertising", slug: "business-advertising", description: "Marketing materials and business advertising design", icon: "briefcase", sortOrder: 3 },
      { name: "Clothing & Merchandise", slug: "clothing-merchandise", description: "Custom clothing and promotional merchandise design", icon: "shirt", sortOrder: 4 },
      { name: "Art & Illustration", slug: "art-illustration", description: "Custom artwork and digital illustrations", icon: "paintbrush", sortOrder: 5 },
      { name: "Packaging & Label", slug: "packaging-label", description: "Product packaging and label design services", icon: "package", sortOrder: 6 },
      { name: "Social Media", slug: "social-media", description: "Social media graphics and content design", icon: "share", sortOrder: 7 },
      { name: "Print Design", slug: "print-design", description: "Business cards, brochures, and print materials", icon: "printer", sortOrder: 8 }
    ];

    categories.forEach(cat => {
      insertCategory.run(cat.name, cat.slug, cat.description, cat.icon, cat.sortOrder);
    });

    // Insert service packages
    const insertPackage = this.db.prepare(`
      INSERT INTO service_packages (categoryId, name, slug, description, price, features, deliveryTime, sortOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const packages = [
      // Logo & Identity packages
      { categoryId: 1, name: "Basic Logo", slug: "basic-logo", description: "Simple logo design with 3 concepts", price: 800, features: JSON.stringify(["3 logo concepts", "2 revisions", "PNG & JPG files"]), deliveryTime: 5, sortOrder: 1 },
      { categoryId: 1, name: "Premium Logo", slug: "premium-logo", description: "Professional logo with brand guidelines", price: 1500, features: JSON.stringify(["5 logo concepts", "Unlimited revisions", "Full brand package", "Vector files"]), deliveryTime: 7, sortOrder: 2 },
      { categoryId: 1, name: "Complete Brand Identity", slug: "complete-brand", description: "Full brand identity system", price: 3000, features: JSON.stringify(["Complete logo suite", "Brand guidelines", "Business card design", "Letterhead design"]), deliveryTime: 14, sortOrder: 3 },
      
      // Web & App Design packages
      { categoryId: 2, name: "Website Design", slug: "website-design", description: "Modern responsive website design", price: 2500, features: JSON.stringify(["Up to 5 pages", "Mobile responsive", "Modern design", "2 revisions"]), deliveryTime: 10, sortOrder: 1 },
      { categoryId: 2, name: "E-commerce Design", slug: "ecommerce-design", description: "Complete online store design", price: 4500, features: JSON.stringify(["Product pages", "Shopping cart", "Payment integration", "Admin panel"]), deliveryTime: 21, sortOrder: 2 },
      { categoryId: 2, name: "Mobile App Design", slug: "mobile-app-design", description: "iOS and Android app design", price: 6000, features: JSON.stringify(["UI/UX design", "Prototype", "Developer handoff", "All screen designs"]), deliveryTime: 28, sortOrder: 3 },
      
      // Custom Web Development packages
      { categoryId: 2, name: "Starter Site", slug: "starter-site", description: "Basic website development for small businesses", price: 25000, features: JSON.stringify(["Up to 5 pages", "Contact forms", "Basic SEO", "Mobile responsive", "1 month support"]), deliveryTime: 21, sortOrder: 4 },
      { categoryId: 2, name: "Business Pro", slug: "business-pro", description: "Advanced business website with CMS", price: 35000, features: JSON.stringify(["Up to 15 pages", "CMS integration", "E-commerce ready", "Advanced SEO", "Analytics setup", "3 months support"]), deliveryTime: 35, sortOrder: 5 },
      { categoryId: 2, name: "Premium Build", slug: "premium-build", description: "Full-stack web application development", price: 45000, features: JSON.stringify(["Custom development", "Database integration", "User authentication", "API development", "Advanced features", "6 months support"]), deliveryTime: 45, sortOrder: 6 }
    ];

    packages.forEach(pkg => {
      insertPackage.run(pkg.categoryId, pkg.name, pkg.slug, pkg.description, pkg.price, pkg.features, pkg.deliveryTime, pkg.sortOrder);
    });

    console.log("✅ SQLite database seeded with sample data");
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const stmt = this.db.prepare("SELECT * FROM users WHERE id = ?");
    const row = stmt.get(id) as any;
    return row ? this.mapUserRow(row) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const stmt = this.db.prepare("SELECT * FROM users WHERE username = ?");
    const row = stmt.get(username) as any;
    return row ? this.mapUserRow(row) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const stmt = this.db.prepare("SELECT * FROM users WHERE email = ?");
    const row = stmt.get(email) as any;
    return row ? this.mapUserRow(row) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const stmt = this.db.prepare(`
      INSERT INTO users (username, email, password, firstName, lastName, phoneNumber, company, industry, role, isEmailVerified, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    const result = stmt.run(
      insertUser.username,
      insertUser.email,
      insertUser.password,
      insertUser.firstName || null,
      insertUser.lastName || null,
      insertUser.phoneNumber || null,
      insertUser.company || null,
      insertUser.industry || null,
      insertUser.role || 'client',
      insertUser.isEmailVerified || false,
      insertUser.isActive !== false
    );

    return this.getUser(result.lastInsertRowid as number) as Promise<User>;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    
    const stmt = this.db.prepare(`
      UPDATE users SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
    `);
    
    stmt.run(...values, id);
    return this.getUser(id);
  }

  async authenticateUser(email: string, password: string): Promise<User | undefined> {
    const stmt = this.db.prepare("SELECT * FROM users WHERE email = ? AND password = ?");
    const row = stmt.get(email, password) as any;
    
    if (row) {
      // Update last login
      const updateStmt = this.db.prepare("UPDATE users SET lastLoginAt = CURRENT_TIMESTAMP WHERE id = ?");
      updateStmt.run(row.id);
      return this.mapUserRow(row);
    }
    
    return undefined;
  }

  // Service Category methods
  async getServiceCategories(): Promise<ServiceCategory[]> {
    const stmt = this.db.prepare("SELECT * FROM service_categories WHERE isActive = 1 ORDER BY sortOrder, name");
    const rows = stmt.all() as any[];
    return rows.map(row => this.mapCategoryRow(row));
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    const stmt = this.db.prepare("SELECT * FROM service_categories WHERE id = ?");
    const row = stmt.get(id) as any;
    return row ? this.mapCategoryRow(row) : undefined;
  }

  async getServiceCategoryBySlug(slug: string): Promise<ServiceCategory | undefined> {
    const stmt = this.db.prepare("SELECT * FROM service_categories WHERE slug = ?");
    const row = stmt.get(slug) as any;
    return row ? this.mapCategoryRow(row) : undefined;
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const stmt = this.db.prepare(`
      INSERT INTO service_categories (name, slug, description, icon, isActive, sortOrder)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      category.name,
      category.slug,
      category.description || null,
      category.icon || null,
      category.isActive !== false,
      category.sortOrder || 0
    );

    return this.getServiceCategory(result.lastInsertRowid as number) as Promise<ServiceCategory>;
  }

  // Service Package methods
  async getServicePackages(): Promise<ServicePackage[]> {
    const stmt = this.db.prepare("SELECT * FROM service_packages WHERE isActive = 1 ORDER BY categoryId, sortOrder, name");
    const rows = stmt.all() as any[];
    return rows.map(row => this.mapPackageRow(row));
  }

  async getServicePackagesByCategory(categoryId: number): Promise<ServicePackage[]> {
    const stmt = this.db.prepare("SELECT * FROM service_packages WHERE categoryId = ? AND isActive = 1 ORDER BY sortOrder, name");
    const rows = stmt.all(categoryId) as any[];
    return rows.map(row => this.mapPackageRow(row));
  }

  async getServicePackage(id: number): Promise<ServicePackage | undefined> {
    const stmt = this.db.prepare("SELECT * FROM service_packages WHERE id = ?");
    const row = stmt.get(id) as any;
    return row ? this.mapPackageRow(row) : undefined;
  }

  async getServicePackageBySlug(slug: string): Promise<ServicePackage | undefined> {
    const stmt = this.db.prepare("SELECT * FROM service_packages WHERE slug = ?");
    const row = stmt.get(slug) as any;
    return row ? this.mapPackageRow(row) : undefined;
  }

  async createServicePackage(package_: InsertServicePackage): Promise<ServicePackage> {
    const stmt = this.db.prepare(`
      INSERT INTO service_packages (categoryId, name, slug, description, price, currency, features, deliveryTime, isActive, sortOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      package_.categoryId,
      package_.name,
      package_.slug,
      package_.description || null,
      package_.price,
      package_.currency || 'SAR',
      JSON.stringify(package_.features || []),
      package_.deliveryTime || null,
      package_.isActive !== false,
      package_.sortOrder || 0
    );

    return this.getServicePackage(result.lastInsertRowid as number) as Promise<ServicePackage>;
  }

  // Project Brief methods
  async getProjectBriefs(): Promise<ProjectBrief[]> {
    const stmt = this.db.prepare("SELECT * FROM project_briefs ORDER BY createdAt DESC");
    const rows = stmt.all() as any[];
    return rows.map(row => this.mapProjectBriefRow(row));
  }

  async getProjectBrief(id: number): Promise<ProjectBrief | undefined> {
    const stmt = this.db.prepare("SELECT * FROM project_briefs WHERE id = ?");
    const row = stmt.get(id) as any;
    return row ? this.mapProjectBriefRow(row) : undefined;
  }

  async createProjectBrief(brief: InsertProjectBrief): Promise<ProjectBrief> {
    const stmt = this.db.prepare(`
      INSERT INTO project_briefs (userId, packageId, projectName, description, timeline, urgency, budget, contactPreference, files, requirements, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      brief.userId || null,
      brief.packageId || null,
      brief.projectName,
      brief.description,
      brief.timeline || null,
      brief.urgency || 'medium',
      brief.budget || null,
      brief.contactPreference || 'email',
      JSON.stringify(brief.files || []),
      JSON.stringify(brief.requirements || {}),
      brief.status || 'pending'
    );

    return this.getProjectBrief(result.lastInsertRowid as number) as Promise<ProjectBrief>;
  }

  // Quiz Response methods
  async getQuizResponses(): Promise<QuizResponse[]> {
    const stmt = this.db.prepare("SELECT * FROM quiz_responses ORDER BY completedAt DESC");
    const rows = stmt.all() as any[];
    return rows.map(row => this.mapQuizResponseRow(row));
  }

  async createQuizResponse(response: InsertQuizResponse): Promise<QuizResponse> {
    const stmt = this.db.prepare(`
      INSERT INTO quiz_responses (userId, brandName, brandValues, targetAudience, preferredStyles, colorPreferences, inspirationBrands, recommendations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const recommendations = this.generateRecommendations(response);

    const result = stmt.run(
      response.userId || null,
      response.brandName || null,
      JSON.stringify(response.brandValues || []),
      response.targetAudience || null,
      JSON.stringify(response.preferredStyles || []),
      JSON.stringify(response.colorPreferences || []),
      JSON.stringify(response.inspirationBrands || []),
      JSON.stringify(recommendations)
    );

    const stmt2 = this.db.prepare("SELECT * FROM quiz_responses WHERE id = ?");
    const row = stmt2.get(result.lastInsertRowid) as any;
    return this.mapQuizResponseRow(row);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    const stmt = this.db.prepare("SELECT * FROM orders ORDER BY createdAt DESC");
    const rows = stmt.all() as any[];
    return rows.map(row => this.mapOrderRow(row));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const stmt = this.db.prepare("SELECT * FROM orders WHERE id = ?");
    const row = stmt.get(id) as any;
    return row ? this.mapOrderRow(row) : undefined;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    const stmt = this.db.prepare("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC");
    const rows = stmt.all(userId) as any[];
    return rows.map(row => this.mapOrderRow(row));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const orderNumber = `TP${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const stmt = this.db.prepare(`
      INSERT INTO orders (userId, packageId, orderNumber, status, totalAmount, currency, customerInfo, projectDetails, paymentStatus, estimatedDelivery, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      insertOrder.userId,
      insertOrder.packageId || null,
      orderNumber,
      insertOrder.status || 'pending',
      insertOrder.totalAmount,
      insertOrder.currency || 'SAR',
      JSON.stringify(insertOrder.customerInfo || {}),
      JSON.stringify(insertOrder.projectDetails || {}),
      insertOrder.paymentStatus || 'pending',
      insertOrder.estimatedDelivery || null,
      insertOrder.notes || null
    );

    return this.getOrder(result.lastInsertRowid as number) as Promise<Order>;
  }

  async updateOrder(id: number, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const fields = [];
    const values = [];
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (key === 'customerInfo' || key === 'projectDetails') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return this.getOrder(id);

    const stmt = this.db.prepare(`
      UPDATE orders SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
    `);
    
    stmt.run(...values, id);
    return this.getOrder(id);
  }

  // Payment methods
  async getPayments(): Promise<Payment[]> {
    const stmt = this.db.prepare("SELECT * FROM payments ORDER BY createdAt DESC");
    const rows = stmt.all() as any[];
    return rows.map(row => this.mapPaymentRow(row));
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const stmt = this.db.prepare("SELECT * FROM payments WHERE id = ?");
    const row = stmt.get(id) as any;
    return row ? this.mapPaymentRow(row) : undefined;
  }

  async getPaymentsByOrder(orderId: number): Promise<Payment[]> {
    const stmt = this.db.prepare("SELECT * FROM payments WHERE orderId = ? ORDER BY createdAt DESC");
    const rows = stmt.all(orderId) as any[];
    return rows.map(row => this.mapPaymentRow(row));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const stmt = this.db.prepare(`
      INSERT INTO payments (orderId, amount, currency, paymentMethod, paymentProvider, transactionId, status, paidAt, failureReason, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      insertPayment.orderId,
      insertPayment.amount,
      insertPayment.currency || 'SAR',
      insertPayment.paymentMethod || null,
      insertPayment.paymentProvider || null,
      insertPayment.transactionId || null,
      insertPayment.status || 'pending',
      insertPayment.paidAt || null,
      insertPayment.failureReason || null,
      JSON.stringify(insertPayment.metadata || {})
    );

    return this.getPayment(result.lastInsertRowid as number) as Promise<Payment>;
  }

  async updatePayment(id: number, updateData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const fields = [];
    const values = [];
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (key === 'metadata') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return this.getPayment(id);

    const stmt = this.db.prepare(`
      UPDATE payments SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
    `);
    
    stmt.run(...values, id);
    return this.getPayment(id);
  }

  // Helper methods for row mapping
  private mapUserRow(row: any): User {
    return {
      ...row,
      isEmailVerified: Boolean(row.isEmailVerified),
      isActive: Boolean(row.isActive),
      lastLoginAt: row.lastLoginAt ? new Date(row.lastLoginAt) : null,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private mapCategoryRow(row: any): ServiceCategory {
    return {
      ...row,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private mapPackageRow(row: any): ServicePackage {
    return {
      ...row,
      features: JSON.parse(row.features || '[]'),
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private mapProjectBriefRow(row: any): ProjectBrief {
    return {
      ...row,
      files: JSON.parse(row.files || '[]'),
      requirements: JSON.parse(row.requirements || '{}'),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private mapQuizResponseRow(row: any): QuizResponse {
    return {
      ...row,
      brandValues: JSON.parse(row.brandValues || '[]'),
      preferredStyles: JSON.parse(row.preferredStyles || '[]'),
      colorPreferences: JSON.parse(row.colorPreferences || '[]'),
      inspirationBrands: JSON.parse(row.inspirationBrands || '[]'),
      recommendations: JSON.parse(row.recommendations || '[]'),
      completedAt: new Date(row.completedAt)
    };
  }

  private mapOrderRow(row: any): Order {
    return {
      ...row,
      customerInfo: JSON.parse(row.customerInfo || '{}'),
      projectDetails: JSON.parse(row.projectDetails || '{}'),
      estimatedDelivery: row.estimatedDelivery ? new Date(row.estimatedDelivery) : null,
      actualDelivery: row.actualDelivery ? new Date(row.actualDelivery) : null,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private mapPaymentRow(row: any): Payment {
    return {
      ...row,
      paidAt: row.paidAt ? new Date(row.paidAt) : null,
      metadata: JSON.parse(row.metadata || '{}'),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private generateRecommendations(response: InsertQuizResponse): string[] {
    const recommendations = [];
    
    if (response.brandValues?.includes('professional')) {
      recommendations.push('Logo & Identity - Professional Package');
    }
    if (response.brandValues?.includes('creative')) {
      recommendations.push('Art & Illustration - Custom Design');
    }
    if (response.targetAudience?.includes('business')) {
      recommendations.push('Business & Advertising - Marketing Package');
    }
    
    return recommendations.length > 0 ? recommendations : ['Logo & Identity - Basic Package'];
  }
}