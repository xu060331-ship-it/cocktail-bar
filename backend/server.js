require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { Client } = require("pg")
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const { mountAuthRoutes, authMiddleware, adminMiddleware } = require("./auth")
const { AI_ENABLED, XIAOJIU_SYSTEM_PROMPT, callAIWithRetry, callAIStream, extractJSON, validateCitations, ruleBasedRecommend, fallbackChatReply, generateCocktailEnhancementPrompt, generateRecommendationPrompt } = require("./ai")
const { getPersona, listPersonas } = require("./ai-personas")
const { STATIC_CARDS, generateCocktailCards } = require("./flashcards")
const { listCategories, getCategory, searchEntries } = require("./encyclopedia")
const { jwtSecret, port, frontendUrl } = require("./config")
const app = express()
const errorLog = []
function recordError(scope, message) { errorLog.unshift({ scope, message, at: new Date().toISOString() }); if (errorLog.length > 100) errorLog.pop() }
const uploadDir = path.join(__dirname, "uploads", "making-logs")
fs.mkdirSync(uploadDir, { recursive: true })
const upload = multer({
  storage: multer.diskStorage({ destination: uploadDir, filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname).toLowerCase()}`) }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)),
})
const contentImageDir = path.join(__dirname, "uploads", "content")
fs.mkdirSync(contentImageDir, { recursive: true })
const contentImageUpload = multer({ storage: multer.diskStorage({ destination: contentImageDir, filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname).toLowerCase()}`) }), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_, file, cb) => cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) })
function validImageSignature(filePath) { const data = fs.readFileSync(filePath); return (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) || (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) || (data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP") }
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use(cors(frontendUrl ? { origin: frontendUrl } : undefined))
app.use(express.json())

const CONTENT_STATUSES = new Set(["draft", "review", "published", "archived"])

app.get("/api/admin/overview", adminMiddleware, async (_, res) => {
  try {
    const [cocktails, articles, popular, ai] = await Promise.all([
      db.query("SELECT id, eng, chn, cat, tip AS description, tip, image_url, COALESCE(review_status, 'published') AS review_status FROM cocktails ORDER BY id"),
      db.query("SELECT id, title, cat, summary AS description, body, image_url, COALESCE(review_status, 'published') AS review_status FROM articles ORDER BY id DESC"),
      db.query("SELECT eng, chn, view_count FROM cocktails ORDER BY view_count DESC LIMIT 10"),
      db.query("SELECT cocktail_eng, generated_at FROM ai_enhancements ORDER BY generated_at DESC LIMIT 50").catch(() => ({ rows: [] })),
    ])
    res.json({ cocktails: cocktails.rows, articles: articles.rows, popular: popular.rows, ai: ai.rows, errors: errorLog })
  } catch (_) { res.status(500).json({ error: "后台数据加载失败" }) }
})

app.put("/api/admin/cocktails/:id", adminMiddleware, async (req, res) => {
  const { chn, cat, description, tip, review_status } = req.body || {}
  if (review_status && !CONTENT_STATUSES.has(review_status)) return res.status(400).json({ error: "无效的审核状态" })
  try { const result = await db.query("UPDATE cocktails SET chn=$1, cat=$2, tip=$3, review_status=COALESCE($4, review_status) WHERE id=$5 RETURNING id, eng, chn, cat, tip AS description, tip, COALESCE(review_status, 'published') AS review_status", [chn, cat, description || tip || null, review_status || "published", req.params.id]); if (!result.rows.length) return res.status(404).json({ error: "酒款不存在" }); res.json(result.rows[0]) }
  catch (err) { recordError("admin.cocktail", err.message); res.status(500).json({ error: "酒款保存失败" }) }
})

app.put("/api/admin/articles/:id", adminMiddleware, async (req, res) => {
  const { title, cat, description, body, review_status } = req.body || {}
  if (review_status && !CONTENT_STATUSES.has(review_status)) return res.status(400).json({ error: "无效的审核状态" })
  try { const result = await db.query("UPDATE articles SET title=$1, cat=$2, summary=$3, body=$4, review_status=COALESCE($5, review_status) WHERE id=$6 RETURNING id, title, cat, summary AS description, body, COALESCE(review_status, 'published') AS review_status", [title, cat, description, body, review_status || "published", req.params.id]); if (!result.rows.length) return res.status(404).json({ error: "文章不存在" }); res.json(result.rows[0]) }
  catch (err) { recordError("admin.article", err.message); res.status(500).json({ error: "文章保存失败" }) }
})

app.post("/api/admin/images/:type/:id", adminMiddleware, contentImageUpload.single("image"), async (req, res) => {
  const table = req.params.type === "cocktails" ? "cocktails" : req.params.type === "articles" ? "articles" : null
  if (!table) return res.status(400).json({ error: "不支持的内容类型" })
  if (!req.file) return res.status(400).json({ error: "请选择 JPG、PNG 或 WebP 图片" })
  try {
    const url = `/uploads/content/${req.file.filename}`
    const result = await db.query(`UPDATE ${table} SET image_url=$1 WHERE id=$2 RETURNING id, image_url`, [url, req.params.id])
    if (!result.rows.length) { fs.unlink(req.file.path, () => {}); return res.status(404).json({ error: "内容不存在" }) }
    res.json(result.rows[0])
  } catch (_) { fs.unlink(req.file.path, () => {}); res.status(500).json({ error: "图片保存失败" }) }
})

app.post("/api/submissions", authMiddleware, async (req, res) => {
  const { content_type, title, summary = "", content = {} } = req.body || {}
  if (!["flashcard", "encyclopedia", "article"].includes(content_type) || !title?.trim()) return res.status(400).json({ error: "投稿类型和标题不能为空" })
  try {
    const result = await db.query("INSERT INTO content_submissions (user_id, content_type, title, summary, content) VALUES ($1,$2,$3,$4,$5) RETURNING id, content_type, title, status, created_at", [req.user.id, content_type, title.trim(), summary, JSON.stringify(content)])
    res.status(201).json(result.rows[0])
  } catch (_) { res.status(500).json({ error: "提交投稿失败，请先完成数据库迁移" }) }
})

app.get("/api/submissions/mine", authMiddleware, async (req, res) => {
  try { const result = await db.query("SELECT id, content_type, title, summary, status, reviewer_note, created_at, reviewed_at FROM content_submissions WHERE user_id=$1 ORDER BY created_at DESC", [req.user.id]); res.json(result.rows) }
  catch (_) { res.status(500).json({ error: "读取投稿记录失败" }) }
})
app.delete("/api/submissions/:id", authMiddleware, async (req, res) => {
  try { const result = await db.query("DELETE FROM content_submissions WHERE id=$1 AND user_id=$2 AND status='pending' RETURNING id", [req.params.id, req.user.id]); if (!result.rows.length) return res.status(400).json({ error: "只有审核中的投稿可以删除" }); res.json({ ok: true }) } catch (_) { res.status(500).json({ error: "删除投稿失败" }) }
})

app.get("/api/notifications", authMiddleware, async (req, res) => {
  try { const result = await db.query("SELECT id, type, title, body, is_read, created_at FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50", [req.user.id]); res.json(result.rows) } catch (_) { res.status(500).json({ error: "读取通知失败" }) }
})
app.patch("/api/notifications/read", authMiddleware, async (req, res) => {
  try { await db.query("UPDATE notifications SET is_read=TRUE WHERE user_id=$1", [req.user.id]); res.json({ ok: true }) } catch (_) { res.status(500).json({ error: "更新通知失败" }) }
})

app.get("/api/community", async (_, res) => {
  try {
    const [content, logs] = await Promise.all([
      db.query("SELECT id, content_type, title, summary, content, created_at FROM published_community_content ORDER BY created_at DESC LIMIT 60"),
      db.query("SELECT l.id, l.cocktail_eng, l.made_at, l.brands, l.rating, l.photo_url, l.created_at, c.chn, u.nickname FROM cocktail_making_logs l LEFT JOIN cocktails c ON c.eng=l.cocktail_eng LEFT JOIN users u ON u.id=l.user_id WHERE l.visibility='public' AND l.moderation_status='approved' ORDER BY l.created_at DESC LIMIT 60")
    ])
    res.json({ content: content.rows, logs: logs.rows })
  } catch (_) { res.status(500).json({ error: "社区内容加载失败" }) }
})

app.post("/api/reports", authMiddleware, async (req, res) => {
  const { target_type, target_id, reason, detail = "" } = req.body || {}
  if (!["article", "encyclopedia", "flashcard", "making_log", "comment"].includes(target_type) || !target_id || !reason) return res.status(400).json({ error: "举报信息不完整" })
  try { await db.query("INSERT INTO content_reports (reporter_id,target_type,target_id,reason,detail) VALUES ($1,$2,$3,$4,$5)", [req.user.id, target_type, String(target_id), reason, detail]); res.status(201).json({ ok: true }) } catch (_) { res.status(500).json({ error: "举报提交失败" }) }
})

app.get("/api/admin/reports", adminMiddleware, async (_, res) => {
  try { const result = await db.query("SELECT r.*, u.email, u.nickname FROM content_reports r JOIN users u ON u.id=r.reporter_id ORDER BY r.status='pending' DESC, r.created_at DESC"); res.json(result.rows) } catch (_) { res.status(500).json({ error: "读取举报失败" }) }
})

app.patch("/api/admin/reports/:id", adminMiddleware, async (req, res) => {
  const { status } = req.body || {}
  if (!["resolved", "dismissed"].includes(status)) return res.status(400).json({ error: "处理状态无效" })
  try { const result = await db.query("UPDATE content_reports SET status=$1, resolved_at=NOW() WHERE id=$2 RETURNING *", [status, req.params.id]); if (!result.rows.length) return res.status(404).json({ error: "举报不存在" }); res.json(result.rows[0]) } catch (_) { res.status(500).json({ error: "处理举报失败" }) }
})

app.delete("/api/admin/comments/:id", adminMiddleware, async (req, res) => {
  try { const result = await db.query("DELETE FROM cocktail_ratings WHERE id=$1 RETURNING id", [req.params.id]); if (!result.rows.length) return res.status(404).json({ error: "评论不存在" }); res.json({ ok: true }) } catch (_) { res.status(500).json({ error: "删除评论失败" }) }
})

app.patch("/api/admin/comments/:id", adminMiddleware, async (req, res) => {
  if (typeof req.body?.is_hidden !== "boolean") return res.status(400).json({ error: "请提供屏蔽状态" })
  try { const result = await db.query("UPDATE cocktail_ratings SET is_hidden=$1, updated_at=NOW() WHERE id=$2 RETURNING id, is_hidden", [req.body.is_hidden, req.params.id]); if (!result.rows.length) return res.status(404).json({ error: "评论不存在" }); res.json(result.rows[0]) } catch (_) { res.status(500).json({ error: "更新评论状态失败" }) }
})

app.get("/api/admin/content-submissions", adminMiddleware, async (_, res) => {
  try { const result = await db.query("SELECT s.*, u.email, u.nickname FROM content_submissions s JOIN users u ON u.id=s.user_id ORDER BY s.status='pending' DESC, s.created_at DESC"); res.json(result.rows) }
  catch (_) { res.status(500).json({ error: "读取内容投稿失败" }) }
})

app.patch("/api/admin/content-submissions/:id", adminMiddleware, async (req, res) => {
  const { status, reviewer_note = "" } = req.body || {}
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ error: "审核状态无效" })
  try {
    const result = await db.query("UPDATE content_submissions SET status=$1, reviewer_note=$2, reviewed_at=NOW() WHERE id=$3 RETURNING *", [status, reviewer_note, req.params.id])
    if (!result.rows.length) return res.status(404).json({ error: "投稿不存在" })
    if (status === "approved") {
      const item = result.rows[0]
      if (item.content_type === "article") await db.query("INSERT INTO articles (title, cat, summary, body) VALUES ($1,$2,$3,$4)", [item.title, item.content.category || "用户投稿", item.summary, item.content.body || item.content.answer || ""])
      else await db.query("INSERT INTO published_community_content (submission_id, content_type, title, summary, content) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (submission_id) DO NOTHING", [item.id, item.content_type, item.title, item.summary, item.content])
      if (typeof cachedCards !== "undefined") { cachedCards = null; cardsLoadedAt = 0 }
    }
    const item = result.rows[0]
    await db.query("INSERT INTO notifications (user_id,type,title,body) VALUES ($1,$2,$3,$4)", [item.user_id, "submission_review", status === "approved" ? "投稿已通过" : "投稿未通过", status === "approved" ? `你的${item.content_type === "article" ? "文章" : item.content_type === "flashcard" ? "学习卡片" : "百科词条"}《${item.title}》已通过审核。` : `你的投稿《${item.title}》未通过审核。${reviewer_note ? `原因：${reviewer_note}` : "请修改后重新提交。"}`])
    res.json(result.rows[0])
  } catch (_) { res.status(500).json({ error: "审核投稿失败" }) }
})
app.delete("/api/admin/content-submissions/:id", adminMiddleware, async (req, res) => {
  try { const result = await db.query("DELETE FROM content_submissions WHERE id=$1 RETURNING id", [req.params.id]); if (!result.rows.length) return res.status(404).json({ error: "投稿不存在" }); res.json({ ok: true }) } catch (_) { res.status(500).json({ error: "删除投稿失败" }) }
})

app.get("/api/admin/submissions", adminMiddleware, async (_, res) => {
  try {
    const result = await db.query(`SELECT l.id, l.cocktail_eng, l.made_at, l.brands, l.rating, l.photo_url, l.visibility, l.moderation_status, u.email, u.nickname, c.chn FROM cocktail_making_logs l JOIN users u ON u.id = l.user_id LEFT JOIN cocktails c ON c.eng = l.cocktail_eng WHERE l.visibility = 'public' ORDER BY l.created_at DESC`)
    res.json(result.rows)
  } catch (_) { res.status(500).json({ error: "读取公开投稿失败" }) }
})

app.patch("/api/admin/submissions/:id", adminMiddleware, async (req, res) => {
  const status = req.body?.moderation_status
  if (!["approved", "rejected", "pending"].includes(status)) return res.status(400).json({ error: "无效的投稿状态" })
  try {
    const result = await db.query("UPDATE cocktail_making_logs SET moderation_status=$1, visibility=CASE WHEN $1='approved' THEN 'public' ELSE 'private' END, updated_at=NOW() WHERE id=$2 AND visibility='public' RETURNING id, moderation_status, visibility", [status, req.params.id])
    if (!result.rows.length) return res.status(404).json({ error: "投稿不存在" })
    res.json(result.rows[0])
  } catch (_) { res.status(500).json({ error: "更新投稿状态失败" }) }
})

const connStr = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const isLocal = connStr.includes("localhost") || connStr.includes("127.0.0.1")

const db = new Client({
  connectionString: connStr,
  ssl: isLocal ? false : { rejectUnauthorized: false },
})

db.connect()
  .then(() => console.log("数据库已连接"))
  .catch((err) => console.error("数据库连接失败:", err.message))

// ====== 鸡尾酒 API ======

app.get("/api/cocktails", async (req, res) => {
  try {
    const { spirit, search, taste, difficulty, occasion } = req.query
    let query = "SELECT * FROM cocktails"
    const params = []
    const conditions = []

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(eng ILIKE $${params.length} OR chn ILIKE $${params.length})`)
    }

    if (spirit) {
      params.push(`%${spirit}%`)
      conditions.push(`EXISTS (SELECT 1 FROM unnest(ingredients) AS ing WHERE ing ILIKE $${params.length})`)
    }

    if (taste) {
      params.push(taste)
      conditions.push(`$${params.length} = ANY(taste_tags)`)
    }

    if (difficulty) {
      params.push(parseInt(difficulty))
      conditions.push(`difficulty = $${params.length}`)
    }

    if (occasion) {
      params.push(occasion)
      conditions.push(`$${params.length} = ANY(occasion)`)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY id"
    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 随机推荐
app.get("/api/cocktails/random", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM cocktails ORDER BY RANDOM() LIMIT 1")
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 热门排行
app.get("/api/cocktails/popular", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const result = await db.query("SELECT id, eng, chn, cat, taste_tags, difficulty, view_count FROM cocktails ORDER BY view_count DESC LIMIT $1", [limit])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/cocktails/:name", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, eng, chn, cat, ingredients, story, method, taste_tags, difficulty, occasion, view_count, tip FROM cocktails WHERE eng = $1",
      [req.params.name]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "未找到" })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 浏览计数 +1
app.post("/api/cocktails/:name/view", async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE cocktails SET view_count = view_count + 1 WHERE eng = $1 RETURNING view_count",
      [req.params.name]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "未找到" })
    res.json({ view_count: result.rows[0].view_count })
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
    let personalized = false
    let preferences = null

    // 尝试读取用户偏好
    const authHeader = req.headers.authorization
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "")
        const jwt = require("jsonwebtoken")
        const decoded = jwt.verify(token, jwtSecret)
        const mem = await db.query(
          "SELECT preferred_tastes, preferred_occasions FROM user_ai_memory WHERE user_id = $1",
          [decoded.id]
        )
        if (mem.rows.length > 0 && (mem.rows[0].preferred_tastes?.length || mem.rows[0].preferred_occasions?.length)) {
          preferences = mem.rows[0]
          personalized = true
        }
      } catch (_) {}
    }

    let cocktail, spirit, articles

    if (personalized && preferences) {
      // 个性化推荐：基于偏好加权随机
      const allCocktails = await db.query("SELECT * FROM cocktails")
      const { preferred_tastes, preferred_occasions } = preferences
      const prefTastes = preferred_tastes || []
      const prefOccs = preferred_occasions || []

      // 扩展偏好（找相似口味）
      const tasteMap = {
        "清爽": ["清爽", "果香", "酸甜"],
        "果香": ["果香", "酸甜", "甜味"],
        "酸甜": ["酸甜", "果香", "清爽"],
        "甜味": ["甜味", "奶油", "果香"],
        "苦味": ["苦味", "草本", "烈"],
        "奶油": ["奶油", "甜味"],
        "烈": ["烈", "苦味", "草本"],
        "草本": ["草本", "清爽", "苦味"],
        "辛辣": ["辛辣", "烈", "草本"],
      }
      const expandedTastes = new Set(prefTastes)
      prefTastes.forEach(t => {
        if (tasteMap[t]) tasteMap[t].forEach(x => expandedTastes.add(x))
      })

      const scored = allCocktails.rows.map(c => {
        let score = 1
        if (c.taste_tags?.length) {
          c.taste_tags.forEach(t => { if (expandedTastes.has(t)) score += 3 })
        }
        if (prefOccs.length && c.occasion?.length) {
          c.occasion.forEach(o => { if (prefOccs.includes(o)) score += 2 })
        }
        if (c.view_count) score += Math.log(c.view_count + 1) * 0.5
        // 加随机因子，不完全确定性
        score += Math.random() * 3
        return { ...c, _score: score }
      })

      scored.sort((a, b) => b._score - a._score)
      cocktail = scored[0]
      spirit = (await db.query(`SELECT id, slug, name, eng, emoji, description AS desc FROM spirits ORDER BY RANDOM() LIMIT 1`)).rows[0]
      articles = (await db.query(`SELECT * FROM articles ORDER BY RANDOM() LIMIT 2`)).rows
    } else {
      // 未登录/无偏好：日期种子确定性随机
      const cRes = await db.query(`SELECT * FROM cocktails ORDER BY MD5(eng || $1) LIMIT 1`, [seed])
      const sRes = await db.query(`SELECT id, slug, name, eng, emoji, description AS desc FROM spirits ORDER BY MD5(slug || $1) LIMIT 1`, [seed])
      const aRes = await db.query(`SELECT * FROM articles ORDER BY MD5(title || $1) LIMIT 2`, [seed])
      cocktail = cRes.rows[0]
      spirit = sRes.rows[0]
      articles = aRes.rows
    }

    res.json({
      cocktail,
      spirit,
      articles,
      date: seed,
      personalized,
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

// ====== 收藏 API ======

// 收藏酒款
app.post("/api/favorites/:eng", authMiddleware, async (req, res) => {
  try {
    await db.query(
      "INSERT INTO favorites (user_id, cocktail_eng) VALUES ($1, $2) ON CONFLICT (user_id, cocktail_eng) DO NOTHING",
      [req.user.id, req.params.eng]
    )
    res.json({ favorited: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 取消收藏
app.delete("/api/favorites/:eng", authMiddleware, async (req, res) => {
  try {
    await db.query("DELETE FROM favorites WHERE user_id = $1 AND cocktail_eng = $2", [req.user.id, req.params.eng])
    res.json({ favorited: false })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 获取用户收藏列表
app.get("/api/favorites", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, f.created_at AS fav_at FROM favorites f
       JOIN cocktails c ON f.cocktail_eng = c.eng
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 检查某款酒是否已收藏
app.get("/api/favorites/:eng", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT 1 FROM favorites WHERE user_id = $1 AND cocktail_eng = $2",
      [req.user.id, req.params.eng]
    )
    res.json({ favorited: result.rows.length > 0 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ====== 浏览历史 API ======

// 记录浏览（登录用户）
app.post("/api/history/:eng", authMiddleware, async (req, res) => {
  try {
    await db.query(
      `INSERT INTO view_history (user_id, cocktail_eng, viewed_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, cocktail_eng) DO UPDATE SET viewed_at = NOW()`,
      [req.user.id, req.params.eng]
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 获取浏览历史
app.get("/api/history", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, vh.viewed_at FROM view_history vh
       JOIN cocktails c ON vh.cocktail_eng = c.eng
       WHERE vh.user_id = $1
       ORDER BY vh.viewed_at DESC
       LIMIT 20`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ====== 吧台 API ======

// 获取我的吧台材料
app.get("/api/bar", authMiddleware, async (req, res) => {
  try {
    const result = await db.query("SELECT ingredient FROM bar_ingredients WHERE user_id = $1 ORDER BY ingredient", [req.user.id])
    res.json(result.rows.map(r => r.ingredient))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 添加吧台材料
app.post("/api/bar", authMiddleware, async (req, res) => {
  try {
    const { ingredient } = req.body || {}
    if (!ingredient) return res.status(400).json({ error: "材料名不能为空" })
    await db.query("INSERT INTO bar_ingredients (user_id, ingredient) VALUES ($1, $2) ON CONFLICT DO NOTHING", [req.user.id, ingredient])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 删除吧台材料
app.delete("/api/bar", authMiddleware, async (req, res) => {
  try {
    const { ingredient } = req.body || {}
    await db.query("DELETE FROM bar_ingredients WHERE user_id = $1 AND ingredient = $2", [req.user.id, ingredient])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 根据吧台材料匹配能做的酒
app.get("/api/bar/match", authMiddleware, async (req, res) => {
  try {
    const bar = await db.query("SELECT ingredient FROM bar_ingredients WHERE user_id = $1", [req.user.id])
    const myIngs = bar.rows.map(r => r.ingredient)
    if (myIngs.length === 0) return res.json({ matchable: [], missing: 0 })

    // 同义词扩展：用户可能用简称，数据库里可能是全称
    const aliasMap = {
      "金酒": ["金酒", "杜松子酒", "干金酒", "干杜松子酒", "伦敦干金酒", "老汤姆金酒", "老汤姆杜松子酒", "普利茅斯金酒"],
      "伏特加": ["伏特加", "斯米诺伏特加", "柑橘伏特加", "香草伏特加"],
      "朗姆": ["朗姆", "朗姆酒", "白朗姆", "白朗姆酒", "黑朗姆", "陈年朗姆", "金朗姆", "牙买加朗姆", "古巴白朗姆", "马提尼克朗姆"],
      "龙舌兰": ["龙舌兰", "龙舌兰酒", "梅斯卡尔", "卡莎萨"],
      "威士忌": ["威士忌", "波本", "黑麦", "苏格兰", "爱尔兰", "波旁", "波本威士忌", "黑麦威士忌", "调和威士忌", "苏格兰威士忌", "爱尔兰威士忌", "日本威士忌", "杰克丹尼"],
      "白兰地": ["白兰地", "干邑", "雅文邑", "苹果白兰地", "卡尔瓦多斯", "干邑白兰地", "格拉巴酒", "皮斯科"],
      "干味美思": ["干味美思"],
      "甜味美思": ["甜味美思", "红味美思", "味美思"],
      "柠檬": ["柠檬", "柠檬汁", "新鲜柠檬汁", "鲜榨柠檬汁"],
      "青柠": ["青柠", "青柠汁", "新鲜青柠汁", "鲜榨青柠汁"],
      "橙汁": ["橙汁", "鲜橙汁", "新鲜橙汁", "鲜榨橙汁"],
      "金巴利": ["金巴利"],
      "阿佩罗": ["阿佩罗"],
      "君度": ["君度", "君度利口酒", "橙皮利口酒"],
      "安哥斯图拉苦精": ["安哥斯图拉苦精", "安格斯特拉苦精"],
      "苏打水": ["苏打水", "苏打"],
      "汤力水": ["汤力水"],
      "可乐": ["可乐", "可口可乐"],
      "香槟": ["香槟", "起泡酒", "普罗赛克", "普罗赛克起泡酒"],
      "姜汁啤酒": ["姜汁啤酒", "姜汁汽水"],
    }

    // 扩展用户材料
    const expandedIngs = new Set()
    myIngs.forEach(ing => {
      expandedIngs.add(ing)
      for (const [key, aliases] of Object.entries(aliasMap)) {
        if (key === ing || aliases.includes(ing)) {
          aliases.forEach(a => expandedIngs.add(a))
        }
      }
    })

    const all = await db.query("SELECT * FROM cocktails")
    const matchable = []
    const partial = []
    const missingCounts = new Map()
    const ingredientType = (name) => {
      if (/汁|柠檬|青柠|橙|菠萝|蔓越莓|葡萄柚/.test(name)) return "果汁/水果"
      if (/糖浆|蜂蜜|石榴糖浆|糖/.test(name)) return "糖浆/甜味剂"
      if (/苦精|美思|君度|金巴利|阿佩罗|利口酒|查特/.test(name)) return "利口酒/加强酒"
      if (/皮|薄荷|樱桃|橄榄|装饰|盐|胡椒/.test(name)) return "装饰物"
      return "基酒/其他"
    }

    for (const c of all.rows) {
      if (!c.ingredients?.length) continue
      const needed = c.ingredients.map(i => {
        // 提取材料名：去掉用量前缀（支持中英文）
        return i.replace(/^[\d.,\s/½⅓¼]+/, "").replace(/^(毫升|克|个|根|滴|茶勺|汤勺|oz|ml|g|dash|barspoon|tsp|tbsp|ml|shot|ounce|杯|颗|片|撮|少许)\s*/, "i").trim()
      })
      const matchCount = needed.filter(n => {
        const nClean = n.replace(/\s+/g, "")
        return [...expandedIngs].some(m => {
          const mClean = m.replace(/\s+/g, "")
          return n.includes(m) || m.includes(n) || nClean.includes(mClean) || mClean.includes(nClean)
        })
      }).length
      const missing = needed.filter(n => ![...expandedIngs].some(m => n.replace(/\s+/g, "").includes(m.replace(/\s+/g, "")) || m.replace(/\s+/g, "").includes(n.replace(/\s+/g, ""))))
      missing.forEach((name) => { const current = missingCounts.get(name) || { name, count: 0, type: ingredientType(name) }; current.count++; missingCounts.set(name, current) })
      if (matchCount === needed.length) {
        matchable.push(c)
      } else if (matchCount >= needed.length - 1 && needed.length > 1) {
        partial.push({ ...c, missing_ingredients: missing })
      }
    }

    res.json({ matchable, partial, missingIngredients: [...missingCounts.values()].sort((a, b) => b.count - a.count), total: matchable.length + partial.length, barSize: myIngs.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ====== 酒单 API ======

// 获取我的酒单列表
app.get("/api/playlists", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, COUNT(pi.id) AS item_count
       FROM playlists p LEFT JOIN playlist_items pi ON p.id = pi.playlist_id
       WHERE p.user_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 创建酒单
app.post("/api/playlists", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body || {}
    if (!name) return res.status(400).json({ error: "酒单名不能为空" })
    const result = await db.query(
      "INSERT INTO playlists (user_id, name, description) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, name, description || ""]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 删除酒单
app.delete("/api/playlists/:id", authMiddleware, async (req, res) => {
  try {
    await db.query("DELETE FROM playlists WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 获取酒单中的酒款
app.get("/api/playlists/:id", authMiddleware, async (req, res) => {
  try {
    const pl = await db.query("SELECT * FROM playlists WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id])
    if (pl.rows.length === 0) return res.status(404).json({ error: "酒单不存在" })

    const items = await db.query(
      `SELECT c.* FROM playlist_items pi
       JOIN cocktails c ON pi.cocktail_eng = c.eng
       WHERE pi.playlist_id = $1
       ORDER BY pi.added_at DESC`,
      [req.params.id]
    )
    res.json({ playlist: pl.rows[0], cocktails: items.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/shared-playlists/:token", async (req, res) => {
  try {
    const pl = await db.query("SELECT id, name, description, is_public, share_token FROM playlists WHERE share_token = $1 AND is_public = TRUE", [req.params.token])
    if (!pl.rows.length) return res.status(404).json({ error: "公开酒单不存在" })
    const items = await db.query("SELECT c.* FROM playlist_items pi JOIN cocktails c ON pi.cocktail_eng = c.eng WHERE pi.playlist_id = $1 ORDER BY pi.added_at DESC", [pl.rows[0].id])
    res.json({ playlist: pl.rows[0], cocktails: items.rows, readonly: true })
  } catch (_) { res.status(500).json({ error: "读取公开酒单失败" }) }
})

app.patch("/api/playlists/:id/sharing", authMiddleware, async (req, res) => {
  try {
    const isPublic = !!req.body?.is_public
    const token = isPublic ? crypto.randomBytes(24).toString("hex") : null
    const result = await db.query("UPDATE playlists SET is_public=$1, share_token=$2 WHERE id=$3 AND user_id=$4 RETURNING id, is_public, share_token", [isPublic, token, req.params.id, req.user.id])
    if (!result.rows.length) return res.status(404).json({ error: "酒单不存在" })
    res.json(result.rows[0])
  } catch (_) { res.status(500).json({ error: "更新分享状态失败" }) }
})

// 添加酒款到酒单
app.post("/api/playlists/:id/items", authMiddleware, async (req, res) => {
  try {
    const { cocktail_eng } = req.body || {}
    await db.query(
      "INSERT INTO playlist_items (playlist_id, cocktail_eng) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [req.params.id, cocktail_eng]
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 从酒单中移除酒款
app.delete("/api/playlists/:id/items/:eng", authMiddleware, async (req, res) => {
  try {
    await db.query("DELETE FROM playlist_items WHERE playlist_id = $1 AND cocktail_eng = $2", [req.params.id, req.params.eng])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ====== 调酒笔记 API ======

// 获取所有笔记列表
app.get("/api/notes", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT n.*, c.chn, c.cat FROM notes n
       JOIN cocktails c ON n.cocktail_eng = c.eng
       WHERE n.user_id = $1
       ORDER BY n.updated_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// 获取某款酒的笔记
app.get("/api/notes/:eng", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM notes WHERE user_id = $1 AND cocktail_eng = $2",
      [req.user.id, req.params.eng]
    )
    res.json(result.rows[0] || null)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// 保存/更新笔记
app.put("/api/notes/:eng", authMiddleware, async (req, res) => {
  try {
    const { body } = req.body || {}
    const result = await db.query(
      `INSERT INTO notes (user_id, cocktail_eng, body) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, cocktail_eng) DO UPDATE SET body = $3, updated_at = NOW()
       RETURNING *`,
      [req.user.id, req.params.eng, body || ""]
    )
    res.json(result.rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// 删除笔记
app.delete("/api/notes/:eng", authMiddleware, async (req, res) => {
  try {
    await db.query("DELETE FROM notes WHERE user_id = $1 AND cocktail_eng = $2", [req.user.id, req.params.eng])
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ====== AI API ======

// ====== AI 角色 + 记忆 API ======

// 获取所有可用角色
app.get("/api/ai/personas", (req, res) => {
  res.json(listPersonas())
})

// 获取用户 AI 记忆
app.get("/api/ai/memory", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT preferred_tastes, preferred_occasions, preferred_persona, mood_history, interaction_count, last_mood, last_interaction_at FROM user_ai_memory WHERE user_id = $1",
      [req.user.id]
    )
    res.json(result.rows[0] || {
      preferred_tastes: [],
      preferred_occasions: [],
      preferred_persona: "xiaojiu",
      mood_history: [],
      interaction_count: 0,
      last_mood: null,
      last_interaction_at: null,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 更新用户偏好
app.put("/api/ai/memory", authMiddleware, async (req, res) => {
  try {
    const { preferred_tastes, preferred_occasions, preferred_persona, last_mood } = req.body || {}

    const existing = await db.query("SELECT mood_history FROM user_ai_memory WHERE user_id = $1", [req.user.id])

    let moodHistory = []
    if (existing.rows.length > 0) {
      moodHistory = existing.rows[0].mood_history || []
    }

    if (last_mood) {
      moodHistory.push({ mood: last_mood, at: new Date().toISOString() })
      if (moodHistory.length > 20) moodHistory = moodHistory.slice(-20)
    }

    await db.query(`
      INSERT INTO user_ai_memory (user_id, preferred_tastes, preferred_occasions, preferred_persona, mood_history, interaction_count, last_mood, last_interaction_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, 1, $6, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        preferred_tastes = COALESCE($2, user_ai_memory.preferred_tastes),
        preferred_occasions = COALESCE($3, user_ai_memory.preferred_occasions),
        preferred_persona = COALESCE($4, user_ai_memory.preferred_persona),
        mood_history = $5,
        interaction_count = user_ai_memory.interaction_count + 1,
        last_mood = COALESCE($6, user_ai_memory.last_mood),
        last_interaction_at = NOW(),
        updated_at = NOW()
    `, [
      req.user.id,
      preferred_tastes || null,
      preferred_occasions || null,
      preferred_persona || null,
      JSON.stringify(moodHistory),
      last_mood || null,
    ])

    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 获取鸡尾酒 AI 增强内容（先查缓存，无则生成）
app.get("/api/ai/enhancement/:eng", async (req, res) => {
  try {
    if (!AI_ENABLED) return res.status(503).json({ error: "AI功能暂未开启" })

    const { eng } = req.params

    // 1. 查缓存
    const cached = await db.query(
      "SELECT quantified, technique, adaptation, substitutions FROM ai_enhancements WHERE cocktail_eng = $1",
      [eng]
    )
    if (cached.rows.length > 0) {
      return res.json(cached.rows[0])
    }

    // 2. 获取鸡尾酒数据
    const cocktailResult = await db.query("SELECT * FROM cocktails WHERE eng = $1", [eng])
    if (cocktailResult.rows.length === 0) return res.status(404).json({ error: "未找到该鸡尾酒" })

    const cocktail = cocktailResult.rows[0]

    // 3. 调用 AI 生成
    const messages = generateCocktailEnhancementPrompt(cocktail)
    const aiText = await callAIWithRetry(messages, { temperature: 0.3, maxTokens: 3000 })
    const data = extractJSON(aiText)

    if (!data) throw new Error("AI 返回格式异常，无法解析 JSON")

    // 4. 存入缓存
    await db.query(
      `INSERT INTO ai_enhancements (cocktail_eng, quantified, technique, adaptation, substitutions)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (cocktail_eng) DO UPDATE SET
         quantified = $2, technique = $3, adaptation = $4, substitutions = $5, generated_at = NOW()`,
      [
        eng,
        data.quantified || null,
        data.technique || null,
        data.adaptation || null,
        data.substitutions || null,
      ]
    )

    // 5. 返回
    res.json({
      quantified: data.quantified,
      technique: data.technique,
      adaptation: data.adaptation,
      substitutions: data.substitutions,
    })
  } catch (err) {
    console.error("AI增强失败:", err.message)
    res.status(503).json({ error: "AI服务暂时不可用，请稍后再试" })
  }
})

// AI 智能推荐（带引用校验 + 规则降级）
app.post("/api/ai/recommend", async (req, res) => {
  try {
    if (!AI_ENABLED) return res.status(503).json({ error: "AI功能暂未开启" })

    const { mood, condition, occasion, tastePrefs, availableIngredients, nonAlcoholic, restrictions } = req.body || {}
    if (!mood && !condition && !occasion && (!tastePrefs || tastePrefs.length === 0) && (!availableIngredients || availableIngredients.length === 0)) {
      return res.status(400).json({ error: "请至少填写一项偏好信息" })
    }

    // 获取所有鸡尾酒
    const allCocktails = await db.query("SELECT eng, chn, cat, ingredients, method, taste_tags, difficulty, occasion, view_count FROM cocktails ORDER BY id")
    const cocktails = allCocktails.rows
    const validateRecipe = (cocktail) => {
      const ingredients = cocktail.ingredients || []
      const text = ingredients.join("、")
      const available = availableIngredients || []
      const missing = available.length ? ingredients.filter((item) => !available.some((owned) => item.includes(owned) || owned.includes(item))) : []
      const strong = ingredients.filter((item) => /金酒|伏特加|朗姆|龙舌兰|威士忌|白兰地|干邑/.test(item)).length
      const hasAcid = /柠檬|青柠|柑橘|葡萄柚|酸/.test(text)
      const hasSweet = /糖浆|蜂蜜|甜|利口酒|君度|果汁|可乐/.test(text)
      const words = [...(restrictions || []), ...(condition || "").split(/[，,、\s]+/).filter(Boolean)]
      const forbidden = words.filter((word) => (word.includes("乳") && /奶油|牛奶|乳/.test(text)) || (word.includes("蛋") && /蛋清|蛋/.test(text)) || (word.includes("坚果") && /杏仁|榛子|坚果/.test(text)) || (word.includes("咖啡") && /咖啡|浓缩/.test(text)) || (word.includes("低酒精") && strong >= 2))
      return { missingIngredients: missing, alcohol: nonAlcoholic ? "已选择无酒精，但请确认替代基酒" : strong >= 3 ? "酒精度偏高，建议降低基酒比例" : strong === 2 ? "酒精度中等，注意饮用量" : "酒精度较低", balance: hasAcid && hasSweet ? "甜酸结构基本完整" : "可能需要补充甜味或酸味", restrictions: forbidden, suitable: cocktail.method ? `${cocktail.method.method || "标准调法"} · ${cocktail.method.glass || "杯型按酒谱"}` : "请按酒谱方法和杯型制作" }
    }

    // 尝试 AI 推荐
    let result = null
    let usedFallback = false

    try {
      const summary = cocktails.map(c =>
        `- ${c.eng}（${c.chn}）| 分类:${c.cat} | 原料:${(c.ingredients||[]).join("、")} | 口感:${(c.taste_tags||[]).join("、")} | 场景:${(c.occasion||[]).join("、")} | 难度:${c.difficulty}/4`
      ).join("\n")

      const messages = generateRecommendationPrompt(
        { mood, condition, occasion, tastePrefs, availableIngredients, nonAlcoholic },
        summary
      )

      const aiText = await callAIWithRetry(messages, { temperature: 0.7, maxTokens: 2000 })
      const data = extractJSON(aiText)

      if (data?.recommendations?.length) {
        // 引用白名单校验
        const validation = validateCitations(data.recommendations, cocktails)
        console.log(`推荐校验: ${validation.validCount} 有效, ${validation.invalidCount} 无效（被过滤）`)

        if (validation.validCount >= 2) {
          // 校验通过
          const recommendations = validation.valid.map(rec => {
            const c = cocktails.find(co => co.eng === rec.eng)
             return c ? { ...c, aiReason: rec.reason, matchScore: rec.matchScore, matchDetails: rec.matchDetails, validation: validateRecipe(c) } : null
          }).filter(Boolean)

          result = {
            analysis: data.analysis || "",
            recommendations,
            generalAdvice: data.generalAdvice || "",
            safetyNote: data.safetyNote || "",
            _source: validation.invalidCount > 0 ? "ai-validated" : "ai",
            _filteredCount: validation.invalidCount,
          }
        }
      }
    } catch (aiErr) {
      console.error("AI推荐失败，降级到规则引擎:", aiErr.message)
    }

    // 降级：规则引擎
    if (!result) {
      usedFallback = true
      result = ruleBasedRecommend(
        { mood, condition, occasion, tastePrefs, availableIngredients, nonAlcoholic },
        cocktails
      )
      result.recommendations = (result.recommendations || []).map((rec) => ({ ...rec, validation: validateRecipe(rec) }))
    }

    res.json({ ...result, _fallback: usedFallback })
  } catch (err) {
    console.error("推荐服务失败:", err.message)
    res.status(503).json({ error: "推荐服务暂时不可用，请稍后再试" })
  }
})

// AI 自由对话（带降级 + 角色切换 + 记忆注入）
app.post("/api/ai/chat", async (req, res) => {
  try {
    if (!AI_ENABLED) return res.status(503).json({ error: "AI功能暂未开启" })

    const { messages, context, personaId } = req.body || {}
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "消息不能为空" })
    }

    // 选择角色
    const persona = getPersona(personaId || "xiaojiu") || getPersona("xiaojiu")

    // 加载用户记忆
    let memoryContext = ""
    const authHeader = req.headers.authorization
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "")
        const jwt = require("jsonwebtoken")
        const decoded = jwt.verify(token, jwtSecret)
        const mem = await db.query(
          "SELECT preferred_tastes, preferred_occasions, mood_history, interaction_count, last_mood, last_interaction_at FROM user_ai_memory WHERE user_id = $1",
          [decoded.id]
        )
        if (mem.rows.length > 0) {
          const m = mem.rows[0]
          const parts = []
          if (m.preferred_tastes?.length) parts.push(`常点口味：${m.preferred_tastes.join("、")}`)
          if (m.preferred_occasions?.length) parts.push(`常喝酒场景：${m.preferred_occasions.join("、")}`)
          if (m.interaction_count > 0) {
            parts.push(`这是你第 ${m.interaction_count + 1} 次光顾`)
            if (m.last_mood) parts.push(`上次来时心情：${m.last_mood}`)
          }
          if (parts.length) memoryContext = `\n\n===== 熟客记忆 =====\n${parts.join("\n")}\n根据记忆做个性化问候，但不要刻意提"上次""第X次"除非自然。`
        }
      } catch (_) {}
    }

    // 构建 system context
    let cocktailContext = ""
    if (context?.cocktailEng) {
      const c = await db.query("SELECT * FROM cocktails WHERE eng = $1", [context.cocktailEng])
      if (c.rows.length > 0) {
        const co = c.rows[0]
        cocktailContext = `\n\n用户正在查看的鸡尾酒：${co.chn}（${co.eng}）\n原料：${(co.ingredients||[]).join("、")}\n调制方法：${co.method?.method}\n口感：${(co.taste_tags||[]).join("、")}`
      }
    }

    const aiMessages = [
      { role: "system", content: persona.fullPrompt + memoryContext + cocktailContext },
      ...messages,
    ]

    let reply
    let fallback = false

    try {
      reply = await callAIWithRetry(aiMessages, { temperature: 0.7, maxTokens: 1500 })
    } catch (aiErr) {
      console.error("AI对话失败，使用降级回复:", aiErr.message)
      const lastUserMsg = [...messages].reverse().find(m => m.role === "user")
      reply = fallbackChatReply(lastUserMsg?.content || "")
      fallback = true
    }

    res.json({ reply, _fallback: fallback, persona: persona.id })
  } catch (err) {
    res.status(503).json({ error: "对话服务暂时不可用，请稍后再试" })
  }
})

// AI 流式对话（SSE — 带角色切换 + 记忆注入）
app.post("/api/ai/chat/stream", async (req, res) => {
  try {
    if (!AI_ENABLED) return res.status(503).json({ error: "AI功能暂未开启" })

    const { messages, context, personaId } = req.body || {}
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "消息不能为空" })
    }

    // 设置 SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    })

    // 选择角色
    const persona = getPersona(personaId || "xiaojiu") || getPersona("xiaojiu")

    // 加载用户记忆
    let memoryContext = ""
    const authHeader = req.headers.authorization
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "")
        const jwt = require("jsonwebtoken")
        const decoded = jwt.verify(token, jwtSecret)
        const mem = await db.query(
          "SELECT preferred_tastes, preferred_occasions, mood_history, interaction_count, last_mood, last_interaction_at FROM user_ai_memory WHERE user_id = $1",
          [decoded.id]
        )
        if (mem.rows.length > 0) {
          const m = mem.rows[0]
          const parts = []
          if (m.preferred_tastes?.length) parts.push(`常点口味：${m.preferred_tastes.join("、")}`)
          if (m.preferred_occasions?.length) parts.push(`常喝酒场景：${m.preferred_occasions.join("、")}`)
          if (m.interaction_count > 0) {
            parts.push(`这是你第 ${m.interaction_count + 1} 次光顾`)
            if (m.last_mood) parts.push(`上次来时心情：${m.last_mood}`)
          }
          if (parts.length) memoryContext = `\n\n===== 熟客记忆 =====\n${parts.join("\n")}\n根据记忆做个性化问候，但不要刻意提"上次""第X次"除非自然。`
        }
      } catch (_) {}
    }

    // 构建 cocktail context
    let cocktailContext = ""
    if (context?.cocktailEng) {
      const c = await db.query("SELECT * FROM cocktails WHERE eng = $1", [context.cocktailEng])
      if (c.rows.length > 0) {
        const co = c.rows[0]
        cocktailContext = `\n\n用户正在查看的鸡尾酒：${co.chn}（${co.eng}）\n原料：${(co.ingredients||[]).join("、")}\n调制方法：${co.method?.method}\n口感：${(co.taste_tags||[]).join("、")}`
      }
    }

    const aiMessages = [
      { role: "system", content: persona.fullPrompt + memoryContext + cocktailContext },
      ...messages,
    ]

    try {
      for await (const chunk of callAIStream(aiMessages, { temperature: 0.7, maxTokens: 1500 })) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
      }
      res.write("data: [DONE]\n\n")
    } catch (streamErr) {
      console.error("流式对话失败:", streamErr.message)
      // 流已开始，发送降级消息
      const lastUserMsg = [...messages].reverse().find(m => m.role === "user")
      const fallback = fallbackChatReply(lastUserMsg?.content || "")
      res.write(`data: ${JSON.stringify({ content: fallback, _fallback: true })}\n\n`)
      res.write("data: [DONE]\n\n")
    }

    res.end()
  } catch (err) {
    if (!res.headersSent) {
      res.status(503).json({ error: "流式对话服务暂时不可用" })
    } else {
      res.end()
    }
  }
})

// ====== 详细调酒记录 API ======
app.get("/api/making-logs", authMiddleware, async (req, res) => {
  try { const result = await db.query(`SELECT l.*, c.chn FROM cocktail_making_logs l LEFT JOIN cocktails c ON c.eng = l.cocktail_eng WHERE l.user_id = $1 ORDER BY l.made_at DESC, l.created_at DESC`, [req.user.id]); res.json(result.rows) }
  catch (_) { res.status(500).json({ error: "读取调酒记录失败" }) }
})
app.post("/api/making-logs", authMiddleware, async (req, res) => {
  try { const { cocktail_eng, made_at, brands = [], rating, recipe_modified = false, modification_note, next_time_note, visibility = "private" } = req.body || {}; if (!cocktail_eng || !made_at) return res.status(400).json({ error: "酒款和日期不能为空" }); const isPublic = visibility === "public"; const result = await db.query(`INSERT INTO cocktail_making_logs (user_id,cocktail_eng,made_at,brands,rating,recipe_modified,modification_note,next_time_note,visibility,moderation_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [req.user.id, cocktail_eng, made_at, JSON.stringify(Array.isArray(brands) ? brands : []), rating || null, !!recipe_modified, modification_note || null, next_time_note || null, isPublic ? "public" : "private", isPublic ? "pending" : "private"]); res.status(201).json(result.rows[0]) }
  catch (_) { res.status(500).json({ error: "保存调酒记录失败" }) }
})
app.post("/api/making-logs/:id/photo", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "请选择 JPG、PNG 或 WebP 图片" })
    if (!validImageSignature(req.file.path)) { fs.unlink(req.file.path, () => {}); return res.status(400).json({ error: "图片文件内容无效" }) }
    const previous = await db.query("SELECT photo_url FROM cocktail_making_logs WHERE id=$1 AND user_id=$2", [req.params.id, req.user.id])
    const result = await db.query("UPDATE cocktail_making_logs SET photo_url=$1, updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING photo_url", [`/uploads/making-logs/${req.file.filename}`, req.params.id, req.user.id])
    if (!result.rows.length) { fs.unlinkSync(req.file.path); return res.status(404).json({ error: "记录不存在" }) }
    if (previous.rows[0]?.photo_url) { const old = path.join(__dirname, previous.rows[0].photo_url.replace(/^\/uploads\//, "uploads/")); if (old !== req.file.path) fs.unlink(old, () => {}) }
    res.json(result.rows[0])
  } catch (_) { if (req.file) fs.unlink(req.file.path, () => {}); res.status(500).json({ error: "上传照片失败" }) }
})
app.delete("/api/making-logs/:id", authMiddleware, async (req, res) => {
  try {
    const result = await db.query("DELETE FROM cocktail_making_logs WHERE id = $1 AND user_id = $2 RETURNING id, photo_url", [req.params.id, req.user.id])
    if (!result.rows.length) return res.status(404).json({ error: "记录不存在" })
    if (result.rows[0].photo_url) fs.unlink(path.join(__dirname, result.rows[0].photo_url.replace(/^\/uploads\//, "uploads/")), () => {})
    res.json({ ok: true })
  } catch (_) { res.status(500).json({ error: "删除调酒记录失败" }) }
})
app.put("/api/making-logs/:id", authMiddleware, async (req, res) => {
  try {
    const { made_at, brands = [], rating, recipe_modified = false, modification_note, next_time_note, visibility } = req.body || {}
    const result = await db.query(`UPDATE cocktail_making_logs SET made_at=$1, brands=$2, rating=$3, recipe_modified=$4, modification_note=$5, next_time_note=$6, visibility=CASE WHEN $9='public' THEN 'public' ELSE 'private' END, moderation_status=CASE WHEN $9='public' THEN 'pending' ELSE 'private' END, updated_at=NOW() WHERE id=$7 AND user_id=$8 RETURNING *`, [made_at, JSON.stringify(Array.isArray(brands) ? brands : []), rating || null, !!recipe_modified, modification_note || null, next_time_note || null, req.params.id, req.user.id, visibility])
    if (!result.rows.length) return res.status(404).json({ error: "记录不存在" })
    res.json(result.rows[0])
  } catch (_) { res.status(500).json({ error: "更新调酒记录失败" }) }
})

// ====== 调配/品尝记录 API ======

// 获取用户的调配和品尝统计
app.get("/api/experience", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT cocktail_eng, action, created_at FROM cocktail_experience WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    )
    const made = result.rows.filter((r) => r.action === "made")
    const tasted = result.rows.filter((r) => r.action === "tasted")
    res.json({
      made: made.map((r) => r.cocktail_eng),
      tasted: tasted.map((r) => r.cocktail_eng),
      made_count: made.length,
      tasted_count: tasted.length,
      total: result.rows.length,
    })
  } catch (err) {
    console.error("获取经验记录失败:", err.message)
    res.status(503).json({ error: "服务暂时不可用" })
  }
})

// 标记/取消标记
app.post("/api/experience/:eng", authMiddleware, async (req, res) => {
  try {
    const { eng } = req.params
    const { action } = req.body // 'made' | 'tasted'

    if (!action || !["made", "tasted"].includes(action)) {
      return res.status(400).json({ error: "action 必须是 made 或 tasted" })
    }

    // 检查鸡尾酒是否存在
    const cocktail = await db.query("SELECT eng FROM cocktails WHERE eng = $1", [eng])
    if (cocktail.rows.length === 0) {
      return res.status(404).json({ error: "鸡尾酒不存在" })
    }

    // 检查是否已存在 → toggle
    const existing = await db.query(
      "SELECT id FROM cocktail_experience WHERE user_id = $1 AND cocktail_eng = $2 AND action = $3",
      [req.user.id, eng, action]
    )

    if (existing.rows.length > 0) {
      // 已存在 → 删除（取消标记）
      await db.query("DELETE FROM cocktail_experience WHERE id = $1", [existing.rows[0].id])
      res.json({ ok: true, added: false, action })
    } else {
      // 不存在 → 添加
      await db.query(
        "INSERT INTO cocktail_experience (user_id, cocktail_eng, action) VALUES ($1, $2, $3)",
        [req.user.id, eng, action]
      )
      res.json({ ok: true, added: true, action })
    }
  } catch (err) {
    console.error("标记经验失败:", err.message)
    res.status(503).json({ error: "保存失败" })
  }
})

// ====== 评分系统 API ======

// 获取某款酒的所有评分
app.get("/api/ratings/:eng", async (req, res) => {
  try {
    const { eng } = req.params

    // 平均分和评分数量
    const stats = await db.query(
      "SELECT COUNT(*)::int AS count, COALESCE(ROUND(AVG(rating), 1), 0) AS avg FROM cocktail_ratings WHERE cocktail_eng = $1",
      [eng]
    )

    // 评分列表（带用户昵称）
    const reviews = await db.query(
      `SELECT cr.id, cr.rating, cr.comment, cr.created_at, u.nickname
       FROM cocktail_ratings cr
       LEFT JOIN users u ON cr.user_id = u.id
       WHERE cr.cocktail_eng = $1 AND cr.is_hidden = FALSE
       ORDER BY cr.updated_at DESC, cr.created_at DESC
       LIMIT 50`,
      [eng]
    )

    // 如果已登录，获取当前用户的评分
    let myRating = null
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken")
        const decoded = jwt.verify(authHeader.replace("Bearer ", ""), jwtSecret)
        if (decoded?.id) {
          const my = await db.query(
            "SELECT id, rating, comment FROM cocktail_ratings WHERE cocktail_eng = $1 AND user_id = $2",
            [eng, decoded.id]
          )
          if (my.rows.length > 0) myRating = my.rows[0]
        }
      } catch (e) { /* ignore */ }
    }

    res.json({
      stats: stats.rows[0],
      reviews: reviews.rows,
      my: myRating,
    })
  } catch (err) {
    console.error("获取评分失败:", err.message)
    res.status(503).json({ error: "评分服务暂时不可用" })
  }
})

// 提交/更新评分
app.post("/api/ratings/:eng", authMiddleware, async (req, res) => {
  try {
    const { eng } = req.params
    const { rating, comment } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "评分必须在 1-5 之间" })
    }

    // 检查鸡尾酒是否存在
    const cocktail = await db.query("SELECT eng FROM cocktails WHERE eng = $1", [eng])
    if (cocktail.rows.length === 0) {
      return res.status(404).json({ error: "鸡尾酒不存在" })
    }

    await db.query(
      `INSERT INTO cocktail_ratings (user_id, cocktail_eng, rating, comment, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, cocktail_eng)
       DO UPDATE SET rating = $3, comment = $4, updated_at = NOW()`,
      [req.user.id, eng, rating, comment || null]
    )

    // 返回更新后的统计
    const stats = await db.query(
      "SELECT COUNT(*)::int AS count, COALESCE(ROUND(AVG(rating), 1), 0) AS avg FROM cocktail_ratings WHERE cocktail_eng = $1",
      [eng]
    )

    res.json({ ok: true, stats: stats.rows[0] })
  } catch (err) {
    console.error("保存评分失败:", err.message)
    res.status(503).json({ error: "保存失败" })
  }
})

// 删除评分
app.delete("/api/ratings/:eng", authMiddleware, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM cocktail_ratings WHERE cocktail_eng = $1 AND user_id = $2",
      [req.params.eng, req.user.id]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error("删除评分失败:", err.message)
    res.status(503).json({ error: "删除失败" })
  }
})

// 高分榜单
app.get("/api/ratings/top/list", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const result = await db.query(
      `SELECT c.eng, c.chn, c.cat, c.ingredients,
              COUNT(cr.id)::int AS rating_count,
              COALESCE(ROUND(AVG(cr.rating), 1), 0) AS rating_avg
       FROM cocktails c
       LEFT JOIN cocktail_ratings cr ON c.eng = cr.cocktail_eng
       GROUP BY c.id
       HAVING COUNT(cr.id) > 0
       ORDER BY rating_avg DESC, rating_count DESC
       LIMIT $1`,
      [limit]
    )
    res.json({ top: result.rows })
  } catch (err) {
    console.error("获取高分榜失败:", err.message)
    res.status(503).json({ error: "榜单服务暂时不可用" })
  }
})

// ====== 口味测试 API ======

app.post("/api/taste-test", async (req, res) => {
  try {
    const { answers } = req.body // { sweetness, sourness, bitterness, strength, texture, occasion }
    if (!answers) return res.status(400).json({ error: "缺少答题数据" })

    // 将答案映射为口味标签权重
    const tasteWeights = {}

    // 甜度: 1=不甜 2=微甜 3=中等 4=很甜
    if (answers.sweetness <= 2) tasteWeights["清爽"] = (tasteWeights["清爽"] || 0) + 2
    if (answers.sweetness >= 3) tasteWeights["甜味"] = (tasteWeights["甜味"] || 0) + answers.sweetness
    if (answers.sweetness >= 3) tasteWeights["果香"] = (tasteWeights["果香"] || 0) + 1

    // 酸度: 1=不要酸 2=微酸 3=中等 4=喜欢酸
    if (answers.sourness >= 3) tasteWeights["酸甜"] = (tasteWeights["酸甜"] || 0) + answers.sourness
    if (answers.sourness >= 2) tasteWeights["清爽"] = (tasteWeights["清爽"] || 0) + 1

    // 苦味: 1=完全不行 2=一点点 3=中等 4=喜欢苦
    if (answers.bitterness >= 3) tasteWeights["苦味"] = (tasteWeights["苦味"] || 0) + answers.bitterness
    if (answers.bitterness >= 3) tasteWeights["草本"] = (tasteWeights["草本"] || 0) + 1

    // 酒精度: 1=无酒精 2=低度 3=中等 4=高度
    if (answers.strength >= 4) tasteWeights["烈"] = (tasteWeights["烈"] || 0) + 3
    if (answers.strength <= 2) tasteWeights["清爽"] = (tasteWeights["清爽"] || 0) + 2

    // 口感: 清爽/丝滑/厚重/气泡
    if (answers.texture === "清爽") tasteWeights["清爽"] = (tasteWeights["清爽"] || 0) + 3
    if (answers.texture === "丝滑") { tasteWeights["奶油"] = (tasteWeights["奶油"] || 0) + 3; tasteWeights["甜味"] = (tasteWeights["甜味"] || 0) + 1 }
    if (answers.texture === "厚重") { tasteWeights["烈"] = (tasteWeights["烈"] || 0) + 2; tasteWeights["苦味"] = (tasteWeights["苦味"] || 0) + 1 }

    // 找到权重最高的 3 个口味标签
    const topTastes = Object.entries(tasteWeights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t]) => t)

    // 场景映射
    const occasionMap = {
      "独自小酌": ["餐后", "酒吧特调"],
      "朋友聚会": ["派对", "夏日"],
      "约会": ["酒吧特调", "餐前"],
      "佐餐": ["餐前", "餐后"],
      "睡前": ["餐后", "冬季"],
      "夏日": ["夏日", "派对"],
    }
    const preferredOccasions = occasionMap[answers.occasion] || []

    // 难度偏好：根据酒精度偏好映射
    const strengthDifficulty = answers.strength <= 2 ? [1, 2] : answers.strength === 3 ? [1, 2, 3] : [2, 3, 4]

    // 查询匹配的鸡尾酒
    const allCocktails = await db.query(
      "SELECT eng, chn, cat, ingredients, taste_tags, difficulty, occasion FROM cocktails"
    )

    // 打分
    const scored = allCocktails.rows.map((c) => {
      let score = 0
      const reasons = []

      // 口味标签匹配（最重要）
      if (c.taste_tags) {
        c.taste_tags.forEach((tag) => {
          if (topTastes.includes(tag)) {
            score += 15
            if (!reasons.includes(`口味:${tag}`)) reasons.push(`口味:${tag}`)
          }
        })
      }

      // 场景匹配
      if (c.occasion && preferredOccasions.length > 0) {
        const occasionMatch = c.occasion.some((o) => preferredOccasions.includes(o))
        if (occasionMatch) {
          score += 10
          reasons.push("场景匹配")
        }
      }

      // 难度匹配
      if (c.difficulty && strengthDifficulty.includes(c.difficulty)) {
        score += 5
      }

      // 去除非酒精版（除非用户选无酒精）
      if (answers.strength === 1) {
        if (c.eng.includes("Virgin") || c.chn?.includes("无酒精")) score += 10
      }

      return { ...c, _score: score, _reasons: reasons }
    })

    // 排序取 top 5
    const top = scored
      .filter((c) => c._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 5)
      .map(({ _score, _reasons, ...c }) => ({
        eng: c.eng,
        chn: c.chn,
        cat: c.cat,
        ingredients: c.ingredients?.slice(0, 3),
        taste_tags: c.taste_tags,
        difficulty: c.difficulty,
        matchScore: _score,
        matchReasons: _reasons,
      }))

    res.json({
      profile: {
        topTastes,
        preferredOccasions,
        summary: generateProfileSummary(topTastes, answers),
      },
      recommendations: top,
    })
  } catch (err) {
    console.error("口味测试失败:", err.message)
    res.status(503).json({ error: "口味测试服务暂时不可用" })
  }
})

function generateProfileSummary(tastes, answers) {
  const textureLabels = { "清爽": "清爽通透的口感", "丝滑": "丝滑绵密的口感", "厚重": "厚重饱满的口感", "气泡": "气泡跳跃的活力" }
  const strengthLabels = { 1: "无酒精或极低酒精", 2: "低酒精度，轻松饮用", 3: "中等酒精度，恰到好处", 4: "高度烈酒，直击灵魂" }
  const lines = [
    `你的味蕾偏好：${tastes.join(" · ")}`,
    `口感倾向：${textureLabels[answers.texture] || "平衡口感"}`,
    `酒精度：${strengthLabels[answers.strength] || "适中"}`,
  ]
  return lines.join("；")
}

// ====== 调酒百科 API ======

app.get("/api/encyclopedia", async (req, res) => {
  try {
    const categories = listCategories()
    const extra = await db.query("SELECT content->>'category' AS category, COUNT(*)::int AS count FROM published_community_content WHERE content_type='encyclopedia' GROUP BY content->>'category'")
    extra.rows.forEach((row) => { const category = categories.find((item) => item.key === row.category); if (category) category.entryCount += row.count })
    res.json({ categories })
  } catch (err) {
    res.status(503).json({ error: "百科服务暂时不可用" })
  }
})

app.get("/api/encyclopedia/:category", async (req, res) => {
  try {
    const cat = getCategory(req.params.category)
    if (!cat) return res.status(404).json({ error: "分类不存在" })
    const extra = await db.query("SELECT id, title, summary, content FROM published_community_content WHERE content_type='encyclopedia' AND content->>'category'=$1 ORDER BY created_at DESC", [req.params.category])
    cat.entries = [...cat.entries, ...extra.rows.map((row) => ({ id: `community_${row.id}`, title: row.title, summary: row.summary, detail: [{ subtitle: "社区贡献", content: row.content.body || row.content.answer || "" }] }))]
    res.json(cat)
  } catch (err) {
    res.status(503).json({ error: "百科服务暂时不可用" })
  }
})

app.get("/api/encyclopedia/search/:query", (req, res) => {
  try {
    const results = searchEntries(req.params.query)
    res.json({ results })
  } catch (err) {
    res.status(503).json({ error: "搜索服务暂时不可用" })
  }
})

// ====== 学习卡片 API ======

// 内存缓存：启动时生成一次卡片数据
let cachedCards = null
let cardsLoadedAt = 0

async function loadAllCards() {
  // 缓存5分钟
  if (cachedCards && Date.now() - cardsLoadedAt < 5 * 60 * 1000) {
    return cachedCards
  }

  // 从数据库加载鸡尾酒数据
  const cocktails = await db.query("SELECT eng, chn, cat, ingredients FROM cocktails ORDER BY eng")
  const methodsData = await db.query("SELECT eng, method FROM cocktails WHERE method IS NOT NULL")

  // 构建 methods map（method 是 JSONB 列）
  const methodsMap = {}
  methodsData.rows.forEach((r) => {
    if (r.method && typeof r.method === "object") {
      methodsMap[r.eng] = r.method
    }
  })

  // 加载 tips 和 attributes 从 JSON 文件
  const fs = require("fs")
  const path = require("path")
  let tipsMap = {}
  let attrsMap = {}
  try {
    const tipsData = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "cocktail-tips.json"), "utf-8"))
    tipsData.forEach((t) => { tipsMap[t.eng] = t.tip })
  } catch (e) { /* ignore */ }
  try {
    const attrsData = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "cocktail-attributes.json"), "utf-8"))
    attrsData.forEach((a) => { attrsMap[a.eng] = a })
  } catch (e) { /* ignore */ }

  const generated = generateCocktailCards(cocktails.rows, methodsMap, tipsMap, attrsMap)
  const community = await db.query("SELECT id, title, summary, content FROM published_community_content WHERE content_type='flashcard' ORDER BY created_at DESC")
  const communityCards = community.rows.map((row) => ({ id: `community_${row.id}`, category: row.content.category || "community", question: row.content.question || row.title, answer: row.content.answer || row.summary || "", hint: row.content.hint || "社区贡献", difficulty: Number(row.content.difficulty) || 1 }))
  cachedCards = [...STATIC_CARDS, ...generated, ...communityCards]
  cardsLoadedAt = Date.now()
  return cachedCards
}

app.get("/api/flashcards", async (req, res) => {
  try {
    const { category, difficulty } = req.query
    let cards = await loadAllCards()

    if (category) {
      cards = cards.filter((c) => c.category === category)
    }
    if (difficulty) {
      cards = cards.filter((c) => c.difficulty === parseInt(difficulty))
    }

    // 随机打乱
    const shuffled = [...cards].sort(() => Math.random() - 0.5)

    // 如果已登录，加载进度并标记已掌握的卡片
    const authHeader = req.headers.authorization
    let masteredIds = new Set()
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken")
        const decoded = jwt.verify(authHeader.replace("Bearer ", ""), jwtSecret)
        if (decoded?.id) {
          const progress = await db.query(
            "SELECT card_id FROM flashcard_progress WHERE user_id = $1 AND mastered = TRUE",
            [decoded.id]
          )
          progress.rows.forEach((r) => masteredIds.add(r.card_id))
        }
      } catch (e) { /* token invalid, ignore */ }
    }

    res.json({
      cards: shuffled,
      total: shuffled.length,
      categories: [...new Set(shuffled.map((c) => c.category))],
      mastered: [...masteredIds],
    })
  } catch (err) {
    console.error("获取卡片失败:", err.message)
    res.status(503).json({ error: "卡片服务暂时不可用" })
  }
})

app.get("/api/flashcards/progress", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT card_id, mastered, reviewed_at FROM flashcard_progress WHERE user_id = $1 ORDER BY reviewed_at DESC",
      [req.user.id]
    )
    const mastered = result.rows.filter((r) => r.mastered).map((r) => r.card_id)
    const reviewed = result.rows.filter((r) => !r.mastered).map((r) => r.card_id)
    res.json({
      total_reviewed: result.rows.length,
      mastered_count: mastered.length,
      mastered,
      reviewed,
      activity: result.rows.map((r) => ({ card_id: r.card_id, mastered: r.mastered, reviewed_at: r.reviewed_at })),
    })
  } catch (err) {
    console.error("获取进度失败:", err.message)
    res.status(503).json({ error: "进度服务暂时不可用" })
  }
})

app.post("/api/flashcards/progress", authMiddleware, async (req, res) => {
  try {
    const { card_id, mastered } = req.body
    if (!card_id) {
      return res.status(400).json({ error: "缺少 card_id" })
    }
    await db.query(
      `INSERT INTO flashcard_progress (user_id, card_id, mastered, reviewed_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, card_id)
       DO UPDATE SET mastered = $3, reviewed_at = NOW()`,
      [req.user.id, card_id, !!mastered]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error("保存进度失败:", err.message)
    res.status(503).json({ error: "保存失败" })
  }
})

mountAuthRoutes(app, db)

app.listen(port, () => {
  console.log(`后端运行在端口 ${port}`)
})
