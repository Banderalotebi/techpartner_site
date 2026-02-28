"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
var import_pg_core, import_drizzle_zod, import_zod, users, serviceCategories, servicePackages, projectBriefs, quizResponses, activities, orders, payments, inquiries, insertUserSchema, insertServiceCategorySchema, insertServicePackageSchema, insertProjectBriefSchema, insertQuizResponseSchema, insertOrderSchema, insertPaymentSchema, insertInquirySchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    import_pg_core = require("drizzle-orm/pg-core");
    import_drizzle_zod = require("drizzle-zod");
    import_zod = require("zod");
    users = (0, import_pg_core.pgTable)("users", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      username: (0, import_pg_core.text)("username").notNull().unique(),
      email: (0, import_pg_core.text)("email").notNull().unique(),
      password: (0, import_pg_core.text)("password").notNull(),
      firstName: (0, import_pg_core.text)("first_name"),
      lastName: (0, import_pg_core.text)("last_name"),
      phone: (0, import_pg_core.text)("phone"),
      address: (0, import_pg_core.text)("address"),
      profileImage: (0, import_pg_core.text)("profile_image"),
      role: (0, import_pg_core.text)("role").notNull().default("client"),
      // 'client' or 'admin'
      isActive: (0, import_pg_core.boolean)("is_active").notNull().default(true),
      lastLoginAt: (0, import_pg_core.timestamp)("last_login_at"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    serviceCategories = (0, import_pg_core.pgTable)("service_categories", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      name: (0, import_pg_core.text)("name").notNull(),
      slug: (0, import_pg_core.text)("slug").notNull().unique(),
      icon: (0, import_pg_core.text)("icon").notNull(),
      description: (0, import_pg_core.text)("description"),
      isActive: (0, import_pg_core.boolean)("is_active").notNull().default(false)
    });
    servicePackages = (0, import_pg_core.pgTable)("service_packages", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      categoryId: (0, import_pg_core.integer)("category_id").notNull(),
      name: (0, import_pg_core.text)("name").notNull(),
      slug: (0, import_pg_core.text)("slug").notNull().unique(),
      description: (0, import_pg_core.text)("description").notNull(),
      price: (0, import_pg_core.integer)("price").notNull(),
      // Price in SAR
      features: (0, import_pg_core.jsonb)("features").$type().notNull(),
      isPopular: (0, import_pg_core.boolean)("is_popular").notNull().default(false)
    });
    projectBriefs = (0, import_pg_core.pgTable)("project_briefs", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      packageId: (0, import_pg_core.integer)("package_id").notNull(),
      companyName: (0, import_pg_core.text)("company_name").notNull(),
      industry: (0, import_pg_core.text)("industry").notNull(),
      description: (0, import_pg_core.text)("description").notNull(),
      designStyle: (0, import_pg_core.text)("design_style"),
      colors: (0, import_pg_core.text)("colors"),
      budget: (0, import_pg_core.text)("budget"),
      deadline: (0, import_pg_core.text)("deadline"),
      email: (0, import_pg_core.text)("email").notNull(),
      requirements: (0, import_pg_core.text)("requirements"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    quizResponses = (0, import_pg_core.pgTable)("quiz_responses", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      businessType: (0, import_pg_core.text)("business_type").notNull(),
      goal: (0, import_pg_core.text)("goal").notNull(),
      audience: (0, import_pg_core.text)("audience").notNull(),
      email: (0, import_pg_core.text)("email"),
      recommendations: (0, import_pg_core.jsonb)("recommendations").$type(),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    activities = (0, import_pg_core.pgTable)("activities", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      userId: (0, import_pg_core.integer)("user_id").references(() => users.id),
      event: (0, import_pg_core.text)("event").notNull(),
      entity: (0, import_pg_core.text)("entity"),
      entityId: (0, import_pg_core.text)("entity_id"),
      metadata: (0, import_pg_core.jsonb)("metadata").$type(),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    orders = (0, import_pg_core.pgTable)("orders", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      userId: (0, import_pg_core.integer)("user_id").references(() => users.id),
      serviceId: (0, import_pg_core.integer)("service_id").references(() => servicePackages.id),
      status: (0, import_pg_core.text)("status").default("pending"),
      totalAmount: (0, import_pg_core.numeric)("total_amount", { precision: 10, scale: 2 }).notNull(),
      paymentStatus: (0, import_pg_core.text)("payment_status").default("pending"),
      orderData: (0, import_pg_core.jsonb)("order_data").$type(),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    payments = (0, import_pg_core.pgTable)("payments", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      orderId: (0, import_pg_core.integer)("order_id").references(() => orders.id),
      amount: (0, import_pg_core.numeric)("amount", { precision: 10, scale: 2 }).notNull(),
      currency: (0, import_pg_core.text)("currency").default("SAR"),
      paymentMethod: (0, import_pg_core.text)("payment_method"),
      transactionId: (0, import_pg_core.text)("transaction_id"),
      status: (0, import_pg_core.text)("status").default("pending"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    inquiries = (0, import_pg_core.pgTable)("inquiries", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      fullName: (0, import_pg_core.text)("full_name").notNull(),
      companyRole: (0, import_pg_core.text)("company_role"),
      mobile: (0, import_pg_core.text)("mobile").notNull(),
      email: (0, import_pg_core.text)("email"),
      projectType: (0, import_pg_core.text)("project_type").notNull(),
      language: (0, import_pg_core.text)("language").default("en"),
      source: (0, import_pg_core.text)("source").default("campaign"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).omit({
      id: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true
    }).extend({
      email: import_zod.z.string().email("Please enter a valid email address"),
      password: import_zod.z.string().min(8, "Password must be at least 8 characters")
    });
    insertServiceCategorySchema = (0, import_drizzle_zod.createInsertSchema)(serviceCategories).omit({
      id: true
    });
    insertServicePackageSchema = (0, import_drizzle_zod.createInsertSchema)(servicePackages).omit({
      id: true
    });
    insertProjectBriefSchema = (0, import_drizzle_zod.createInsertSchema)(projectBriefs).omit({
      id: true,
      createdAt: true
    });
    insertQuizResponseSchema = (0, import_drizzle_zod.createInsertSchema)(quizResponses).omit({
      id: true,
      createdAt: true,
      recommendations: true
    });
    insertOrderSchema = (0, import_drizzle_zod.createInsertSchema)(orders).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPaymentSchema = (0, import_drizzle_zod.createInsertSchema)(payments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertInquirySchema = (0, import_drizzle_zod.createInsertSchema)(inquiries).omit({
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
var import_serverless, import_neon_serverless, import_ws, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    import_serverless = require("@neondatabase/serverless");
    import_neon_serverless = require("drizzle-orm/neon-serverless");
    import_ws = __toESM(require("ws"), 1);
    init_schema();
    import_serverless.neonConfig.webSocketConstructor = import_ws.default;
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new import_serverless.Pool({ connectionString: process.env.DATABASE_URL });
    db = (0, import_neon_serverless.drizzle)({ client: pool, schema: schema_exports });
  }
});

// vite-stub:vite-production-stub
var require_vite_production_stub = __commonJS({
  "vite-stub:vite-production-stub"(exports2, module2) {
    var path2 = require("path");
    var fs2 = require("fs");
    var express3 = require("express");
    function log2(message, source) {
      source = source || "express";
      const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
      console.log(formattedTime + " [" + source + "] " + message);
    }
    function serveStatic2(app2) {
      const distPath = path2.resolve(__dirname, "public");
      if (!fs2.existsSync(distPath)) {
        throw new Error("Could not find the build directory: " + distPath + ", make sure to build the client first");
      }
      app2.use(express3.static(distPath));
      app2.use("*", function(_req, res) {
        res.sendFile(path2.resolve(distPath, "index.html"));
      });
    }
    async function setupVite2(app2, server) {
      throw new Error("setupVite should not be called in production");
    }
    module2.exports = { log: log2, serveStatic: serveStatic2, setupVite: setupVite2 };
  }
});

// server/index.ts
var import_config = require("dotenv/config");
var import_express8 = __toESM(require("express"), 1);

// server/routes.ts
var import_http = require("http");

// server/storage.ts
init_schema();
var import_drizzle_orm = require("drizzle-orm");
var db2;
try {
  if (process.env.DATABASE_URL) {
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
var import_zod3 = require("zod");

// server/routes/inquiry.ts
var import_express = require("express");
init_db();
init_schema();
var import_drizzle_orm2 = require("drizzle-orm");
var import_zod2 = require("zod");

// server/email.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
var EmailService = class {
  transporter = null;
  fromEmail;
  isDevelopment;
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || "noreply@techpartner.sa";
    this.isDevelopment = false;
    if (this.shouldCreateTransporter()) {
      const config = this.getEmailConfig();
      this.transporter = import_nodemailer.default.createTransport(config);
    }
  }
  shouldCreateTransporter() {
    if (true) {
      return true;
    }
    return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  }
  getEmailConfig() {
    if (true) {
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
      if (false) {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", import_nodemailer.default.getTestMessageUrl(info));
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
var router = (0, import_express.Router)();
var inquirySubmissionSchema = insertInquirySchema.extend({
  email: import_zod2.z.string().email().optional().or(import_zod2.z.literal(""))
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
    if (error instanceof import_zod2.z.ZodError) {
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
      db.select().from(inquiries).orderBy((0, import_drizzle_orm2.desc)(inquiries.createdAt)).limit(Number(limit)).offset(skip),
      db.select({ count: (0, import_drizzle_orm2.count)() }).from(inquiries)
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
      db.select({ count: (0, import_drizzle_orm2.count)() }).from(inquiries),
      // Today's inquiries
      db.select({ count: (0, import_drizzle_orm2.count)() }).from(inquiries).where(import_drizzle_orm2.sql`${inquiries.createdAt} >= ${today}`),
      // Language breakdown
      db.select({
        language: inquiries.language,
        count: (0, import_drizzle_orm2.count)()
      }).from(inquiries).groupBy(inquiries.language),
      // Project type breakdown
      db.select({
        projectType: inquiries.projectType,
        count: (0, import_drizzle_orm2.count)()
      }).from(inquiries).groupBy(inquiries.projectType).orderBy((0, import_drizzle_orm2.desc)((0, import_drizzle_orm2.count)()))
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
var import_express2 = require("express");
var router2 = (0, import_express2.Router)();
router2.post("/test-email", async (req, res) => {
  if (true) {
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
  if (true) {
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
var import_express3 = require("express");
var import_axios = __toESM(require("axios"), 1);
var router3 = (0, import_express3.Router)();
router3.post("/test-payment", async (req, res) => {
  if (true) {
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
    const response = await import_axios.default.post(
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
    const response = await import_axios.default.post(
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
    const response = await import_axios.default.post(
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
var import_express4 = require("express");
init_db();
init_schema();
var import_drizzle_orm4 = require("drizzle-orm");

// server/middleware/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
init_db();
init_schema();
var import_drizzle_orm3 = require("drizzle-orm");
var JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
var generateToken = (user) => {
  return import_jsonwebtoken.default.sign(
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
  return import_jsonwebtoken.default.verify(token, JWT_SECRET);
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
    }).from(users).where((0, import_drizzle_orm3.eq)(users.id, decoded.id)).limit(1);
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
var router4 = (0, import_express4.Router)();
router4.get("/admin/dashboard", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [totalOrdersResult] = await db.select({ count: (0, import_drizzle_orm4.count)() }).from(orders);
    const [paidOrdersResult] = await db.select({ count: (0, import_drizzle_orm4.count)() }).from(orders).where((0, import_drizzle_orm4.eq)(orders.status, "PAID"));
    const [pendingOrdersResult] = await db.select({ count: (0, import_drizzle_orm4.count)() }).from(orders).where((0, import_drizzle_orm4.eq)(orders.status, "PENDING"));
    const [revenueResult] = await db.select({
      total: (0, import_drizzle_orm4.sum)(orders.totalAmount)
    }).from(orders).where((0, import_drizzle_orm4.eq)(orders.paymentStatus, "paid"));
    const recentOrders = await db.select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      userEmail: users.email,
      serviceName: servicePackages.name
    }).from(orders).leftJoin(users, (0, import_drizzle_orm4.eq)(orders.userId, users.id)).leftJoin(servicePackages, (0, import_drizzle_orm4.eq)(orders.serviceId, servicePackages.id)).orderBy((0, import_drizzle_orm4.desc)(orders.createdAt)).limit(10);
    const recentActivities = await db.select({
      id: activities.id,
      event: activities.event,
      entity: activities.entity,
      entityId: activities.entityId,
      metadata: activities.metadata,
      createdAt: activities.createdAt,
      userEmail: users.email
    }).from(activities).leftJoin(users, (0, import_drizzle_orm4.eq)(activities.userId, users.id)).orderBy((0, import_drizzle_orm4.desc)(activities.createdAt)).limit(20);
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
    const [order] = await db.select().from(orders).where((0, import_drizzle_orm4.eq)(orders.id, parseInt(id))).limit(1);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const [updatedOrder] = await db.update(orders).set({
      status,
      updatedAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm4.eq)(orders.id, parseInt(id))).returning();
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
    }).from(payments).orderBy((0, import_drizzle_orm4.desc)(payments.createdAt));
    res.json(allPayments);
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ error: "Failed to get payments" });
  }
});
router4.get("/admin/analytics/payments", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [totalPaymentsResult] = await db.select({ count: (0, import_drizzle_orm4.count)() }).from(payments);
    const [successfulPaymentsResult] = await db.select({ count: (0, import_drizzle_orm4.count)() }).from(payments).where((0, import_drizzle_orm4.eq)(payments.status, "completed"));
    const [pendingPaymentsResult] = await db.select({ count: (0, import_drizzle_orm4.count)() }).from(payments).where((0, import_drizzle_orm4.eq)(payments.status, "pending"));
    const [failedPaymentsResult] = await db.select({ count: (0, import_drizzle_orm4.count)() }).from(payments).where((0, import_drizzle_orm4.eq)(payments.status, "failed"));
    const [totalRevenueResult] = await db.select({
      total: (0, import_drizzle_orm4.sum)(payments.amount)
    }).from(payments).where((0, import_drizzle_orm4.eq)(payments.status, "completed"));
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
    const [payment] = await db.select().from(payments).where((0, import_drizzle_orm4.eq)(payments.id, parseInt(id))).limit(1);
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
    }).from(orders).leftJoin(users, (0, import_drizzle_orm4.eq)(orders.userId, users.id)).leftJoin(servicePackages, (0, import_drizzle_orm4.eq)(orders.serviceId, servicePackages.id)).orderBy((0, import_drizzle_orm4.desc)(orders.createdAt));
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
    }).from(activities).leftJoin(users, (0, import_drizzle_orm4.eq)(activities.userId, users.id)).orderBy((0, import_drizzle_orm4.desc)(activities.createdAt)).limit(100);
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
    const [order] = await db.select().from(orders).where((0, import_drizzle_orm4.eq)(orders.id, parseInt(orderId))).limit(1);
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
    }).where((0, import_drizzle_orm4.eq)(orders.id, parseInt(orderId))).returning();
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

// server/routes/blog.ts
var import_express5 = require("express");
var router5 = (0, import_express5.Router)();
var blogPosts = [
  {
    id: 1,
    title: "How to Build a Strong Brand Identity",
    titleAr: "\u0643\u064A\u0641 \u062A\u0628\u0646\u064A \u0647\u0648\u064A\u0629 \u0639\u0644\u0627\u0645\u0629 \u062A\u062C\u0627\u0631\u064A\u0629 \u0642\u0648\u064A\u0629",
    slug: "how-to-build-strong-brand-identity",
    excerpt: "A strong brand identity is more than just a logo. Learn the key elements that make your brand memorable and trustworthy.",
    excerptAr: "\u0647\u0648\u064A\u0629 \u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629 \u0627\u0644\u0642\u0648\u064A\u0629 \u0623\u0643\u062B\u0631 \u0645\u0646 \u0645\u062C\u0631\u062F \u0634\u0639\u0627\u0631. \u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 \u0627\u0644\u062A\u064A \u062A\u062C\u0639\u0644 \u0639\u0644\u0627\u0645\u062A\u0643 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629 \u0644\u0627 \u062A\u064F\u0646\u0633\u0649 \u0648\u062C\u062F\u064A\u0631\u0629 \u0628\u0627\u0644\u062B\u0642\u0629.",
    content: "Building a strong brand identity requires consistency, clarity, and creativity. Start with your brand values, define your target audience, and create visual elements that reflect your personality.",
    category: "Branding",
    author: "TechPartner Team",
    publishedAt: "2025-01-15T10:00:00Z",
    imageUrl: "/assets/art-and-illustration.png",
    tags: ["branding", "logo", "identity", "design"],
    readTime: 5
  },
  {
    id: 2,
    title: "Top Web Design Trends in 2025",
    titleAr: "\u0623\u0628\u0631\u0632 \u0627\u062A\u062C\u0627\u0647\u0627\u062A \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0648\u064A\u0628 \u0641\u064A 2025",
    slug: "top-web-design-trends-2025",
    excerpt: "Discover the latest web design trends shaping the digital landscape in 2025, from AI-driven layouts to immersive experiences.",
    excerptAr: "\u0627\u0643\u062A\u0634\u0641 \u0623\u062D\u062F\u062B \u0627\u062A\u062C\u0627\u0647\u0627\u062A \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0648\u064A\u0628 \u0627\u0644\u062A\u064A \u062A\u0634\u0643\u0644 \u0627\u0644\u0645\u0634\u0647\u062F \u0627\u0644\u0631\u0642\u0645\u064A \u0641\u064A 2025\u060C \u0645\u0646 \u0627\u0644\u062A\u062E\u0637\u064A\u0637\u0627\u062A \u0627\u0644\u0645\u062F\u0639\u0648\u0645\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0625\u0644\u0649 \u0627\u0644\u062A\u062C\u0627\u0631\u0628 \u0627\u0644\u063A\u0627\u0645\u0631\u0629.",
    content: "2025 brings exciting new trends in web design including dark mode by default, micro-animations, AI-personalized content, and accessibility-first design principles.",
    category: "Web Design",
    author: "TechPartner Team",
    publishedAt: "2025-01-20T10:00:00Z",
    imageUrl: "/assets/web-and-app-design.png",
    tags: ["web design", "trends", "UI", "UX"],
    readTime: 7
  },
  {
    id: 3,
    title: "The Importance of Packaging Design for Your Product",
    titleAr: "\u0623\u0647\u0645\u064A\u0629 \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u062A\u063A\u0644\u064A\u0641 \u0644\u0645\u0646\u062A\u062C\u0643",
    slug: "importance-of-packaging-design",
    excerpt: "Great packaging design can be the difference between a product that sells and one that sits on the shelf. Here's why it matters.",
    excerptAr: "\u064A\u0645\u0643\u0646 \u0623\u0646 \u064A\u0643\u0648\u0646 \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u062A\u063A\u0644\u064A\u0641 \u0627\u0644\u0631\u0627\u0626\u0639 \u0647\u0648 \u0627\u0644\u0641\u0631\u0642 \u0628\u064A\u0646 \u0645\u0646\u062A\u062C \u064A\u064F\u0628\u0627\u0639 \u0648\u0645\u0646\u062A\u062C \u064A\u0628\u0642\u0649 \u0639\u0644\u0649 \u0627\u0644\u0631\u0641. \u0625\u0644\u064A\u0643 \u0633\u0628\u0628 \u0623\u0647\u0645\u064A\u062A\u0647.",
    content: "Packaging design communicates your brand values at the point of sale. It should be functional, attractive, and aligned with your overall brand identity.",
    category: "Packaging",
    author: "TechPartner Team",
    publishedAt: "2025-02-01T10:00:00Z",
    imageUrl: "/assets/packaging.png",
    tags: ["packaging", "product design", "branding"],
    readTime: 4
  },
  {
    id: 4,
    title: "Why Your Business Needs a Professional Logo",
    titleAr: "\u0644\u0645\u0627\u0630\u0627 \u062A\u062D\u062A\u0627\u062C \u0634\u0631\u0643\u062A\u0643 \u0625\u0644\u0649 \u0634\u0639\u0627\u0631 \u0627\u062D\u062A\u0631\u0627\u0641\u064A",
    slug: "why-business-needs-professional-logo",
    excerpt: "Your logo is the face of your business. Investing in a professional logo design pays dividends in brand recognition and trust.",
    excerptAr: "\u0634\u0639\u0627\u0631\u0643 \u0647\u0648 \u0648\u062C\u0647 \u0639\u0645\u0644\u0643. \u0627\u0644\u0627\u0633\u062A\u062B\u0645\u0627\u0631 \u0641\u064A \u062A\u0635\u0645\u064A\u0645 \u0634\u0639\u0627\u0631 \u0627\u062D\u062A\u0631\u0627\u0641\u064A \u064A\u0639\u0648\u062F \u0628\u0641\u0648\u0627\u0626\u062F \u0643\u0628\u064A\u0631\u0629 \u0641\u064A \u0627\u0644\u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629 \u0648\u0627\u0644\u062B\u0642\u0629.",
    content: "A professional logo establishes credibility, differentiates you from competitors, and creates a lasting first impression. It's the cornerstone of your visual identity.",
    category: "Logo Design",
    author: "TechPartner Team",
    publishedAt: "2025-02-10T10:00:00Z",
    imageUrl: "/assets/logo-and-branding-design.png",
    tags: ["logo", "branding", "business", "design"],
    readTime: 6
  }
];
router5.get("/blog", (req, res) => {
  const { category, limit } = req.query;
  let posts = [...blogPosts];
  if (category) {
    posts = posts.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (limit) {
    posts = posts.slice(0, parseInt(String(limit), 10));
  }
  res.json(posts);
});
router5.get("/blog/:slug", (req, res) => {
  const post = blogPosts.find((p) => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ error: "Blog post not found" });
  }
  res.json(post);
});
var blog_default = router5;

// server/routes/i18n.ts
var import_express6 = require("express");

// server/translation-service.ts
var import_axios2 = __toESM(require("axios"), 1);
var OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
var MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";
var TranslationService = class _TranslationService {
  static instance;
  cache = {};
  supportedLanguages = ["en", "ar"];
  constructor() {
    this.loadCacheFromStorage();
  }
  static getInstance() {
    if (!_TranslationService.instance) {
      _TranslationService.instance = new _TranslationService();
    }
    return _TranslationService.instance;
  }
  /**
   * Translate text using Ollama AI
   */
  async translate(request) {
    const { text: text2, sourceLang, targetLang, context } = request;
    const cacheKey = this.getCacheKey(text2, sourceLang, targetLang);
    if (this.cache[cacheKey]?.[targetLang]) {
      console.log(`[Translation] Cache hit for: "${text2.substring(0, 50)}..."`);
      return this.cache[cacheKey][targetLang];
    }
    if (sourceLang === targetLang) {
      return text2;
    }
    try {
      console.log(`[Translation] Translating to ${targetLang}: "${text2.substring(0, 50)}..."`);
      const translatedText = await this.translateWithOllama(text2, sourceLang, targetLang, context);
      this.storeInCache(text2, sourceLang, targetLang, translatedText);
      return translatedText;
    } catch (error) {
      console.error("[Translation] Error:", error.message);
      return text2;
    }
  }
  /**
   * Translate using Ollama AI
   */
  async translateWithOllama(text2, sourceLang, targetLang, context) {
    const targetLangName = this.getLanguageName(targetLang);
    const sourceLangName = this.getLanguageName(sourceLang);
    let prompt = `You are a professional translator. Translate the following ${sourceLangName} text to ${targetLangName}.
    
IMPORTANT RULES:
- Return ONLY the translated text
- Do NOT add explanations, notes, or context
- Do NOT include the original text
- Do NOT add quotes around the translation
- Preserve any placeholders like {{variable}} or HTML tags
- Keep the same tone and style`;
    if (context) {
      prompt += `
Context: ${context}`;
    }
    prompt += `

Text to translate:
${text2}

Translation (only the translated text, no explanations):`;
    const response = await import_axios2.default.post(`${OLLAMA_HOST}/api/generate`, {
      model: MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 1024,
        stop: ["\n\n", "Note:", "Explanation:", "Context:"]
      }
    });
    let translated = response.data.response.trim();
    translated = translated.replace(/^["']|["']$/g, "").replace(/^(Translation|Translated text|Arabic|English)[:.]?\s*/i, "").replace(/\n.*$/s, "").trim();
    return translated;
  }
  /**
   * Batch translate multiple texts
   */
  async translateBatch(texts, sourceLang, targetLang) {
    const promises = texts.map(
      (text2) => this.translate({ text: text2, sourceLang, targetLang })
    );
    return Promise.all(promises);
  }
  /**
   * Get all translations for a language
   */
  async getTranslationsForLanguage(lang) {
    const translations = {};
    Object.keys(this.cache).forEach((key) => {
      if (this.cache[key][lang]) {
        translations[key] = this.cache[key][lang];
      }
    });
    return translations;
  }
  /**
   * Store translation in cache
   */
  storeInCache(originalText, sourceLang, targetLang, translatedText) {
    const cacheKey = this.getCacheKey(originalText, sourceLang, targetLang);
    if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = {};
    }
    this.cache[cacheKey][targetLang] = translatedText;
    this.cache[cacheKey][sourceLang] = originalText;
    this.saveCacheToStorage();
  }
  /**
   * Generate cache key
   */
  getCacheKey(text2, sourceLang, targetLang) {
    const hash = this.simpleHash(text2);
    return `${sourceLang}_${hash}`;
  }
  /**
   * Simple hash function
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
  /**
   * Get language name
   */
  getLanguageName(lang) {
    const names = {
      "en": "English",
      "ar": "Modern Standard Arabic (\u0641\u0635\u062D\u0649)",
      "fr": "French",
      "es": "Spanish",
      "de": "German"
    };
    return names[lang] || lang;
  }
  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }
  /**
   * Add custom translation
   */
  addCustomTranslation(key, lang, translation) {
    if (!this.cache[key]) {
      this.cache[key] = {};
    }
    this.cache[key][lang] = translation;
    this.saveCacheToStorage();
  }
  /**
   * Load cache from storage
   */
  loadCacheFromStorage() {
    try {
      console.log("[Translation] Cache initialized");
    } catch (error) {
      console.error("[Translation] Error loading cache:", error);
    }
  }
  /**
   * Save cache to storage
   */
  saveCacheToStorage() {
    try {
    } catch (error) {
      console.error("[Translation] Error saving cache:", error);
    }
  }
  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
    console.log("[Translation] Cache cleared");
  }
  /**
   * Get cache stats
   */
  getCacheStats() {
    let totalTranslations = 0;
    const totalKeys = Object.keys(this.cache).length;
    Object.values(this.cache).forEach((langMap) => {
      totalTranslations += Object.keys(langMap).length;
    });
    return { totalKeys, totalTranslations };
  }
  /**
   * Auto-translate content object
   */
  async autoTranslateContent(content, targetLang, sourceLang = "en") {
    const translated = {};
    for (const [key, value] of Object.entries(content)) {
      translated[key] = await this.translate({
        text: value,
        sourceLang,
        targetLang,
        context: `UI text for key: ${key}`
      });
    }
    return translated;
  }
};
var translationService = TranslationService.getInstance();

// server/routes/i18n.ts
var router6 = (0, import_express6.Router)();
router6.get("/translations/:lang", async (req, res) => {
  try {
    const { lang } = req.params;
    const supportedLanguages = translationService.getSupportedLanguages();
    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({
        error: "Unsupported language",
        supportedLanguages
      });
    }
    const translations = await translationService.getTranslationsForLanguage(lang);
    res.json({
      language: lang,
      translations,
      count: Object.keys(translations).length
    });
  } catch (error) {
    console.error("[i18n] Error fetching translations:", error);
    res.status(500).json({ error: "Failed to fetch translations" });
  }
});
router6.post("/translate", async (req, res) => {
  try {
    const { text: text2, sourceLang = "en", targetLang, context } = req.body;
    if (!text2 || !targetLang) {
      return res.status(400).json({
        error: "Missing required fields: text and targetLang"
      });
    }
    const supportedLanguages = translationService.getSupportedLanguages();
    if (!supportedLanguages.includes(targetLang)) {
      return res.status(400).json({
        error: "Unsupported target language",
        supportedLanguages
      });
    }
    const translated = await translationService.translate({
      text: text2,
      sourceLang,
      targetLang,
      context
    });
    res.json({
      original: text2,
      translated,
      sourceLang,
      targetLang
    });
  } catch (error) {
    console.error("[i18n] Error translating:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});
router6.post("/translate-batch", async (req, res) => {
  try {
    const { texts, sourceLang = "en", targetLang } = req.body;
    if (!Array.isArray(texts) || !targetLang) {
      return res.status(400).json({
        error: "Missing required fields: texts (array) and targetLang"
      });
    }
    const translations = await translationService.translateBatch(
      texts,
      sourceLang,
      targetLang
    );
    res.json({
      translations,
      sourceLang,
      targetLang,
      count: translations.length
    });
  } catch (error) {
    console.error("[i18n] Error batch translating:", error);
    res.status(500).json({ error: "Batch translation failed" });
  }
});
router6.get("/languages", (req, res) => {
  const languages = translationService.getSupportedLanguages();
  res.json({
    languages,
    defaultLanguage: "en"
  });
});
router6.get("/cache-stats", (req, res) => {
  const stats = translationService.getCacheStats();
  res.json(stats);
});
router6.post("/clear-cache", async (req, res) => {
  try {
    translationService.clearCache();
    res.json({ message: "Cache cleared successfully" });
  } catch (error) {
    console.error("[i18n] Error clearing cache:", error);
    res.status(500).json({ error: "Failed to clear cache" });
  }
});
router6.post("/auto-translate", async (req, res) => {
  try {
    const { content, targetLang, sourceLang = "en" } = req.body;
    if (!content || typeof content !== "object" || !targetLang) {
      return res.status(400).json({
        error: "Missing required fields: content (object) and targetLang"
      });
    }
    const translated = await translationService.autoTranslateContent(
      content,
      targetLang,
      sourceLang
    );
    res.json({
      original: content,
      translated,
      sourceLang,
      targetLang
    });
  } catch (error) {
    console.error("[i18n] Error auto-translating:", error);
    res.status(500).json({ error: "Auto-translation failed" });
  }
});
var i18n_default = router6;

// server/routes.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
async function registerRoutes(app2) {
  app2.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "TechPartner Platform"
    });
  });
  app2.get("/sitemap.xml", (req, res) => {
    const publicPath = true ? "dist/public" : "public";
    res.setHeader("Content-Type", "application/xml");
    res.sendFile("sitemap.xml", { root: publicPath });
  });
  app2.get("/sitemap", (req, res) => {
    const publicPath = true ? "dist/public" : "public";
    res.setHeader("Content-Type", "text/html");
    res.sendFile("sitemap.html", { root: publicPath });
  });
  app2.get("/robots.txt", (req, res) => {
    const publicPath = true ? "dist/public" : "public";
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
      const hashedPassword = await import_bcryptjs.default.hash(data.password, 12);
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
      const isPasswordValid = await import_bcryptjs.default.compare(password, user.password);
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
      const isCurrentPasswordValid = await import_bcryptjs.default.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      const hashedNewPassword = await import_bcryptjs.default.hash(newPassword, 10);
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
      if (error instanceof import_zod3.z.ZodError) {
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
      if (error instanceof import_zod3.z.ZodError) {
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
  app2.get("/api/services", async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      const packages = await storage.getServicePackages();
      const services = categories.map((cat) => ({
        ...cat,
        packages: packages.filter((pkg) => pkg.categoryId === cat.id)
      }));
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });
  app2.use("/api", blog_default);
  app2.use("/api", inquiry_default);
  app2.use("/api", email_test_default);
  app2.use("/api", payments_default);
  app2.use("/api", admin_default);
  app2.use("/api/i18n", i18n_default);
  const httpServer = (0, import_http.createServer)(app2);
  return httpServer;
}

// server/index.ts
var import_vite = __toESM(require_vite_production_stub(), 1);

// server/static-handler.ts
var import_express7 = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
function serveStaticFixed(app2) {
  const distPath = import_path.default.resolve(process.cwd(), "dist", "public");
  console.log("Current working directory:", process.cwd());
  console.log("Looking for static files at:", distPath);
  console.log("Directory exists:", import_fs.default.existsSync(distPath));
  if (import_fs.default.existsSync(distPath)) {
    console.log("Files in dist/public:", import_fs.default.readdirSync(distPath));
    const assetsPath = import_path.default.join(distPath, "assets");
    if (import_fs.default.existsSync(assetsPath)) {
      console.log("Files in assets:", import_fs.default.readdirSync(assetsPath).slice(0, 5));
    }
  }
  if (!import_fs.default.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(import_express7.default.static(distPath));
  app2.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    console.log("Serving SPA fallback for:", req.path);
    res.sendFile(import_path.default.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = (0, import_express8.default)();
app.use(import_express8.default.json());
app.use(import_express8.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      (0, import_vite.log)(logLine);
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
    await (0, import_vite.setupVite)(app, server);
  } else {
    serveStaticFixed(app);
  }
  const port = Number(process.env.PORT) || 3e3;
  const host = "0.0.0.0";
  server.listen({
    port,
    host,
    reusePort: true
  }, () => {
    (0, import_vite.log)(`TechPartner Platform serving on port ${port}`);
    if (true) {
      (0, import_vite.log)("Running in production mode for Google Cloud App Engine");
    }
  });
})();
//# sourceMappingURL=index.cjs.map
