import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, RotateCw, Check, BookOpen, Sparkles } from "lucide-react"

const CATEGORY_LABELS = {
  cocktail: "🍸 鸡尾酒",
  technique: "🔧 调酒手法",
  spirit: "🥃 基酒知识",
  term: "📖 术语",
  glassware: "🍷 杯型",
  recipe: "🍹 经典配方",
  tip: "💡 调酒提醒",
}

const DIFFICULTY_COLORS = {
  1: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  2: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  3: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  4: "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

const DIFFICULTY_LABELS = { 1: "入门", 2: "进阶", 3: "高级", 4: "挑战" }

export default function FlashCard({ cards, masteredIds, onMaster, onReview, loading }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [direction, setDirection] = useState(1) // 1=forward, -1=backward

  const card = cards[index]
  const isMastered = card ? masteredIds.includes(card.id) : false

  // Reset flip when card changes
  useEffect(() => {
    setFlipped(false)
  }, [index])

  const goNext = useCallback(() => {
    if (index < cards.length - 1) {
      setDirection(1)
      setIndex(index + 1)
    }
  }, [index, cards.length])

  const goPrev = useCallback(() => {
    if (index > 0) {
      setDirection(-1)
      setIndex(index - 1)
    }
  }, [index])

  const handleFlip = () => {
    if (!flipped && !isMastered) {
      // Auto-mark as reviewed when flipping
      onReview(card.id)
    }
    setFlipped(!flipped)
  }

  const handleMaster = (e) => {
    e.stopPropagation()
    onMaster(card.id)
  }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        handleFlip()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goNext, goPrev, flipped, index])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-accent-dim)] flex items-center justify-center">
            <Sparkles size={28} strokeWidth={1.5} className="text-[var(--color-accent)] animate-pulse" />
          </div>
          <p className="text-[var(--color-text-muted)] text-sm">正在准备卡片...</p>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <BookOpen size={40} strokeWidth={1.5} className="mx-auto mb-4 text-[var(--color-text-muted)] opacity-40" />
          <p className="text-[var(--color-text-muted)]">暂无卡片</p>
        </div>
      </div>
    )
  }

  const progress = ((index + 1) / cards.length) * 100

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-2">
          <span>{index + 1} / {cards.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-accent)] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="perspective-[1000px] mb-6" style={{ minHeight: 320 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${card.id}-${flipped}`}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
            style={{ minHeight: 320 }}
          >
            <div
              onClick={handleFlip}
              className={`
                relative w-full cursor-pointer select-none
                bg-[var(--color-bg-card)] border rounded-2xl p-8
                transition-all duration-300 hover:border-[var(--color-accent)]
                ${flipped
                  ? "border-[var(--color-accent)]/40 shadow-lg shadow-[var(--color-accent)]/5"
                  : "border-[var(--color-border)] shadow-sm"
                }
                ${isMastered ? "ring-1 ring-emerald-500/30" : ""}
              `}
              style={{ minHeight: 320 }}
            >
              {/* Top badges */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full">
                  {CATEGORY_LABELS[card.category] || card.category}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[card.difficulty] || DIFFICULTY_COLORS[1]}`}>
                  {DIFFICULTY_LABELS[card.difficulty] || "入门"}
                </span>
                {isMastered && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check size={10} strokeWidth={2.5} />
                    已掌握
                  </span>
                )}
              </div>

              {/* Content */}
              {!flipped ? (
                <div className="flex flex-col justify-center" style={{ minHeight: 200 }}>
                  <p className="text-lg text-[var(--color-text-main)] font-serif leading-relaxed mb-4">
                    {card.question}
                  </p>
                  {card.hint && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-auto flex items-center gap-1">
                      <Sparkles size={11} strokeWidth={1.5} className="text-[var(--color-accent)]" />
                      提示：{card.hint}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col" style={{ minHeight: 200 }}>
                  <p className="text-sm text-[var(--color-text-gray)] leading-relaxed whitespace-pre-line">
                    {card.answer}
                  </p>
                </div>
              )}

              {/* Flip hint */}
              <div className="absolute bottom-4 right-4">
                <p className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                  <RotateCw size={10} strokeWidth={1.5} />
                  {flipped ? "点击翻回" : "点击翻转"}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          上一张
        </button>

        <div className="flex items-center gap-3">
          {flipped && !isMastered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleMaster}
              className="flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-4 py-2 hover:bg-emerald-500/30 transition-colors"
            >
              <Check size={14} strokeWidth={2} />
              记住了
            </motion.button>
          )}
          {flipped && isMastered && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Check size={14} strokeWidth={2} />
              已掌握
            </span>
          )}
        </div>

        <button
          onClick={goNext}
          disabled={index === cards.length - 1}
          className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2"
        >
          下一张
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Keyboard hints */}
      <p className="text-center text-[10px] text-[var(--color-text-muted)] mt-6 opacity-50">
        ← → 切换卡片 · 空格键 翻转
      </p>
    </div>
  )
}
