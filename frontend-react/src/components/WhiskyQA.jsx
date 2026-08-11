import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const qaList = [
  {
    id: "01",
    q: "威士忌年份越高就越好吗？",
    a: "威士忌的好坏不能仅用年份高低来判断。初馏品质、橡木桶品质、陈放环境都会在过程中影响酒体及风味。若放进桶内的原液品质就差，放再久也不见得会好。并不是愈老的酒愈好，也有可能熟成太久导致桶味过重、口感过涩。",
    detail: "苏格兰法令规定，橡木桶熟陈三年以上才能称之为威士忌。调酒师的主观认定也可能在调和过程中混合高年份或低年份的酒，才能让威士忌有特定的风味展现。",
  },
  {
    id: "02",
    q: "酒液颜色越深，代表年份越高吗？",
    a: "不一定。颜色取决于橡木桶的种类以及有无添加焦糖调色。在雪莉桶陈年的威士忌很容易就能变成琥珀色；在波本桶陈年，放再久也不可能变成琥珀色。",
    detail: "由于每一批原酒的香气、口感、颜色都不一样，调酒师即使能调出同样的香气和口感，也无法调出相同的颜色，所以苏格兰威士忌允许添加焦糖调色，让每批颜色一致。",
  },
  {
    id: "03",
    q: "什么是「天使分享」？",
    a: "苏格兰威士忌在橡木桶中陈年时，水分和酒精每年会平均蒸发约 2%，称为「天使分享」（Angel's Share）。储存方式和环境的温湿度都会影响流失速度。",
    detail: "储藏的方式和环境的温度、湿度，都会影响流失的速度，以及流失的酒精与水的比例。在干燥地区，水分蒸发更快，酒精度反而上升。",
  },
]

export default function WhiskyQA() {
  const [active, setActive] = useState(0)

  return (
    <section className="w-full min-h-[100dvh] snap-start flex bg-[var(--color-bg-page)]">
      <div className="w-full max-w-7xl mx-auto px-5 pt-24 pb-16">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-14"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3 font-serif">WHISKY 101</p>
          <h2 className="text-3xl md:text-4xl text-[var(--color-text-main)] tracking-[0.08em] font-serif leading-tight">
            威士忌入门三问
          </h2>
        </motion.div>

        {/* 左右分栏：手机端竖排，桌面端横排 */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* 上方/左侧：问题列表 — 手机端用小按钮 */}
          <div className="md:w-[40%] shrink-0 flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {qaList.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActive(i)}
                className={`text-left shrink-0 px-4 md:px-7 py-3 md:py-6 rounded-xl md:rounded-2xl border transition-all duration-500 min-w-[140px] md:min-w-0 ${
                  active === i
                    ? "bg-[var(--color-bg-card)] border-[var(--color-accent)]"
                    : "border-[var(--color-border)] md:border-transparent hover:bg-[var(--color-bg-card)] hover:border-[var(--color-border)]"
                }`}
              >
                <span className="text-[10px] text-[var(--color-accent)] tracking-[0.2em] font-serif mb-1 md:mb-2 block">
                  {item.id}
                </span>
                <h3 className={`text-sm md:text-lg font-serif leading-snug md:leading-relaxed transition-colors duration-300 ${
                  active === i ? "text-[var(--color-text-main)]" : "text-[var(--color-text-gray)]"
                }`}>
                  {item.q}
                </h3>
              </motion.button>
            ))}
          </div>

          {/* 下方/右侧：答案展示 */}
          <div className="flex-1 flex items-start md:items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10, x: 0 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 md:p-10"
              >
                <div className="absolute -bottom-6 -right-4 text-[120px] md:text-[180px] font-serif font-bold text-[var(--color-accent)] opacity-[0.04] leading-none select-none pointer-events-none">
                  {qaList[active].id}
                </div>
                <span className="text-[10px] text-[var(--color-accent)] tracking-[0.2em] font-serif mb-4 block">
                  {qaList[active].id} — 答案
                </span>
                <p className="text-sm md:text-lg text-[var(--color-text-gray)] leading-relaxed mb-4 md:mb-6">
                  {qaList[active].a}
                </p>
                <div className="border-t border-[var(--color-border)] pt-4 md:pt-5">
                  <p className="text-xs md:text-sm text-[var(--color-text-muted)] leading-relaxed italic">
                    {qaList[active].detail}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
