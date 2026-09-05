require("dotenv").config()
const { Client } = require("pg")

const db = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false } })

async function main() {
  await db.connect()
  await db.query("CREATE EXTENSION IF NOT EXISTS vector")
  await db.query(`CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id SERIAL PRIMARY KEY,
    source_type VARCHAR(40) NOT NULL,
    source_id VARCHAR(120) NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (source_type, source_id)
  )`)
  await db.query("CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10)")
  await db.query("CREATE INDEX IF NOT EXISTS knowledge_chunks_source_idx ON knowledge_chunks (source_type, source_id)")
  console.log("知识库表已准备完成")
  await db.end()
}

main().catch(async (err) => { console.error("知识库迁移失败:", err.message); await db.end().catch(() => {}); process.exitCode = 1 })
