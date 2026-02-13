CREATE TYPE "public"."banner_placement" AS ENUM('home', 'category');--> statement-breakpoint
CREATE TABLE "banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placement" "banner_placement" DEFAULT 'home' NOT NULL,
	"title" varchar(120) NOT NULL,
	"subtitle" varchar(200),
	"image_url" text NOT NULL,
	"alt_text" varchar(140),
	"cta_label" varchar(40) NOT NULL,
	"cta_href" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"start_at" timestamp with time zone,
	"end_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "unit" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "unit" SET DEFAULT 'piece'::text;--> statement-breakpoint
DROP TYPE "public"."product_unit";--> statement-breakpoint
CREATE TYPE "public"."product_unit" AS ENUM('piece', 'kg', 'g', 'liter', 'box');--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "unit" SET DEFAULT 'piece'::"public"."product_unit";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "unit" SET DATA TYPE "public"."product_unit" USING "unit"::"public"."product_unit";--> statement-breakpoint
CREATE INDEX "banners_placement_active_order_idx" ON "banners" USING btree ("placement","is_active","sort_order");--> statement-breakpoint
CREATE INDEX "banners_schedule_idx" ON "banners" USING btree ("start_at","end_at");