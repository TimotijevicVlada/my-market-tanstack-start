-- Migration to add custom fields (role, isActive) to better-auth user table
-- Apply this directly to your PostgreSQL database

-- Create the user_role enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE "user_role" AS ENUM ('buyer', 'seller', 'admin', 'super-admin');
    END IF;
END $$;

-- Add role column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user' AND column_name = 'role'
    ) THEN
        ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'buyer' NOT NULL;
    END IF;
END $$;

-- Add is_active column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE "user" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;
    END IF;
END $$;
