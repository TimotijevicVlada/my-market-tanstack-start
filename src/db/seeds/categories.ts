import { db } from '../index.ts'
import { categories } from '../schema/categories.ts'

const fakeCategories: Array<typeof categories.$inferInsert> = [
  {
    name: 'White tech',
    slug: 'white-tech',
    description:
      'Home appliances and white goods including refrigerators, washing machines, and kitchen appliances.',
  },
  {
    name: 'TV Audio and Video',
    slug: 'tv-audio-and-video',
    description:
      'Televisions, audio systems, speakers, headphones, and video equipment.',
  },
  {
    name: 'Small home tools',
    slug: 'small-home-tools',
    description:
      'Small household tools and gadgets for everyday home maintenance and tasks.',
  },
  {
    name: 'Beauty tools',
    slug: 'beauty-tools',
    description:
      'Beauty and personal care tools including hair styling tools, skincare devices, and grooming accessories.',
  },
  {
    name: 'Home and Garden',
    slug: 'home-and-garden',
    description:
      'Furniture, home decor, garden supplies, and outdoor living essentials.',
  },
  {
    name: 'Vehicle',
    slug: 'vehicle',
    description:
      'Cars, motorcycles, bicycles, and vehicle accessories and parts.',
  },
  {
    name: 'IT shop',
    slug: 'it-shop',
    description:
      'Computer hardware, software, networking equipment, and IT accessories.',
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description:
      'Gaming consoles, video games, gaming accessories, and gaming equipment.',
  },
  {
    name: 'Sport and Recreation',
    slug: 'sport-and-recreation',
    description:
      'Sports equipment, fitness gear, outdoor recreation items, and athletic apparel.',
  },
  {
    name: 'Phones',
    slug: 'phones',
    description:
      'Smartphones, mobile phones, phone accessories, and mobile device accessories.',
  },
  {
    name: 'Childrens equipement',
    slug: 'childrens-equipement',
    description:
      'Equipment and gear designed for children including safety items, furniture, and accessories.',
  },
  {
    name: 'maintenance and cleaning',
    slug: 'maintenance-and-cleaning',
    description:
      'Cleaning supplies, maintenance tools, and household cleaning products.',
  },
  {
    name: 'Beauty and care',
    slug: 'beauty-and-care',
    description:
      'Cosmetics, skincare products, personal care items, and beauty essentials.',
  },
  {
    name: 'clothes',
    slug: 'clothes',
    description:
      'Clothing for men, women, and children including casual, formal, and seasonal apparel.',
  },
  {
    name: 'Fashion accessories',
    slug: 'fashion-accessories',
    description:
      'Jewelry, watches, bags, belts, scarves, and other fashion accessories.',
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description:
      'Shoes, boots, sneakers, sandals, and all types of footwear for every occasion.',
  },
  {
    name: 'Pet shop',
    slug: 'pet-shop',
    description:
      'Pet food, toys, accessories, grooming supplies, and products for pets.',
  },
  {
    name: 'Nutrition and health',
    slug: 'nutrition-and-health',
    description:
      'Health supplements, vitamins, nutritional products, and wellness items.',
  },
  {
    name: 'bookstore and entertainment',
    slug: 'bookstore-and-entertainment',
    description: 'Books, magazines, movies, music, and entertainment media.',
  },
  {
    name: 'food and drink',
    slug: 'food-and-drink',
    description: 'Food products, beverages, snacks, and culinary essentials.',
  },
  {
    name: 'toys for children',
    slug: 'toys-for-children',
    description:
      'Toys, games, educational materials, and play items for children of all ages.',
  },
  {
    name: 'office and school supplies',
    slug: 'office-and-school-supplies',
    description:
      'Office equipment, stationery, school supplies, and workplace essentials.',
  },
  {
    name: 'musical instruments and equipment',
    slug: 'musical-instruments-and-equipment',
    description:
      'Musical instruments, audio equipment, recording gear, and music accessories.',
  },
  {
    name: 'domestic tradition products',
    slug: 'domestic-tradition-products',
    description:
      'Traditional domestic products, handmade items, and cultural home goods.',
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
