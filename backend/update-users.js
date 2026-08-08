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
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      nickname VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
  console.log("users 表已创建（或已存在）")

  await db.end()
  console.log("完成")
}

update().catch(err => { console.error("出错:", err.message); db.end() })
