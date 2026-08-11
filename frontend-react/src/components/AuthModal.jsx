import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../lib/auth"
import { X, Mail, Lock, User, Loader2 } from "lucide-react"

export default function AuthModal({ open, onClose, initialMode = "login" }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState(initialMode)

  // 每次弹窗打开时同步模式
  useEffect(() => {
    if (open) setMode(initialMode)
  }, [open, initialMode]) // "login" | "register"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function reset() {
    setError("")
    setMode("login")
    setEmail("")
    setPassword("")
    setNickname("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await register(email, password, nickname)
      }
      reset()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function switchMode() {
    setError("")
    setMode(mode === "login" ? "register" : "login")
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* 弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-sm mx-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 shadow-2xl"
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {/* 标题 */}
            <h2 className="text-xl text-[var(--color-text-main)] font-serif mb-6">
              {mode === "login" ? "登录" : "注册"}
            </h2>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="relative">
                  <User size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="昵称（选填）"
                    className="w-full bg-[var(--color-bg-page)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="邮箱"
                  required
                  className="w-full bg-[var(--color-bg-page)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>

              <div className="relative">
                <Lock size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="密码（至少6位）"
                  required
                  minLength={6}
                  className="w-full bg-[var(--color-bg-page)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>

              {/* 错误提示 */}
              {error && (
                <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-4 py-2">{error}</p>
              )}

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[var(--color-accent)] text-[var(--color-bg-page)] py-3 rounded-xl text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {mode === "login" ? "登录" : "注册"}
              </button>
            </form>

            {/* 切换模式 */}
            <p className="text-xs text-[var(--color-text-muted)] text-center mt-5">
              {mode === "login" ? "还没有账号？" : "已有账号？"}
              <button
                onClick={switchMode}
                className="text-[var(--color-accent)] hover:underline ml-1"
              >
                {mode === "login" ? "立即注册" : "去登录"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
