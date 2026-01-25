import { db } from '../index.ts'
import { productImages } from '../schema/product-images.ts'
import { products } from '../schema/products.ts'

export async function seedProductImages() {
  // Safety check: prevent running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Seed script cannot run in production environment!')
    return { inserted: 0, skipped: true }
  }

  // Get all products
  const allProducts = await db.select().from(products)

  if (allProducts.length === 0) {
    console.log('⚠️  No products found. Skipping product images seed.')
    console.log('💡 Make sure to seed products first.')
    return { inserted: 0, skipped: true }
  }

  // Helper to find product by slug
  const findProduct = (slug: string) =>
    allProducts.find((prod) => prod.slug === slug)!

  // Create fake product images data
  // Using placeholder image URLs (you can replace with actual image URLs later)
  const fakeImages = [
    // Organic Tomatoes - multiple images
    {
      productId: findProduct('organic-tomatoes').id,
      url: 'https://images.unsplash.com/photo-1546097491-4c0b48c5f1a0?w=800',
      sortOrder: 0,
      alt: 'Fresh organic tomatoes on the vine',
    },
    {
      productId: findProduct('organic-tomatoes').id,
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
      sortOrder: 1,
      alt: 'Close-up of organic tomatoes',
    },
    // Fresh Lettuce Mix
    {
      productId: findProduct('fresh-lettuce-mix').id,
      url: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800',
      sortOrder: 0,
      alt: 'Fresh mixed lettuce leaves',
    },
    {
      productId: findProduct('fresh-lettuce-mix').id,
      url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800',
      sortOrder: 1,
      alt: 'Fresh lettuce mix in basket',
    },
    // Organic Carrots
    {
      productId: findProduct('organic-carrots').id,
      url: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800',
      sortOrder: 0,
      alt: 'Fresh organic carrots with green tops',
    },
    {
      productId: findProduct('organic-carrots').id,
      url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800',
      sortOrder: 1,
      alt: 'Organic carrots close-up',
    },
    // Fresh Whole Milk
    {
      productId: findProduct('fresh-whole-milk').id,
      url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800',
      sortOrder: 0,
      alt: 'Fresh whole milk bottle',
    },
    // Artisan Cheese Selection
    {
      productId: findProduct('artisan-cheese-selection').id,
      url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800',
      sortOrder: 0,
      alt: 'Assortment of artisan cheeses',
    },
    {
      productId: findProduct('artisan-cheese-selection').id,
      url: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=800',
      sortOrder: 1,
      alt: 'Cheese board with various cheeses',
    },
    // Free-Range Chicken Eggs
    {
      productId: findProduct('free-range-chicken-eggs').id,
      url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800',
      sortOrder: 0,
      alt: 'Fresh free-range chicken eggs',
    },
    {
      productId: findProduct('free-range-chicken-eggs').id,
      url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800',
      sortOrder: 1,
      alt: 'Brown and white free-range eggs',
    },
    // Grass-Fed Ground Beef
    {
      productId: findProduct('grass-fed-ground-beef').id,
      url: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800',
      sortOrder: 0,
      alt: 'Fresh grass-fed ground beef',
    },
    // Organic Strawberries
    {
      productId: findProduct('organic-strawberries').id,
      url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800',
      sortOrder: 0,
      alt: 'Fresh organic strawberries',
    },
    {
      productId: findProduct('organic-strawberries').id,
      url: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800',
      sortOrder: 1,
      alt: 'Ripe organic strawberries in basket',
    },
    // Sourdough Bread
    {
      productId: findProduct('sourdough-bread').id,
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
      sortOrder: 0,
      alt: 'Fresh baked sourdough bread',
    },
    {
      productId: findProduct('sourdough-bread').id,
      url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800',
      sortOrder: 1,
      alt: 'Sliced sourdough bread on cutting board',
    },
    // Local Honey
    {
      productId: findProduct('local-honey').id,
      url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800',
      sortOrder: 0,
      alt: 'Jar of golden local honey',
    },
    {
      productId: findProduct('local-honey').id,
      url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
      sortOrder: 1,
      alt: 'Honey being poured from jar',
    },
  ]

  // Delete all existing product images to override
  console.log('🗑️  Deleting existing product images...')
  await db.delete(productImages)

  // Insert product images
  console.log('📝 Inserting product images...')
  const insertedImages = await db
    .insert(productImages)
    .values(fakeImages)
    .returning()

  console.log(
    `✅ Successfully inserted ${insertedImages.length} product images:`,
  )
  insertedImages.forEach((image) => {
    console.log(`   - Image: ${image.alt || 'No alt text'}`)
  })

  return { inserted: insertedImages.length, skipped: false }
}
