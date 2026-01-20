import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { config } from 'dotenv'
import { Pool } from 'pg'

config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

async function applyUserFields() {
  try {
    const sql = readFileSync(
      join(process.cwd(), 'drizzle', 'apply-user-fields-migration.sql'),
      'utf-8'
    )

    console.log('Applying user fields (role, isActive)...')
    await pool.query(sql)
    console.log('✅ User fields applied successfully!')
  } catch (error: any) {
    console.error('❌ Error applying fields:', error.message)
    throw error
  } finally {
    await pool.end()
  }
}

applyUserFields()
