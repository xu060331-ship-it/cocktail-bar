require("dotenv").config()
const { Client } = require("pg")
const url = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const db = new Client({ connectionString: url, ssl: url.includes("localhost") ? false : { rejectUnauthorized: false } })
async function run() {
  await db.connect()
  await db.query(`CREATE TABLE IF NOT EXISTS content_submissions (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(30) NOT NULL CHECK (content_type IN ('flashcard','encyclopedia','article')),
    title VARCHAR(255) NOT NULL, summary TEXT, content JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    reviewer_note TEXT, created_at TIMESTAMP DEFAULT NOW(), reviewed_at TIMESTAMP
  )`)
  await db.query("CREATE INDEX IF NOT EXISTS idx_submissions_status ON content_submissions(status, content_type)")
  await db.query(`CREATE TABLE IF NOT EXISTS published_community_content (id SERIAL PRIMARY KEY, submission_id INTEGER UNIQUE REFERENCES content_submissions(id) ON DELETE CASCADE, content_type VARCHAR(30) NOT NULL, title VARCHAR(255) NOT NULL, summary TEXT, content JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMP DEFAULT NOW())`)
  await db.end()
  console.log("content_submissions migration complete")
}
run().catch((err) => { console.error(err.message); process.exit(1) })
