// ====== 评分系统表迁移 ======
const { Client } = require("pg")
require("dotenv").config()

const connStr = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const isLocal = connStr.includes("localhost") || connStr.includes("127.0.0.1")

const client = new Client({
  connectionString: connStr,
  ssl: isLocal ? false : { rejectUnauthorized: false },
})

async function run() {
  await client.connect()
  console.log("已连接数据库")

  await client.query(`
    CREATE TABLE IF NOT EXISTS cocktail_ratings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      cocktail_eng VARCHAR(100) NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, cocktail_eng)
    )
  `)
  console.log("✅ cocktail_ratings 表已创建")

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_ratings_cocktail ON cocktail_ratings(cocktail_eng)
  `)
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_ratings_user ON cocktail_ratings(user_id)
  `)
  console.log("✅ 索引已创建")

  // 添加平均评分视图或直接通过查询计算
  console.log("迁移完成")
  await client.end()
}

run().catch((err) => {
  console.error("迁移失败:", err.message)
  process.exit(1)
})
