import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../src/config/db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sqlPath = path.join(__dirname, '../sql/schema_pmv.sql')

async function main() {
  const raw = fs.readFileSync(sqlPath, 'utf8')
  const statements = raw
    .split(/;\s*\n/)
    .map((s) => s.replace(/--.*$/gm, '').trim())
    .filter((s) => s.length > 0)

  const conn = await pool.getConnection()
  try {
    for (const statement of statements) {
      await conn.query(statement)
      const preview = statement.slice(0, 60).replace(/\s+/g, ' ')
      console.log('OK:', preview + (statement.length > 60 ? '…' : ''))
    }
    console.log('\nSchema PMV aplicado correctamente en Clever Cloud.')
  } finally {
    conn.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('Error aplicando schema:', err.message)
  process.exit(1)
})
