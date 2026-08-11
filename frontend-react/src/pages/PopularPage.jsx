import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { fetchAPI } from "../lib/api"
import { cocktailImg } from "../lib/images"
import { motion } from "framer-motion"
import { TrendingUp, Eye, Star } from "lucide-react"

export default function PopularPage() {
  const [tab, setTab] = useState("views") // "views" | "ratings"
  const [cocktails, setCocktails] = useState([])
  const [topRated, setTopRated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetchAPI("/api/cocktails/popular?limit=20"),
      fetchAPI("/api/ratings/top/list?limit=20"),
    ])
      .then(([viewsData, ratingsData]) => {
        setCocktails(viewsData)
        setTopRated(ratingsData.top)
        setLoading(false)
      })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-3">排行加载失败</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-[var(--color-accent)] border border-[var(--color-accent)] rounded-full px-6 py-2 hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-page)] transition-colors">
            重新加载
          </button>
        </div>
      </div>
    )
  }

  const currentList = tab === "views" ? cocktails : topRated

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3 flex items-center gap-2">
            <TrendingUp size={14} strokeWidth={1.5} /> RANKING
          </p>
          <h1 className="text-4xl text-[var(--color-text-main)] font-serif mb-2">热门排行</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {tab === "views" ? "大家最常看的鸡尾酒，按浏览次数排序" : "酒友真实评分，高分好酒一览"}
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("views")}
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border transition-all ${
              tab === "views"
                ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] border-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
            }`}
          >
            <Eye size={13} strokeWidth={1.5} />
            热门浏览
          </button>
          <button
            onClick={() => setTab("ratings")}
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border transition-all ${
              tab === "ratings"
                ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] border-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
            }`}
          >
            <Star size={13} strokeWidth={1.5} />
            高分好评
          </button>
        </div>

        <div className="space-y-3">
          {currentList.map((c, i) => (
            <motion.div
              key={c.eng}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/cocktails/${encodeURIComponent(c.eng)}`}
                className="flex items-center gap-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-accent)] transition-all group"
              >
                {/* 排名 */}
                <div className="w-8 shrink-0 text-center">
                  {i < 3 ? (
                    <span className={`text-lg font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : "text-amber-600"}`}>
                      {i + 1}
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--color-text-muted)]">{i + 1}</span>
                  )}
                </div>

                {/* 图片 */}
                <div className="w-14 h-14 rounded-lg bg-[var(--color-accent-dim)] overflow-hidden shrink-0">
                  <img src={cocktailImg(c.eng)} alt={c.eng} className="w-full h-full object-cover" loading="lazy" />
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors">
                    {c.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || c.eng}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] italic">{c.eng}</p>
                </div>

                {/* 标签 */}
                <div className="hidden sm:flex gap-1.5 flex-wrap">
                  {c.taste_tags?.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                  {c.difficulty && (
                    <span className="text-[10px] bg-[var(--color-bg-page)] text-[var(--color-text-muted)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                      {["", "新手", "入门", "进阶", "专业"][c.difficulty]}
                    </span>
                  )}
                </div>

                {/* 数据 */}
                <div className="flex items-center gap-1 text-xs shrink-0">
                  {tab === "views" ? (
                    <>
                      <Eye size={12} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
                      <span className="text-[var(--color-text-muted)]">{c.view_count || 0}</span>
                    </>
                  ) : (
                    <>
                      <Star size={12} strokeWidth={1.5} className="text-amber-400 fill-amber-400" />
                      <span className="text-amber-400 font-medium">{c.rating_avg}</span>
                      <span className="text-[var(--color-text-muted)] ml-0.5">({c.rating_count})</span>
                    </>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {currentList.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)]">
              {tab === "ratings" ? "还没有评分数据，去给喜欢的酒打分吧！" : "暂无数据"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
