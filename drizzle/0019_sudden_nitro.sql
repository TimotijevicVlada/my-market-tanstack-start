DO $$ 
BEGIN
    -- Create enum type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seller_status') THEN
        CREATE TYPE "public"."seller_status" AS ENUM('pending', 'approved', 'rejected');
    END IF;
    
    -- Rename column if it exists and hasn't been renamed yet
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sellers' AND column_name = 'is_verified') THEN
        ALTER TABLE "sellers" RENAME COLUMN "is_verified" TO "status";
    END IF;
    
    -- Change column type to enum if it's still boolean
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'sellers' 
        AND column_name = 'status'
        AND data_type = 'boolean'
    ) THEN
        -- Convert boolean to enum: true -> 'approved', false -> 'pending'
        ALTER TABLE "sellers" ALTER COLUMN "status" TYPE "public"."seller_status" 
        USING CASE 
            WHEN "status" = true THEN 'approved'::"public"."seller_status"
            ELSE 'pending'::"public"."seller_status"
        END;
    END IF;
END $$;