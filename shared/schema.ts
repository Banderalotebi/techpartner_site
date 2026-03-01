import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  address: text("address"),
  profileImage: text("profile_image"),
  role: text("role").notNull().default("client"), // 'client' or 'admin'
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(false),
});

export const servicePackages = pgTable("service_packages", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in SAR
  features: jsonb("features").$type<string[]>().notNull(),
  isPopular: boolean("is_popular").notNull().default(false),
});

export const projectBriefs = pgTable("project_briefs", {
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizResponses = pgTable("quiz_responses", {
  id: serial("id").primaryKey(),
  businessType: text("business_type").notNull(),
  goal: text("goal").notNull(),
  audience: text("audience").notNull(),
  email: text("email"),
  recommendations: jsonb("recommendations").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Activity Logging Table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  event: text("event").notNull(),
  entity: text("entity"),
  entityId: text("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// TPOS Integration Tables
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  serviceId: integer("service_id").references(() => servicePackages.id),
  status: text("status").default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").default("pending"),
  orderData: jsonb("order_data").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("SAR"),
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  companyRole: text("company_role"),
  mobile: text("mobile").notNull(),
  email: text("email"),
  projectType: text("project_type").notNull(),
  language: text("language").default("en"),
  source: text("source").default("campaign"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// AI CRM Tables - Phase 1: Unified AI CRM
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  source: text("source").default("Chatbot"), // 'Chatbot', 'Contact Form', 'Scraper'
  leadScore: text("lead_score").default("PENDING"), // 'HOT', 'WARM', 'COLD', 'PENDING'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  leadEmail: text("lead_email").notNull(),
  interactionType: text("interaction_type").notNull(), // 'Chat Transcript', 'Email Sent', 'Page Visit', 'Autonomous Email Sent'
  content: text("content"),
  aiSummary: text("ai_summary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// SEO Prospects Table - Phase 2: SEO Agent
export const prospects = pgTable("prospects", {
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  approved: boolean("approved").default(false),
  reason: text("reason"),
  draftEmail: text("draft_email"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Programmatic SEO Pages - Phase 3: GEO + pSEO Engine
export const programmaticPages = pgTable("programmatic_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  targetKeyword: text("target_keyword").notNull(),
  city: text("city").notNull(),
  industry: text("industry").notNull(),
  h1Title: text("h1_title").notNull(),
  aiGeneratedContent: text("ai_generated_content").notNull(),
  jsonLdSchema: jsonb("json_ld_schema").notNull(),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true,
});

export const insertServicePackageSchema = createInsertSchema(servicePackages).omit({
  id: true,
});

export const insertProjectBriefSchema = createInsertSchema(projectBriefs).omit({
  id: true,
  createdAt: true,
});

export const insertQuizResponseSchema = createInsertSchema(quizResponses).omit({
  id: true,
  createdAt: true,
  recommendations: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInteractionSchema = createInsertSchema(interactions).omit({
  id: true,
  createdAt: true,
});

export const insertProspectSchema = createInsertSchema(prospects).omit({
  id: true,
  createdAt: true,
});

export const insertProgrammaticPageSchema = createInsertSchema(programmaticPages).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServicePackage = typeof servicePackages.$inferSelect;
export type InsertServicePackage = z.infer<typeof insertServicePackageSchema>;
export type ProjectBrief = typeof projectBriefs.$inferSelect;
export type InsertProjectBrief = z.infer<typeof insertProjectBriefSchema>;
export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = z.infer<typeof insertQuizResponseSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
export type Prospect = typeof prospects.$inferSelect;
export type InsertProspect = z.infer<typeof insertProspectSchema>;
export type ProgrammaticPage = typeof programmaticPages.$inferSelect;
export type InsertProgrammaticPage = z.infer<typeof insertProgrammaticPageSchema>;
