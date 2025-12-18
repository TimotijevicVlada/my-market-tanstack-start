import { eq } from 'drizzle-orm'
import { db } from '../index.ts'
import { producers } from '../schema/producers.ts'
import { users } from '../schema/users.ts'

export async function seedProducers() {
  // Safety check: prevent running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Seed script cannot run in production environment!')
    return { inserted: 0, skipped: true }
  }

  // Get all users with producer role
  const producerUsers = await db
    .select()
    .from(users)
    .where(eq(users.role, 'producer'))

  if (producerUsers.length === 0) {
    console.log('⚠️  No producer users found. Skipping producers seed.')
    console.log('💡 Make sure to seed users first with producer role.')
    return { inserted: 0, skipped: true }
  }

  // Create fake producers data based on PRODUCER users
  const fakeProducers = producerUsers.map((user, index) => {
    const producerData = [
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
      ...producerData[index % producerData.length],
    }
  })

  // Delete all existing producers to override
  console.log('🗑️  Deleting existing producers...')
  await db.delete(producers)

  // Insert producers
  console.log('📝 Inserting producers...')
  const insertedProducers = await db
    .insert(producers)
    .values(fakeProducers)
    .returning()

  console.log(`✅ Successfully inserted ${insertedProducers.length} producers:`)
  insertedProducers.forEach((producer) => {
    console.log(
      `   - ${producer.name} (${producer.slug}) - Verified: ${producer.isVerified}`,
    )
  })

  return { inserted: insertedProducers.length, skipped: false }
}
