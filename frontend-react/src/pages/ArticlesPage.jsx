import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { articleImg } from "../lib/images"
import { fetchAPI } from "../lib/api"
import { motion } from "framer-motion"
import { ArrowRight, Clock, User } from "lucide-react"

const categories = ["全部", "鸡尾酒历史", "酿造工艺", "基酒知识", "调酒师故事", "酒具百科", "品鉴笔记"]

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState("全部")
  const [hoveredArticle, setHoveredArticle] = useState(null)

  useEffect(() => {
    fetchAPI("")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  const featured = articles[0] || null
  const rest = activeCat === "全部" ? articles.slice(1) : articles.filter((a) => a.cat === activeCat)

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3">LEARN & EXPLORE</p>
          <h1 className="text-5xl text-white font-serif mb-3">关于酒</h1>
          <p className="text-[var(--color-text-gray)] text-lg">鸡尾酒的历史、酿造的科学、调酒师的哲学。</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                activeCat === cat ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] font-semibold" : "bg-[var(--color-bg-card)] text-[var(--color-text-gray)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 精选 */}
        {activeCat === "全部" && featured && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <Link
              to={`/articles/${featured.id}`}
              className="group block bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-accent)] transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-[45%] h-64 lg:h-auto bg-[var(--color-accent-dim)] shrink-0 overflow-hidden">
                  <img src={articleImg(featured.title)} alt={featured.title} className="w-full h-full object-cover min-h-[250px]" loading="lazy" />
                </div>
                <div className="flex-1 p-10 flex flex-col justify-center">
                  <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full self-start mb-4">{featured.cat}</span>
                  <h2 className="text-2xl lg:text-3xl text-white font-serif leading-snug mb-4 group-hover:text-[var(--color-accent)] transition-colors">{featured.title}</h2>
                  <p className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-6">{featured.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1"><User size={12} strokeWidth={1.5} /> {featured.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12} strokeWidth={1.5} /> {featured.read_time}</span>
                    <span className="ml-auto text-[var(--color-accent)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">阅读全文 <ArrowRight size={14} strokeWidth={1.5} /></span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* 文章列表 */}
        <div className="space-y-5">
          {rest.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredArticle(i)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              <Link
                to={`/articles/${article.id}`}
                className={`block bg-[var(--color-bg-card)] border rounded-2xl px-8 py-6 transition-all duration-500 group ${
                  hoveredArticle === i ? "border-[var(--color-accent)] shadow-[0_0_40px_rgba(201,169,110,0.06)]" : "border-[var(--color-border)]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full">{article.cat}</span>
                </div>
                <h3 className="text-base text-white font-serif leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors">{article.title}</h3>
                <p className="text-xs text-[var(--color-text-gray)] leading-relaxed mb-3 line-clamp-2">{article.summary}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1"><User size={12} strokeWidth={1.5} /> {article.author}</span>
                  <span className="flex items-center gap-1"><Clock size={12} strokeWidth={1.5} /> {article.read_time}</span>
                  <span className={`ml-auto text-[var(--color-accent)] flex items-center gap-1 transition-opacity duration-300 ${hoveredArticle === i ? "opacity-100" : "opacity-0"}`}>阅读 <ArrowRight size={14} strokeWidth={1.5} /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mt-16 pt-8 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)]">更多文章正在撰写中，由调酒师社区的贡献者持续更新</p>
        </motion.div>
      </div>
    </div>
  )
}
