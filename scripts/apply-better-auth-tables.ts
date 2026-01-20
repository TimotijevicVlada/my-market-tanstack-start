import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { config } from 'dotenv'
import { Pool } from 'pg'

config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

async function applyBetterAuthTables() {
  try {
    const sql = readFileSync(
      join(process.cwd(), 'drizzle', 'apply-better-auth-tables.sql'),
      'utf-8'
    )

    console.log('Applying better-auth tables...')
    await pool.query(sql)
    console.log('✅ Better-auth tables applied successfully!')
  } catch (error: any) {
    if (error.code === '42P07') {
      // Table already exists
      console.log('⚠️  Some tables already exist. Skipping...')
    } else {
      console.error('❌ Error applying tables:', error.message)
      throw error
    }
  } finally {
    await pool.end()
  }
}

applyBetterAuthTables()
