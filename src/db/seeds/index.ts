import { pool } from '../index.ts'
import { seedUsers } from './users.ts'
import { seedCategories } from './categories.ts'
import { seedProducers } from './producers.ts'
import { seedProducts } from './products.ts'
import { seedProductReviews } from './product-reviews.ts'
import { seedProductImages } from './product-images.ts'

// Import all seed functions here as you create them

export async function runAllSeeds() {
  try {
    console.log('🌱 Starting seed process...\n')

    // Run all seed functions (order matters: users → categories → producers → products → reviews → images)
    await seedUsers()
    await seedCategories()
    await seedProducers()
    await seedProducts()
    await seedProductReviews()
    await seedProductImages()

    console.log('\n🎉 Seed process completed successfully!')
  } catch (error) {
    console.error('❌ Error during seed process:', error)
    throw error
  } finally {
    // Close the database connection
    await pool.end()
  }
}

async function seed() {
  try {
    await runAllSeeds()
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()
