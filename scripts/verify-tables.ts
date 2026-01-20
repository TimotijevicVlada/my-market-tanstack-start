import { config } from 'dotenv'
import { Pool } from 'pg'

config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

async function verifyTables() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user', 'session', 'account', 'verification')
      ORDER BY table_name
    `)
    
    const tables = result.rows.map(row => row.table_name)
    console.log('✅ Better-auth tables found:')
    tables.forEach(table => console.log(`   - ${table}`))
    
    if (tables.length === 4) {
      console.log('\n✅ All 4 better-auth tables are present!')
    } else {
      console.log(`\n⚠️  Expected 4 tables, found ${tables.length}`)
    }
  } catch (error: any) {
    console.error('❌ Error verifying tables:', error.message)
    throw error
  } finally {
    await pool.end()
  }
}

verifyTables()
