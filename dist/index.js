import { createRequire } from "module"; import { fileURLToPath as __fileURLToPath } from "url"; import { dirname as __pathDirname } from "path"; const require = createRequire(import.meta.url); const __filename = __fileURLToPath(import.meta.url); const __dirname = __pathDirname(__filename);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc3) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc3 = __getOwnPropDesc(from, key)) || desc3.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activities: () => activities,
  inquiries: () => inquiries,
  insertInquirySchema: () => insertInquirySchema,
  insertOrderSchema: () => insertOrderSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertProjectBriefSchema: () => insertProjectBriefSchema,
  insertQuizResponseSchema: () => insertQuizResponseSchema,
  insertServiceCategorySchema: () => insertServiceCategorySchema,
  insertServicePackageSchema: () => insertServicePackageSchema,
  insertUserSchema: () => insertUserSchema,
  orders: () => orders,
  payments: () => payments,
  projectBriefs: () => projectBriefs,
  quizResponses: () => quizResponses,
  serviceCategories: () => serviceCategories,
  servicePackages: () => servicePackages,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users, serviceCategories, servicePackages, projectBriefs, quizResponses, activities, orders, payments, inquiries, insertUserSchema, insertServiceCategorySchema, insertServicePackageSchema, insertProjectBriefSchema, insertQuizResponseSchema, insertOrderSchema, insertPaymentSchema, insertInquirySchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      username: text("username").notNull().unique(),
      email: text("email").notNull().unique(),
      password: text("password").notNull(),
      firstName: text("first_name"),
      lastName: text("last_name"),
      phone: text("phone"),
      address: text("address"),
      profileImage: text("profile_image"),
      role: text("role").notNull().default("client"),
      // 'client' or 'admin'
      isActive: boolean("is_active").notNull().default(true),
      lastLoginAt: timestamp("last_login_at"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    serviceCategories = pgTable("service_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      slug: text("slug").notNull().unique(),
      icon: text("icon").notNull(),
      description: text("description"),
      isActive: boolean("is_active").notNull().default(false)
    });
    servicePackages = pgTable("service_packages", {
      id: serial("id").primaryKey(),
      categoryId: integer("category_id").notNull(),
      name: text("name").notNull(),
      slug: text("slug").notNull().unique(),
      description: text("description").notNull(),
      price: integer("price").notNull(),
      // Price in SAR
      features: jsonb("features").$type().notNull(),
      isPopular: boolean("is_popular").notNull().default(false)
    });
    projectBriefs = pgTable("project_briefs", {
      id: serial("id").primaryKey(),
      packageId: integer("package_id").notNull(),
      companyName: text("company_name").notNull(),
      industry: text("industry").notNull(),
      description: text("description").notNull(),
      designStyle: text("design_style"),
      colors: text("colors"),
      budget: text("budget"),
      deadline: text("deadline"),
      email: text("email").notNull(),
      requirements: text("requirements"),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    quizResponses = pgTable("quiz_responses", {
      id: serial("id").primaryKey(),
      businessType: text("business_type").notNull(),
      goal: text("goal").notNull(),
      audience: text("audience").notNull(),
      email: text("email"),
      recommendations: jsonb("recommendations").$type(),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    activities = pgTable("activities", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      event: text("event").notNull(),
      entity: text("entity"),
      entityId: text("entity_id"),
      metadata: jsonb("metadata").$type(),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    orders = pgTable("orders", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      serviceId: integer("service_id").references(() => servicePackages.id),
      status: text("status").default("pending"),
      totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
      paymentStatus: text("payment_status").default("pending"),
      orderData: jsonb("order_data").$type(),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    payments = pgTable("payments", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").references(() => orders.id),
      amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
      currency: text("currency").default("SAR"),
      paymentMethod: text("payment_method"),
      transactionId: text("transaction_id"),
      status: text("status").default("pending"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    inquiries = pgTable("inquiries", {
      id: serial("id").primaryKey(),
      fullName: text("full_name").notNull(),
      companyRole: text("company_role"),
      mobile: text("mobile").notNull(),
      email: text("email"),
      projectType: text("project_type").notNull(),
      language: text("language").default("en"),
      source: text("source").default("campaign"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true
    }).extend({
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8, "Password must be at least 8 characters")
    });
    insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
      id: true
    });
    insertServicePackageSchema = createInsertSchema(servicePackages).omit({
      id: true
    });
    insertProjectBriefSchema = createInsertSchema(projectBriefs).omit({
      id: true,
      createdAt: true
    });
    insertQuizResponseSchema = createInsertSchema(quizResponses).omit({
      id: true,
      createdAt: true,
      recommendations: true
    });
    insertOrderSchema = createInsertSchema(orders).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPaymentSchema = createInsertSchema(payments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertInquirySchema = createInsertSchema(inquiries).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  pool: () => pool
});
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var __filename, __dirname, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    __filename = fileURLToPath(import.meta.url);
    __dirname = path2.dirname(__filename);
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay()
      ],
      resolve: {
        alias: {
          "@": path2.resolve(__dirname, "client"),
          "@shared": path2.resolve(__dirname, "shared"),
          "@assets": path2.resolve(__dirname, "assets_temp")
        }
      },
      build: {
        rollupOptions: {
          input: path2.resolve(__dirname, "client", "index.html")
        },
        outDir: path2.resolve(__dirname, "dist/public"),
        emptyOutDir: true
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}
var __filename2, __dirname2, viteLogger;
var init_vite = __esm({
  "server/vite.ts"() {
    "use strict";
    init_vite_config();
    __filename2 = fileURLToPath2(import.meta.url);
    __dirname2 = path3.dirname(__filename2);
    viteLogger = createLogger();
  }
});

// server/index.ts
import "dotenv/config";
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
init_schema();
import { eq } from "drizzle-orm";
var db2;
try {
  if (process.env.NODE_ENV !== "development" && process.env.DATABASE_URL) {
    const { db: database } = (init_db(), __toCommonJS(db_exports));
    db2 = database;
  }
} catch (error) {
}
var MemStorage = class {
  users;
  serviceCategories;
  servicePackages;
  projectBriefs;
  quizResponses;
  orders;
  payments;
  currentUserId;
  currentCategoryId;
  currentPackageId;
  currentBriefId;
  currentQuizId;
  currentOrderId;
  currentPaymentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.serviceCategories = /* @__PURE__ */ new Map();
    this.servicePackages = /* @__PURE__ */ new Map();
    this.projectBriefs = /* @__PURE__ */ new Map();
    this.quizResponses = /* @__PURE__ */ new Map();
    this.orders = /* @__PURE__ */ new Map();
    this.payments = /* @__PURE__ */ new Map();
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
  seedData() {
    const categories = [
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
      }
    ];
    categories.forEach((category) => {
      const id = this.currentCategoryId++;
      const fullCategory = {
        ...category,
        id,
        description: category.description || null,
        isActive: category.isActive || false
      };
      this.serviceCategories.set(id, fullCategory);
    });
    const packages = [
      {
        categoryId: 1,
        name: "Logo Design",
        slug: "logo-design",
        description: "Crafting an unforgettable logo tailored to your brand",
        price: 2e3,
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
        price: 3e3,
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
        price: 2e4,
        features: ["Personal creative director", "Complete brand strategy", "Logo design", "Brand guidelines", "Marketing materials", "Website design", "3 months support"],
        isPopular: false
      }
    ];
    packages.forEach((package_) => {
      const id = this.currentPackageId++;
      const fullPackage = {
        ...package_,
        id,
        features: package_.features || [],
        isPopular: package_.isPopular || false
      };
      this.servicePackages.set(id, fullPackage);
    });
  }
  seedAdminData() {
    const order1 = {
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
      createdAt: /* @__PURE__ */ new Date("2024-11-15"),
      updatedAt: /* @__PURE__ */ new Date("2024-11-20")
    };
    const order2 = {
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
      createdAt: /* @__PURE__ */ new Date("2024-12-01"),
      updatedAt: /* @__PURE__ */ new Date("2024-12-07")
    };
    const order3 = {
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
      createdAt: /* @__PURE__ */ new Date("2024-12-06"),
      updatedAt: /* @__PURE__ */ new Date("2024-12-06")
    };
    this.orders.set(order1.id, order1);
    this.orders.set(order2.id, order2);
    this.orders.set(order3.id, order3);
    const payment1 = {
      id: this.currentPaymentId++,
      orderId: 1,
      amount: "5500.00",
      currency: "SAR",
      paymentMethod: "Credit Card",
      transactionId: "TXN_20241115_001",
      status: "completed",
      createdAt: /* @__PURE__ */ new Date("2024-11-15"),
      updatedAt: /* @__PURE__ */ new Date("2024-11-15")
    };
    const payment2 = {
      id: this.currentPaymentId++,
      orderId: 2,
      amount: "25000.00",
      currency: "SAR",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN_20241201_002",
      status: "completed",
      createdAt: /* @__PURE__ */ new Date("2024-12-01"),
      updatedAt: /* @__PURE__ */ new Date("2024-12-01")
    };
    const payment3 = {
      id: this.currentPaymentId++,
      orderId: 3,
      amount: "12000.00",
      currency: "SAR",
      paymentMethod: "Credit Card",
      transactionId: null,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date("2024-12-06"),
      updatedAt: /* @__PURE__ */ new Date("2024-12-06")
    };
    this.payments.set(payment1.id, payment1);
    this.payments.set(payment2.id, payment2);
    this.payments.set(payment3.id, payment3);
    const brief1 = {
      id: this.currentBriefId++,
      name: "Ahmed Salem",
      email: "ahmed@sauditech.com",
      projectDescription: "Need a professional logo design for my tech startup",
      timeline: "2-3 weeks",
      urgency: "medium",
      contactPreference: "email",
      createdAt: /* @__PURE__ */ new Date("2024-11-15"),
      updatedAt: /* @__PURE__ */ new Date("2024-11-15")
    };
    const brief2 = {
      id: this.currentBriefId++,
      name: "Layla Mohammed",
      email: "layla@fashionboutique.sa",
      projectDescription: "E-commerce website for fashion boutique in Riyadh",
      timeline: "1 month",
      urgency: "high",
      contactPreference: "phone",
      createdAt: /* @__PURE__ */ new Date("2024-12-01"),
      updatedAt: /* @__PURE__ */ new Date("2024-12-01")
    };
    this.projectBriefs.set(brief1.id, brief1);
    this.projectBriefs.set(brief2.id, brief2);
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
      ...insertUser,
      id,
      isActive: true,
      lastLoginAt: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updateData) {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return void 0;
    }
    const updatedUser = {
      ...existingUser,
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async updateUserLastLogin(id) {
    const existingUser = await this.getUser(id);
    if (existingUser) {
      const updatedUser = {
        ...existingUser,
        lastLoginAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.set(id, updatedUser);
    }
  }
  async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password && user.isActive) {
      await this.updateUser(user.id, { lastLoginAt: /* @__PURE__ */ new Date() });
      return user;
    }
    return void 0;
  }
  // Service Category methods
  async getServiceCategories() {
    return Array.from(this.serviceCategories.values());
  }
  async getServiceCategory(id) {
    return this.serviceCategories.get(id);
  }
  async getServiceCategoryBySlug(slug) {
    return Array.from(this.serviceCategories.values()).find((cat) => cat.slug === slug);
  }
  async createServiceCategory(category) {
    const id = this.currentCategoryId++;
    const newCategory = {
      ...category,
      id,
      description: category.description || null,
      isActive: category.isActive || false
    };
    this.serviceCategories.set(id, newCategory);
    return newCategory;
  }
  // Service Package methods
  async getServicePackages() {
    return Array.from(this.servicePackages.values());
  }
  async getServicePackagesByCategory(categoryId) {
    return Array.from(this.servicePackages.values()).filter((pkg) => pkg.categoryId === categoryId);
  }
  async getServicePackage(id) {
    return this.servicePackages.get(id);
  }
  async getServicePackageBySlug(slug) {
    return Array.from(this.servicePackages.values()).find((pkg) => pkg.slug === slug);
  }
  async createServicePackage(package_) {
    const id = this.currentPackageId++;
    const newPackage = {
      ...package_,
      id,
      features: package_.features || [],
      isPopular: package_.isPopular || false
    };
    this.servicePackages.set(id, newPackage);
    return newPackage;
  }
  // Project Brief methods
  async getProjectBriefs() {
    return Array.from(this.projectBriefs.values());
  }
  async getProjectBrief(id) {
    return this.projectBriefs.get(id);
  }
  async createProjectBrief(brief) {
    const id = this.currentBriefId++;
    const newBrief = {
      ...brief,
      id,
      designStyle: brief.designStyle || null,
      colors: brief.colors || null,
      budget: brief.budget || null,
      deadline: brief.deadline || null,
      requirements: brief.requirements || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.projectBriefs.set(id, newBrief);
    return newBrief;
  }
  // Quiz Response methods
  async getQuizResponses() {
    return Array.from(this.quizResponses.values());
  }
  async createQuizResponse(response) {
    const id = this.currentQuizId++;
    const recommendations = this.generateRecommendations(response);
    const newResponse = {
      ...response,
      id,
      email: response.email || null,
      recommendations,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.quizResponses.set(id, newResponse);
    return newResponse;
  }
  generateRecommendations(response) {
    const recommendations = [];
    if (response.businessType === "startup") {
      recommendations.push("logo-design", "business-card");
    } else if (response.businessType === "established") {
      recommendations.push("brand-pack", "brand-guide");
    } else if (response.businessType === "expansion") {
      recommendations.push("full-service", "brand-pack");
    }
    if (response.goal === "professional-image") {
      recommendations.push("logo-card", "brand-guide");
    } else if (response.goal === "brand-recognition") {
      recommendations.push("brand-pack", "full-service");
    }
    return Array.from(new Set(recommendations));
  }
  // TPOS Integration - Orders
  async getOrders() {
    return Array.from(this.orders.values());
  }
  async getOrder(id) {
    return this.orders.get(id);
  }
  async getOrdersByUser(userId) {
    return Array.from(this.orders.values()).filter((order) => order.userId === userId);
  }
  async createOrder(insertOrder) {
    const id = this.currentOrderId++;
    const order = {
      ...insertOrder,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.orders.set(id, order);
    return order;
  }
  async updateOrder(id, updateData) {
    const order = this.orders.get(id);
    if (!order) return void 0;
    const updatedOrder = {
      ...order,
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  // TPOS Integration - Payments
  async getPayments() {
    return Array.from(this.payments.values());
  }
  async getPayment(id) {
    return this.payments.get(id);
  }
  async getPaymentsByOrder(orderId) {
    return Array.from(this.payments.values()).filter((payment) => payment.orderId === orderId);
  }
  async createPayment(insertPayment) {
    const id = this.currentPaymentId++;
    const payment = {
      ...insertPayment,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.payments.set(id, payment);
    return payment;
  }
  async updatePayment(id, updateData) {
    const payment = this.payments.get(id);
    if (!payment) return void 0;
    const updatedPayment = {
      ...payment,
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
};
var storage = new MemStorage();

// server/routes.ts
init_schema();

// server/activityLogger.ts
init_db();
init_schema();
async function logActivity(params) {
  const { userId = null, event, entity = null, entityId = null, metadata = {} } = params;
  try {
    console.log("\u{1F50D} Activity Log:", {
      userId,
      event,
      entity,
      entityId,
      metadata,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    await db.insert(activities).values({
      userId: userId ?? null,
      event,
      entity: entity ?? null,
      entityId: entityId ? String(entityId) : null,
      metadata: metadata ? metadata : null,
      createdAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("\u274C Failed to log activity:", error, params);
    return { success: false, error };
  }
}

// server/routes.ts
import { z as z3 } from "zod";

// server/routes/inquiry.ts
init_db();
init_schema();
import { Router } from "express";
import { desc, count, sql } from "drizzle-orm";
import { z as z2 } from "zod";

// server/email.ts
import nodemailer from "nodemailer";
var EmailService = class {
  transporter = null;
  fromEmail;
  isDevelopment;
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || "noreply@techpartner.sa";
    this.isDevelopment = process.env.NODE_ENV === "development";
    if (this.shouldCreateTransporter()) {
      const config = this.getEmailConfig();
      this.transporter = nodemailer.createTransport(config);
    }
  }
  shouldCreateTransporter() {
    if (process.env.NODE_ENV === "production") {
      return true;
    }
    return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  }
  getEmailConfig() {
    if (process.env.NODE_ENV === "production") {
      return {
        host: "smtp.zoho.com",
        port: 587,
        secure: false,
        // Use STARTTLS
        auth: {
          user: process.env.SMTP_USER || "noreply@techpartner.sa",
          pass: process.env.SMTP_PASS || ""
        }
      };
    } else {
      return {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASS || ""
        }
      };
    }
  }
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };
      if (!this.transporter) {
        console.log("\n=== EMAIL SIMULATION (Development Mode) ===");
        console.log("From:", this.fromEmail);
        console.log("To:", options.to);
        console.log("Subject:", options.subject);
        console.log("Content:", options.html || options.text);
        console.log("==========================================\n");
        return true;
      }
      const info = await this.transporter.sendMail(mailOptions);
      if (process.env.NODE_ENV === "development") {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }
  async sendWelcomeEmail(userEmail, userName) {
    const subject = "Welcome to TechPartner!";
    const html = `
      <h2>Welcome to TechPartner!</h2>
      <p>Hello ${userName || "there"},</p>
      <p>Thank you for joining TechPartner. We're excited to help you with your digital transformation journey.</p>
      <p>If you have any questions, feel free to reach out to us at info@techpartner.sa</p>
      <p>Best regards,<br>The TechPartner Team</p>
    `;
    return this.sendEmail({
      to: userEmail,
      subject,
      html
    });
  }
  async sendContactFormEmail(formData) {
    const subject = `New Contact Form Submission - ${formData.company || "Unknown Company"}`;
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.contactPerson || "Not provided"}</p>
      <p><strong>Email:</strong> ${formData.email || "Not provided"}</p>
      <p><strong>Company:</strong> ${formData.company || "Not provided"}</p>
      <p><strong>Phone:</strong> ${formData.phoneNumber || "Not provided"}</p>
      <p><strong>Industry:</strong> ${formData.industry || "Not provided"}</p>
      <p><strong>Service:</strong> ${formData.serviceType || "Not provided"}</p>
      <p><strong>Budget:</strong> ${formData.budget || "Not provided"}</p>
      <p><strong>Timeline:</strong> ${formData.timeline || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.projectDescription || "No message provided"}</p>
    `;
    return this.sendEmail({
      to: "info@techpartner.sa",
      subject,
      html
    });
  }
  async testEmailConnection() {
    try {
      if (!this.transporter) {
        console.log("Email service is in development mode (no SMTP credentials)");
        return true;
      }
      await this.transporter.verify();
      console.log("Email service is ready");
      return true;
    } catch (error) {
      console.error("Email service verification failed:", error);
      return false;
    }
  }
};
var emailService = new EmailService();

// server/routes/inquiry.ts
var router = Router();
var inquirySubmissionSchema = insertInquirySchema.extend({
  email: z2.string().email().optional().or(z2.literal(""))
});
router.post("/submit-inquiry", async (req, res) => {
  try {
    const validatedData = inquirySubmissionSchema.parse(req.body);
    const cleanedData = {
      ...validatedData,
      email: validatedData.email === "" ? null : validatedData.email
    };
    const [inquiry] = await db.insert(inquiries).values(cleanedData).returning();
    console.log("New inquiry submitted:", {
      id: inquiry.id,
      fullName: inquiry.fullName,
      mobile: inquiry.mobile,
      projectType: inquiry.projectType,
      language: inquiry.language,
      createdAt: inquiry.createdAt
    });
    try {
      const emailData = {
        contactPerson: inquiry.fullName,
        email: inquiry.email,
        company: inquiry.companyRole || "Not provided",
        phoneNumber: inquiry.mobile,
        serviceType: inquiry.projectType,
        projectDescription: `Inquiry from ${inquiry.fullName} regarding ${inquiry.projectType}`,
        industry: "Not specified",
        budget: "Not specified",
        timeline: "Not specified"
      };
      await emailService.sendContactFormEmail(emailData);
      console.log("Email notification sent for inquiry:", inquiry.id);
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }
    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiryId: inquiry.id
    });
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    if (error instanceof z2.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry"
    });
  }
});
router.get("/inquiries", async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [inquiryResults, totalResults] = await Promise.all([
      db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(Number(limit)).offset(skip),
      db.select({ count: count() }).from(inquiries)
    ]);
    const total = totalResults[0]?.count || 0;
    res.json({
      success: true,
      data: {
        inquiries: inquiryResults,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries"
    });
  }
});
router.get("/inquiry-stats", async (req, res) => {
  try {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const [
      totalInquiries,
      todayInquiries,
      languageStats,
      projectTypeStats
    ] = await Promise.all([
      // Total inquiries
      db.select({ count: count() }).from(inquiries),
      // Today's inquiries
      db.select({ count: count() }).from(inquiries).where(sql`${inquiries.createdAt} >= ${today}`),
      // Language breakdown
      db.select({
        language: inquiries.language,
        count: count()
      }).from(inquiries).groupBy(inquiries.language),
      // Project type breakdown
      db.select({
        projectType: inquiries.projectType,
        count: count()
      }).from(inquiries).groupBy(inquiries.projectType).orderBy(desc(count()))
    ]);
    res.json({
      success: true,
      data: {
        totalInquiries: totalInquiries[0]?.count || 0,
        todayInquiries: todayInquiries[0]?.count || 0,
        languageBreakdown: languageStats,
        projectTypeBreakdown: projectTypeStats
      }
    });
  } catch (error) {
    console.error("Error fetching inquiry stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiry statistics"
    });
  }
});
var inquiry_default = router;

// server/routes/email-test.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.post("/test-email", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Test endpoint not available in production" });
  }
  try {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({
        error: "Missing required fields: to, subject, message"
      });
    }
    const success = await emailService.sendEmail({
      to,
      subject,
      html: `<p>${message}</p>`,
      text: message
    });
    if (success) {
      res.json({ success: true, message: "Email sent successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send email" });
    }
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({ success: false, message: "Error sending test email" });
  }
});
router2.get("/test-email-connection", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Test endpoint not available in production" });
  }
  try {
    const isConnected = await emailService.testEmailConnection();
    if (isConnected) {
      res.json({ success: true, message: "Email service is connected" });
    } else {
      res.status(500).json({ success: false, message: "Email service connection failed" });
    }
  } catch (error) {
    console.error("Email connection test error:", error);
    res.status(500).json({ success: false, message: "Error testing email connection" });
  }
});
var email_test_default = router2;

// server/routes/payments.ts
import { Router as Router3 } from "express";
import axios from "axios";
var router3 = Router3();
router3.post("/test-payment", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Test endpoint not available in production" });
  }
  try {
    const { amount = 1, currency = "SAR" } = req.body;
    const tapPayload = {
      amount: parseFloat(amount),
      currency,
      threeDSecure: true,
      save_card: false,
      description: "Test payment for TechPartner integration",
      statement_descriptor: "TechPartner Test",
      customer: {
        first_name: "Test",
        middle_name: "",
        last_name: "User",
        email: "test@techpartner.sa",
        phone: {
          country_code: "966",
          number: "500000000"
        }
      },
      merchant: {
        id: process.env.TAP_MERCHANT_ID || "67967090"
      },
      source: {
        id: "src_all"
      },
      redirect: {
        url: `${process.env.FRONTEND_URL}/payment/test-success`
      },
      reference: {
        transaction: `test_txn_${Date.now()}`,
        order: `test_order_${Date.now()}`
      },
      post: {
        url: `${process.env.FRONTEND_URL}/api/webhooks/tap`
      },
      receipt: {
        email: false,
        sms: false
      },
      metadata: {
        test: "true",
        platform: "techpartner"
      }
    };
    console.log("Creating test payment with payload:", JSON.stringify(tapPayload, null, 2));
    await logActivity({
      userId: null,
      event: "TEST_PAYMENT_INITIATED",
      entity: "payment",
      entityId: tapPayload.reference.order,
      metadata: {
        amount: tapPayload.amount,
        currency: tapPayload.currency,
        testPayment: true,
        merchantId: tapPayload.merchant.id,
        initiatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    const response = await axios.post(
      "https://api.tap.company/v2/charges",
      tapPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    await logActivity({
      userId: null,
      event: "TEST_PAYMENT_CREATED",
      entity: "payment",
      entityId: response.data.id,
      metadata: {
        amount: tapPayload.amount,
        currency: tapPayload.currency,
        tapChargeId: response.data.id,
        paymentUrl: response.data.transaction?.url,
        testPayment: true,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        orderReference: tapPayload.reference.order
      }
    });
    console.log("Tap API Response:", response.data);
    res.json({
      success: true,
      paymentUrl: response.data.transaction?.url,
      tapId: response.data.id,
      status: response.data.status,
      message: "Test payment created successfully"
    });
  } catch (error) {
    console.error("Test payment error:", error.response?.data || error.message);
    await logActivity({
      userId: null,
      event: "TEST_PAYMENT_ERROR",
      entity: "payment",
      entityId: "test_payment",
      metadata: {
        error: error.response?.data || error.message,
        stack: error.stack,
        testPayment: true,
        failedAt: (/* @__PURE__ */ new Date()).toISOString(),
        requestData: req.body
      }
    });
    res.status(500).json({
      error: "Failed to create test payment",
      details: error.response?.data || error.message
    });
  }
});
router3.post("/payments", async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status !== "PENDING") {
      return res.status(400).json({ error: "Order is not in pending status" });
    }
    const user = order.userId ? await storage.getUser(order.userId) : null;
    const tapPayload = {
      amount: parseFloat(order.totalAmount),
      currency: "SAR",
      threeDSecure: true,
      save_card: false,
      description: `Payment for Order #${order.id}`,
      statement_descriptor: "TechPartner",
      customer: {
        first_name: user?.firstName || "Customer",
        middle_name: "",
        last_name: user?.lastName || "",
        email: user?.email || "customer@techpartner.sa",
        phone: {
          country_code: "966",
          number: "500000000"
        }
      },
      merchant: {
        id: process.env.TAP_MERCHANT_ID || "67967090"
      },
      source: {
        id: "src_all"
      },
      redirect: {
        url: `${process.env.FRONTEND_URL}/payment/success?order=${order.id}`
      },
      reference: {
        transaction: `txn_${order.id}_${Date.now()}`,
        order: order.id.toString()
      },
      post: {
        url: `${process.env.FRONTEND_URL}/api/webhooks/tap`
      },
      receipt: {
        email: true,
        sms: false
      },
      metadata: {
        order_id: order.id.toString(),
        user_id: order.userId?.toString() || "guest",
        platform: "techpartner"
      }
    };
    const response = await axios.post(
      "https://api.tap.company/v2/charges",
      tapPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    await logActivity({
      userId: order.userId || null,
      event: "PAYMENT_INITIATED",
      entity: "order",
      entityId: order.id,
      metadata: {
        tapId: response.data.id,
        paymentUrl: response.data.transaction.url,
        orderId: order.id,
        amount: order.totalAmount,
        currency: "SAR",
        paymentMethod: "tap",
        initiatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    await logActivity({
      userId: order.userId || null,
      event: "BUSINESS_PAYMENT_REQUEST_CREATED",
      entity: "payment",
      entityId: response.data.id,
      metadata: {
        orderId: order.id,
        orderValue: order.totalAmount,
        currency: "SAR",
        paymentProvider: "tap",
        requestedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    res.json({
      paymentUrl: response.data.transaction.url,
      tapId: response.data.id
    });
  } catch (error) {
    console.error("Payment creation error:", error.response?.data || error.message);
    await logActivity({
      userId: req.body.orderId ? null : null,
      // We don't have easy access to userId here
      event: "PAYMENT_CREATION_FAILED",
      entity: "order",
      entityId: req.body.orderId || "unknown",
      metadata: {
        error: error.response?.data || error.message,
        stack: error.stack,
        requestData: req.body,
        failedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    res.status(500).json({ error: "Failed to create payment" });
  }
});
router3.post("/webhooks/tap", async (req, res) => {
  try {
    const tapEvent = req.body;
    const orderId = parseInt(tapEvent.reference?.order);
    const tapId = tapEvent.id;
    const status = tapEvent.status;
    console.log("Tap webhook received:", { orderId, tapId, status });
    await logActivity({
      userId: null,
      event: "TAP_WEBHOOK_RECEIVED",
      entity: "webhook",
      entityId: tapId || "unknown",
      metadata: {
        orderId,
        status,
        amount: tapEvent.amount,
        currency: tapEvent.currency,
        webhookData: tapEvent
      }
    });
    if (!orderId) {
      await logActivity({
        userId: null,
        event: "TAP_WEBHOOK_INVALID",
        entity: "webhook",
        entityId: tapId || "unknown",
        metadata: {
          error: "No order reference found",
          receivedData: tapEvent
        }
      });
      return res.status(400).json({ error: "No order reference found" });
    }
    let orderStatus = "pending";
    let paymentStatus = "pending";
    switch (status) {
      case "CAPTURED":
        orderStatus = "completed";
        paymentStatus = "completed";
        break;
      case "FAILED":
      case "DECLINED":
        orderStatus = "failed";
        paymentStatus = "failed";
        break;
      case "CANCELLED":
        orderStatus = "cancelled";
        paymentStatus = "cancelled";
        break;
    }
    await logActivity({
      userId: null,
      event: "TAP_PAYMENT_STATUS_DETERMINED",
      entity: "payment",
      entityId: tapId,
      metadata: {
        orderId,
        tapStatus: status,
        determinedOrderStatus: orderStatus,
        determinedPaymentStatus: paymentStatus,
        amount: tapEvent.amount,
        currency: tapEvent.currency
      }
    });
    const updatedOrder = await storage.updateOrder(orderId, {
      status: orderStatus,
      paymentStatus
    });
    await logActivity({
      userId: updatedOrder?.userId || null,
      event: "ORDER_STATUS_UPDATED_BY_WEBHOOK",
      entity: "order",
      entityId: orderId,
      metadata: {
        tapId,
        previousStatus: updatedOrder?.status,
        newStatus: orderStatus,
        newPaymentStatus: paymentStatus,
        amount: updatedOrder?.totalAmount,
        triggeredBy: "tap_webhook"
      }
    });
    const paymentRecord = await storage.createPayment({
      orderId,
      amount: updatedOrder?.totalAmount || "0",
      currency: "SAR",
      transactionId: tapId,
      status: paymentStatus,
      paymentMethod: "tap"
    });
    await logActivity({
      userId: updatedOrder?.userId || null,
      event: "PAYMENT_RECORD_CREATED_BY_WEBHOOK",
      entity: "payment",
      entityId: paymentRecord?.id || tapId,
      metadata: {
        orderId,
        tapId,
        amount: updatedOrder?.totalAmount || "0",
        currency: "SAR",
        status: paymentStatus,
        paymentMethod: "tap",
        createdBy: "tap_webhook"
      }
    });
    await logActivity({
      userId: updatedOrder?.userId || null,
      event: "PAYMENT_STATUS_UPDATED",
      entity: "order",
      entityId: orderId,
      metadata: {
        tapId,
        status,
        orderStatus,
        paymentStatus,
        finalAmount: updatedOrder?.totalAmount,
        webhookProcessed: true,
        processedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    if (paymentStatus === "completed") {
      await logActivity({
        userId: updatedOrder?.userId || null,
        event: "PAYMENT_COMPLETED_VIA_WEBHOOK",
        entity: "payment",
        entityId: tapId,
        metadata: {
          orderId,
          amount: updatedOrder?.totalAmount,
          currency: "SAR",
          completedAt: (/* @__PURE__ */ new Date()).toISOString(),
          paymentMethod: "tap",
          completionTrigger: "tap_webhook"
        }
      });
      await logActivity({
        userId: updatedOrder?.userId || null,
        event: "BUSINESS_TRANSACTION_COMPLETED",
        entity: "order",
        entityId: orderId,
        metadata: {
          tapId,
          orderValue: updatedOrder?.totalAmount,
          currency: "SAR",
          paymentProvider: "tap",
          completedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    }
    if (paymentStatus === "failed") {
      await logActivity({
        userId: updatedOrder?.userId || null,
        event: "PAYMENT_FAILED_VIA_WEBHOOK",
        entity: "payment",
        entityId: tapId,
        metadata: {
          orderId,
          amount: updatedOrder?.totalAmount,
          currency: "SAR",
          failureReason: status,
          failedAt: (/* @__PURE__ */ new Date()).toISOString(),
          paymentMethod: "tap",
          failureTrigger: "tap_webhook"
        }
      });
    }
    res.status(200).json({ success: true, orderId, status: orderStatus });
  } catch (error) {
    console.error("Webhook processing error:", error);
    await logActivity({
      userId: null,
      event: "TAP_WEBHOOK_PROCESSING_ERROR",
      entity: "webhook",
      entityId: req.body?.id || "unknown",
      metadata: {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : void 0,
        webhookData: req.body,
        failedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    res.status(500).json({ error: "Webhook processing failed" });
  }
});
router3.post("/create", async (req, res) => {
  try {
    const { amount, currency = "SAR", description, service } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }
    const tapPayload = {
      amount: parseFloat(amount),
      currency,
      threeDSecure: true,
      save_card: false,
      description: description || `Payment for ${service?.title || "Service"}`,
      statement_descriptor: "TechPartner",
      customer: {
        first_name: "Customer",
        middle_name: "",
        last_name: "",
        email: "customer@techpartner.sa",
        phone: {
          country_code: "966",
          number: "500000000"
        }
      },
      merchant: {
        id: process.env.TAP_MERCHANT_ID || "67967090"
      },
      source: {
        id: "src_all"
      },
      redirect: {
        url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/success`
      },
      reference: {
        transaction: `direct_txn_${Date.now()}`,
        order: `direct_order_${Date.now()}`
      },
      post: {
        url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/api/webhooks/tap`
      },
      receipt: {
        email: false,
        sms: false
      },
      metadata: {
        service_title: service?.title || "Unknown Service",
        service_category: service?.category || "Unknown Category",
        platform: "techpartner",
        payment_type: "direct"
      }
    };
    await logActivity({
      userId: null,
      event: "DIRECT_PAYMENT_INITIATED",
      entity: "payment",
      entityId: "direct_payment",
      metadata: {
        amount: tapPayload.amount,
        currency: tapPayload.currency,
        service,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    const response = await axios.post(
      "https://api.tap.company/v2/charges",
      tapPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    await logActivity({
      userId: null,
      event: "DIRECT_PAYMENT_CREATED",
      entity: "payment",
      entityId: response.data.id,
      metadata: {
        amount: tapPayload.amount,
        currency: tapPayload.currency,
        tapChargeId: response.data.id,
        paymentUrl: response.data.transaction?.url,
        service,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    res.json({
      success: true,
      chargeId: response.data.id,
      paymentUrl: response.data.transaction?.url,
      status: response.data.status,
      amount: response.data.amount,
      currency: response.data.currency
    });
  } catch (error) {
    console.error("Direct payment creation error:", error);
    await logActivity({
      userId: null,
      event: "DIRECT_PAYMENT_ERROR",
      entity: "payment",
      entityId: "direct_payment",
      metadata: {
        error: error?.response?.data || error?.message || "Unknown error",
        stack: error?.stack,
        requestData: req.body,
        failedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    res.status(500).json({
      error: "Failed to create payment",
      details: error?.response?.data || error?.message || "Unknown error"
    });
  }
});
var payments_default = router3;

// server/routes/admin.ts
init_db();
init_schema();
import { Router as Router4 } from "express";
import { eq as eq4, desc as desc2, count as count2, sum } from "drizzle-orm";

// server/middleware/auth.ts
init_db();
init_schema();
import jwt from "jsonwebtoken";
import { eq as eq3 } from "drizzle-orm";
var JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
var generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role || "client"
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};
var verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
var requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    console.log("\u{1F50D} Token decoded:", { id: decoded.id, email: decoded.email });
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      role: users.role,
      isActive: users.isActive
    }).from(users).where(eq3(users.id, decoded.id)).limit(1);
    console.log("\u{1F50D} User lookup result:", user || "No user found");
    if (!user || !user.isActive) {
      console.log("\u274C Auth failed:", { userExists: !!user, isActive: user?.isActive });
      return res.status(401).json({ error: "User not found or inactive" });
    }
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid token." });
  }
};
var requireAdmin = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      requireAuth(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    if (!req.user || req.user.role !== "admin") {
      console.log("\u274C Admin access denied:", {
        userExists: !!req.user,
        userRole: req.user?.role,
        userEmail: req.user?.email
      });
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }
    req.user.isAdmin = true;
    console.log("\u2705 Admin access granted:", { email: req.user.email, role: req.user.role });
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(403).json({ error: "Access denied. Admin privileges required." });
  }
};

// server/routes/admin.ts
var router4 = Router4();
router4.get("/admin/dashboard", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [totalOrdersResult] = await db.select({ count: count2() }).from(orders);
    const [paidOrdersResult] = await db.select({ count: count2() }).from(orders).where(eq4(orders.status, "PAID"));
    const [pendingOrdersResult] = await db.select({ count: count2() }).from(orders).where(eq4(orders.status, "PENDING"));
    const [revenueResult] = await db.select({
      total: sum(orders.totalAmount)
    }).from(orders).where(eq4(orders.paymentStatus, "paid"));
    const recentOrders = await db.select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      userEmail: users.email,
      serviceName: servicePackages.name
    }).from(orders).leftJoin(users, eq4(orders.userId, users.id)).leftJoin(servicePackages, eq4(orders.serviceId, servicePackages.id)).orderBy(desc2(orders.createdAt)).limit(10);
    const recentActivities = await db.select({
      id: activities.id,
      event: activities.event,
      entity: activities.entity,
      entityId: activities.entityId,
      metadata: activities.metadata,
      createdAt: activities.createdAt,
      userEmail: users.email
    }).from(activities).leftJoin(users, eq4(activities.userId, users.id)).orderBy(desc2(activities.createdAt)).limit(20);
    const dashboardData = {
      stats: {
        totalOrders: totalOrdersResult.count,
        paidOrders: paidOrdersResult.count,
        pendingOrders: pendingOrdersResult.count,
        totalRevenue: revenueResult.total || 0
      },
      recentOrders,
      recentActivities
    };
    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
});
router4.patch("/admin/orders/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [order] = await db.select().from(orders).where(eq4(orders.id, parseInt(id))).limit(1);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const [updatedOrder] = await db.update(orders).set({
      status,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq4(orders.id, parseInt(id))).returning();
    await db.insert(activities).values({
      userId: req.user.id,
      event: "ADMIN_ORDER_STATUS_UPDATE",
      entity: "order",
      entityId: updatedOrder.id.toString(),
      metadata: {
        oldStatus: order.status,
        newStatus: status,
        adminId: req.user.id
      }
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});
router4.get("/admin/payments", requireAuth, requireAdmin, async (req, res) => {
  try {
    const allPayments = await db.select({
      id: payments.id,
      orderId: payments.orderId,
      amount: payments.amount,
      currency: payments.currency,
      paymentMethod: payments.paymentMethod,
      transactionId: payments.transactionId,
      status: payments.status,
      createdAt: payments.createdAt,
      updatedAt: payments.updatedAt
    }).from(payments).orderBy(desc2(payments.createdAt));
    res.json(allPayments);
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ error: "Failed to get payments" });
  }
});
router4.get("/admin/analytics/payments", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [totalPaymentsResult] = await db.select({ count: count2() }).from(payments);
    const [successfulPaymentsResult] = await db.select({ count: count2() }).from(payments).where(eq4(payments.status, "completed"));
    const [pendingPaymentsResult] = await db.select({ count: count2() }).from(payments).where(eq4(payments.status, "pending"));
    const [failedPaymentsResult] = await db.select({ count: count2() }).from(payments).where(eq4(payments.status, "failed"));
    const [totalRevenueResult] = await db.select({
      total: sum(payments.amount)
    }).from(payments).where(eq4(payments.status, "completed"));
    const analytics = {
      totalPayments: totalPaymentsResult.count,
      successfulPayments: successfulPaymentsResult.count,
      pendingPayments: pendingPaymentsResult.count,
      failedPayments: failedPaymentsResult.count,
      totalRevenue: totalRevenueResult.total || 0,
      successRate: totalPaymentsResult.count > 0 ? (successfulPaymentsResult.count / totalPaymentsResult.count * 100).toFixed(2) : "0"
    };
    res.json(analytics);
  } catch (error) {
    console.error("Payment analytics error:", error);
    res.status(500).json({ error: "Failed to get payment analytics" });
  }
});
router4.get("/admin/payments/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [payment] = await db.select().from(payments).where(eq4(payments.id, parseInt(id))).limit(1);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({ error: "Failed to get payment details" });
  }
});
router4.get("/admin/orders", requireAuth, requireAdmin, async (req, res) => {
  try {
    const allOrders = await db.select({
      id: orders.id,
      userId: orders.userId,
      serviceId: orders.serviceId,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      orderData: orders.orderData,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      userEmail: users.email,
      serviceName: servicePackages.name
    }).from(orders).leftJoin(users, eq4(orders.userId, users.id)).leftJoin(servicePackages, eq4(orders.serviceId, servicePackages.id)).orderBy(desc2(orders.createdAt));
    res.json(allOrders);
  } catch (error) {
    console.error("Get admin orders error:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
});
router4.get("/admin/activities", requireAuth, requireAdmin, async (req, res) => {
  try {
    const allActivities = await db.select({
      id: activities.id,
      userId: activities.userId,
      event: activities.event,
      entity: activities.entity,
      entityId: activities.entityId,
      metadata: activities.metadata,
      createdAt: activities.createdAt,
      userEmail: users.email
    }).from(activities).leftJoin(users, eq4(activities.userId, users.id)).orderBy(desc2(activities.createdAt)).limit(100);
    res.json(allActivities);
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({ error: "Failed to get activities" });
  }
});
router4.post("/admin/payments/manual", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { orderId, amount, currency = "SAR", paymentMethod = "manual", notes } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ error: "Order ID and amount are required" });
    }
    const [order] = await db.select().from(orders).where(eq4(orders.id, parseInt(orderId))).limit(1);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const transactionId = `manual_${orderId}_${Date.now()}`;
    const [payment] = await db.insert(payments).values({
      orderId: parseInt(orderId),
      amount: amount.toString(),
      currency,
      paymentMethod,
      transactionId,
      status: "completed",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    const [updatedOrder] = await db.update(orders).set({
      status: "PAID",
      paymentStatus: "paid",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq4(orders.id, parseInt(orderId))).returning();
    await db.insert(activities).values({
      userId: req.user.id,
      event: "ADMIN_MANUAL_PAYMENT_CREATED",
      entity: "payment",
      entityId: payment.id.toString(),
      metadata: {
        orderId,
        amount,
        currency,
        paymentMethod,
        transactionId,
        notes,
        adminId: req.user.id,
        adminEmail: req.user.email
      }
    });
    res.json({
      payment,
      updatedOrder,
      message: "Manual payment created successfully"
    });
  } catch (error) {
    console.error("Create manual payment error:", error);
    res.status(500).json({ error: "Failed to create manual payment" });
  }
});
var admin_default = router4;

// server/routes.ts
import bcrypt from "bcryptjs";
async function registerRoutes(app2) {
  app2.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "TechPartner Platform"
    });
  });
  app2.get("/sitemap.xml", (req, res) => {
    const publicPath = process.env.NODE_ENV === "production" ? "dist/public" : "public";
    res.setHeader("Content-Type", "application/xml");
    res.sendFile("sitemap.xml", { root: publicPath });
  });
  app2.get("/sitemap", (req, res) => {
    const publicPath = process.env.NODE_ENV === "production" ? "dist/public" : "public";
    res.setHeader("Content-Type", "text/html");
    res.sendFile("sitemap.html", { root: publicPath });
  });
  app2.get("/robots.txt", (req, res) => {
    const publicPath = process.env.NODE_ENV === "production" ? "dist/public" : "public";
    res.setHeader("Content-Type", "text/plain");
    res.sendFile("robots.txt", { root: publicPath });
  });
  app2.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.sendFile("robots.txt", { root: "public" });
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }
      const hashedPassword = await bcrypt.hash(data.password, 12);
      const userData = { ...data, password: hashedPassword };
      const user = await storage.createUser(userData);
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username
      });
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({
        user: userWithoutPassword,
        token,
        message: "Registration successful"
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt:", { email, passwordLength: password?.length });
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      const user = await storage.getUserByEmail(email);
      console.log("User found:", user ? { id: user.id, email: user.email, isActive: user.isActive } : "No user found");
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      if (!user.isActive) {
        return res.status(401).json({ error: "Account is deactivated. Please contact support." });
      }
      await storage.updateUserLastLogin(user.id);
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username
      });
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token,
        message: "Login successful"
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      if (req.user) {
        const user = await storage.getUserByEmail(req.user.email);
        if (user && user.isActive) {
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        }
      }
      res.status(401).json({ error: "User not found or inactive" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/auth/logout", requireAuth, async (req, res) => {
    res.json({ message: "Logout successful" });
  });
  app2.put("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const { firstName, lastName, email, phone, address } = req.body;
      const userId = req.user.id;
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }
      const updatedUser = await storage.updateUser(userId, {
        ...firstName && { firstName },
        ...lastName && { lastName },
        ...email && { email },
        ...phone && { phone },
        ...address && { address }
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
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  app2.put("/api/auth/password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current password and new password are required" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long" });
      }
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(userId, { password: hashedNewPassword });
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/categories/:categoryId/packages", async (req, res) => {
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
  app2.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getServicePackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  app2.get("/api/packages/:packageId", async (req, res) => {
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
  app2.post("/api/project-briefs", async (req, res) => {
    try {
      const validatedData = insertProjectBriefSchema.parse(req.body);
      const package_ = await storage.getServicePackage(validatedData.packageId);
      if (!package_) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      const brief = await storage.createProjectBrief(validatedData);
      res.status(201).json(brief);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create project brief" });
    }
  });
  app2.post("/api/quiz-responses", async (req, res) => {
    try {
      const validatedData = insertQuizResponseSchema.parse(req.body);
      const response = await storage.createQuizResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create quiz response" });
    }
  });
  app2.get("/api/project-briefs", requireAdmin, async (req, res) => {
    try {
      console.log("\u{1F50D} Admin accessing project briefs:", { email: req.user?.email, role: req.user?.role });
      const briefs = await storage.getProjectBriefs();
      res.json(briefs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project briefs" });
    }
  });
  app2.get("/api/orders", requireAdmin, async (req, res) => {
    try {
      console.log("\u{1F50D} Admin accessing orders:", { email: req.user?.email, role: req.user?.role });
      const orders2 = await storage.getOrders();
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const validation = insertOrderSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid request data",
          details: validation.error.issues
        });
      }
      const order = await storage.createOrder(validation.data);
      await logActivity({
        userId: order.userId || null,
        event: "ORDER_CREATED",
        entity: "order",
        entityId: order.id,
        metadata: { ...order }
      });
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.put("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      console.log("\u{1F50D} Admin updating order:", { email: req.user?.email, role: req.user?.role, orderId: req.params.id });
      const id = parseInt(req.params.id);
      const order = await storage.updateOrder(id, req.body);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      await logActivity({
        userId: order.userId || null,
        event: "ORDER_UPDATED",
        entity: "order",
        entityId: order.id,
        metadata: { ...order }
      });
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.patch("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      console.log("\u{1F50D} Admin patching order:", { email: req.user?.email, role: req.user?.role, orderId: req.params.id });
      const id = parseInt(req.params.id);
      const { status, paymentStatus } = req.body;
      const updateData = {};
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
      await logActivity({
        userId: order.userId || null,
        event: "ORDER_UPDATED",
        entity: "order",
        entityId: order.id,
        metadata: { ...order }
      });
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/orders/my", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const orders2 = await storage.getOrdersByUser(userId);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const orders2 = await storage.getOrdersByUser(userId);
      const stats = {
        total: orders2.length,
        pending: orders2.filter((o) => o.status.toLowerCase() === "pending").length,
        paid: orders2.filter((o) => o.status.toLowerCase() === "paid" || o.status.toLowerCase() === "completed").length,
        failed: orders2.filter((o) => o.status.toLowerCase() === "failed").length,
        cancelled: orders2.filter((o) => o.status.toLowerCase() === "cancelled").length,
        totalSpent: orders2.filter((o) => o.status.toLowerCase() === "paid" || o.status.toLowerCase() === "completed").reduce((sum2, o) => sum2 + (o.totalAmount || 0), 0)
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching order stats:", error);
      res.status(500).json({ error: "Failed to fetch order statistics" });
    }
  });
  app2.get("/api/payments", async (req, res) => {
    try {
      const payments2 = await storage.getPayments();
      res.json(payments2);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/payments", async (req, res) => {
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
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/users", requireAdmin, async (req, res) => {
    try {
      console.log("\u{1F50D} Admin accessing users:", { email: req.user?.email, role: req.user?.role });
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
      const sampleUsers = [
        {
          id: 1,
          username: "ahmed_salem",
          email: "ahmed@sauditech.com",
          firstName: "Ahmed",
          lastName: "Salem",
          phone: "+966501234567",
          isActive: true,
          createdAt: /* @__PURE__ */ new Date("2024-01-15"),
          lastLoginAt: /* @__PURE__ */ new Date("2024-12-07")
        },
        {
          id: 2,
          username: "layla_mohammed",
          email: "layla@fashionboutique.sa",
          firstName: "Layla",
          lastName: "Mohammed",
          phone: "+966509876543",
          isActive: true,
          createdAt: /* @__PURE__ */ new Date("2024-02-20"),
          lastLoginAt: /* @__PURE__ */ new Date("2024-12-06")
        }
      ];
      res.json(sampleUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.patch("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      console.log("\u{1F50D} Admin patching order (duplicate route):", { email: req.user?.email, role: req.user?.role, orderId: req.params.id });
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
  app2.use("/api", inquiry_default);
  app2.use("/api", email_test_default);
  app2.use("/api", payments_default);
  app2.use("/api", admin_default);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/static-handler.ts
import express from "express";
import fs from "fs";
import path from "path";
function serveStaticFixed(app2) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  console.log("Current working directory:", process.cwd());
  console.log("Looking for static files at:", distPath);
  console.log("Directory exists:", fs.existsSync(distPath));
  if (fs.existsSync(distPath)) {
    console.log("Files in dist/public:", fs.readdirSync(distPath));
    const assetsPath = path.join(distPath, "assets");
    if (fs.existsSync(assetsPath)) {
      console.log("Files in assets:", fs.readdirSync(assetsPath).slice(0, 5));
    }
  }
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    console.log("Serving SPA fallback for:", req.path);
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/index.ts
function log2(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log2(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    const { setupVite: setupVite2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
    await setupVite2(app, server);
  } else {
    serveStaticFixed(app);
  }
  const port = Number(process.env.PORT) || 5e3;
  const host = "0.0.0.0";
  server.listen({
    port,
    host,
    reusePort: true
  }, () => {
    log2(`TechPartner Platform serving on port ${port}`);
    if (process.env.NODE_ENV === "production") {
      log2("Running in production mode");
    }
  });
})();
//# sourceMappingURL=index.js.map
