ALTER TABLE "sellers" RENAME COLUMN "name" TO "email";--> statement-breakpoint
ALTER TABLE "sellers" RENAME COLUMN "slug" TO "city";--> statement-breakpoint
ALTER TABLE "sellers" RENAME COLUMN "location" TO "address";--> statement-breakpoint
ALTER TABLE "sellers" DROP CONSTRAINT "sellers_slug_unique";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "phone" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "display_name" varchar(120) NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "website" varchar(255);--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "country" varchar(80) DEFAULT 'Serbia';--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "postal_code" varchar(20);--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "cover_image_url" text;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "verification_note" text;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "commission_rate" numeric(5, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "rating_avg" numeric(3, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "rating_count" integer DEFAULT 0;