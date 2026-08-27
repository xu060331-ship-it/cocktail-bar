const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("./config")

const JWT_EXPIRES = "7d"

// ====== 认证中间件 ======
function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "请先登录" })
  }

  try {
    const token = header.split(" ")[1]
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded  // { id, email, nickname }
    next()
  } catch (err) {
    return res.status(401).json({ error: "登录已过期，请重新登录" })
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (!process.env.ADMIN_EMAIL || req.user.email !== process.env.ADMIN_EMAIL) return res.status(403).json({ error: "没有管理权限" })
    next()
  })
}

// ====== 挂载路由到 app ======
function mountAuthRoutes(app, db) {

  // 注册
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, nickname } = req.body || {}

      if (!email || !password) {
        return res.status(400).json({ error: "邮箱和密码不能为空" })
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "请输入正确的邮箱格式" })
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "密码至少6位" })
      }

      // 检查邮箱是否已注册
      const exist = await db.query("SELECT id FROM users WHERE email = $1", [email])
      if (exist.rows.length > 0) {
        return res.status(409).json({ error: "该邮箱已注册" })
      }

      // bcrypt 加密密码
      const password_hash = await bcrypt.hash(password, 10)

      const result = await db.query(
        "INSERT INTO users (email, password_hash, nickname) VALUES ($1, $2, $3) RETURNING id, email, nickname, created_at",
        [email, password_hash, nickname || email.split("@")[0]]
      )

      const user = result.rows[0]

      // 签发 JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, nickname: user.nickname },
        jwtSecret,
        { expiresIn: JWT_EXPIRES }
      )

      res.status(201).json({ token, user: { id: user.id, email: user.email, nickname: user.nickname } })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // 登录
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body || {}

      if (!email || !password) {
        return res.status(400).json({ error: "邮箱和密码不能为空" })
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "请输入正确的邮箱格式" })
      }

      // 查用户
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "邮箱或密码错误" })
      }

      const user = result.rows[0]

      // 验证密码
      const match = await bcrypt.compare(password, user.password_hash)
      if (!match) {
        return res.status(401).json({ error: "邮箱或密码错误" })
      }

      // 签发 JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, nickname: user.nickname },
        jwtSecret,
        { expiresIn: JWT_EXPIRES }
      )

      res.json({ token, user: { id: user.id, email: user.email, nickname: user.nickname } })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // 获取当前用户信息
  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
      const result = await db.query("SELECT id, email, nickname, created_at FROM users WHERE id = $1", [req.user.id])
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "用户不存在" })
      }
      res.json(result.rows[0])
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })
}

module.exports = { mountAuthRoutes, authMiddleware, adminMiddleware }
