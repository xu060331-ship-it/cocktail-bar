require("dotenv").config()
const { Client } = require("pg")
const db = new Client({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar" })

async function run() {
  await db.connect()
  await db.query(`CREATE TABLE IF NOT EXISTS community_likes (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, content_id VARCHAR(120) NOT NULL, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(user_id, content_id))`)
  await db.query(`CREATE TABLE IF NOT EXISTS community_favorites (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, content_id VARCHAR(120) NOT NULL, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(user_id, content_id))`)
  await db.query(`CREATE TABLE IF NOT EXISTS community_comments (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, content_id VARCHAR(120) NOT NULL, body TEXT NOT NULL, is_hidden BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())`)
  await db.query("CREATE INDEX IF NOT EXISTS idx_community_comments_content ON community_comments(content_id, is_hidden, created_at DESC)")
  await db.end()
  console.log("community interactions migration complete")
}
run().catch((err) => { console.error(err); process.exit(1) })
