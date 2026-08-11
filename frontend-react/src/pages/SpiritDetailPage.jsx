import { useState, useEffect } from "react"
import { fetchAPI } from "../lib/api";
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ExternalLink, ChevronDown } from "lucide-react"

function ExpandableCard({ item }) {
  const [open, setOpen] = useState(false)
  const hasBody = item.body && item.body.length > 50  // 有长文才可展开

  // 收起时：有desc显示desc，没desc截取body前150字
  const collapsedText = item.desc || (item.body ? item.body.substring(0, 150) + "..." : "")
  const displayText = open && hasBody ? item.body : collapsedText

  return (
    <motion.div
      layout
      onClick={() => hasBody && setOpen(!open)}
      className={`bg-[var(--color-bg-card)] border rounded-xl p-6 transition-all duration-500 ${
        open ? "border-[var(--color-accent)] shadow-[0_0_40px_rgba(201,169,110,0.06)]" : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
      } ${hasBody ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base text-[var(--color-text-main)] font-serif leading-snug flex-1">{item.label}</h3>
        {hasBody && (
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 mt-1">
            <ChevronDown size={16} strokeWidth={1.5} className="text-[var(--color-accent)]" />
          </motion.div>
        )}
      </div>

      {/* 内容区 */}
      <AnimatePresence initial={false}>
        <motion.div
          key={open ? "open" : "closed"}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
            {displayText.split("\n\n").map((para, pi) => (
              <p key={pi} className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-4 last:mb-0">
                {para.trim()}
              </p>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default function SpiritDetailPage() {
  const { name } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAPI(`/api/spirits/${name}`)
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [name])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  if (!data || data.error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">该基酒详情页尚未完成</p>
          <Link to="/spirits" className="text-[var(--color-accent)] hover:underline">返回基酒百科</Link>
        </div>
      </div>
    )
  }

  const details = data.details
  const sections = details ? details.sections : []

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5">
        <Link to="/spirits" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors mb-12">
          <ArrowLeft size={16} strokeWidth={1.5} />
          返回基酒百科
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{data.emoji}</span>
            <div>
              <h1 className="text-5xl text-[var(--color-text-main)] font-serif">{data.name}</h1>
              <p className="text-lg text-[var(--color-text-muted)] italic">{data.eng}</p>
            </div>
          </div>
          {data.hero && (
            <p className="text-base text-[var(--color-text-gray)] leading-relaxed max-w-2xl mt-4">{data.hero}</p>
          )}
        </motion.div>

        {sections.length > 0 ? (
          sections.map((section, si) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: si * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
            >
              <h2 className="text-xl text-[var(--color-accent)] font-serif mb-6 flex items-center gap-3">
                <span className="w-6 h-px bg-[var(--color-accent)]" />
                {section.title}
              </h2>
              <div className="space-y-5">
                {section.items.map((item) => (
                  <ExpandableCard key={item.label} item={item} />
                ))}
              </div>
            </motion.section>
          ))
        ) : (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            详细内容正在撰写中，敬请期待
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center pt-12 border-t border-[var(--color-border)]"
        >
          <Link to="/cocktails" className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:underline text-sm">
            在酒谱中查找所有{data.name}基鸡尾酒 <ExternalLink size={14} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
