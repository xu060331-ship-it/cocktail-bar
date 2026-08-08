require("dotenv").config()
const { Client } = require("pg")
const fs = require("fs")
const attrs = JSON.parse(fs.readFileSync("./data/cocktail-attributes.json", "utf-8"))

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar",
  ssl: (process.env.DATABASE_URL || "").includes("localhost") ? false : { rejectUnauthorized: false },
})

async function update() {
  await db.connect()
  console.log("数据库已连接")

  // 添加新列
  for (const col of [
    "ALTER TABLE cocktails ADD COLUMN IF NOT EXISTS taste_tags TEXT[]",
    "ALTER TABLE cocktails ADD COLUMN IF NOT EXISTS difficulty INT DEFAULT 2",
    "ALTER TABLE cocktails ADD COLUMN IF NOT EXISTS occasion TEXT[]",
    "ALTER TABLE cocktails ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0",
  ]) {
    try {
      await db.query(col)
      console.log("列已添加:", col.match(/ADD COLUMN IF NOT EXISTS (\w+)/)[1])
    } catch (err) {
      console.log("添加列跳过:", err.message)
    }
  }

  // 更新每款酒的属性
  let updated = 0
  for (const a of attrs) {
    const result = await db.query(
      `UPDATE cocktails SET taste_tags = $1, difficulty = $2, occasion = $3 WHERE eng = $4`,
      [a.taste_tags, a.difficulty, a.occasion, a.eng]
    )
    updated += result.rowCount
  }

  console.log(`已更新 ${updated} 款酒`)

  // 检查遗漏
  const missing = await db.query("SELECT eng, chn FROM cocktails WHERE taste_tags IS NULL OR difficulty IS NULL OR occasion IS NULL")
  if (missing.rows.length > 0) {
    console.log(`⚠ ${missing.rows.length} 款酒缺少属性:`)
    missing.rows.forEach(r => console.log(`  - ${r.eng} (${r.chn})`))
  }

  await db.end()
  console.log("更新完成")
}

update().catch(err => { console.error("出错:", err.message); db.end() })
