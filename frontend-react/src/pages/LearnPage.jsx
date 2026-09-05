import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Sparkles, BarChart3, Trophy, Filter, Loader2, Flame, Layers3, ArrowRight } from "lucide-react"
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
  const [activity, setActivity] = useState([])
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkinStreak, setCheckinStreak] = useState(0)

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
        setActivity(data.activity || [])
      })
      .catch(() => {})
  }, [user])

  useEffect(() => {
    if (!user) return
    fetchAPI("/api/checkins", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then((data) => { setCheckedIn(data.checkedInToday); setCheckinStreak(data.streak || 0) }).catch(() => {})
  }, [user])

  async function checkIn() {
    try { const data = await fetchAPI("/api/checkins", { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); setCheckedIn(true); setCheckinStreak(data.streak || 1) } catch (_) {}
  }

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
  const activityDays = [...new Set(activity.map((item) => new Date(item.reviewed_at).toISOString().slice(0, 10)))].sort().reverse()
  let streak = 0
  for (let i = 0; i < activityDays.length; i++) {
    const expected = new Date(); expected.setDate(expected.getDate() - i)
    if (activityDays[i] !== expected.toISOString().slice(0, 10)) break
    streak++
  }
  const level = stats.mastered >= 100 ? "调酒导师" : stats.mastered >= 50 ? "熟练调酒师" : stats.mastered >= 20 ? "进阶学徒" : "入门学徒"
  const weeklyCount = activity.filter((item) => Date.now() - new Date(item.reviewed_at).getTime() < 7 * 86400000).length
  const nextCards = cards.filter((card) => !masteredIds.includes(card.id)).sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1)).slice(0, 3)
  const learnedCategories = new Set(cards.filter((card) => masteredIds.includes(card.id)).map((card) => card.category))

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20">
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
          <h1 className="text-5xl text-[var(--color-text-main)] font-serif mb-3">学习卡片</h1>
          <p className="text-[var(--color-text-gray)] text-lg">
            翻转卡片，掌握调酒知识。从入门到高级，像刷单词一样刷鸡尾酒。
          </p>
        </motion.div>

        {user && <div className="mb-8 grid gap-3 sm:grid-cols-5"><div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"><Flame size={16} className="mb-2 text-orange-400" /><p className="text-xl font-semibold">{streak} 天</p><p className="text-xs text-[var(--color-text-muted)]">连续学习</p></div><div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"><Layers3 size={16} className="mb-2 text-[var(--color-accent)]" /><p className="text-xl font-semibold">{level}</p><p className="text-xs text-[var(--color-text-muted)]">当前等级</p></div><div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"><BarChart3 size={16} className="mb-2 text-emerald-400" /><p className="text-xl font-semibold">{weeklyCount}</p><p className="text-xs text-[var(--color-text-muted)]">本周复习</p></div><div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"><Trophy size={16} className="mb-2 text-yellow-400" /><p className="text-xl font-semibold">{stats.mastered}/{stats.total}</p><p className="text-xs text-[var(--color-text-muted)]">已掌握卡片</p></div><div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"><p className="mb-2 text-sm text-[var(--color-accent)]">{learnedCategories.size}</p><p className="text-xl font-semibold">{learnedCategories.size}/7</p><p className="text-xs text-[var(--color-text-muted)]">已学知识分类</p></div></div>}

        {user && <div className="mb-8 border-b border-[var(--color-border)] pb-8"><div className="mb-3 flex items-center justify-between"><div><p className="text-xs tracking-[0.2em] text-[var(--color-accent)]">NEXT UP</p><h2 className="mt-1 font-serif text-xl">推荐下一组卡片</h2></div><span className="text-xs text-[var(--color-text-muted)]">从简单内容开始</span></div><div className="grid gap-3 md:grid-cols-3">{nextCards.map((card) => <button key={card.id} type="button" onClick={() => setCategory(card.category)} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 text-left hover:border-[var(--color-accent)]"><span className="line-clamp-2 text-sm text-[var(--color-text-gray)]">{card.question}</span><ArrowRight size={14} className="shrink-0 text-[var(--color-accent)]" /></button>)}</div></div>}

        {user && <div className="mb-8 flex items-center justify-between gap-3 border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"><div><p className="font-ui text-sm text-[var(--color-text-main)]">每日学习打卡</p><p className="mt-1 font-ui text-xs text-[var(--color-text-muted)]">{checkedIn ? `今日已打卡${checkinStreak ? ` · 连续 ${checkinStreak} 天` : ""}` : "完成一次打卡，保持学习节奏"}</p></div><button type="button" onClick={checkIn} disabled={checkedIn} className="shrink-0 bg-[var(--color-accent)] px-4 py-2 font-ui text-sm text-[var(--color-bg-page)] disabled:opacity-50">{checkedIn ? "已打卡" : "立即打卡"}</button></div>}

        {user && <div className="mb-8 border-b border-[var(--color-border)] pb-8"><div className="mb-3 flex items-center justify-between"><h2 className="font-serif text-xl">学习成就</h2><span className="font-ui text-xs text-[var(--color-text-muted)]">根据你的进度解锁</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><div className={`border p-3 font-ui ${checkinStreak > 0 ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)]" : "border-[var(--color-border)] opacity-50"}`}><p className="text-lg">✦</p><p className="mt-1 text-xs">初次打卡</p></div><div className={`border p-3 font-ui ${Math.max(streak, checkinStreak) >= 3 ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)]" : "border-[var(--color-border)] opacity-50"}`}><p className="text-lg">🔥</p><p className="mt-1 text-xs">连续学习 3 天</p></div><div className={`border p-3 font-ui ${stats.mastered >= 10 ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)]" : "border-[var(--color-border)] opacity-50"}`}><p className="text-lg">📚</p><p className="mt-1 text-xs">掌握 10 张卡片</p></div><div className={`border p-3 font-ui ${stats.mastered >= 1 ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)]" : "border-[var(--color-border)] opacity-50"}`}><p className="text-lg">🍸</p><p className="mt-1 text-xs">完成第一次学习</p></div></div></div>}

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 text-center">
            <BarChart3 size={18} strokeWidth={1.5} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
            <p className="text-2xl text-[var(--color-text-main)] font-medium">{stats.total}</p>
            <p className="text-[10px] text-[var(--color-text-muted)] tracking-wider">卡片总数</p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 text-center">
            <Trophy size={18} strokeWidth={1.5} className="mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl text-[var(--color-text-main)] font-medium">{stats.mastered}</p>
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
              <span className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-text-main)] font-medium">
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
                  : "text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-main)]"
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
