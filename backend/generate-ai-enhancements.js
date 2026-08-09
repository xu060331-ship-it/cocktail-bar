/**
 * 批量预生成所有鸡尾酒的 AI 增强内容
 * 运行：node generate-ai-enhancements.js
 *
 * 遍历所有酒款，调用 DeepSeek 生成四个维度的增强内容并存入数据库
 * 每次调用间隔 3 秒，总共约 6-7 分钟
 * 一次性成本约 ¥0.07（DeepSeek 定价）
 */
require("dotenv").config()
const { Client } = require("pg")
const { AI_ENABLED, callAIWithRetry, extractJSON, generateCocktailEnhancementPrompt } = require("./ai")

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar",
  ssl: (process.env.DATABASE_URL || "").includes("localhost") ? false : { rejectUnauthorized: false },
})

// 每批次处理的数量（可调）
const BATCH_SIZE = 1 // 一次处理 1 款（避免限流）
const DELAY_MS = 3000 // 每批之间等待 3 秒

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function generate() {
  await db.connect()
  console.log("数据库已连接\n")

  if (!AI_ENABLED) {
    console.log("AI_ENABLED=false，跳过生成")
    await db.end()
    return
  }

  // 查询所有鸡尾酒，排除已生成的
  const cocktails = await db.query(`
    SELECT c.* FROM cocktails c
    LEFT JOIN ai_enhancements ae ON c.eng = ae.cocktail_eng
    WHERE ae.cocktail_eng IS NULL
    ORDER BY c.id
  `)

  const total = cocktails.rows.length
  if (total === 0) {
    console.log("所有鸡尾酒的 AI 增强内容已生成完毕，无需重新生成。")
    await db.end()
    return
  }

  console.log(`找到 ${total} 款待生成的鸡尾酒\n`)
  console.log("开始批量生成 AI 增强内容...\n")

  let generated = 0
  let failed = 0
  const failedList = []

  for (let i = 0; i < total; i++) {
    const cocktail = cocktails.rows[i]
    const progress = `[${i + 1}/${total}]`
    const label = `${cocktail.chn}（${cocktail.eng}）`

    try {
      const messages = generateCocktailEnhancementPrompt(cocktail)
      console.log(`${progress} 正在生成: ${label}...`)
      const aiText = await callAIWithRetry(messages, { temperature: 0.3, maxTokens: 3000 })

      const data = extractJSON(aiText)
      if (!data) {
        throw new Error("无法解析 AI 返回的 JSON")
      }

      // 存入数据库
      await db.query(
        `INSERT INTO ai_enhancements (cocktail_eng, quantified, technique, adaptation, substitutions)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (cocktail_eng) DO UPDATE SET
           quantified = $2, technique = $3, adaptation = $4, substitutions = $5, generated_at = NOW()`,
        [
          cocktail.eng,
          data.quantified || null,
          data.technique || null,
          data.adaptation || null,
          data.substitutions || null,
        ]
      )

      generated++
      console.log(`${progress} ✅ 完成: ${label}`)
    } catch (err) {
      failed++
      failedList.push(label)
      console.error(`${progress} ❌ 失败: ${label} — ${err.message}`)
    }

    // 间隔等待（最后一条不需要等待）
    if (i < total - 1) {
      await sleep(DELAY_MS)
    }
  }

  // 汇总
  console.log("\n===== 生成完毕 =====")
  console.log(`成功: ${generated} 款`)
  console.log(`失败: ${failed} 款`)
  if (failedList.length > 0) {
    console.log("\n失败的酒款：")
    failedList.forEach((f) => console.log(`  - ${f}`))
    console.log("\n可以重新运行此脚本来重试失败的酒款。")
  }
  console.log("")

  await db.end()
}

generate().catch((err) => {
  console.error("脚本出错:", err.message)
  db.end()
})
