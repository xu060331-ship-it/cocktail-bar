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
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      cocktail_eng VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, cocktail_eng)
    )
  `)
  console.log("favorites 表已创建（或已存在）")

  // 创建浏览历史表
  await db.query(`
    CREATE TABLE IF NOT EXISTS view_history (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      cocktail_eng VARCHAR(100) NOT NULL,
      viewed_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, cocktail_eng)
    )
  `)
  console.log("view_history 表已创建（或已存在）")

  await db.end()
  console.log("完成")
}

update().catch(err => { console.error("出错:", err.message); db.end() })
