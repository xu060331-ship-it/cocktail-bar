import { useState, useEffect } from "react"
import { Star, User, Trash2 } from "lucide-react"
import { fetchAPI } from "../lib/api"
import { useAuth } from "../lib/auth"
import { motion } from "framer-motion"

export default function StarRating({ cocktailEng }) {
  const { user } = useAuth()
  const [stats, setStats] = useState({ count: 0, avg: 0 })
  const [reviews, setReviews] = useState([])
  const [myRating, setMyRating] = useState(null)
  const [hoverStar, setHoverStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  const [comment, setComment] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadRatings = () => {
    const token = localStorage.getItem("token")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    fetchAPI(`/api/ratings/${encodeURIComponent(cocktailEng)}`, { headers })
      .then((data) => {
        setStats(data.stats)
        setReviews(data.reviews)
        if (data.my) {
          setMyRating(data.my)
          setSelectedStar(data.my.rating)
          setComment(data.my.comment || "")
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadRatings()
  }, [cocktailEng, user])

  const handleSubmit = async () => {
    if (selectedStar === 0) return
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetchAPI(`/api/ratings/${encodeURIComponent(cocktailEng)}`, {
        method: "POST",
        body: { rating: selectedStar, comment: comment.trim() || null },
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(res.stats)
      setMyRating({ rating: selectedStar, comment: comment.trim() })
      // Reload reviews to show the new one
      loadRatings()
    } catch (err) {
      console.error("评分失败:", err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      await fetchAPI(`/api/ratings/${encodeURIComponent(cocktailEng)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setMyRating(null)
      setSelectedStar(0)
      setComment("")
      loadRatings()
    } catch (err) {
      console.error("删除失败:", err.message)
    } finally {
      setSaving(false)
    }
  }

  const renderStars = (count, size = 16, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNum = i + 1
      const filled = interactive
        ? starNum <= (hoverStar || selectedStar)
        : starNum <= Math.round(count)

      return (
        <button
          key={i}
          disabled={!interactive}
          onMouseEnter={() => interactive && setHoverStar(starNum)}
          onMouseLeave={() => interactive && setHoverStar(0)}
          onClick={() => interactive && setSelectedStar(starNum)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            size={size}
            strokeWidth={1.5}
            className={filled
              ? "text-amber-400 fill-amber-400"
              : "text-[var(--color-text-muted)]"
            }
          />
        </button>
      )
    })
  }

  if (loading) return null

  return (
    <div className="border-t border-[var(--color-border)] pt-6 mt-6">
      {/* Stats header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {renderStars(stats.avg)}
          </div>
          <span className="text-lg text-[var(--color-text-main)] font-medium">{stats.avg}</span>
          <span className="text-xs text-[var(--color-text-muted)]">
            ({stats.count} 条评分)
          </span>
        </div>
      </div>

      {/* My rating */}
      {user ? (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 mb-5">
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            {myRating ? "我的评分" : "给这杯酒打分"}
          </p>
          <div className="flex items-center gap-1 mb-3">
            {renderStars(stats.avg, 22, true)}
            {selectedStar > 0 && (
              <span className="text-xs text-[var(--color-text-muted)] ml-2">
                {selectedStar} 星
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="写一句简短的品鉴感受..."
              maxLength={200}
              className="flex-1 bg-[var(--color-bg-page)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            <button
              onClick={handleSubmit}
              disabled={selectedStar === 0 || saving}
              className="text-xs bg-[var(--color-accent)] text-[var(--color-bg-page)] px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {saving ? "..." : myRating ? "更新" : "提交"}
            </button>
            {myRating && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className="text-xs text-[var(--color-text-muted)] hover:text-red-400 px-2 py-2 rounded-lg transition-colors shrink-0"
                title="删除评分"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 mb-5 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">
            登录后可评分和写品鉴
          </p>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--color-accent)] tracking-wide">品鉴记录</p>
          {reviews.slice(0, 10).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <User size={12} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
                  <span className="text-xs text-[var(--color-text-muted)]">{review.nickname || "匿名"}</span>
                  <div className="flex items-center gap-0.5">
                    {renderStars(review.rating, 11)}
                  </div>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {new Date(review.created_at).toLocaleDateString("zh-CN")}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-[var(--color-text-gray)] leading-relaxed">{review.comment}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
