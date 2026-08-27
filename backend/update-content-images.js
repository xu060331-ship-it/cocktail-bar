require("dotenv").config()
const { Client } = require("pg")
const url = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const db = new Client({ connectionString: url, ssl: url.includes("localhost") ? false : { rejectUnauthorized: false } })
async function run() { await db.connect(); await db.query("ALTER TABLE cocktails ADD COLUMN IF NOT EXISTS image_url TEXT"); await db.query("ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url TEXT"); await db.end(); console.log("content image fields migration complete") }
run().catch((e) => { console.error(e.message); process.exit(1) })
