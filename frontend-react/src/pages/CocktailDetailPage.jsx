import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { cocktailHeroImg } from "../lib/images"
import { fetchAPI } from "../lib/api"
import { useAuth } from "../lib/auth"
import Breadcrumb from "../components/Breadcrumb"
import AIDeepAnalysis from "../components/AIDeepAnalysis"
import StarRating from "../components/StarRating"
import MakingLogForm from "../components/MakingLogForm"
import { useExperience } from "../lib/experience"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, GlassWater, Heart, Copy, Check, Share2, ListPlus, Plus, Coffee } from "lucide-react"

export default function CocktailDetailPage() {
  const { name } = useParams()
  const { user } = useAuth()
  const [cocktail, setCocktail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favorited, setFavorited] = useState(false)
  const { madeSet, tastedSet, toggle: toggleExp } = useExperience()
  const [favLoading, setFavLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [showPlSelector, setShowPlSelector] = useState(false)
  const [addingToPl, setAddingToPl] = useState(null)
  const [note, setNote] = useState("")
  const [noteSaved, setNoteSaved] = useState(false)
  const [noteLoading, setNoteLoading] = useState(false)
  const [showMakingLog, setShowMakingLog] = useState(false)
  const [favoriteFeedback, setFavoriteFeedback] = useState("")

  // 获取用户酒单
  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem("token")
    fetchAPI("/api/playlists", { headers: { Authorization: `Bearer ${token}` } })
      .then(d => setPlaylists(d))
      .catch(() => {})
  }, [user])

  async function addToPlaylist(plId) {
    setAddingToPl(plId)
    const token = localStorage.getItem("token")
    try {
      await fetchAPI(`/api/playlists/${plId}/items`, {
        method: "POST",
        body: { cocktail_eng: cocktail.eng },
        headers: { Authorization: `Bearer ${token}` },
      })
      setShowPlSelector(false)
    } catch (err) { console.error(err) }
    setAddingToPl(null)
  }

  // 加载笔记
  useEffect(() => {
    if (!user || !cocktail) return
    setNoteLoading(true)
    const token = localStorage.getItem("token")
    fetchAPI(`/api/notes/${encodeURIComponent(cocktail.eng)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(d => { if (d?.body) setNote(d.body) })
      .catch(() => {})
      .finally(() => setNoteLoading(false))
  }, [cocktail, user])

  // 保存笔记
  async function saveNote() {
    const token = localStorage.getItem("token")
    await fetchAPI(`/api/notes/${encodeURIComponent(cocktail.eng)}`, {
      method: "PUT",
      body: { body: note },
      headers: { Authorization: `Bearer ${token}` },
    })
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }
  const [related, setRelated] = useState([])

  useEffect(() => {
    fetchAPI(`/api/cocktails/${name}`)
      .then((data) => {
        setCocktail(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
    // 浏览计数 +1（fire and forget）
    fetchAPI(`/api/cocktails/${encodeURIComponent(name)}/view`, { method: "POST" }).catch(() => {})
    // 记录浏览历史（登录用户）
    if (user) {
      const token = localStorage.getItem("token")
      fetchAPI(`/api/history/${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
  }, [name])

  // 获取相关推荐
  useEffect(() => {
    if (!cocktail?.taste_tags?.length) return
    const tag = cocktail.taste_tags[0]
    fetchAPI(`/api/cocktails?taste=${encodeURIComponent(tag)}`)
      .then((data) => {
        setRelated(data.filter((c) => c.eng !== cocktail.eng).slice(0, 4))
      })
      .catch(() => {})
  }, [cocktail])

  // 检查收藏状态
  useEffect(() => {
    if (!user) { setFavorited(false); return }
    const token = localStorage.getItem("token")
    fetchAPI(`/api/favorites/${encodeURIComponent(name)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => setFavorited(data.favorited))
      .catch(() => {})
  }, [name, user])

  // 切换收藏
  async function toggleFavorite() {
    if (!user) return
    setFavLoading(true)
    const token = localStorage.getItem("token")
    try {
      if (favorited) {
        await fetchAPI(`/api/favorites/${encodeURIComponent(name)}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        setFavorited(false)
        setFavoriteFeedback("已取消收藏")
      } else {
        await fetchAPI(`/api/favorites/${encodeURIComponent(name)}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
        setFavorited(true)
        setFavoriteFeedback("已加入收藏")
      }
    } catch (err) {
      console.error("收藏操作失败:", err)
      setFavoriteFeedback("操作失败，请稍后重试")
    } finally {
      setFavLoading(false)
      setTimeout(() => setFavoriteFeedback(""), 2200)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  if (!cocktail || cocktail.error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">未找到该鸡尾酒</p>
          <Link to="/cocktails" className="text-[var(--color-accent)] hover:underline">返回酒谱</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif">
      {/* 返回按钮 */}
      <div className="fixed top-20 left-6 z-40">
        <Link
          to="/cocktails"
          className="flex items-center gap-2 text-sm text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-4 py-2"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          返回酒谱
        </Link>
      </div>

      {/* Hero 大图 */}
      <div className="w-full h-[55vh] bg-[var(--color-accent-dim)] border-b border-[var(--color-border)] overflow-hidden">
        <img
          src={cocktailHeroImg(cocktail.eng)}
          alt={cocktail.eng}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 内容区 */}
      <div className="max-w-3xl mx-auto px-5 py-16">
        {/* 面包屑 */}
        <Breadcrumb items={[
          { label: "酒谱", to: "/cocktails" },
          { label: cocktail?.cat || "..." },
          { label: cocktail?.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || "..." }
        ]} />

        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-4">{cocktail.eng?.toUpperCase()}</p>
          <h1 className="text-5xl md:text-6xl text-[var(--color-text-main)] font-serif leading-tight mb-4">{cocktail.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || cocktail.eng}</h1>
          <p className="text-lg text-[var(--color-text-muted)] italic">{cocktail.eng}</p>

          <div className="flex flex-wrap gap-3 mt-6 items-center">
            <span className="text-xs bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-3 py-1 rounded-full">{cocktail.cat}</span>
            {user && (
              <button
                onClick={toggleFavorite}
                disabled={favLoading}
                className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-all ${
                  favorited
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-red-400 hover:border-red-500/30"
                }`}
              >
                <Heart size={12} strokeWidth={1.5} fill={favorited ? "currentColor" : "none"} />
                {favorited ? "已收藏" : "收藏"}
              </button>
            )}
            {favoriteFeedback && <span className={`text-xs ${favoriteFeedback.includes("失败") ? "text-red-400" : "text-emerald-400"}`}>{favoriteFeedback}</span>}
            {user && (
              <>
                <button
                  onClick={() => toggleExp(cocktail.eng, "made")}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-all ${
                    madeSet.has(cocktail.eng)
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-emerald-400 hover:border-emerald-500/30"
                  }`}
                >
                  <GlassWater size={12} strokeWidth={1.5} />
                  {madeSet.has(cocktail.eng) ? "已调配" : "调配过"}
                </button>
                <button
                  onClick={() => toggleExp(cocktail.eng, "tasted")}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-all ${
                    tastedSet.has(cocktail.eng)
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-amber-400 hover:border-amber-500/30"
                  }`}
                >
                  <Coffee size={12} strokeWidth={1.5} />
                  {tastedSet.has(cocktail.eng) ? "已品尝" : "喝过"}
                </button>
              </>
            )}
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href)
                setLinkCopied(true)
                setTimeout(() => setLinkCopied(false), 2000)
              }}
              className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)] rounded-full px-2.5 py-1"
            >
              {linkCopied ? <Check size={12} strokeWidth={1.5} className="text-green-400" /> : <Share2 size={12} strokeWidth={1.5} />}
              {linkCopied ? "已复制链接" : "分享"}
            </button>
            {user && playlists.length > 0 && (
              <span className="relative">
                <button onClick={() => setShowPlSelector(!showPlSelector)}
                  className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)] rounded-full px-2.5 py-1">
                  <ListPlus size={12} strokeWidth={1.5} /> 加入酒单
                </button>
                {showPlSelector && (
                  <div className="absolute top-full mt-1 right-0 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-2 shadow-xl z-30 min-w-[160px]">
                    {playlists.map(pl => (
                      <button key={pl.id} onClick={() => addToPlaylist(pl.id)} disabled={addingToPl === pl.id}
                        className="w-full text-left text-xs text-[var(--color-text-gray)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-page)] rounded-lg px-3 py-2 transition-colors flex items-center gap-2">
                        <Plus size={10} /> {pl.name} ({pl.item_count || 0})
                      </button>
                    ))}
                    <Link to="/profile" onClick={() => setShowPlSelector(false)} className="block text-[10px] text-[var(--color-accent)] hover:underline text-center mt-1 pt-1 border-t border-[var(--color-border)]">新建酒单 →</Link>
                  </div>
                )}
              </span>
            )}
            {cocktail.difficulty && (
              <span className="text-xs bg-[var(--color-bg-page)] text-[var(--color-text-gray)] px-3 py-1 rounded-full border border-[var(--color-border)]">
                {["", "新手", "入门", "进阶", "专业"][cocktail.difficulty]}
              </span>
            )}
            {cocktail.view_count > 0 && (
              <span className="text-xs text-[var(--color-text-muted)] px-2 py-1">{cocktail.view_count} 次浏览</span>
            )}
          </div>
          {(cocktail.taste_tags?.length > 0 || cocktail.occasion?.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {cocktail.taste_tags?.map((tag) => (
                <span key={tag} className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full">{tag}</span>
              ))}
              {cocktail.occasion?.map((o) => (
                <span key={o} className="text-[10px] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] px-2.5 py-0.5 rounded-full border border-[var(--color-border)]">适合{o}</span>
              ))}
            </div>
          )}
        </motion.div>

        {/* 历史故事 — 从数据库读取 */}
        {cocktail.story && [cocktail.story.origin, cocktail.story.funFact, cocktail.story.legacy].filter(Boolean).map((section, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] text-[var(--color-accent)] tracking-[0.2em] font-serif">
                {["起源", "趣闻", "延伸"][i]}
              </span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>
            <h2 className="text-2xl text-[var(--color-text-main)] font-serif mb-6 leading-snug">{section.title}</h2>
            {section.body.split("\n\n").map((para, pi) => (
              <p key={pi} className="text-[var(--color-text-gray)] leading-loose text-base mb-5">
                {para.trim()}
              </p>
            ))}
          </motion.section>
        ))}

        {/* 配料 + 调制方法 */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <GlassWater size={18} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <h2 className="text-xl text-[var(--color-text-main)] font-serif">配方与调制</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 配料 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm text-[var(--color-accent)] tracking-wide">配料</h3>
                <button
                  onClick={async () => {
                    const text = cocktail.ingredients.join("\n")
                    await navigator.clipboard.writeText(text)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)] rounded-full px-2.5 py-1"
                >
                  {copied ? <Check size={12} strokeWidth={1.5} className="text-green-400" /> : <Copy size={12} strokeWidth={1.5} />}
                  {copied ? "已复制" : "一键复制"}
                </button>
              </div>
              <ul className="space-y-3">
                {cocktail.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* 调制方法 */}
            <div>
              <h3 className="text-sm text-[var(--color-accent)] tracking-wide mb-4">
                <Clock size={14} strokeWidth={1.5} className="inline mr-1" />
                调制步骤
              </h3>
              {cocktail.method ? (
                <div className="space-y-4">
                  {/* 方法 + 杯具 */}
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-3 py-1 rounded-full">
                      {cocktail.method.method}
                    </span>
                    <span className="bg-[var(--color-bg-page)] text-[var(--color-text-gray)] px-3 py-1 rounded-full border border-[var(--color-border)]">
                      {cocktail.method.glass}
                    </span>
                  </div>
                  {/* 步骤 */}
                  <ol className="space-y-3">
                    {cocktail.method.steps.map((step, si) => (
                      <li key={si} className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                        <span className="text-xs text-[var(--color-accent)] font-bold mt-0.5 shrink-0">
                          {String(si + 1).padStart(2, "0")}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  {/* 装饰 */}
                  {cocktail.method.garnish && cocktail.method.garnish !== "无需装饰" && (
                    <p className="text-xs text-[var(--color-text-muted)] italic border-t border-[var(--color-border)] pt-3">
                      🍸 {cocktail.method.garnish}
                    </p>
                  )}
                </div>
              ) : (
                <ol className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] py-8">
                    调制方法数据正在更新中...
                  </li>
                </ol>
              )}
            </div>
          </div>

          {/* 调酒提醒 */}
          {cocktail.tip && (
            <div className="mt-8 border-t border-[var(--color-border)] pt-6">
              <div className="flex items-start gap-3 bg-[var(--color-accent-dim)] rounded-xl p-5">
                <span className="text-lg shrink-0 mt-0.5">💡</span>
                <div>
                  <p className="text-xs text-[var(--color-accent)] tracking-wide mb-1">关键提醒</p>
                  <p className="text-sm text-[var(--color-text-gray)] leading-relaxed">{cocktail.tip}</p>
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* AI 深度解析 */}
        <AIDeepAnalysis cocktailEng={cocktail.eng} cocktailData={cocktail} />

        {/* 评分与品鉴 */}
        <StarRating cocktailEng={cocktail.eng} />

        {user && <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"><button type="button" onClick={() => setShowMakingLog(!showMakingLog)} className="text-sm font-semibold text-[var(--color-accent)]">{showMakingLog ? "收起调酒记录" : "记录这次调酒"}</button>{showMakingLog && <MakingLogForm cocktailEng={cocktail.eng} />}</section>}

        {/* 调酒笔记（仅登录用户） */}
        {user && (
          <motion.section
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8"
          >
            <h2 className="text-lg text-[var(--color-text-main)] font-serif mb-4">📝 我的调酒笔记</h2>
            {noteLoading ? (
              <p className="text-xs text-[var(--color-text-muted)] animate-pulse">加载中...</p>
            ) : (
              <>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="记录你的试喝感受、配方改编想法、实操心得..."
                  rows={5}
                  className="w-full bg-[var(--color-bg-page)] border border-[var(--color-border)] rounded-xl p-4 text-sm text-[var(--color-text-gray)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors resize-y"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    {note.length > 0 ? `${note.length} 字` : "私密笔记，只有你能看到"}
                  </p>
                  <button
                    onClick={saveNote}
                    className={`text-xs px-5 py-2 rounded-full font-semibold transition-all ${
                      noteSaved
                        ? "bg-green-500/20 text-green-400"
                        : "bg-[var(--color-accent)] text-[var(--color-bg-page)] hover:brightness-110"
                    }`}
                  >
                    {noteSaved ? "已保存 ✓" : "保存笔记"}
                  </button>
                </div>
              </>
            )}
          </motion.section>
        )}

        {/* 相关推荐 */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--color-border)]">
            <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-6">RELATED COCKTAILS</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((c) => (
                <Link
                  key={c.eng}
                  to={`/cocktails/${encodeURIComponent(c.eng)}`}
                  className="group bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent)] transition-all"
                >
                  <div className="aspect-square bg-[var(--color-accent-dim)] overflow-hidden">
                    <img src={cocktailHeroImg(c.eng)} alt={c.eng} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors truncate">
                      {c.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || c.eng}
                    </h4>
                    <p className="text-[10px] text-[var(--color-text-muted)] italic truncate">{c.eng}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 底部分割 + 返回 */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-center">
          <Link to="/cocktails" className="text-sm text-[var(--color-accent)] hover:underline">
            返回酒谱，探索更多经典
          </Link>
        </div>
      </div>
    </div>
  )
}
