const { Client } = require("pg")
require("dotenv").config()
const url = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const db = new Client({ connectionString: url, ssl: url.includes("localhost") ? false : { rejectUnauthorized: false } })
async function run() {
  await db.connect()
  await db.query("ALTER TABLE playlists ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE")
  await db.query("ALTER TABLE playlists ADD COLUMN IF NOT EXISTS share_token VARCHAR(64) UNIQUE")
  await db.end()
  console.log("playlist sharing migration complete")
}
run().catch((err) => { console.error(err.message); process.exit(1) })
