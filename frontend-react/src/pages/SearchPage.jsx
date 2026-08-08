import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, Sparkles } from "lucide-react"
import { cocktailImg } from "../lib/images"
import { fetchAPI } from "../lib/api"

const hints = [
  "我有金酒和柠檬，能调什么？",
  "推荐几款酸口的鸡尾酒",
  "适合夏天的清爽长饮",
  "用威士忌调的经典鸡尾酒",
  "我想喝甜的奶油鸡尾酒",
  "苦味为主的鸡尾酒有哪些",
]

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQ)
  const [results, setResults] = useState(null)
  const [parsed, setParsed] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const doSearch = (q) => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setQuery(q)
    fetchAPI(`/api/search?q=${encodeURIComponent(q)}`)
      .then((data) => {
        setResults(data.results)
        setParsed(data.parsed)
        setLoading(false)
      })
      .catch((err) => { setError(err.message); setLoading(false) })
  }

  // 如果导航栏带参数过来，自动搜索
  useEffect(() => {
    if (initialQ) doSearch(initialQ)
  }, [initialQ])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (val.trim() === "") {
      setResults(null)
      setParsed(null)
    }
  }

  const handleClear = () => {
    setQuery("")
    setResults(null)
    setParsed(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") doSearch(e.target.value)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={20} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <p className="text-xs tracking-[0.3em] text-[var(--color-accent)]">SMART SEARCH</p>
          </div>
          <h1 className="text-5xl text-white font-serif mb-3">智能搜酒</h1>
          <p className="text-[var(--color-text-gray)] text-lg">
            用自然语言描述你想喝什么——"我有金酒想喝酸的"——我来帮你找
          </p>
        </motion.div>

        {/* 搜索框 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8"
        >
          <div className="relative">
            <Search size={18} strokeWidth={1.5} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="例如：我有金酒和柠檬，能调什么？"
              className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl pl-14 pr-24 py-5 text-lg text-white placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-28 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white p-2 transition-colors"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => doSearch(query)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[var(--color-accent)] text-[var(--color-bg-page)] px-6 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? "搜索中..." : "搜索"}
            </button>
          </div>

          {/* 搜索提示 */}
          {!results && !error && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {hints.map((hint) => (
                <button
                  key={hint}
                  onClick={() => doSearch(hint)}
                  className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-4 py-2 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                >
                  {hint}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* 解析结果 */}
        {parsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="flex flex-wrap gap-2 text-xs">
              {parsed.spirits.length > 0 && (
                <span className="text-[var(--color-accent)]">
                  基酒：{parsed.spirits.join("、")}
                </span>
              )}
              {parsed.tastes.length > 0 && (
                <span className="text-[var(--color-text-gray)]">
                  口味：{parsed.tastes.join("、")}
                </span>
              )}
              {parsed.methods.length > 0 && (
                <span className="text-[var(--color-text-gray)]">
                  调法：{parsed.methods.join("、")}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* 搜索错误 */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <p className="text-[var(--color-text-muted)] text-sm mb-3">搜索请求失败：{error}</p>
            <button onClick={() => doSearch(query)} className="text-sm text-[var(--color-accent)] hover:underline">
              重试
            </button>
          </motion.div>
        )}

        {/* 搜索结果 */}
        <AnimatePresence>
          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                找到 {results.length} 款匹配的鸡尾酒
              </p>

              {results.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-[var(--color-text-muted)] text-lg mb-2">没有找到完全匹配的鸡尾酒</p>
                  <p className="text-sm text-[var(--color-text-muted)]">试试换个描述，比如"清爽的夏日饮品"或"威士忌调的经典酒"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((c, i) => (
                    <motion.div
                      key={c.eng}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={`/cocktails/${encodeURIComponent(c.eng)}`}
                        className="flex gap-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-accent)] transition-all duration-300 group"
                      >
                        <div className="w-20 h-20 rounded-lg bg-[var(--color-accent-dim)] overflow-hidden shrink-0">
                          <img src={cocktailImg(c.eng)} alt={c.eng} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base text-white font-serif group-hover:text-[var(--color-accent)] transition-colors">
                            {c.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || c.eng}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)] italic mb-1">{c.eng}</p>
                          <p className="text-xs text-[var(--color-text-gray)] truncate">
                            {c.ingredients?.slice(0, 3).join(" · ")}
                          </p>
                        </div>
                        <ArrowRight size={14} strokeWidth={1.5} className="text-[var(--color-accent)] self-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
