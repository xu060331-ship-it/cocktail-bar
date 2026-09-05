require("dotenv").config()
const { Client } = require("pg")
const url = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const db = new Client({ connectionString: url, ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : { rejectUnauthorized: false } })
async function run() { await db.connect(); await db.query("CREATE TABLE IF NOT EXISTS user_checkins (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, checkin_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(user_id, checkin_date))"); await db.query("CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON user_checkins(user_id, checkin_date DESC)"); await db.end(); console.log("checkins migration complete") }
run().catch((err) => { console.error(err); process.exit(1) })
