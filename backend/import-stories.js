// 批量导入鸡尾酒故事
const { Client } = require("pg")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const stories = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "stories-export.json"), "utf-8"))

const connStr = process.env.DATABASE_URL || "postgresql://postgres:CocktailBar2024@localhost:5432/cocktail_bar"
const isLocal = connStr.includes("localhost") || connStr.includes("127.0.0.1")

async function run() {
  const db = new Client({
    connectionString: connStr,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  })
  await db.connect()
  console.log(`已连接数据库，准备导入 ${stories.length} 个故事`)

  let success = 0
  let fail = 0

  for (const item of stories) {
    try {
      await db.query(
        "UPDATE cocktails SET story = $1 WHERE eng = $2",
        [JSON.stringify(item.story), item.eng]
      )
      success++
    } catch (e) {
      console.error(`  ${item.eng} 失败: ${e.message}`)
      fail++
    }
  }

  console.log(`完成! 成功: ${success}, 失败: ${fail}`)
  await db.end()
}

run().catch((e) => { console.error(e.message); process.exit(1) })
