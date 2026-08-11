// 修复三个鸡尾酒的 eng 字段，使得 slug 生成的图片路径与实际文件名匹配
const { Client } = require("pg")
require("dotenv").config()

const connStr = process.env.DATABASE_URL || "postgresql://postgres:CocktailBar2024@localhost:5432/cocktail_bar"
const isLocal = connStr.includes("localhost") || connStr.includes("127.0.0.1")

const FIXES = [
  { old: "Vieux Carr",    new: "Vieux Carre", chn: "老广场" },
  { old: "French 75 75",  new: "French 75",   chn: "法国75" },
  { old: "VE.N.TO VE.N.TO", new: "Ve.n.to",  chn: "Ve.n.To" },
]

async function run() {
  const db = new Client({
    connectionString: connStr,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  })
  await db.connect()
  console.log("已连接数据库")

  for (const fix of FIXES) {
    const check = await db.query("SELECT eng, chn FROM cocktails WHERE eng = $1", [fix.old])
    if (check.rows.length > 0) {
      await db.query("UPDATE cocktails SET eng = $1 WHERE eng = $2", [fix.new, fix.old])
      console.log(`✅ ${fix.chn}: "${fix.old}" → "${fix.new}"`)
    } else {
      // 检查是否已经是新值
      const already = await db.query("SELECT eng FROM cocktails WHERE eng = $1", [fix.new])
      if (already.rows.length > 0) {
        console.log(`⏭  ${fix.chn}: 已经是 "${fix.new}"，无需修复`)
      } else {
        console.log(`⚠  ${fix.chn}: 数据库中找不到 "${fix.old}"，手动检查`)
      }
    }
  }

  // 验证 slug 匹配
  function slug(eng) {
    return eng.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
  }
  console.log("\n验证图片路径:")
  for (const fix of FIXES) {
    const s = slug(fix.new)
    console.log(`  ${fix.chn}: eng="${fix.new}" → slug="${s}" → /images/${s}.jpg`)
  }
  console.log("\n修复完成！请确认这三张图片文件存在于 public/images/ 目录。")

  await db.end()
}

run().catch(e => { console.error(e.message); process.exit(1) })
