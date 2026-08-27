require("dotenv").config()
const fs = require("fs")
const path = require("path")
const { Client } = require("pg")
const url = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const db = new Client({ connectionString: url, ssl: url.includes("localhost") ? false : { rejectUnauthorized: false } })
async function run() { await db.connect(); const rows = await db.query("SELECT photo_url FROM cocktail_making_logs WHERE photo_url IS NOT NULL UNION SELECT image_url FROM cocktails WHERE image_url IS NOT NULL UNION SELECT image_url FROM articles WHERE image_url IS NOT NULL"); const used = new Set(rows.rows.map((r) => r.photo_url || r.image_url)); for (const folder of ["making-logs", "content"]) { const dir = path.join(__dirname, "uploads", folder); for (const name of fs.readdirSync(dir)) { const urlPath = `/uploads/${folder}/${name}`; if (!used.has(urlPath)) fs.unlinkSync(path.join(dir, name)) } } await db.end(); console.log("孤立图片清理完成") }
run().catch((e) => { console.error(e.message); process.exit(1) })
