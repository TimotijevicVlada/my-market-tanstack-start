import { boolean, index, integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { products } from "./products";
import { categories } from "./categories";

export const productCategories = pgTable(
    "product_categories",
    {
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),

        categoryId: uuid("category_id")
            .notNull()
            .references(() => categories.id, { onDelete: "restrict" }),
        sortOrder: integer("sort_order").notNull().default(0),
        isPrimary: boolean("is_primary").notNull().default(false),
    },
    (t) => [
        primaryKey({ columns: [t.productId, t.categoryId] }),
        index("product_categories_product_idx").on(t.productId),
        index("product_categories_category_idx").on(t.categoryId),
    ],
);