-- Drop the existing users table (data will be re-seeded)
DROP TABLE IF EXISTS "users";--> statement-breakpoint
-- Recreate users table with UUID id
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"username" varchar(100) NOT NULL UNIQUE,
	"email" varchar(255) NOT NULL UNIQUE,
	"role" "user_role" NOT NULL,
	"created_at" timestamp DEFAULT now()
);