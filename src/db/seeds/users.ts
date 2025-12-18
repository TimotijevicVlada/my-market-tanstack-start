import { db } from '../index.ts'
import { users } from '../schema/users.ts'

const fakeUsers: Array<typeof users.$inferInsert> = [
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    role: 'admin',
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    role: 'buyer',
  },
  {
    username: 'bob_johnson',
    email: 'bob.johnson@example.com',
    role: 'producer',
  },
  {
    username: 'alice_williams',
    email: 'alice.williams@example.com',
    role: 'buyer',
  },
  {
    username: 'charlie_brown',
    email: 'charlie.brown@example.com',
    role: 'producer',
  },
]

export async function seedUsers() {
  // Safety check: prevent running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Seed script cannot run in production environment!')
    return { inserted: 0, skipped: true }
  }

  // Delete all existing users to override
  console.log('🗑️  Deleting existing users...')
  await db.delete(users)

  // Insert users
  console.log('📝 Inserting users...')
  const insertedUsers = await db.insert(users).values(fakeUsers).returning()

  console.log(`✅ Successfully inserted ${insertedUsers.length} users:`)
  insertedUsers.forEach((user) => {
    console.log(`   - ${user.username} (${user.email}) → ${user.role}`)
  })

  return { inserted: insertedUsers.length, skipped: false }
}
