import { db } from '../index.ts'
import { categories } from '../schema/categories.ts'

const fakeCategories: Array<typeof categories.$inferInsert> = [
  {
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    description:
      'Fresh fruits, vegetables, herbs, and locally grown produce from local farmers.',
  },
  {
    name: 'Dairy Products',
    slug: 'dairy-products',
    description:
      'Fresh milk, cheese, yogurt, butter, cream, and other dairy products from local farms.',
  },
  {
    name: 'Meat & Poultry',
    slug: 'meat-poultry',
    description:
      'Fresh meat, poultry, eggs, and processed meats from local producers and farmers.',
  },
  {
    name: 'Bakery & Bread',
    slug: 'bakery-bread',
    description:
      'Fresh bread, pastries, cakes, cookies, and other baked goods made locally.',
  },
  {
    name: 'Pantry Staples',
    slug: 'pantry-staples',
    description:
      'Dry goods, grains, legumes, oils, spices, canned goods, and cooking essentials.',
  },
]

export async function seedCategories() {
  // Safety check: prevent running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Seed script cannot run in production environment!')
    return { inserted: 0, skipped: true }
  }

  // Delete all existing categories to override
  console.log('🗑️  Deleting existing categories...')
  await db.delete(categories)

  // Insert categories
  console.log('📝 Inserting categories...')
  const insertedCategories = await db
    .insert(categories)
    .values(fakeCategories)
    .returning()

  console.log(
    `✅ Successfully inserted ${insertedCategories.length} categories:`,
  )
  insertedCategories.forEach((category) => {
    console.log(`   - ${category.name} (${category.slug})`)
  })

  return { inserted: insertedCategories.length, skipped: false }
}
