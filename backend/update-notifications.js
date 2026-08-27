require("dotenv").config()
const { Client } = require("pg")
const url = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const db = new Client({ connectionString: url, ssl: url.includes("localhost") ? false : { rejectUnauthorized: false } })
async function run() { await db.connect(); await db.query(`CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, type VARCHAR(40) NOT NULL, title VARCHAR(255) NOT NULL, body TEXT, is_read BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW())`); await db.query("CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC)"); await db.end(); console.log("notifications migration complete") }
run().catch((e) => { console.error(e.message); process.exit(1) })
