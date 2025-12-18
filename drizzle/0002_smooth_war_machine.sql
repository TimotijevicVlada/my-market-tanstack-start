CREATE TYPE "public"."user_role" AS ENUM('PRODUCER', 'BUYER', 'ADMIN');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_name";