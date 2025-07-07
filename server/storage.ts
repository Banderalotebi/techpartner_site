import { 
  users, type User, type InsertUser,
  serviceCategories, type ServiceCategory, type InsertServiceCategory,
  servicePackages, type ServicePackage, type InsertServicePackage,
  projectBriefs, type ProjectBrief, type InsertProjectBrief,
  quizResponses, type QuizResponse, type InsertQuizResponse,
  orders, type Order, type InsertOrder,
  payments, type Payment, type InsertPayment
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  authenticateUser(email: string, password: string): Promise<User | undefined>;
  
  // Service Categories
  getServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  getServiceCategoryBySlug(slug: string): Promise<ServiceCategory | undefined>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Service Packages
  getServicePackages(): Promise<ServicePackage[]>;
  getServicePackagesByCategory(categoryId: number): Promise<ServicePackage[]>;
  getServicePackage(id: number): Promise<ServicePackage | undefined>;
  getServicePackageBySlug(slug: string): Promise<ServicePackage | undefined>;
  createServicePackage(package_: InsertServicePackage): Promise<ServicePackage>;
  
  // Project Briefs
  getProjectBriefs(): Promise<ProjectBrief[]>;
  getProjectBrief(id: number): Promise<ProjectBrief | undefined>;
  createProjectBrief(brief: InsertProjectBrief): Promise<ProjectBrief>;
  
  // Quiz Responses
  getQuizResponses(): Promise<QuizResponse[]>;
  createQuizResponse(response: InsertQuizResponse): Promise<QuizResponse>;
  
  // TPOS Integration - Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // TPOS Integration - Payments
  getPayments(): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByOrder(orderId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private serviceCategories: Map<number, ServiceCategory>;
  private servicePackages: Map<number, ServicePackage>;
  private projectBriefs: Map<number, ProjectBrief>;
  private quizResponses: Map<number, QuizResponse>;
  private orders: Map<number, Order>;
  private payments: Map<number, Payment>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentPackageId: number;
  private currentBriefId: number;
  private currentQuizId: number;
  private currentOrderId: number;
  private currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.serviceCategories = new Map();
    this.servicePackages = new Map();
    this.projectBriefs = new Map();
    this.quizResponses = new Map();
    this.orders = new Map();
    this.payments = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentPackageId = 1;
    this.currentBriefId = 1;
    this.currentQuizId = 1;
    this.currentOrderId = 1;
    this.currentPaymentId = 1;
    
    this.seedData();
    this.seedAdminData();
  }

  private seedData() {
    // Seed service categories
    const categories: InsertServiceCategory[] = [
      {
        name: "Logo & Identity",
        slug: "logo-identity",
        icon: "fas fa-palette",
        description: "Professional logo design and brand identity solutions",
        isActive: true
      },
      {
        name: "Web App Design",
        slug: "web-app",
        icon: "fas fa-laptop-code",
        description: "Modern web application design and development",
        isActive: false
      },
      {
        name: "Business Advertising",
        slug: "advertising",
        icon: "fas fa-bullhorn",
        description: "Marketing materials and advertising design",
        isActive: false
      },
      {
        name: "Clothing & Merchandise",
        slug: "clothing",
        icon: "fas fa-tshirt",
        description: "Custom apparel and merchandise design",
        isActive: false
      },
      {
        name: "Art & Illustration",
        slug: "art",
        icon: "fas fa-paint-brush",
        description: "Custom artwork and illustration services",
        isActive: false
      },
      {
        name: "Packaging & Label",
        slug: "packaging",
        icon: "fas fa-box",
        description: "Product packaging and label design",
        isActive: false
      },
      {
        name: "Book & Magazine",
        slug: "book",
        icon: "fas fa-book",
        description: "Publication design and layout services",
        isActive: false
      },
      {
        name: "Social Media",
        slug: "social-media",
        icon: "fas fa-share-alt",
        description: "Social media graphics and content design",
        isActive: false
      },
      {
        name: "Print Design",
        slug: "print-design", 
        icon: "fas fa-print",
        description: "Brochures, flyers, and print marketing materials",
        isActive: false
      },

    ];

    categories.forEach(category => {
      const id = this.currentCategoryId++;
      const fullCategory: ServiceCategory = { 
        ...category, 
        id,
        description: category.description || null,
        isActive: category.isActive || false
      };
      this.serviceCategories.set(id, fullCategory);
    });

    // Seed service packages for Logo & Identity
    const packages: InsertServicePackage[] = [
      {
        categoryId: 1,
        name: "Logo Design",
        slug: "logo-design",
        description: "Crafting an unforgettable logo tailored to your brand",
        price: 2000,
        features: ["Custom logo design", "3 initial concepts", "Unlimited revisions", "Vector files", "Color variations"],
        isPopular: false
      },
      {
        categoryId: 1,
        name: "Business Card",
        slug: "business-card",
        description: "A unique card designed to build connections",
        price: 1200,
        features: ["Custom business card design", "Print-ready files", "2 design concepts", "Standard size"],
        isPopular: false
      },
      {
        categoryId: 1,
        name: "Logo + Brand Identity Pack",
        slug: "brand-pack",
        description: "Get a logo plus digital and print essentials to jump start your brand",
        price: 3000,
        features: ["Logo design", "Business card", "Letterhead", "Envelope", "Facebook cover", "Brand guidelines"],
        isPopular: true
      },
      {
        categoryId: 1,
        name: "Logo + Brand Guide",
        slug: "brand-guide",
        description: "Extend your logo design into a complete brand with matching fonts, colors and style",
        price: 2400,
        features: ["Logo design", "Comprehensive brand guide", "Color palette", "Typography guide", "Usage guidelines"],
        isPopular: false
      },
      {
        categoryId: 1,
        name: "Logo + Business Card",
        slug: "logo-card",
        description: "Get a logo and business card design that seamlessly complement each other",
        price: 2500,
        features: ["Logo design", "Business card design", "Coordinated design system", "Print-ready files"],
        isPopular: false
      },
      {
        categoryId: 1,
        name: "Full Service Brand Pack",
        slug: "full-service",
        description: "Craft a strategically guided brand identity with your personal creative director from TechPartner Studio",
        price: 20000,
        features: ["Personal creative director", "Complete brand strategy", "Logo design", "Brand guidelines", "Marketing materials", "Website design", "3 months support"],
        isPopular: false
      }
    ];

    packages.forEach(package_ => {
      const id = this.currentPackageId++;
      const fullPackage: ServicePackage = { 
        ...package_, 
        id,
        features: package_.features || [],
        isPopular: package_.isPopular || false
      };
      this.servicePackages.set(id, fullPackage);
    });
  }

  private seedAdminData() {
    // Seed sample orders for admin dashboard
    const order1: Order = {
      id: this.currentOrderId++,
      userId: 1,
      serviceId: 1,
      status: "completed",
      totalAmount: "5500.00",
      paymentStatus: "completed",
      orderData: {
        projectName: "Corporate Logo Design",
        companyName: "Saudi Tech Solutions",
        industry: "Technology",
        designStyle: "Modern Professional"
      },
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-11-20')
    };
    
    const order2: Order = {
      id: this.currentOrderId++,
      userId: 2,
      serviceId: 2,
      status: "processing",
      totalAmount: "25000.00",
      paymentStatus: "completed",
      orderData: {
        projectName: "E-commerce Website",
        companyName: "Riyadh Fashion Boutique",
        industry: "Fashion Retail",
        features: ["Product Catalog", "Payment Gateway", "Mobile Responsive"]
      },
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-07')
    };
    
    const order3: Order = {
      id: this.currentOrderId++,
      userId: 1,
      serviceId: 3,
      status: "pending",
      totalAmount: "12000.00",
      paymentStatus: "pending",
      orderData: {
        projectName: "Brand Identity Package",
        companyName: "Wellness Studio Jeddah",
        industry: "Healthcare & Wellness",
        services: ["Logo Design", "Business Cards", "Brochures"]
      },
      createdAt: new Date('2024-12-06'),
      updatedAt: new Date('2024-12-06')
    };

    this.orders.set(order1.id, order1);
    this.orders.set(order2.id, order2);
    this.orders.set(order3.id, order3);

    // Seed sample payments
    const payment1: Payment = {
      id: this.currentPaymentId++,
      orderId: 1,
      amount: "5500.00",
      currency: "SAR",
      paymentMethod: "Credit Card",
      transactionId: "TXN_20241115_001",
      status: "completed",
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-11-15')
    };
    
    const payment2: Payment = {
      id: this.currentPaymentId++,
      orderId: 2,
      amount: "25000.00",
      currency: "SAR",
      paymentMethod: "Bank Transfer", 
      transactionId: "TXN_20241201_002",
      status: "completed",
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01')
    };
    
    const payment3: Payment = {
      id: this.currentPaymentId++,
      orderId: 3,
      amount: "12000.00",
      currency: "SAR",
      paymentMethod: "Credit Card",
      transactionId: null,
      status: "pending",
      createdAt: new Date('2024-12-06'),
      updatedAt: new Date('2024-12-06')
    };

    this.payments.set(payment1.id, payment1);
    this.payments.set(payment2.id, payment2);
    this.payments.set(payment3.id, payment3);

    // Seed sample project briefs
    const brief1: ProjectBrief = {
      id: this.currentBriefId++,
      name: "Ahmed Salem",
      email: "ahmed@sauditech.com",
      projectDescription: "Need a professional logo design for my tech startup",
      timeline: "2-3 weeks",
      urgency: "medium",
      contactPreference: "email",
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-11-15')
    };
    
    const brief2: ProjectBrief = {
      id: this.currentBriefId++,
      name: "Layla Mohammed",
      email: "layla@fashionboutique.sa",
      projectDescription: "E-commerce website for fashion boutique in Riyadh",
      timeline: "1 month",
      urgency: "high",
      contactPreference: "phone",
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01')
    };

    this.projectBriefs.set(brief1.id, brief1);
    this.projectBriefs.set(brief2.id, brief2);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }
    
    const updatedUser: User = { 
      ...existingUser, 
      ...updateData,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async authenticateUser(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password && user.isActive) {
      // Update last login time
      await this.updateUser(user.id, { lastLoginAt: new Date() });
      return user;
    }
    return undefined;
  }

  // Service Category methods
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }

  async getServiceCategoryBySlug(slug: string): Promise<ServiceCategory | undefined> {
    return Array.from(this.serviceCategories.values()).find(cat => cat.slug === slug);
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const id = this.currentCategoryId++;
    const newCategory: ServiceCategory = { 
      ...category, 
      id,
      description: category.description || null,
      isActive: category.isActive || false
    };
    this.serviceCategories.set(id, newCategory);
    return newCategory;
  }

  // Service Package methods
  async getServicePackages(): Promise<ServicePackage[]> {
    return Array.from(this.servicePackages.values());
  }

  async getServicePackagesByCategory(categoryId: number): Promise<ServicePackage[]> {
    return Array.from(this.servicePackages.values()).filter(pkg => pkg.categoryId === categoryId);
  }

  async getServicePackage(id: number): Promise<ServicePackage | undefined> {
    return this.servicePackages.get(id);
  }

  async getServicePackageBySlug(slug: string): Promise<ServicePackage | undefined> {
    return Array.from(this.servicePackages.values()).find(pkg => pkg.slug === slug);
  }

  async createServicePackage(package_: InsertServicePackage): Promise<ServicePackage> {
    const id = this.currentPackageId++;
    const newPackage: ServicePackage = { 
      ...package_, 
      id,
      features: package_.features || [],
      isPopular: package_.isPopular || false
    };
    this.servicePackages.set(id, newPackage);
    return newPackage;
  }

  // Project Brief methods
  async getProjectBriefs(): Promise<ProjectBrief[]> {
    return Array.from(this.projectBriefs.values());
  }

  async getProjectBrief(id: number): Promise<ProjectBrief | undefined> {
    return this.projectBriefs.get(id);
  }

  async createProjectBrief(brief: InsertProjectBrief): Promise<ProjectBrief> {
    const id = this.currentBriefId++;
    const newBrief: ProjectBrief = { 
      ...brief, 
      id, 
      designStyle: brief.designStyle || null,
      colors: brief.colors || null,
      budget: brief.budget || null,
      deadline: brief.deadline || null,
      requirements: brief.requirements || null,
      createdAt: new Date() 
    };
    this.projectBriefs.set(id, newBrief);
    return newBrief;
  }

  // Quiz Response methods
  async getQuizResponses(): Promise<QuizResponse[]> {
    return Array.from(this.quizResponses.values());
  }

  async createQuizResponse(response: InsertQuizResponse): Promise<QuizResponse> {
    const id = this.currentQuizId++;
    
    // Generate recommendations based on quiz answers
    const recommendations = this.generateRecommendations(response);
    
    const newResponse: QuizResponse = { 
      ...response, 
      id, 
      email: response.email || null,
      recommendations,
      createdAt: new Date() 
    };
    this.quizResponses.set(id, newResponse);
    return newResponse;
  }

  private generateRecommendations(response: InsertQuizResponse): string[] {
    const recommendations: string[] = [];
    
    if (response.businessType === 'startup') {
      recommendations.push('logo-design', 'business-card');
    } else if (response.businessType === 'established') {
      recommendations.push('brand-pack', 'brand-guide');
    } else if (response.businessType === 'expansion') {
      recommendations.push('full-service', 'brand-pack');
    }
    
    if (response.goal === 'professional-image') {
      recommendations.push('logo-card', 'brand-guide');
    } else if (response.goal === 'brand-recognition') {
      recommendations.push('brand-pack', 'full-service');
    }
    
    return Array.from(new Set(recommendations)); // Remove duplicates
  }

  // TPOS Integration - Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { 
      ...order, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // TPOS Integration - Payments
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentsByOrder(orderId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.orderId === orderId);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = { 
      ...insertPayment, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, updateData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment: Payment = { 
      ...payment, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
}

// rewrite MemStorage to DatabaseStorage
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async authenticateUser(email: string, password: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }

  async getServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories);
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id));
    return category || undefined;
  }

  async getServiceCategoryBySlug(slug: string): Promise<ServiceCategory | undefined> {
    const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.slug, slug));
    return category || undefined;
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const [newCategory] = await db
      .insert(serviceCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getServicePackages(): Promise<ServicePackage[]> {
    return await db.select().from(servicePackages);
  }

  async getServicePackagesByCategory(categoryId: number): Promise<ServicePackage[]> {
    return await db.select().from(servicePackages).where(eq(servicePackages.categoryId, categoryId));
  }

  async getServicePackage(id: number): Promise<ServicePackage | undefined> {
    const [pkg] = await db.select().from(servicePackages).where(eq(servicePackages.id, id));
    return pkg || undefined;
  }

  async getServicePackageBySlug(slug: string): Promise<ServicePackage | undefined> {
    const [pkg] = await db.select().from(servicePackages).where(eq(servicePackages.slug, slug));
    return pkg || undefined;
  }

  async createServicePackage(package_: InsertServicePackage): Promise<ServicePackage> {
    const [newPackage] = await db
      .insert(servicePackages)
      .values(package_)
      .returning();
    return newPackage;
  }

  async getProjectBriefs(): Promise<ProjectBrief[]> {
    return await db.select().from(projectBriefs);
  }

  async getProjectBrief(id: number): Promise<ProjectBrief | undefined> {
    const [brief] = await db.select().from(projectBriefs).where(eq(projectBriefs.id, id));
    return brief || undefined;
  }

  async createProjectBrief(brief: InsertProjectBrief): Promise<ProjectBrief> {
    const [newBrief] = await db
      .insert(projectBriefs)
      .values(brief)
      .returning();
    return newBrief;
  }

  async getQuizResponses(): Promise<QuizResponse[]> {
    return await db.select().from(quizResponses);
  }

  async createQuizResponse(response: InsertQuizResponse): Promise<QuizResponse> {
    const [newResponse] = await db
      .insert(quizResponses)
      .values(response)
      .returning();
    return newResponse;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrder(id: number, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentsByOrder(orderId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.orderId, orderId));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  async updatePayment(id: number, updateData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [payment] = await db
      .update(payments)
      .set(updateData)
      .where(eq(payments.id, id))
      .returning();
    return payment || undefined;
  }
}

export const storage = new MemStorage();
