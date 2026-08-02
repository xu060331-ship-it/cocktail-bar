import { motion } from "framer-motion"

const spirits = [
  { name: "金酒", eng: "Gin", emoji: "🍸", desc: "杜松子的清香，药草的层次" },
  { name: "伏特加", eng: "Vodka", emoji: "🍶", desc: "纯粹透明，调酒的白色画布" },
  { name: "朗姆", eng: "Rum", emoji: "🥃", desc: "甘蔗的灵魂，加勒比海的风" },
  { name: "龙舌兰", eng: "Tequila", emoji: "🌵", desc: "墨西哥烈日下的蓝色信仰" },
  { name: "威士忌", eng: "Whisky", emoji: "🥃", desc: "橡木桶里的时间艺术" },
  { name: "白兰地", eng: "Brandy", emoji: "🍇", desc: "葡萄的灵魂，法国的骄傲" },
]

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function BaseSpirits() {
  return (
    <section className="w-full h-[100dvh] snap-start flex items-center bg-[var(--color-bg-page)]">
      <div className="w-full max-w-4xl mx-auto px-5 flex flex-col justify-center h-full py-20">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <h2 className="text-4xl text-[var(--color-accent)] tracking-[0.15em] font-serif text-left">
            六大基酒
          </h2>
          <p className="text-base text-[var(--color-text-muted)] italic tracking-wide mt-2">
            每一瓶背后，都藏着一个国家的风土与脾气
          </p>
        </motion.div>

        {/* 3x2 网格 */}
        <div className="grid grid-cols-3 gap-x-10 gap-y-8 w-full">
          {spirits.map((s, i) => (
            <motion.a
              key={s.eng}
              href="#"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={itemVariants}
              whileHover={{
                borderColor: "var(--color-accent)",
                boxShadow: "0 16px 48px rgba(201, 169, 110, 0.06)",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center text-center py-10 px-4 rounded-2xl border border-transparent"
            >
              {/* 圆形图标 */}
              <div className="w-24 h-24 rounded-full bg-[var(--color-accent-dim)] border-2 border-[var(--color-border)] flex items-center justify-center text-4xl mb-5 transition-colors duration-300 group-hover:border-[var(--color-accent)]">
                {s.emoji}
              </div>

              <h3 className="text-xl text-white mb-0.5 font-serif">{s.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] italic tracking-wide mb-3">
                {s.eng}
              </p>
              <p className="text-sm text-[var(--color-text-gray)] leading-relaxed">{s.desc}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
