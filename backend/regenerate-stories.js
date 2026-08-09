// 重新生成鸡尾酒故事（只更新那些模板填充的）
const { Client } = require("pg")
const fs = require("fs")
require("dotenv").config()

const connStr = process.env.DATABASE_URL || "postgresql://postgres:CocktailBar2024@localhost:5432/cocktail_bar"
const isLocal = connStr.includes("localhost") || connStr.includes("127.0.0.1")

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
if (!DEEPSEEK_API_KEY) {
  console.error("请在 .env 中设置 DEEPSEEK_API_KEY")
  process.exit(1)
}

// 判断是否模板故事的关键词
const TEMPLATE_MARKERS = [
  "是一款难忘经典鸡尾酒",
  "是一款当代经典鸡尾酒",
  "是一款新时代鸡尾酒",
  "IBA 官方将其列为",
  "每一杯经典鸡尾酒都是一个时代的切片",
  "诞生于它的时代——但它超越了它的时代",
  "的调制方法有特定的技术要求",
  "核心配料包括",
  "持久遗产在于",
  "简单的配方——",
]

function isTemplateStory(story) {
  if (!story?.origin?.body) return true
  const text = story.origin.body + (story.funFact?.body || "") + (story.legacy?.body || "")
  const matchCount = TEMPLATE_MARKERS.filter(m => text.includes(m)).length
  return matchCount >= 2
}

async function callAI(messages) {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature: 0.8,
      max_tokens: 1500,
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ""
}

async function generateStory(cocktail) {
  const chn = (cocktail.chn || "").replace(/[（(][^）)]*[）)]/g, "").trim()
  const eng = cocktail.eng
  const ingredients = (cocktail.ingredients || []).join("、")

  const prompt = `你是一位鸡尾酒历史学者。请为 "${chn}（${eng}）" 写三段故事。

配料：${ingredients}
分类：${cocktail.cat || "经典鸡尾酒"}

请按以下 JSON 格式输出：

{
  "origin": {
    "title": "起源的标题（10-20字）",
    "body": "起源故事。请写真实的历史：谁发明的？在哪一年？在哪个城市或酒吧？当时的社会背景是什么？如果历史上有争议（多种说法），请提及。至少200字。不要编造虚假历史——如果你不确定具体细节，使用'据传''据说''普遍认为'等措辞。不要使用'XXX是一款XXX鸡尾酒'这种套话开头。"
  },
  "funFact": {
    "title": "趣闻的标题（10-20字）",
    "body": "一个有趣的冷知识。可以关于：名字的由来、名人轶事、电影/文学中的出现、调酒技术的独特之处、原料的冷门知识。至少150字。要具体、有趣、让人记住。不要写'调制方法有特定的技术要求'这种废话。"
  },
  "legacy": {
    "title": "传承的标题（10-20字）",
    "body": "这款酒对鸡尾酒文化产生了什么影响？它启发了哪些后来的配方？它在今天的精酿鸡尾酒运动中处于什么位置？至少150字。要提到具体的变体或受其影响的酒款名称。不要写'每一杯经典鸡尾酒都是一个时代的切片'这种套话。"
  }
}

要求：
- 中文写作，保留英文术语
- 具体、真实、有细节，不是泛泛的模板文章
- 不要用 markdown
- 不要出现配方中配料的具体毫升数（已经在配料表中显示了）`

  const response = await callAI([{ role: "user", content: prompt }])

  // 尝试解析 JSON
  try {
    // 找到 JSON 块
    const jsonMatch = response.match(/\{[\s\S]*"origin"[\s\S]*"legacy"[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return JSON.parse(response)
  } catch (e) {
    console.error(`  解析失败: ${eng}`)
    console.error(`  原始响应: ${response.slice(0, 300)}`)
    return null
  }
}

async function main() {
  const db = new Client({
    connectionString: connStr,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  })
  await db.connect()
  console.log("已连接数据库")

  // 获取所有鸡尾酒
  const result = await db.query(
    "SELECT eng, chn, cat, ingredients, story FROM cocktails ORDER BY eng"
  )

  const needsUpdate = result.rows.filter(c => isTemplateStory(c.story))
  console.log(`总鸡尾酒数: ${result.rows.length}`)
  console.log(`需要更新故事的: ${needsUpdate.length}`)
  console.log(`已有真实故事的: ${result.rows.length - needsUpdate.length}`)

  if (needsUpdate.length === 0) {
    console.log("所有鸡尾酒都有真实故事了！")
    await db.end()
    return
  }

  console.log("\n需要更新的酒款:")
  needsUpdate.forEach(c => console.log(`  - ${c.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || c.eng} (${c.eng})`))
  console.log("\n开始更新...")

  let success = 0
  let fail = 0
  const errors = []

  for (let i = 0; i < needsUpdate.length; i++) {
    const c = needsUpdate[i]
    const chn = (c.chn || "").replace(/[（(][^）)]*[）)]/g, "").trim()
    console.log(`[${i + 1}/${needsUpdate.length}] ${chn} (${c.eng})...`)

    try {
      const story = await generateStory(c)
      if (story?.origin?.body && story?.funFact?.body && story?.legacy?.body) {
        await db.query(
          "UPDATE cocktails SET story = $1 WHERE eng = $2",
          [JSON.stringify(story), c.eng]
        )
        console.log(`  ✅ 已更新`)
        success++
      } else {
        throw new Error("故事不完整")
      }
    } catch (e) {
      console.log(`  ❌ 失败: ${e.message}`)
      fail++
      errors.push(c.eng)
    }

    // 避免触发限流
    if (i < needsUpdate.length - 1) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  console.log(`\n完成! 成功: ${success}, 失败: ${fail}`)
  if (errors.length > 0) console.log("失败列表:", errors.join(", "))

  await db.end()
}

main().catch(e => { console.error(e.message); process.exit(1) })
