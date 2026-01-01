import { db } from '../index.ts'
import { products } from '../schema/products.ts'
import { sellers } from '../schema/sellers.ts'
import { categories } from '../schema/categories.ts'

export async function seedProducts() {
  // Safety check: prevent running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Seed script cannot run in production environment!')
    return { inserted: 0, skipped: true }
  }

  // Get all sellers and categories
  const allSellers = await db.select().from(sellers)
  const allCategories = await db.select().from(categories)

  if (allSellers.length === 0) {
    console.log('⚠️  No sellers found. Skipping products seed.')
    console.log('💡 Make sure to seed sellers first.')
    return { inserted: 0, skipped: true }
  }

  if (allCategories.length === 0) {
    console.log('⚠️  No categories found. Skipping products seed.')
    console.log('💡 Make sure to seed categories first.')
    return { inserted: 0, skipped: true }
  }

  // Helper to find category by slug
  const findCategory = (slug: string) =>
    allCategories.find((cat) => cat.slug === slug)!

  // Helper to find seller by displayName
  const findSeller = (displayName: string) =>
    allSellers.find((seller) => seller.displayName === displayName)!

  // Create fake products data
  const fakeProducts = [
    // Johnson's Organic Farm - Fresh Produce
    {
      sellerId: findSeller("Johnson's Organic Farm").id,
      categoryId: findCategory('fresh-produce').id,
      name: 'Organic Tomatoes',
      slug: 'organic-tomatoes',
      description:
        'Fresh, ripe organic tomatoes grown without pesticides. Perfect for salads, sauces, and fresh eating.',
      price: '4.99',
      unit: 'kg' as const,
      quantity: 50,
      isAvailable: true,
      isOrganic: true,
      originPlace: 'Rural Valley Farm',
      mainImageUrl: null,
      status: 'published' as const,
    },
    {
      sellerId: findSeller("Johnson's Organic Farm").id,
      categoryId: findCategory('fresh-produce').id,
      name: 'Fresh Lettuce Mix',
      slug: 'fresh-lettuce-mix',
      description:
        'A beautiful mix of organic lettuce varieties including romaine, butterhead, and red leaf.',
      price: '3.49',
      unit: 'bunch' as const,
      quantity: 30,
      isAvailable: true,
      isOrganic: true,
      originPlace: 'Rural Valley Farm',
      mainImageUrl: null,
      status: 'published' as const,
    },
    {
      sellerId: findSeller("Johnson's Organic Farm").id,
      categoryId: findCategory('fresh-produce').id,
      name: 'Organic Carrots',
      slug: 'organic-carrots',
      description:
        'Sweet and crunchy organic carrots, freshly harvested from our fields.',
      price: '2.99',
      unit: 'kg' as const,
      quantity: 40,
      isAvailable: true,
      isOrganic: true,
      originPlace: 'Rural Valley Farm',
      mainImageUrl: null,
      status: 'published' as const,
    },
    // Brown's Fresh Market - Dairy Products
    {
      sellerId: findSeller("Brown's Fresh Market").id,
      categoryId: findCategory('dairy-products').id,
      name: 'Fresh Whole Milk',
      slug: 'fresh-whole-milk',
      description:
        'Farm-fresh whole milk from local dairy farms. Rich and creamy, perfect for your family.',
      price: '5.99',
      unit: 'gallon' as const,
      quantity: 25,
      isAvailable: true,
      isOrganic: false,
      originPlace: 'Local Dairy Farm',
      mainImageUrl: null,
      status: 'published' as const,
    },
    {
      sellerId: findSeller("Brown's Fresh Market").id,
      categoryId: findCategory('dairy-products').id,
      name: 'Artisan Cheese Selection',
      slug: 'artisan-cheese-selection',
      description:
        'Handcrafted local cheeses including cheddar, mozzarella, and goat cheese.',
      price: '12.99',
      unit: 'piece' as const,
      quantity: 15,
      isAvailable: true,
      isOrganic: false,
      originPlace: 'Local Creamery',
      mainImageUrl: null,
      status: 'published' as const,
    },
    // Brown's Fresh Market - Meat & Poultry
    {
      sellerId: findSeller("Brown's Fresh Market").id,
      categoryId: findCategory('meat-poultry').id,
      name: 'Free-Range Chicken Eggs',
      slug: 'free-range-chicken-eggs',
      description:
        'Farm-fresh eggs from free-range chickens. Rich, golden yolks and superior flavor.',
      price: '6.99',
      unit: 'dozen' as const,
      quantity: 20,
      isAvailable: true,
      isOrganic: false,
      originPlace: 'Local Poultry Farm',
      mainImageUrl: null,
      status: 'published' as const,
    },
    {
      sellerId: findSeller("Brown's Fresh Market").id,
      categoryId: findCategory('meat-poultry').id,
      name: 'Grass-Fed Ground Beef',
      slug: 'grass-fed-ground-beef',
      description:
        'Premium ground beef from grass-fed cattle. Lean, flavorful, and responsibly raised.',
      price: '9.99',
      unit: 'lb' as const,
      quantity: 18,
      isAvailable: true,
      isOrganic: false,
      originPlace: 'Local Ranch',
      mainImageUrl: null,
      status: 'published' as const,
    },
    // Johnson's Organic Farm - Fresh Produce (more items)
    {
      sellerId: findSeller("Johnson's Organic Farm").id,
      categoryId: findCategory('fresh-produce').id,
      name: 'Organic Strawberries',
      slug: 'organic-strawberries',
      description:
        'Sweet, juicy organic strawberries. Perfect for desserts, smoothies, or fresh eating.',
      price: '7.99',
      unit: 'box' as const,
      quantity: 12,
      isAvailable: true,
      isOrganic: true,
      originPlace: 'Rural Valley Farm',
      mainImageUrl: null,
      status: 'published' as const,
    },
    // Brown's Fresh Market - Bakery & Bread
    {
      sellerId: findSeller("Brown's Fresh Market").id,
      categoryId: findCategory('bakery-bread').id,
      name: 'Sourdough Bread',
      slug: 'sourdough-bread',
      description:
        'Artisan sourdough bread baked daily with natural fermentation. Crusty outside, soft inside.',
      price: '4.99',
      unit: 'piece' as const,
      quantity: 10,
      isAvailable: true,
      isOrganic: false,
      originPlace: 'Local Bakery',
      mainImageUrl: null,
      status: 'published' as const,
    },
    // Brown's Fresh Market - Pantry Staples
    {
      sellerId: findSeller("Brown's Fresh Market").id,
      categoryId: findCategory('pantry-staples').id,
      name: 'Local Honey',
      slug: 'local-honey',
      description:
        'Pure, raw local honey from nearby apiaries. Great for natural sweetening and health benefits.',
      price: '11.99',
      unit: 'oz' as const,
      quantity: 8,
      isAvailable: true,
      isOrganic: false,
      originPlace: 'Local Apiary',
      mainImageUrl: null,
      status: 'published' as const,
    },
  ]

  // Delete all existing products to override
  console.log('🗑️  Deleting existing products...')
  await db.delete(products)

  // Insert products
  console.log('📝 Inserting products...')
  const insertedProducts = await db
    .insert(products)
    .values(fakeProducts)
    .returning()

  console.log(`✅ Successfully inserted ${insertedProducts.length} products:`)
  insertedProducts.forEach((product) => {
    console.log(
      `   - ${product.name} (${product.slug}) - $${product.price}/${product.unit}`,
    )
  })

  return { inserted: insertedProducts.length, skipped: false }
}
