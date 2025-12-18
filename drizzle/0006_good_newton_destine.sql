CREATE TYPE "public"."product_status" AS ENUM('draft', 'published', 'out_of_stock', 'archived');--> statement-breakpoint
CREATE TYPE "public"."product_unit" AS ENUM('kg', 'lb', 'g', 'oz', 'piece', 'bunch', 'dozen', 'liter', 'gallon', 'box');--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"producer_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"unit" "product_unit" NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"is_organic" boolean DEFAULT false NOT NULL,
	"origin_place" varchar(255) NOT NULL,
	"main_image_url" varchar(500),
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;