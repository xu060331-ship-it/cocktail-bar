import { Link } from "react-router-dom"
import { useState, useMemo, useEffect } from "react"
import { cocktailImg } from "../lib/images"
import { fetchAPI } from "../lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"

const categories = ["全部", "难忘经典", "当代经典", "新时代"]
const spiritFilters = ["全部", "金酒", "伏特加", "朗姆", "龙舌兰", "威士忌", "白兰地"]
const tasteFilters = ["全部", "酸甜", "果香", "清爽", "烈", "苦味", "草本", "奶油", "甜味", "辛辣"]
const difficultyLabels = ["全部", "新手", "入门", "进阶", "专业"]
const occasionFilters = ["全部", "餐前", "餐后", "派对", "夏日", "冬季", "酒吧特调"]

// 从配料文本里推断基酒
function detectSpirit(ingredients) {
  const text = ingredients.join(" ")
  if (/金酒|杜松子|干金|老汤姆|普利茅斯/i.test(text)) return "金酒"
  if (/伏特加|斯米诺|斯堪的纳维亚/i.test(text)) return "伏特加"
  if (/朗姆|卡莎萨|农业朗姆|黑朗姆|白朗姆|金朗姆|陈年朗姆/i.test(text)) return "朗姆"
  if (/龙舌兰|梅斯卡尔|特基拉|100%/i.test(text)) return "龙舌兰"
  if (/威士忌|波旁|黑麦|苏格兰|爱尔兰|波本/i.test(text)) return "威士忌"
  if (/白兰地|干邑|雅文邑|卡尔瓦多斯/i.test(text)) return "白兰地"
  return null
}

// 提取调制方法（从中文名括号里）
function extractMethod(chn) {
  const m = chn.match(/[（(]([^）)]+)[）)]/)
  return m ? m[1] : ""
}

// 预处理数据（基酒推断 + 调法提取）
function processData(raw) {
  return raw.map((c) => ({
    ...c,
    spirit: detectSpirit(c.ingredients),
    method: extractMethod(c.chn),
    chnClean: c.chn.replace(/[（(][^）)]*[）)]/g, "").trim(),
  }))
}

export default function CocktailsPage() {
  const [allCocktails, setAllCocktails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCat, setActiveCat] = useState("全部")
  const [activeSpirit, setActiveSpirit] = useState("全部")
  const [activeTaste, setActiveTaste] = useState("全部")
  const [activeDifficulty, setActiveDifficulty] = useState("全部")
  const [activeOccasion, setActiveOccasion] = useState("全部")
  const [search, setSearch] = useState("")

  // 页面加载时从后端拿数据
  useEffect(() => {
    fetchAPI("/api/cocktails")
      .then((data) => {
        setAllCocktails(processData(data))
        setLoading(false)
      })
      .catch((err) => {
        console.error("获取失败:", err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    return allCocktails.filter((c) => {
      if (activeCat !== "全部" && c.cat !== activeCat) return false
      if (activeSpirit !== "全部" && c.spirit !== activeSpirit) return false
      if (activeTaste !== "全部" && (!c.taste_tags || !c.taste_tags.includes(activeTaste))) return false
      if (activeDifficulty !== "全部") {
        const diffMap = { "新手": 1, "入门": 2, "进阶": 3, "专业": 4 }
        if (c.difficulty !== diffMap[activeDifficulty]) return false
      }
      if (activeOccasion !== "全部" && (!c.occasion || !c.occasion.includes(activeOccasion))) return false
      if (search) {
        const s = search.toLowerCase()
        if (!c.chnClean.includes(search) && !c.eng.toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [allCocktails, activeCat, activeSpirit, activeTaste, activeDifficulty, activeOccasion, search])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-3">数据加载失败</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">{error}</p>
          <button onClick={() => { setError(null); setLoading(true); fetchAPI("/api/cocktails").then((data) => { setAllCocktails(processData(data)); setLoading(false); }).catch((err) => { setError(err.message); setLoading(false); }); }} className="text-sm text-[var(--color-accent)] border border-[var(--color-accent)] rounded-full px-6 py-2 hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-page)] transition-colors">
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3">IBA OFFICIAL COCKTAILS</p>
          <h1 className="text-5xl text-white font-serif mb-3">酒谱</h1>
          <p className="text-[var(--color-text-gray)] text-lg">
            国际调酒师协会（IBA）官方认证的 {allCocktails.length} 款鸡尾酒配方
          </p>
        </motion.div>

        {/* 搜索 + 筛选 */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索酒名..."
              className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white">
                <X size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="flex gap-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 ${
                  activeCat === cat ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] font-semibold" : "text-[var(--color-text-gray)] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full p-1">
            {spiritFilters.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSpirit(s)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 ${
                  activeSpirit === s ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] font-semibold" : "text-[var(--color-text-gray)] hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 口感 + 难度 + 场景 */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-xs text-[var(--color-text-muted)] shrink-0">口感</span>
          <div className="flex gap-1 flex-wrap">
            {tasteFilters.map((t) => (
              <button key={t} onClick={() => setActiveTaste(t)} className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${activeTaste === t ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] font-semibold" : "text-[var(--color-text-gray)] hover:text-white bg-[var(--color-bg-card)] border border-[var(--color-border)]"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-xs text-[var(--color-text-muted)] shrink-0">难度</span>
          <div className="flex gap-1">
            {difficultyLabels.map((d) => (
              <button key={d} onClick={() => setActiveDifficulty(d)} className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${activeDifficulty === d ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] font-semibold" : "text-[var(--color-text-gray)] hover:text-white bg-[var(--color-bg-card)] border border-[var(--color-border)]"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-xs text-[var(--color-text-muted)] shrink-0">场景</span>
          <div className="flex gap-1 flex-wrap">
            {occasionFilters.map((o) => (
              <button key={o} onClick={() => setActiveOccasion(o)} className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${activeOccasion === o ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] font-semibold" : "text-[var(--color-text-gray)] hover:text-white bg-[var(--color-bg-card)] border border-[var(--color-border)]"}`}>
                {o}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--color-text-muted)] mb-6">共 {filtered.length} 款</p>

        {/* 卡片网格 */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((c) => (
              <motion.div
                key={c.eng}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/cocktails/${encodeURIComponent(c.eng)}`}
                  className="block bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:border-[var(--color-accent)] hover:shadow-[0_0_40px_rgba(201,169,110,0.08)]"
                >
                  <div className="w-full h-44 bg-[var(--color-accent-dim)] rounded-xl mb-4 overflow-hidden">
                    <img
                      src={cocktailImg(c.eng)}
                      alt={c.chnClean || c.eng}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg text-white font-serif leading-tight">{c.chnClean}</h3>
                      <p className="text-xs text-[var(--color-text-muted)] italic mt-0.5">{c.eng}</p>
                    </div>
                    <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-0.5 rounded-full shrink-0 ml-2">{c.cat}</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {c.spirit && (
                      <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full">{c.spirit}</span>
                    )}
                    {c.method && (
                      <span className="text-[10px] bg-[var(--color-border)] text-[var(--color-text-gray)] px-2.5 py-0.5 rounded-full">{c.method}</span>
                    )}
                    {c.difficulty && (
                      <span className="text-[10px] bg-[var(--color-bg-page)] text-[var(--color-text-muted)] px-2.5 py-0.5 rounded-full border border-[var(--color-border)]">
                        {["", "新手", "入门", "进阶", "专业"][c.difficulty]}
                      </span>
                    )}
                    {c.taste_tags && c.taste_tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] text-[var(--color-text-gray)] px-2 py-0.5 rounded-full bg-[var(--color-accent-dim)]">{tag}</span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--color-text-muted)] text-lg">没有找到匹配的鸡尾酒</p>
            <button onClick={() => { setActiveCat("全部"); setActiveSpirit("全部"); setActiveTaste("全部"); setActiveDifficulty("全部"); setActiveOccasion("全部"); setSearch("") }} className="mt-4 text-sm text-[var(--color-accent)] hover:underline">
              清除所有筛选
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
