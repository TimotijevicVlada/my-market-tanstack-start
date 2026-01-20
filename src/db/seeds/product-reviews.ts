import { eq } from 'drizzle-orm'
import { db } from '../index.ts'
import { productReviews } from '../schema/product-reviews.ts'
import { products } from '../schema/products.ts'
import { user } from '../schema/better-auth.ts'

export async function seedProductReviews() {
  // Safety check: prevent running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Seed script cannot run in production environment!')
    return { inserted: 0, skipped: true }
  }

  // Get all products and buyer users
  const allProducts = await db.select().from(products)
  const buyerUsers = await db
    .select()
    .from(user)
    .where(eq(user.role, 'buyer'))

  if (allProducts.length === 0) {
    console.log('⚠️  No products found. Skipping product reviews seed.')
    console.log('💡 Make sure to seed products first.')
    return { inserted: 0, skipped: true }
  }

  if (buyerUsers.length === 0) {
    console.log('⚠️  No buyer users found. Skipping product reviews seed.')
    console.log('💡 Make sure to seed users with buyer role first.')
    return { inserted: 0, skipped: true }
  }

  // Helper to find product by slug
  const findProduct = (slug: string) =>
    allProducts.find((prod) => prod.slug === slug)!

  // Helper to find user by username
  const findUser = (username: string) =>
    buyerUsers.find((userBuyer) => userBuyer.name === username)!

  // Create fake reviews data
  const fakeReviews = [
    // Reviews for Organic Tomatoes
    {
      productId: findProduct('organic-tomatoes').id,
      userId: findUser('jane_smith').id,
      rating: 5,
      content:
        'Excellent tomatoes! Very fresh and flavorful. They taste like they were picked this morning. Will definitely order again!',
      status: 'approved' as const,
    },
    {
      productId: findProduct('organic-tomatoes').id,
      userId: findUser('alice_williams').id,
      rating: 4,
      content:
        'Great quality tomatoes, very fresh. A bit pricey but worth it for organic produce. Good for making sauces.',
      status: 'approved' as const,
    },
    // Reviews for Fresh Lettuce Mix
    {
      productId: findProduct('fresh-lettuce-mix').id,
      userId: findUser('jane_smith').id,
      rating: 5,
      content:
        'Beautiful mix of lettuces, very crisp and fresh. Perfect for salads. Arrived in great condition!',
      status: 'approved' as const,
    },
    // Reviews for Organic Carrots
    {
      productId: findProduct('organic-carrots').id,
      userId: findUser('alice_williams').id,
      rating: 5,
      content:
        'The sweetest carrots I have ever tasted! My kids love them. Very fresh and organic. Highly recommend!',
      status: 'approved' as const,
    },
    // Reviews for Fresh Whole Milk
    {
      productId: findProduct('fresh-whole-milk').id,
      userId: findUser('jane_smith').id,
      rating: 5,
      content:
        'Creamy and delicious! You can really taste the difference from store-bought milk. My family loves it!',
      status: 'approved' as const,
    },
    {
      productId: findProduct('fresh-whole-milk').id,
      userId: findUser('alice_williams').id,
      rating: 4,
      content:
        'Good quality milk, very fresh. Great for making cheese and yogurt at home. Delivery was prompt.',
      status: 'approved' as const,
    },
    // Reviews for Artisan Cheese Selection
    {
      productId: findProduct('artisan-cheese-selection').id,
      userId: findUser('jane_smith').id,
      rating: 5,
      content:
        'Amazing selection of cheeses! Each one is unique and delicious. Perfect for a cheese board or cooking.',
      status: 'approved' as const,
    },
    // Reviews for Free-Range Chicken Eggs
    {
      productId: findProduct('free-range-chicken-eggs').id,
      userId: findUser('alice_williams').id,
      rating: 5,
      content:
        'Best eggs I have ever had! The yolks are so golden and rich. You can really taste the difference from free-range chickens.',
      status: 'approved' as const,
    },
    {
      productId: findProduct('free-range-chicken-eggs').id,
      userId: findUser('jane_smith').id,
      rating: 4,
      content:
        'Very fresh eggs with beautiful yolks. Good quality and well-packaged. Will order regularly!',
      status: 'pending' as const,
    },
    // Reviews for Grass-Fed Ground Beef
    {
      productId: findProduct('grass-fed-ground-beef').id,
      userId: findUser('alice_williams').id,
      rating: 5,
      content:
        'Excellent quality beef! Very lean and flavorful. Perfect for burgers and meatballs. Great value!',
      status: 'approved' as const,
    },
    // Reviews for Organic Strawberries
    {
      productId: findProduct('organic-strawberries').id,
      userId: findUser('jane_smith').id,
      rating: 5,
      content:
        'These strawberries are absolutely delicious! Sweet, juicy, and perfectly ripe. My favorite purchase so far!',
      status: 'approved' as const,
    },
    // Reviews for Sourdough Bread
    {
      productId: findProduct('sourdough-bread').id,
      userId: findUser('alice_williams').id,
      rating: 4,
      content:
        'Freshly baked and delicious! The crust is perfect and the inside is soft. Great for sandwiches and toast.',
      status: 'approved' as const,
    },
    // Reviews for Local Honey
    {
      productId: findProduct('local-honey').id,
      userId: findUser('jane_smith').id,
      rating: 5,
      content:
        'Wonderful local honey! Great flavor and quality. Helps with allergies too. Will definitely buy again!',
      status: 'approved' as const,
    },
  ]

  // Delete all existing reviews to override
  console.log('🗑️  Deleting existing product reviews...')
  await db.delete(productReviews)

  // Insert reviews
  console.log('📝 Inserting product reviews...')
  const insertedReviews = await db
    .insert(productReviews)
    .values(fakeReviews)
    .returning()

  console.log(
    `✅ Successfully inserted ${insertedReviews.length} product reviews:`,
  )
  insertedReviews.forEach((review) => {
    console.log(`   - Rating: ${review.rating}/5 - Status: ${review.status}`)
  })

  return { inserted: insertedReviews.length, skipped: false }
}
