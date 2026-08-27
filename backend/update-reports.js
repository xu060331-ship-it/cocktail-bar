require("dotenv").config()
const { Client } = require("pg")
const url = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const db = new Client({ connectionString: url, ssl: url.includes("localhost") ? false : { rejectUnauthorized: false } })
async function run() { await db.connect(); await db.query(`CREATE TABLE IF NOT EXISTS content_reports (id SERIAL PRIMARY KEY, reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, target_type VARCHAR(30) NOT NULL, target_id VARCHAR(120) NOT NULL, reason VARCHAR(100) NOT NULL, detail TEXT, status VARCHAR(20) NOT NULL DEFAULT 'pending', created_at TIMESTAMP DEFAULT NOW(), resolved_at TIMESTAMP)`); await db.query("CREATE INDEX IF NOT EXISTS idx_reports_status ON content_reports(status, created_at DESC)"); await db.query("ALTER TABLE cocktail_ratings ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE"); await db.end(); console.log("content_reports migration complete") }
run().catch((e) => { console.error(e.message); process.exit(1) })
