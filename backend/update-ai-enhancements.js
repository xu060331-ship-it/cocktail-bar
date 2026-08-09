require("dotenv").config()
const { Client } = require("pg")

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar",
  ssl: (process.env.DATABASE_URL || "").includes("localhost") ? false : { rejectUnauthorized: false },
})

async function update() {
  await db.connect()
  console.log("数据库已连接")

  await db.query(`
    CREATE TABLE IF NOT EXISTS ai_enhancements (
      id SERIAL PRIMARY KEY,
      cocktail_eng VARCHAR(100) UNIQUE NOT NULL,
      quantified JSONB,
      technique JSONB,
      adaptation JSONB,
      substitutions JSONB,
      generated_at TIMESTAMP DEFAULT NOW()
    )
  `)
  console.log("ai_enhancements 表已创建（或已存在）")

  await db.end()
  console.log("完成 — ai_enhancements 表迁移成功")
}

update().catch(err => { console.error("出错:", err.message); db.end() })
