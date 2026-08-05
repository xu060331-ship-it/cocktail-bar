const express = require("express")
const cors = require("cors")
const { Client } = require("pg")
const app = express()

app.use(cors())

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar",
})

db.connect()
  .then(() => console.log("数据库已连接"))
  .catch((err) => console.error("数据库连接失败:", err.message))

// ====== 鸡尾酒 API ======

app.get("/api/cocktails", async (req, res) => {
  try {
    const { spirit, search } = req.query
    let query = "SELECT * FROM cocktails"
    const params = []

    if (search) {
      params.push(`%${search}%`)
      query += ` WHERE (eng ILIKE $${params.length} OR chn ILIKE $${params.length})`
    }

    if (spirit) {
      params.push(`%${spirit}%`)
      query += `${params.length === 1 ? " WHERE" : " AND"} EXISTS (
        SELECT 1 FROM unnest(ingredients) AS ing WHERE ing ILIKE $${params.length}
      )`
    }

    query += " ORDER BY id"
    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/cocktails/:name", async (req, res) => {
  try {
    const result = await db.query("SELECT id, eng, chn, cat, ingredients, story FROM cocktails WHERE eng = $1", [req.params.name])
    if (result.rows.length === 0) return res.status(404).json({ error: "未找到" })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ====== 基酒 API ======

app.get("/api/spirits", async (req, res) => {
  try {
    const result = await db.query("SELECT id, slug, name, eng, emoji, description AS desc, hero, details FROM spirits ORDER BY id")
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/spirits/:slug", async (req, res) => {
  try {
    const result = await db.query("SELECT id, slug, name, eng, emoji, description AS desc, hero, details FROM spirits WHERE slug = $1", [req.params.slug])
    if (result.rows.length === 0) return res.status(404).json({ error: "未找到" })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ====== 文章 API ======

app.get("/api/articles", async (req, res) => {
  try {
    const { cat } = req.query
    let query = "SELECT * FROM articles"
    const params = []
    if (cat && cat !== "全部") {
      params.push(cat)
      query += ` WHERE cat = $${params.length}`
    }
    query += " ORDER BY created_at DESC"
    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/articles/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM articles WHERE id = $1", [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ error: "未找到" })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ====== 每日推荐（日期种子——同一天固定不变）======

app.get("/api/daily", async (req, res) => {
  try {
    const seed = req.query.date || new Date().toISOString().slice(0, 10)
    // PostgreSQL 用 MD5(seed) 做确定性随机——同一天返回相同结果
    const orderC = `MD5(eng || '${seed}')`
    const orderS = `MD5(slug || '${seed}')`
    const orderA = `MD5(title || '${seed}')`

    const cocktails = await db.query(`SELECT * FROM cocktails ORDER BY ${orderC} LIMIT 1`)
    const spirits = await db.query(`SELECT id, slug, name, eng, emoji, description AS desc FROM spirits ORDER BY ${orderS} LIMIT 1`)
    const articles = await db.query(`SELECT * FROM articles ORDER BY ${orderA} LIMIT 2`)

    res.json({
      cocktail: cocktails.rows[0],
      spirit: spirits.rows[0],
      articles: articles.rows,
      date: seed,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ====== 智能搜索 ======

app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q || ""
    if (!q.trim()) return res.json({ results: [], parsed: {} })

    // 解析用户自然语言
    const parsed = {
      spirits: [],     // 匹配到的基酒
      tastes: [],      // 匹配到的口味
      methods: [],     // 匹配到的调制方法
      keywords: [],    // 其他关键词
    }

    // 基酒识别
    const spiritMap = [
      { keys: ["金酒", "gin", "杜松子"], value: "金酒" },
      { keys: ["伏特加", "vodka"], value: "伏特加" },
      { keys: ["朗姆", "rum", "甘蔗"], value: "朗姆" },
      { keys: ["龙舌兰", "tequila", "特基拉"], value: "龙舌兰" },
      { keys: ["威士忌", "whisky", "whiskey", "波本", "黑麦"], value: "威士忌" },
      { keys: ["白兰地", "brandy", "干邑", "cognac"], value: "白兰地" },
    ]
    for (const s of spiritMap) {
      if (s.keys.some(k => q.toLowerCase().includes(k.toLowerCase()))) {
        parsed.spirits.push(s.value)
      }
    }

    // 口味识别
    const tasteMap = [
      { keys: ["酸", "sour", "柠檬", "青柠", "柑橘"], value: "酸味" },
      { keys: ["甜", "sweet", "糖", "蜂蜜"], value: "甜味" },
      { keys: ["苦", "bitter", "苦精", "金巴利"], value: "苦味" },
      { keys: ["清爽", "refresh", "气泡", "苏打", "菲士", "fizz"], value: "清爽" },
      { keys: ["烈", "strong", "高度", "浓"], value: "浓烈" },
      { keys: ["奶油", "cream", "奶", "丝滑"], value: "奶油" },
      { keys: ["水果", "fruit", "菠萝", "橙", "草莓", "蔓越莓"], value: "水果风味" },
      { keys: ["辣", "spicy", "辣椒", "姜"], value: "辛辣" },
    ]
    for (const t of tasteMap) {
      if (t.keys.some(k => q.toLowerCase().includes(k.toLowerCase()))) {
        parsed.tastes.push(t.value)
      }
    }

    // 调制方法识别
    const methodMap = [
      { keys: ["摇", "shake", "摇和"], value: "摇和法" },
      { keys: ["搅拌", "stir", "直调"], value: "搅拌法" },
      { keys: ["直调", "build"], value: "直调法" },
    ]
    for (const m of methodMap) {
      if (m.keys.some(k => q.toLowerCase().includes(k.toLowerCase()))) {
        parsed.methods.push(m.value)
      }
    }

    // 数据库查询
    let query = "SELECT * FROM cocktails"
    const params = []
    const conditions = []

    if (parsed.spirits.length > 0) {
      const spiritConditions = parsed.spirits.map((s, i) => {
        params.push(`%${s}%`)
        return `EXISTS (SELECT 1 FROM unnest(ingredients) AS ing WHERE ing ILIKE $${params.length})`
      })
      conditions.push(`(${spiritConditions.join(" OR ")})`)
    }

    if (parsed.tastes.length > 0) {
      const tasteConditions = parsed.tastes.map((t, i) => {
        const tasteKeys = tasteMap.find(tm => tm.value === t)
        if (!tasteKeys) return null
        const ors = tasteKeys.keys.filter(k => k.length > 1).map(k => {
          params.push(`%${k}%`)
          return `EXISTS (SELECT 1 FROM unnest(ingredients) AS ing WHERE ing ILIKE $${params.length})`
        })
        return ors.length > 0 ? `(${ors.join(" OR ")})` : null
      }).filter(Boolean)
      if (tasteConditions.length > 0) {
        conditions.push(`(${tasteConditions.join(" AND ")})`)
      }
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY id LIMIT 20"
    const result = await db.query(query, params)

    res.json({
      results: result.rows,
      parsed,
      query: q,
      total: result.rows.length,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3000, () => {
  console.log("后端运行在 http://localhost:3000")
})
