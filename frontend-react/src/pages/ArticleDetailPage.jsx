import { useState, useEffect } from "react"
import { fetchAPI } from "../lib/api";
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, User } from "lucide-react"

export default function ArticleDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAPI(`/api/articles/${id}`)
      .then((data) => {
        setArticle(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  if (!article || article.error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">文章未找到</p>
          <Link to="/articles" className="text-[var(--color-accent)] hover:underline">返回关于酒</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5">
        <Link to="/articles" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors mb-12">
          <ArrowLeft size={16} strokeWidth={1.5} />
          返回关于酒
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full mb-4 inline-block">
            {article.cat}
          </span>
          <h1 className="text-4xl md:text-5xl text-white font-serif leading-tight mb-6">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)] mb-12">
            <span className="flex items-center gap-1"><User size={14} strokeWidth={1.5} /> {article.author}</span>
            <span className="flex items-center gap-1"><Clock size={14} strokeWidth={1.5} /> {article.read_time}</span>
          </div>
        </motion.div>

        {article.body ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {article.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-[var(--color-text-gray)] leading-loose text-base mb-6">
                {para.trim()}
              </p>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            文章正文正在撰写中，敬请期待
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-[var(--color-border)] text-center">
          <Link to="/articles" className="text-sm text-[var(--color-accent)] hover:underline">
            返回关于酒，浏览更多文章
          </Link>
        </div>
      </div>
    </div>
  )
}
