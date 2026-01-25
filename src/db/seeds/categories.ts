import { db } from '../index.ts'
import { categories } from '../schema/categories.ts'

const fakeCategories: Array<typeof categories.$inferInsert> = [
  {
    name: 'White tech',
    slug: 'white-tech',
    sortOrder: 1,
    description:
      'Home appliances and white goods including refrigerators, washing machines, and kitchen appliances.',
  },
  {
    name: 'TV Audio and Video',
    slug: 'tv-audio-and-video',
    sortOrder: 2,
    description:
      'Televisions, audio systems, speakers, headphones, and video equipment.',
  },
  {
    name: 'Small home tools',
    slug: 'small-home-tools',
    sortOrder: 3,
    description:
      'Small household tools and gadgets for everyday home maintenance and tasks.',
  },
  {
    name: 'Beauty tools',
    slug: 'beauty-tools',
    sortOrder: 4,
    description:
      'Beauty and personal care tools including hair styling tools, skincare devices, and grooming accessories.',
  },
  {
    name: 'Home and Garden',
    slug: 'home-and-garden',
    sortOrder: 5,
    description:
      'Furniture, home decor, garden supplies, and outdoor living essentials.',
  },
  {
    name: 'Vehicle',
    slug: 'vehicle',
    sortOrder: 6,
    description:
      'Cars, motorcycles, bicycles, and vehicle accessories and parts.',
  },
  {
    name: 'IT shop',
    slug: 'it-shop',
    sortOrder: 7,
    description:
      'Computer hardware, software, networking equipment, and IT accessories.',
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    sortOrder: 8,
    description:
      'Gaming consoles, video games, gaming accessories, and gaming equipment.',
  },
  {
    name: 'Sport and Recreation',
    slug: 'sport-and-recreation',
    sortOrder: 9,
    description:
      'Sports equipment, fitness gear, outdoor recreation items, and athletic apparel.',
  },
  {
    name: 'Phones',
    slug: 'phones',
    sortOrder: 10,
    description:
      'Smartphones, mobile phones, phone accessories, and mobile device accessories.',
  },
  {
    name: 'Childrens equipement',
    slug: 'childrens-equipement',
    sortOrder: 11,
    description:
      'Equipment and gear designed for children including safety items, furniture, and accessories.',
  },
  {
    name: 'maintenance and cleaning',
    slug: 'maintenance-and-cleaning',
    sortOrder: 12,
    description:
      'Cleaning supplies, maintenance tools, and household cleaning products.',
  },
  {
    name: 'Beauty and care',
    slug: 'beauty-and-care',
    sortOrder: 13,
    description:
      'Cosmetics, skincare products, personal care items, and beauty essentials.',
  },
  {
    name: 'clothes',
    slug: 'clothes',
    sortOrder: 14,
    description:
      'Clothing for men, women, and children including casual, formal, and seasonal apparel.',
  },
  {
    name: 'Fashion accessories',
    slug: 'fashion-accessories',
    sortOrder: 15,
    description:
      'Jewelry, watches, bags, belts, scarves, and other fashion accessories.',
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    sortOrder: 16,
    description:
      'Shoes, boots, sneakers, sandals, and all types of footwear for every occasion.',
  },
  {
    name: 'Pet shop',
    slug: 'pet-shop',
    sortOrder: 17,
    description:
      'Pet food, toys, accessories, grooming supplies, and products for pets.',
  },
  {
    name: 'Nutrition and health',
    slug: 'nutrition-and-health',
    sortOrder: 18,
    description:
      'Health supplements, vitamins, nutritional products, and wellness items.',
  },
  {
    name: 'bookstore and entertainment',
    slug: 'bookstore-and-entertainment',
    sortOrder: 19,
    description: 'Books, magazines, movies, music, and entertainment media.',
  },
  {
    name: 'food and drink',
    slug: 'food-and-drink',
    sortOrder: 20,
    description: 'Food products, beverages, snacks, and culinary essentials.',
  },
  {
    name: 'toys for children',
    slug: 'toys-for-children',
    sortOrder: 21,
    description:
      'Toys, games, educational materials, and play items for children of all ages.',
  },
  {
    name: 'office and school supplies',
    slug: 'office-and-school-supplies',
    sortOrder: 22,
    description:
      'Office equipment, stationery, school supplies, and workplace essentials.',
  },
  {
    name: 'musical instruments and equipment',
    slug: 'musical-instruments-and-equipment',
    sortOrder: 23,
    description:
      'Musical instruments, audio equipment, recording gear, and music accessories.',
  },
  {
    name: 'domestic tradition products',
    slug: 'domestic-tradition-products',
    sortOrder: 24,
    description:
      'Traditional domestic products, handmade items, and cultural home goods.',
  },
  {
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    sortOrder: 25,
    description:
      'Fresh fruits and vegetables, organic produce, and farm-fresh items.',
  },
  {
    name: 'Dairy Products',
    slug: 'dairy-products',
    sortOrder: 26,
    description:
      'Milk, cheese, yogurt, butter, and other dairy products from local farms.',
  },
  {
    name: 'Meat & Poultry',
    slug: 'meat-poultry',
    sortOrder: 27,
    description:
      'Fresh meat, poultry, eggs, and protein products from local sources.',
  },
  {
    name: 'Bakery & Bread',
    slug: 'bakery-bread',
    sortOrder: 28,
    description:
      'Fresh baked goods, bread, pastries, and artisanal bakery items.',
  },
  {
    name: 'Pantry Staples',
    slug: 'pantry-staples',
    sortOrder: 29,
    description:
      'Essential pantry items including grains, oils, spices, and cooking basics.',
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
  try {
    await db.delete(categories)
  } catch (error: any) {
    if (error?.cause?.code === '42P01') {
      // Table doesn't exist
      console.error('❌ Error: The "categories" table does not exist!')
      console.error('💡 Please run "npm run db:push" first to create all database tables.')
      throw new Error('Database tables not found. Run "npm run db:push" first.')
    }
    throw error
  }

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
