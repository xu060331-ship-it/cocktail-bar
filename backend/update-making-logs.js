const { Client } = require("pg")
require("dotenv").config()

const connStr = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const client = new Client({ connectionString: connStr, ssl: connStr.includes("localhost") ? false : { rejectUnauthorized: false } })

async function run() {
  await client.connect()
  await client.query(`CREATE TABLE IF NOT EXISTS cocktail_making_logs (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cocktail_eng VARCHAR(100) NOT NULL, made_at DATE NOT NULL DEFAULT CURRENT_DATE,
    brands JSONB NOT NULL DEFAULT '[]', rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    recipe_modified BOOLEAN NOT NULL DEFAULT FALSE, modification_note TEXT,
    next_time_note TEXT, photo_url TEXT, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
  )`)
  await client.query("CREATE INDEX IF NOT EXISTS idx_making_logs_user ON cocktail_making_logs(user_id, made_at DESC)")
  await client.query("ALTER TABLE cocktail_making_logs ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) NOT NULL DEFAULT 'private'")
  await client.query("ALTER TABLE cocktail_making_logs ADD COLUMN IF NOT EXISTS moderation_status VARCHAR(20) NOT NULL DEFAULT 'private'")
  await client.end()
  console.log("cocktail_making_logs migration complete")
}
run().catch((err) => { console.error(err.message); process.exit(1) })
