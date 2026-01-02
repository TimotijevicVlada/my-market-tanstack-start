ALTER TABLE "sellers" ALTER COLUMN "is_active" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "updated_at" SET DEFAULT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "updated_at" DROP NOT NULL;