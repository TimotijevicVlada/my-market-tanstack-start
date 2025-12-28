import { eq } from 'drizzle-orm'
import { db } from '../index.ts'
import { sellers } from '../schema/sellers.ts'
import { users } from '../schema/users.ts'

export async function seedSellers() {
  // Safety check: prevent running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Seed script cannot run in production environment!')
    return { inserted: 0, skipped: true }
  }

  // Get all users with seller role
  const sellerUsers = await db
    .select()
    .from(users)
    .where(eq(users.role, 'seller'))

  if (sellerUsers.length === 0) {
    console.log('⚠️  No seller users found. Skipping sellers seed.')
    console.log('💡 Make sure to seed users first with seller role.')
    return { inserted: 0, skipped: true }
  }

  // Create fake sellers data based on SELLER users
  const fakeSellers = sellerUsers.map((user, index) => {
    const fakeSellersData = [
      {
        name: "Johnson's Organic Farm",
        slug: 'johnsons-organic-farm',
        description:
          'Family-owned organic farm specializing in fresh vegetables, fruits, and herbs. We practice sustainable farming methods and deliver the freshest produce directly from our fields.',
        location: '123 Farm Road, Rural Valley, State 12345',
        phone: '+1-555-0101',
        isVerified: true,
      },
      {
        name: "Brown's Fresh Market",
        slug: 'browns-fresh-market',
        description:
          'Local market providing fresh dairy products, meats, and pantry staples. Supporting local farmers and offering high-quality products to our community.',
        location: '456 Market Street, Downtown, State 67890',
        phone: '+1-555-0202',
        isVerified: false,
      },
    ]

    return {
      userId: user.id,
      ...fakeSellersData[index % fakeSellersData.length],
    }
  })

  // Delete all existing sellers to override
  console.log('🗑️  Deleting existing sellers...')
  await db.delete(sellers)

  // Insert sellers
  console.log('📝 Inserting sellers...')
  const insertedSellers = await db
    .insert(sellers)
    .values(fakeSellers)
    .returning()

  console.log(`✅ Successfully inserted ${insertedSellers.length} sellers:`)
  insertedSellers.forEach((seller) => {
    console.log(
      `   - ${seller.name} (${seller.slug}) - Verified: ${seller.isVerified}`,
    )
  })

  return { inserted: insertedSellers.length, skipped: false }
}
