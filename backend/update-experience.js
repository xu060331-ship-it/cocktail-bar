// ====== 调配/品尝记录表迁移 ======
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
    CREATE TABLE IF NOT EXISTS cocktail_experience (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      cocktail_eng VARCHAR(100) NOT NULL,
      action VARCHAR(10) NOT NULL CHECK (action IN ('made', 'tasted')),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, cocktail_eng, action)
    )
  `)
  console.log("✅ cocktail_experience 表已创建")

  await client.query(`CREATE INDEX IF NOT EXISTS idx_exp_user ON cocktail_experience(user_id)`)
  await client.query(`CREATE INDEX IF NOT EXISTS idx_exp_cocktail ON cocktail_experience(cocktail_eng)`)
  console.log("✅ 索引已创建")

  await client.end()
  console.log("迁移完成")
}

run().catch((err) => {
  console.error("迁移失败:", err.message)
  process.exit(1)
})
