import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { cocktailHeroImg } from "../lib/images"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, GlassWater } from "lucide-react"

export default function CocktailDetailPage() {
  const { name } = useParams()
  const [cocktail, setCocktail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:3000/api/cocktails/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setCocktail(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [name])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  if (!cocktail || cocktail.error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">未找到该鸡尾酒</p>
          <Link to="/cocktails" className="text-[var(--color-accent)] hover:underline">返回酒谱</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif">
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
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-4">{cocktail.eng?.toUpperCase()}</p>
          <h1 className="text-5xl md:text-6xl text-white font-serif leading-tight mb-4">{cocktail.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || cocktail.eng}</h1>
          <p className="text-lg text-[var(--color-text-muted)] italic">{cocktail.eng}</p>

          <div className="flex gap-3 mt-6">
            <span className="text-xs bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-3 py-1 rounded-full">{cocktail.cat}</span>
          </div>
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
            <h2 className="text-2xl text-white font-serif mb-6 leading-snug">{section.title}</h2>
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
            <h2 className="text-xl text-white font-serif">配方与调制</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 配料 */}
            <div>
              <h3 className="text-sm text-[var(--color-accent)] tracking-wide mb-4">配料</h3>
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
              <ol className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                  <span className="text-xs text-[var(--color-accent)] font-bold mt-0.5 shrink-0">01</span>
                  将所有配料加入摇酒壶，加冰用力摇和 10-12 秒
                </li>
                <li className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                  <span className="text-xs text-[var(--color-accent)] font-bold mt-0.5 shrink-0">02</span>
                  双重过滤倒入装满碎冰的飓风杯中
                </li>
                <li className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                  <span className="text-xs text-[var(--color-accent)] font-bold mt-0.5 shrink-0">03</span>
                  苏打水补满，轻轻提拉混合
                </li>
                <li className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                  <span className="text-xs text-[var(--color-accent)] font-bold mt-0.5 shrink-0">04</span>
                  用菠萝角、樱桃和薄荷枝装饰杯口
                </li>
              </ol>
            </div>
          </div>
        </motion.section>

        {/* 底部分割 + 返回 */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)] text-center">
          <Link to="/cocktails" className="text-sm text-[var(--color-accent)] hover:underline">
            返回酒谱，探索更多经典
          </Link>
        </div>
      </div>
    </div>
  )
}
