import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../lib/auth"
import { fetchAPI } from "../lib/api"
import { cocktailImg } from "../lib/images"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Heart, LogOut, ChevronRight, Clock } from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState("favorites") // "favorites" | "history"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem("token")
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const favReq = fetchAPI("/api/favorites", authHeaders)
    const histReq = fetchAPI("/api/history", authHeaders)
    Promise.all([favReq, histReq])
      .then(([fav, hist]) => { setFavorites(fav); setHistory(hist); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">请先登录</p>
          <Link to="/" className="text-sm text-[var(--color-accent)] hover:underline">返回首页</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5">
        {/* 用户信息 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3">MY PROFILE</p>
              <h1 className="text-4xl text-white font-serif">{user.nickname || "调酒爱好者"}</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-[var(--color-text-gray)] hover:text-white transition-colors border border-[var(--color-border)] rounded-full px-4 py-2"
            >
              <LogOut size={14} strokeWidth={1.5} />
              退出登录
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
              <p className="text-3xl text-[var(--color-accent)] font-bold mb-1">{favorites.length}</p>
              <p className="text-xs text-[var(--color-text-muted)]">已收藏</p>
            </div>
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
              <p className="text-3xl text-[var(--color-accent)] font-bold mb-1">{history.length}</p>
              <p className="text-xs text-[var(--color-text-muted)]">浏览记录</p>
            </div>
          </div>
        </motion.div>

        {/* 收藏 / 历史 Tab 切换 */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`text-sm flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
                activeTab === "favorites" ? "text-white border-[var(--color-accent)]" : "text-[var(--color-text-muted)] border-transparent hover:text-white"
              }`}
            >
              <Heart size={14} strokeWidth={1.5} />
              收藏 ({favorites.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`text-sm flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
                activeTab === "history" ? "text-white border-[var(--color-accent)]" : "text-[var(--color-text-muted)] border-transparent hover:text-white"
              }`}
            >
              <Clock size={14} strokeWidth={1.5} />
              浏览记录 ({history.length})
            </button>
          </div>

          {loading && (
            <p className="text-sm text-[var(--color-text-muted)] animate-pulse">加载中...</p>
          )}

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {!loading && activeTab === "favorites" && favorites.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--color-text-muted)] mb-4">还没有收藏任何鸡尾酒</p>
              <Link to="/cocktails" className="text-sm text-[var(--color-accent)] hover:underline flex items-center justify-center gap-1">
                去酒谱看看 <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {!loading && activeTab === "history" && history.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--color-text-muted)] mb-4">还没有浏览记录</p>
              <Link to="/cocktails" className="text-sm text-[var(--color-accent)] hover:underline flex items-center justify-center gap-1">
                去酒谱看看 <ArrowRight size={14} />
              </Link>
            </div>
          )}

          <AnimatePresence>
            <div className="space-y-3">
              {(activeTab === "favorites" ? favorites : history).map((c, i) => (
                <motion.div
                  key={c.eng}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/cocktails/${encodeURIComponent(c.eng)}`}
                    className="flex items-center gap-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-accent)] transition-all group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-[var(--color-accent-dim)] overflow-hidden shrink-0">
                      <img src={cocktailImg(c.eng)} alt={c.eng} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-white font-serif group-hover:text-[var(--color-accent)] transition-colors">
                        {c.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || c.eng}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)] italic">{c.eng}</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {c.taste_tags?.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                    <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  )
}
