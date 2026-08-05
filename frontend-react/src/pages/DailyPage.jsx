import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { cocktailImg, spiritImg } from "../lib/images"
import { motion } from "framer-motion"
import { ArrowRight, Clock, User, Sparkles } from "lucide-react"

export default function DailyPage() {
  const [picks, setPicks] = useState(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    fetch(`http://localhost:3000/api/daily?date=${today}`)
      .then((res) => res.json())
      .then((data) => {
        setPicks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [today])


  if (loading || !picks) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  const cocktail = picks.cocktail
  const spirit = picks.spirit

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={18} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <p className="text-xs tracking-[0.3em] text-[var(--color-accent)]">{today}-每日精选</p>
          </div>
          <h1 className="text-5xl text-white font-serif mb-3">今日推荐</h1>
          <p className="text-[var(--color-text-gray)] text-lg">
            每天一杯鸡尾酒、一款基酒、两篇文章。由数据库随机选取。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2"
          >
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden h-full group hover:border-[var(--color-accent)] transition-all duration-500">
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-[40%] h-48 sm:h-auto bg-[var(--color-accent-dim)] shrink-0 overflow-hidden">
                  <img src={cocktailImg(cocktail.eng)} alt={cocktail.eng} className="w-full h-full object-cover min-h-[200px]" loading="lazy" />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] bg-[var(--color-accent)] text-[var(--color-bg-page)] px-2.5 py-0.5 rounded-full font-semibold">今日鸡尾酒</span>
                      <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full">{cocktail.cat}</span>
                    </div>
                    <h2 className="text-2xl text-white font-serif mb-1">{cocktail.chn ? cocktail.chn.replace(/[（(][^）)]*[）)]/g, "").trim() : cocktail.eng}</h2>
                    <p className="text-sm text-[var(--color-text-muted)] italic mb-4">{cocktail.eng}</p>
                    <p className="text-sm text-[var(--color-text-gray)] leading-relaxed">
                      {cocktail.ingredients ? cocktail.ingredients.slice(0, 3).join(" - ") : ""}
                    </p>
                  </div>
                  <Link to={`/cocktails/${encodeURIComponent(cocktail.eng)}`} className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] mt-4 group-hover:underline">
                    查看完整配方 <ArrowRight size={14} strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1"
          >
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 h-full flex flex-col group hover:border-[var(--color-accent)] transition-all duration-500">
              <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full self-start mb-4">今日基酒</span>
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-dim)] overflow-hidden mb-5">
                <img src={spiritImg(spirit.slug || spirit.eng)} alt={spirit.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="text-xl text-white font-serif mb-1">{spirit.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] italic mb-4">{spirit.eng}</p>
              <p className="text-sm text-[var(--color-text-gray)] leading-relaxed flex-1">{spirit.desc}</p>
              <Link to={`/spirits/${spirit.slug}`} className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] mt-4 group-hover:underline">
                探索{spirit.name}的世界 <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {picks.articles.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/articles/${article.id}`} className="block bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 h-full group hover:border-[var(--color-accent)] transition-all duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] bg-[var(--color-accent)] text-[var(--color-bg-page)] px-2.5 py-0.5 rounded-full font-semibold">今日文章 {i + 1}</span>
                  <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full">{article.cat}</span>
                </div>
                <h3 className="text-lg text-white font-serif leading-snug mb-3 group-hover:text-[var(--color-accent)] transition-colors">{article.title}</h3>
                <p className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-5">{article.summary}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1"><User size={12} strokeWidth={1.5} /> {article.author}</span>
                  <span className="flex items-center gap-1"><Clock size={12} strokeWidth={1.5} /> {article.read_time}</span>
                  <span className="ml-auto text-[var(--color-accent)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">阅读 <ArrowRight size={14} strokeWidth={1.5} /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mt-14 pt-8 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)] flex items-center justify-center gap-2">
            内容基于日期种子固定 · 明天再来会有新推荐
          </p>
        </motion.div>
      </div>
    </div>
  )
}
