CREATE TABLE "seller_categories" (
	"seller_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT NULL,
	CONSTRAINT "seller_categories_pkey" PRIMARY KEY("seller_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "seller_categories" ADD CONSTRAINT "seller_categories_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_categories" ADD CONSTRAINT "seller_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;