require("dotenv").config()
const { Client } = require("pg")

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar",
  ssl: (process.env.DATABASE_URL || "").includes("localhost") ? false : { rejectUnauthorized: false },
})

async function update() {
  await db.connect()
  console.log("数据库已连接")

  // 用户 AI 记忆表
  await db.query(`
    CREATE TABLE IF NOT EXISTS user_ai_memory (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      preferred_tastes TEXT[],
      preferred_occasions TEXT[],
      preferred_persona VARCHAR(20) DEFAULT 'xiaojiu',
      mood_history JSONB DEFAULT '[]',
      interaction_count INT DEFAULT 0,
      last_mood VARCHAR(50),
      last_interaction_at TIMESTAMP,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)
  console.log("user_ai_memory 表已创建（或已存在）")

  await db.end()
  console.log("完成 — user_ai_memory 表迁移成功")
}

update().catch(err => { console.error("出错:", err.message); db.end() })
