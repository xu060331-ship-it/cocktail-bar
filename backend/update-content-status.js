require("dotenv").config()
const { Client } = require("pg")

const client = new Client({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar" })

async function migrate() {
  await client.connect()
  await client.query("ALTER TABLE cocktails ADD COLUMN IF NOT EXISTS review_status VARCHAR(20) DEFAULT 'published'")
  await client.query("ALTER TABLE articles ADD COLUMN IF NOT EXISTS review_status VARCHAR(20) DEFAULT 'published'")
  await client.query("UPDATE cocktails SET review_status = 'published' WHERE review_status IS NULL")
  await client.query("UPDATE articles SET review_status = 'published' WHERE review_status IS NULL")
  await client.end()
  console.log("内容审核状态字段已创建")
}

migrate().catch((error) => { console.error("迁移失败:", error.message); process.exitCode = 1 })
