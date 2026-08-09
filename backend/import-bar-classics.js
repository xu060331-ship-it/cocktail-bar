require("dotenv").config()
const { Client } = require("pg")
const fs = require("fs")
const classics = JSON.parse(fs.readFileSync("./data/bar-classics.json", "utf-8"))

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar",
  ssl: (process.env.DATABASE_URL || "").includes("localhost") ? false : { rejectUnauthorized: false },
})

async function importClassics() {
  await db.connect()
  console.log("数据库已连接")

  let inserted = 0
  for (const c of classics) {
    try {
      await db.query(
        `INSERT INTO cocktails (eng, chn, cat, ingredients, story, method, taste_tags, difficulty, occasion, tip)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (eng) DO NOTHING`,
        [
          c.eng, c.chn, c.cat, c.ingredients,
          JSON.stringify(c.story), JSON.stringify(c.method),
          c.taste_tags, c.difficulty, c.occasion, c.tip,
        ]
      )
      inserted++
    } catch (err) {
      console.error(`  ✗ ${c.eng}: ${err.message}`)
    }
  }

  console.log(`已导入 ${inserted} 款酒吧经典`)

  // 统计总数
  const count = await db.query("SELECT cat, COUNT(*) FROM cocktails GROUP BY cat ORDER BY COUNT(*) DESC")
  count.rows.forEach(r => console.log(`  ${r.cat}: ${r.count} 款`))

  await db.end()
  console.log("导入完成")
}

importClassics().catch(err => { console.error("出错:", err.message); db.end() })
