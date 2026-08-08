require("dotenv").config()
const { Client } = require("pg")
const fs = require("fs")
const tips = JSON.parse(fs.readFileSync("./data/cocktail-tips.json", "utf-8"))

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar",
  ssl: (process.env.DATABASE_URL || "").includes("localhost") ? false : { rejectUnauthorized: false },
})

async function update() {
  await db.connect()
  console.log("数据库已连接")

  // 添加 tip 列
  try {
    await db.query("ALTER TABLE cocktails ADD COLUMN IF NOT EXISTS tip TEXT")
    console.log("tip 列已添加（或已存在）")
  } catch (err) {
    console.log("添加列失败:", err.message)
  }

  let updated = 0
  for (const t of tips) {
    const result = await db.query("UPDATE cocktails SET tip = $1 WHERE eng = $2", [t.tip, t.eng])
    updated += result.rowCount
  }

  console.log(`已更新 ${updated} 款酒的调酒提醒`)
  await db.end()
  console.log("更新完成")
}

update().catch(err => { console.error("出错:", err.message); db.end() })
