require("dotenv").config()
const { Client } = require("pg")
const fs = require("fs")
const methodsData = JSON.parse(fs.readFileSync("./data/cocktail-methods.json", "utf-8"))

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar",
  ssl: (process.env.DATABASE_URL || "").includes("localhost") ? false : { rejectUnauthorized: false },
})

async function update() {
  await db.connect()
  console.log("数据库已连接")

  // 添加 method 列（如果不存在）
  try {
    await db.query("ALTER TABLE cocktails ADD COLUMN IF NOT EXISTS method JSONB")
    console.log("method 列已添加（或已存在）")
  } catch (err) {
    console.log("添加列失败:", err.message)
  }

  // 更新每款酒的调制方法
  let updated = 0
  for (const m of methodsData) {
    const result = await db.query(
      "UPDATE cocktails SET method = $1 WHERE eng = $2",
      [JSON.stringify({ method: m.method, glass: m.glass, steps: m.steps, garnish: m.garnish }), m.eng]
    )
    updated += result.rowCount
  }

  console.log(`已更新 ${updated} 款鸡尾酒的调制方法`)

  // 检查是否有遗漏
  const missing = await db.query("SELECT eng, chn FROM cocktails WHERE method IS NULL")
  if (missing.rows.length > 0) {
    console.log(`⚠ 以下 ${missing.rows.length} 款酒缺少方法数据:`)
    missing.rows.forEach(r => console.log(`  - ${r.eng} (${r.chn})`))
  }

  await db.end()
  console.log("更新完成")
}

update().catch(err => { console.error("出错:", err.message); db.end() })
