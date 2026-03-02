CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event" text NOT NULL,
	"entity" text,
	"entity_id" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"business_name" text NOT NULL,
	"website_url" text NOT NULL,
	"page_speed_score" integer,
	"ai_report_content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "client_audits_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "domain_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"domain_name" text NOT NULL,
	"keywords_matched" text NOT NULL,
	"status" text DEFAULT 'NEW',
	"discovered_at" timestamp DEFAULT now(),
	CONSTRAINT "domain_leads_domain_name_unique" UNIQUE("domain_name")
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"company_role" text,
	"mobile" text NOT NULL,
	"email" text,
	"project_type" text NOT NULL,
	"language" text DEFAULT 'en',
	"source" text DEFAULT 'campaign',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_email" text NOT NULL,
	"interaction_type" text NOT NULL,
	"content" text,
	"ai_summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"source" text DEFAULT 'Chatbot',
	"lead_score" text DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"service_id" integer,
	"status" text DEFAULT 'pending',
	"total_amount" numeric(10, 2) NOT NULL,
	"payment_status" text DEFAULT 'pending',
	"order_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'SAR',
	"payment_method" text,
	"transaction_id" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programmatic_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"target_keyword" text NOT NULL,
	"city" text NOT NULL,
	"industry" text NOT NULL,
	"h1_title" text NOT NULL,
	"ai_generated_content" text NOT NULL,
	"json_ld_schema" jsonb NOT NULL,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "programmatic_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project_briefs" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_id" integer NOT NULL,
	"company_name" text NOT NULL,
	"industry" text NOT NULL,
	"description" text NOT NULL,
	"design_style" text,
	"colors" text,
	"budget" text,
	"deadline" text,
	"email" text NOT NULL,
	"requirements" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prospects" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"approved" boolean DEFAULT false,
	"reason" text,
	"draft_email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "prospects_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "quiz_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_type" text NOT NULL,
	"goal" text NOT NULL,
	"audience" text NOT NULL,
	"email" text,
	"recommendations" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT false NOT NULL,
	CONSTRAINT "service_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "service_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"features" jsonb NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	CONSTRAINT "service_packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"address" text,
	"profile_image" text,
	"role" text DEFAULT 'client' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_service_packages_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;