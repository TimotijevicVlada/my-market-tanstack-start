import bcrypt from 'bcryptjs'
import { db } from '../index.ts'
import { users } from '../schema/users.ts'

const fakeUsers = [
  {
    username: 'Vlada',
    email: 'timotijevicvlada@gmail.com',
    passwordHash: 'Vladablok62',
    role: 'admin' as const,
  },
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    passwordHash: 'password',
    role: 'super-admin' as const,
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    passwordHash: 'password',
    role: 'buyer' as const,
  },
  {
    username: 'bob_johnson',
    email: 'bob.johnson@example.com',
    passwordHash: 'password',
    role: 'seller' as const,
  },
  {
    username: 'alice_williams',
    email: 'alice.williams@example.com',
    passwordHash: 'password',
    role: 'buyer' as const,
  },
  {
    username: 'charlie_brown',
    email: 'charlie.brown@example.com',
    passwordHash: 'password',
    role: 'seller' as const,
  },
  {
    username: 'david_green',
    email: 'david.green@example.com',
    passwordHash: 'password',
    role: 'seller' as const,
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

  // Hash passwords and prepare users for insertion
  console.log('🔐 Hashing passwords...')
  const usersToInsert = await Promise.all(
    fakeUsers.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.passwordHash, 10)
      return {
        username: user.username,
        email: user.email,
        passwordHash,
        role: user.role,
      }
    }),
  )

  // Insert users
  console.log('📝 Inserting users...')
  const insertedUsers = await db.insert(users).values(usersToInsert).returning()

  console.log(`✅ Successfully inserted ${insertedUsers.length} users:`)
  insertedUsers.forEach((user) => {
    console.log(`   - ${user.username} (${user.email}) → ${user.role}`)
  })

  console.log('\n💡 All users have password: "password"')

  return { inserted: insertedUsers.length, skipped: false }
}
