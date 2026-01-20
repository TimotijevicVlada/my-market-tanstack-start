import { eq } from 'drizzle-orm'
import { db } from '../index.ts'
import { sellers } from '../schema/sellers.ts'
import { user } from '../schema/better-auth.ts'

export async function seedSellers() {
  // Safety check: prevent running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Seed script cannot run in production environment!')
    return { inserted: 0, skipped: true }
  }

  // Get all users with seller role
  const sellerUsers = await db
    .select()
    .from(user)
    .where(eq(user.role, 'seller'))

  if (sellerUsers.length === 0) {
    console.log('⚠️  No seller users found. Skipping sellers seed.')
    console.log('💡 Make sure to seed users first with seller role.')
    return { inserted: 0, skipped: true }
  }

  // Create fake sellers data based on SELLER users
  const fakeSellers = sellerUsers.map((userSeller, index) => {
    const fakeSellersData = [
      {
        displayName: "Johnson's Organic Farm",
        description:
          'Family-owned organic farm specializing in fresh vegetables, fruits, and herbs. We practice sustainable farming methods and deliver the freshest produce directly from our fields.',
        phone: '+381-11-123-4567',
        email: 'johnson@organicfarm.rs',
        website: 'https://johnsonorganic.rs',
        country: 'Serbia',
        city: 'Novi Sad',
        address: '123 Farm Road, Rural Valley',
        postalCode: '21000',
        status: 'approved' as const,
      },
      {
        displayName: "Brown's Fresh Market",
        description:
          'Local market providing fresh dairy products, meats, and pantry staples. Supporting local farmers and offering high-quality products to our community.',
        phone: '+381-11-234-5678',
        email: 'info@brownsmarket.rs',
        website: 'https://brownsmarket.rs',
        country: 'Serbia',
        city: 'Belgrade',
        address: '456 Market Street, Downtown',
        postalCode: '11000',
        status: 'pending' as const,
      },
      {
        displayName: 'Green Acres Farm',
        description:
          'Family-owned farm specializing in fresh vegetables, fruits, and herbs. We practice sustainable farming methods and deliver the freshest produce directly from our fields.',
        phone: '+381-11-345-6789',
        email: 'greenacres@farm.rs',
        website: 'https://greenacresfarm.rs',
        country: 'Serbia',
        city: 'Novi Sad',
        address: '123 Farm Road, Rural Valley',
        postalCode: '21000',
        status: 'rejected' as const,
      },
    ]

    return {
      userId: userSeller.id,
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
    console.log(`   - ${seller.displayName} - Status: ${seller.status}`)
  })

  return { inserted: insertedSellers.length, skipped: false }
}
