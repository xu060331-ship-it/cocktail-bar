import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Sparkles, BarChart3, Trophy, Filter, Loader2 } from "lucide-react"
import FlashCard from "../components/FlashCard"
import { fetchAPI } from "../lib/api"
import { useAuth } from "../lib/auth"

const CATEGORY_OPTIONS = [
  { key: "", label: "全部" },
  { key: "cocktail", label: "🍸 鸡尾酒" },
  { key: "technique", label: "🔧 手法" },
  { key: "spirit", label: "🥃 基酒" },
  { key: "term", label: "📖 术语" },
  { key: "glassware", label: "🍷 杯型" },
  { key: "recipe", label: "🍹 配方" },
  { key: "tip", label: "💡 提醒" },
]

export default function LearnPage() {
  const { user } = useAuth()
  const [cards, setCards] = useState([])
  const [filteredCards, setFilteredCards] = useState([])
  const [masteredIds, setMasteredIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [category, setCategory] = useState("")
  const [stats, setStats] = useState({ total: 0, mastered: 0, reviewed: 0 })

  // Load cards
  const loadCards = useCallback(async () => {
    setLoading(true)
    try {
      const params = category ? `?category=${category}` : ""
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const data = await fetchAPI(`/api/flashcards${params}`, { headers })
      setCards(data.cards)
      setMasteredIds(data.mastered || [])
      setStats({
        total: data.total || data.cards.length,
        mastered: data.mastered?.length || 0,
        reviewed: 0,
      })
    } catch (err) {
      console.error("加载卡片失败:", err.message)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  // Filter cards by category (client-side for already loaded)
  useEffect(() => {
    if (!category) {
      setFilteredCards(cards)
    } else {
      setFilteredCards(cards.filter((c) => c.category === category))
    }
  }, [cards, category])

  // Load progress separately
  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem("token")
    fetchAPI("/api/flashcards/progress", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setMasteredIds(data.mastered || [])
        setStats((prev) => ({
          ...prev,
          mastered: data.mastered_count || 0,
          reviewed: data.total_reviewed || 0,
        }))
      })
      .catch(() => {})
  }, [user])

  const handleMaster = async (cardId) => {
    setSavingId(cardId)
    // Optimistic update
    if (!masteredIds.includes(cardId)) {
      setMasteredIds((prev) => [...prev, cardId])
      setStats((prev) => ({ ...prev, mastered: prev.mastered + 1 }))
    }
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await fetchAPI("/api/flashcards/progress", {
          method: "POST",
          body: { card_id: cardId, mastered: true },
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch (err) {
      // Revert on error
      setMasteredIds((prev) => prev.filter((id) => id !== cardId))
      setStats((prev) => ({ ...prev, mastered: Math.max(0, prev.mastered - 1) }))
    } finally {
      setSavingId(null)
    }
  }

  const handleReview = async (cardId) => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await fetchAPI("/api/flashcards/progress", {
          method: "POST",
          body: { card_id: cardId, mastered: false },
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch (err) {
      // Silent fail for review
    }
  }

  const masteryPercent = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={18} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <p className="text-xs tracking-[0.3em] text-[var(--color-accent)]">调酒知识训练</p>
          </div>
          <h1 className="text-5xl text-white font-serif mb-3">学习卡片</h1>
          <p className="text-[var(--color-text-gray)] text-lg">
            翻转卡片，掌握调酒知识。从入门到高级，像刷单词一样刷鸡尾酒。
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 text-center">
            <BarChart3 size={18} strokeWidth={1.5} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
            <p className="text-2xl text-white font-medium">{stats.total}</p>
            <p className="text-[10px] text-[var(--color-text-muted)] tracking-wider">卡片总数</p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 text-center">
            <Trophy size={18} strokeWidth={1.5} className="mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl text-white font-medium">{stats.mastered}</p>
            <p className="text-[10px] text-[var(--color-text-muted)] tracking-wider">已掌握</p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 text-center">
            <div className="relative w-[72px] h-[72px] mx-auto mb-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-border)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${masteryPercent * 0.942} 94.2`}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm text-white font-medium">
                {masteryPercent}%
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] tracking-wider">掌握率</p>
          </div>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none"
        >
          <Filter size={14} strokeWidth={1.5} className="text-[var(--color-text-muted)] shrink-0" />
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setCategory(opt.key)}
              className={`
                shrink-0 text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200
                ${category === opt.key
                  ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] border-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-white"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </motion.div>

        {/* FlashCard component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <FlashCard
            cards={filteredCards}
            masteredIds={masteredIds}
            onMaster={handleMaster}
            onReview={handleReview}
            loading={loading}
          />
        </motion.div>

        {/* Login prompt */}
        {!user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 pt-8 border-t border-[var(--color-border)]"
          >
            <p className="text-xs text-[var(--color-text-muted)]">
              登录后可保存学习进度 · 支持键盘操作 ← → 空格
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
