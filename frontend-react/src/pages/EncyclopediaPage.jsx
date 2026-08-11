import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAPI } from "../lib/api"
import { Sparkles, BookOpen, Search, ChevronRight, ArrowLeft } from "lucide-react"

export default function EncyclopediaPage() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [categoryData, setCategoryData] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [catLoading, setCatLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)

  useEffect(() => {
    fetchAPI("/api/encyclopedia")
      .then((data) => {
        setCategories(data.categories)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const loadCategory = (key) => {
    setCatLoading(true)
    setActiveCategory(key)
    setSearchResults(null)
    setExpandedId(null)
    fetchAPI(`/api/encyclopedia/${key}`)
      .then((data) => {
        setCategoryData(data)
        setCatLoading(false)
      })
      .catch(() => setCatLoading(false))
  }

  const doSearch = (q) => {
    if (!q.trim()) {
      setSearchResults(null)
      return
    }
    fetchAPI(`/api/encyclopedia/search/${encodeURIComponent(q.trim())}`)
      .then((data) => setSearchResults(data.results))
      .catch(() => {})
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    if (val.trim().length >= 2) {
      doSearch(val)
    } else {
      setSearchResults(null)
    }
  }

  const goBack = () => {
    setActiveCategory(null)
    setCategoryData(null)
    setExpandedId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif flex items-center justify-center pt-24">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

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
            <BookOpen size={18} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <p className="text-xs tracking-[0.3em] text-[var(--color-accent)]">调酒知识库</p>
          </div>
          <h1 className="text-5xl text-[var(--color-text-main)] font-serif mb-3">调酒百科</h1>
          <p className="text-[var(--color-text-gray)] text-lg">
            从手法到杯型，从术语到工具——调酒师的完整知识体系。
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜索术语、手法、杯型..."
              className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl pl-11 pr-4 py-3 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
        </motion.div>

        {/* Search results */}
        {searchResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              找到 {searchResults.length} 个相关词条
            </p>
            <div className="space-y-2">
              {searchResults.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-accent)] transition-all"
                  onClick={() => {
                    setSearchQuery("")
                    setSearchResults(null)
                    loadCategory(entry.category)
                    setTimeout(() => setExpandedId(entry.id), 300)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-0.5 rounded-full mr-2">
                        {entry.categoryEmoji} {entry.categoryLabel}
                      </span>
                      <span className="text-sm text-[var(--color-text-main)] font-serif">{entry.title}</span>
                    </div>
                    <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1.5 ml-0">{entry.summary}</p>
                </motion.div>
              ))}
              {searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                <p className="text-xs text-[var(--color-text-muted)] text-center py-4">未找到匹配词条</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Category grid or detail */}
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  onClick={() => loadCategory(cat.key)}
                  className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 text-left hover:border-[var(--color-accent)] transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{cat.emoji}</span>
                    <ChevronRight size={16} strokeWidth={1.5} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg text-[var(--color-text-main)] font-serif mb-1">{cat.label}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{cat.description}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-2">{cat.entryCount} 个词条</p>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Back button */}
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors mb-6"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
                返回分类
              </button>

              {/* Category header */}
              <div className="mb-6">
                <span className="text-3xl mr-2">{categoryData?.emoji}</span>
                <h2 className="text-3xl text-[var(--color-text-main)] font-serif mt-2">{categoryData?.label}</h2>
                <p className="text-sm text-[var(--color-text-gray)] mt-1">{categoryData?.description}</p>
              </div>

              {catLoading ? (
                <div className="text-center py-12">
                  <p className="text-sm text-[var(--color-text-muted)] animate-pulse">加载词条中...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categoryData?.entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        className="w-full p-5 text-left flex items-start justify-between gap-4 hover:border-[var(--color-accent)] transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="text-base text-[var(--color-text-main)] font-serif mb-1">{entry.title}</h3>
                          <p className="text-xs text-[var(--color-text-gray)] leading-relaxed">{entry.summary}</p>
                        </div>
                        <ChevronRight
                          size={16}
                          strokeWidth={1.5}
                          className={`text-[var(--color-text-muted)] shrink-0 mt-1 transition-transform duration-200 ${
                            expandedId === entry.id ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedId === entry.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 border-t border-[var(--color-border)] pt-4 space-y-4">
                              {entry.detail.map((sec, i) => (
                                <div key={i}>
                                  <p className="text-xs text-[var(--color-accent)] font-medium mb-1.5 tracking-wide">
                                    {sec.subtitle}
                                  </p>
                                  <p className="text-sm text-[var(--color-text-gray)] leading-relaxed whitespace-pre-line">
                                    {sec.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)] flex items-center justify-center gap-2">
            <Sparkles size={12} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            内容持续扩充中 · 欢迎贡献词条
          </p>
        </div>
      </div>
    </div>
  )
}
