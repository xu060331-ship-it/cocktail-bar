import { motion } from "framer-motion"

const cocktails = [
  {
    name: "干马天尼",
    eng: "Dry Martini",
    emoji: "🍸",
    spirit: "金酒",
    method: "搅拌法",
    recipe: "金酒 60ml · 干味美思 10ml",
    note: "摇晃，不要搅拌 - 詹姆斯·邦德",
  },
  {
    name: "大吉利",
    eng: "Daiquiri",
    emoji: "🍋",
    spirit: "朗姆",
    method: "摇和法",
    recipe: "白朗姆 60ml · 青柠汁 20ml · 细砂糖",
    note: "海明威在哈瓦那的日常伴侣",
  },
  {
    name: "亚历山大",
    eng: "Alexander",
    emoji: "🍫",
    spirit: "白兰地",
    method: "摇和法",
    recipe: "白兰地 30ml · 可可利口酒 · 鲜奶油",
    note: "丝滑如甜点，二十世纪初的社交名饮",
  },
  {
    name: "花花公子",
    eng: "Boulevardier",
    emoji: "🥃",
    spirit: "威士忌",
    method: "搅拌法",
    recipe: "波本 45ml · 金巴利 · 甜味美思",
    note: "内格罗尼的威士忌变奏，更醇厚深邃",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export default function ClassicCocktails() {
  return (
    <section className="w-full h-[100dvh] snap-start flex items-center bg-[var(--color-bg-page)]">
      <div className="w-full max-w-6xl mx-auto px-5 flex flex-col justify-center h-full py-20">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <h2 className="text-4xl text-[var(--color-accent)] tracking-[0.15em] font-serif text-left">
            IBA 官方经典鸡尾酒
          </h2>
          <p className="text-base text-[var(--color-text-muted)] italic tracking-wide mt-2">
            每一杯都是调酒史上的里程碑
          </p>
        </motion.div>

        {/* 4 列卡片 */}
        <div className="grid grid-cols-4 gap-6 w-full">
          {cocktails.map((c, i) => (
            <motion.div
              key={c.eng}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              whileHover={{
                y: -8,
                borderColor: "var(--color-accent)",
                boxShadow: "0 20px 60px rgba(201, 169, 110, 0.08)",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center text-center bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl px-5 pt-10 pb-8 cursor-pointer"
            >
              {/* 圆形图片区 */}
              <div className="w-28 h-28 rounded-full bg-[var(--color-accent-dim)] border-2 border-[var(--color-border)] flex items-center justify-center text-5xl mb-5">
                {c.emoji}
              </div>

              {/* 标签 */}
              <div className="flex gap-2 mb-4">
                <span className="text-[11px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full">
                  {c.spirit}
                </span>
                <span className="text-[11px] bg-[var(--color-border)] text-[var(--color-text-gray)] px-2.5 py-0.5 rounded-full">
                  {c.method}
                </span>
              </div>

              <h3 className="text-xl text-white mb-0.5 font-serif">{c.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] italic mb-4">{c.eng}</p>

              {/* 配方 + 分割线 */}
              <p className="text-sm text-[var(--color-text-gray)] pb-4 mb-3 border-b border-[var(--color-border)] w-full">
                {c.recipe}
              </p>

              <p className="text-xs text-[var(--color-text-muted)] italic leading-relaxed">{c.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
