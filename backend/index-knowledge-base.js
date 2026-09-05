require("dotenv").config()
const { Client } = require("pg")
const { createEmbedding } = require("./ai")

const db = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false } })

function text(value) { return typeof value === "string" ? value : JSON.stringify(value || "") }
function makeDocument(title, content) { return `${title || ""}\n${content}`.trim().slice(0, 12000) }

async function main() {
  await db.connect()
  const sources = []
  const cocktails = await db.query("SELECT eng, chn, cat, ingredients, story, method, taste_tags, difficulty, occasion, tip FROM cocktails ORDER BY id")
  for (const row of cocktails.rows) sources.push({ type: "cocktail", id: row.eng, title: row.chn || row.eng, content: makeDocument(row.chn || row.eng, text(row)) })
  const articles = await db.query("SELECT id, title, summary, body, cat FROM articles WHERE COALESCE(review_status, 'published')='published'")
  for (const row of articles.rows) sources.push({ type: "article", id: String(row.id), title: row.title, content: makeDocument(row.title, `${row.summary || ""}\n${row.body || ""}`) })
  const community = await db.query("SELECT id, content_type, title, summary, content FROM published_community_content")
  for (const row of community.rows) sources.push({ type: row.content_type, id: String(row.id), title: row.title, content: makeDocument(row.title, `${row.summary || ""}\n${text(row.content)}`) })
  const approved = await db.query("SELECT id, content_type, title, summary, content FROM content_submissions WHERE status='approved' AND content_type IN ('flashcard','encyclopedia') AND NOT EXISTS (SELECT 1 FROM published_community_content p WHERE p.submission_id=content_submissions.id)")
  for (const row of approved.rows) sources.push({ type: row.content_type, id: `submission_${row.id}`, title: row.title, content: makeDocument(row.title, `${row.summary || ""}\n${text(row.content)}`) })

  let done = 0
  for (const source of sources) {
    const embedding = await createEmbedding(source.content)
    await db.query("INSERT INTO knowledge_chunks (source_type,source_id,title,content,embedding,metadata,updated_at) VALUES ($1,$2,$3,$4,$5::vector,$6,NOW()) ON CONFLICT (source_type,source_id) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content, embedding=EXCLUDED.embedding, metadata=EXCLUDED.metadata, updated_at=NOW()", [source.type, source.id, source.title, source.content, `[${embedding.join(",")}]`, JSON.stringify({ indexed_by: "index-knowledge-base" })])
    done += 1
    if (done % 10 === 0) console.log(`已索引 ${done}/${sources.length}`)
  }
  console.log(`知识库索引完成，共 ${done} 条`)
  await db.end()
}

main().catch(async (err) => { console.error("知识库索引失败:", err.message); await db.end().catch(() => {}); process.exitCode = 1 })
