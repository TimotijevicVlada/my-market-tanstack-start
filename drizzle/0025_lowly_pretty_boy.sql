ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'buyer' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;