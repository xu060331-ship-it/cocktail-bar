import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Shuffle, X, ArrowRight, Sparkles } from "lucide-react"
import { fetchAPI } from "../lib/api"
import { cocktailHeroImg } from "../lib/images"

export default function RandomPicker() {
  const [cocktail, setCocktail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function pickRandom() {
    setLoading(true)
    try {
      const data = await fetchAPI("/api/cocktails/random")
      setCocktail(data)
      setOpen(true)
    } catch (err) {
      console.error("随机推荐失败:", err)
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setOpen(false)
    setCocktail(null)
  }

  return (
    <>
      {/* 浮动按钮 */}
      <motion.button
        onClick={pickRandom}
        disabled={loading}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-bold text-[var(--color-bg-page)] shadow-lg shadow-[var(--color-accent)]/20 transition-all hover:brightness-110 sm:bottom-6 sm:right-6 sm:px-5"
      >
        <Shuffle size={16} strokeWidth={2} className={loading ? "animate-spin" : ""} />
        今天喝什么
      </motion.button>

      {/* 结果弹窗 */}
      <AnimatePresence>
        {open && cocktail && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center font-sans">
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* 卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mx-4 mb-[calc(5.5rem+env(safe-area-inset-bottom))] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl sm:mb-0 sm:max-w-sm"
            >
              {/* 图片 */}
              <div className="h-48 bg-[var(--color-accent-dim)] overflow-hidden">
                <img
                  src={cocktailHeroImg(cocktail.eng)}
                  alt={cocktail.eng}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 关闭按钮 */}
              <button
                onClick={close}
                className="absolute top-3 right-3 bg-black/40 backdrop-blur rounded-full p-1.5 text-[var(--color-text-main)] hover:bg-black/60 transition-colors"
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              {/* 内容 */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} strokeWidth={1.5} className="text-[var(--color-accent)]" />
                  <p className="text-xs text-[var(--color-accent)] tracking-wide">今天试试这杯</p>
                </div>

                <h3 className="text-xl text-[var(--color-text-main)] font-serif mb-1">
                  {cocktail.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || cocktail.eng}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] italic mb-4">{cocktail.eng}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-0.5 rounded-full">{cocktail.cat}</span>
                  {cocktail.taste_tags?.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                  {cocktail.difficulty && (
                    <span className="text-[10px] text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                      {["", "新手", "入门", "进阶", "专业"][cocktail.difficulty]}
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/cocktails/${encodeURIComponent(cocktail.eng)}`}
                    onClick={close}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-accent)] text-[var(--color-bg-page)] py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
                  >
                    查看详情 <ArrowRight size={14} strokeWidth={1.5} />
                  </Link>
                  <button
                    onClick={pickRandom}
                    disabled={loading}
                    className="flex items-center justify-center gap-1 border border-[var(--color-border)] text-[var(--color-text-gray)] hover:text-[var(--color-text-main)] rounded-xl px-4 py-2.5 text-sm transition-colors"
                  >
                    <Shuffle size={14} strokeWidth={1.5} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
