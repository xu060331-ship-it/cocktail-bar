// ====== 学习卡片进度表迁移 ======
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
    CREATE TABLE IF NOT EXISTS flashcard_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      card_id VARCHAR(200) NOT NULL,
      mastered BOOLEAN DEFAULT FALSE,
      reviewed_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, card_id)
    )
  `)
  console.log("✅ flashcard_progress 表已创建")

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_fp_user ON flashcard_progress(user_id)
  `)
  console.log("✅ 索引已创建")

  await client.end()
  console.log("迁移完成")
}

run().catch((err) => {
  console.error("迁移失败:", err.message)
  process.exit(1)
})
