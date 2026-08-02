import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const qaList = [
  {
    q: "威士忌年份越高就越好吗？",
    a: "威士忌的好坏不能仅用年份高低来判断。初馏品质、橡木桶品质、陈放环境都会在过程中影响酒体及风味。若放进桶内的原液品质就差，放再久也不见得会好。并不是愈老的酒愈好，也有可能熟成太久导致桶味过重、口感过涩。",
  },
  {
    q: "酒液的颜色越深，代表年份越高吗？",
    a: "不一定。颜色取决于橡木桶的种类以及有无添加焦糖调色。在雪莉桶陈年的威士忌很容易就能变成琥珀色；在波本桶陈年，放再久也不可能变成琥珀色。苏格兰威士忌允许添加焦糖调色以确保每批颜色一致。",
  },
  {
    q: "什么是「天使分享」？",
    a: "苏格兰威士忌在橡木桶中陈年时，水分和酒精每年会平均蒸发约 2%，称为「天使分享」（Angel's Share）。储存方式和环境的温湿度都会影响流失速度，以及流失的酒精与水的比例。",
  },
]

function QACard({ q, a, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setOpen(!open)}
      whileHover={{ borderColor: "var(--color-accent)", boxShadow: "0 8px 32px rgba(201, 169, 110, 0.05)" }}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl px-8 py-7 cursor-pointer transition-colors duration-500"
    >
      {/* 问题行 */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg text-white font-serif leading-relaxed">{q}</h3>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown size={20} strokeWidth={1.5} className="text-[var(--color-accent)]" />
        </motion.div>
      </div>

      {/* 答案：展开/收起 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5 mt-5 border-t border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-gray)] leading-loose">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function WhiskyQA() {
  return (
    <section className="w-full h-[100dvh] snap-start flex items-center bg-[var(--color-bg-page)]">
      <div className="w-full max-w-3xl mx-auto px-5 flex flex-col justify-center h-full py-20">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <h2 className="text-4xl text-[var(--color-accent)] tracking-[0.15em] font-serif text-left">
            威士忌入门问答
          </h2>
          <p className="text-base text-[var(--color-text-muted)] italic tracking-wide mt-2">
            你的调酒师朋友不会告诉你的那些事
          </p>
        </motion.div>

        {/* 三张问答卡片 */}
        <div className="flex flex-col gap-5">
          {qaList.map((item, i) => (
            <QACard key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
