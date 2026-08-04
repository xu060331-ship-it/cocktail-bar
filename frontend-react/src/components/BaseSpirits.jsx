import { useState } from "react"
import { motion } from "framer-motion"
import { Beer, Waves, Flame, Grape, Leaf, Snowflake } from "lucide-react"

const spirits = [
  {
    name: "金酒", eng: "Gin",
    desc: "杜松子的清香，药草的层次。伦敦干金、老汤姆金——每一瓶都是植物学家调配的香水。",
    icon: Leaf, bar: "bg-gradient-to-r from-emerald-500/60 to-emerald-400/20",
  },
  {
    name: "伏特加", eng: "Vodka",
    desc: "纯粹透明，调酒的白色画布。从俄罗斯冻原到波兰平原，谷物、马铃薯、葡萄皆可为之。",
    icon: Snowflake, bar: "bg-gradient-to-r from-slate-400/60 to-slate-300/20",
  },
  {
    name: "朗姆", eng: "Rum",
    desc: "甘蔗的灵魂，加勒比海的风。白朗姆清爽、金朗姆醇厚、黑朗姆深沉——同一源头，三种性格。",
    icon: Waves, bar: "bg-gradient-to-r from-amber-500/60 to-amber-400/20",
  },
  {
    name: "龙舌兰", eng: "Tequila",
    desc: "墨西哥烈日下的蓝色信仰。一株蓝色龙舌兰需七年成熟，每一口都是时间的耐心。",
    icon: Flame, bar: "bg-gradient-to-r from-lime-500/60 to-lime-400/20",
  },
  {
    name: "威士忌", eng: "Whisky",
    desc: "橡木桶里的时间艺术。苏格兰的烟熏、爱尔兰的顺滑、波本的甜美——同一个名字，千种风味。",
    icon: Beer, bar: "bg-gradient-to-r from-orange-500/60 to-orange-400/20",
  },
  {
    name: "白兰地", eng: "Brandy",
    desc: "葡萄的灵魂，法国的骄傲。从干邑到雅文邑，从水果白兰地到渣酿白兰地，都是蒸馏的艺术。",
    icon: Grape, bar: "bg-gradient-to-r from-rose-500/60 to-rose-400/20",
  },
]

function SpiritCard({ s, index, isHovered, onHover, onLeave }) {
  const Icon = s.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      animate={{
        scale: isHovered ? 1.04 : 1,
        opacity: isHovered === null ? 1 : isHovered ? 1 : 0.4,
        filter: isHovered === null ? "blur(0px)" : isHovered ? "blur(0px)" : "blur(1.5px)",
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 cursor-pointer overflow-hidden"
    >
      {/* 顶部彩色条 — 每个酒一个专属颜色 */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${s.bar} rounded-t-2xl`} />

      {/* 图标 */}
      <div className="flex items-center gap-4 mb-4 mt-2">
        <div className="w-14 h-14 rounded-xl bg-[var(--color-accent-dim)] flex items-center justify-center group-hover:bg-[var(--color-accent-dim)] transition-colors">
          <Icon size={28} strokeWidth={1.5} className="text-[var(--color-accent)]" />
        </div>
        <div>
          <h3 className="text-lg text-white font-serif leading-none mb-1">{s.name}</h3>
          <p className="text-[11px] text-[var(--color-text-muted)] italic tracking-wide">{s.eng}</p>
        </div>
      </div>

      {/* 描述 — hover 时密度增加 */}
      <p className="text-base text-[var(--color-text-gray)] leading-relaxed">{s.desc}</p>

      {/* Hover 时琥珀微光覆盖 */}
      <motion.div
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-[var(--color-accent)] pointer-events-none rounded-2xl"
      />
    </motion.div>
  )
}

export default function BaseSpirits() {
  const [hovered, setHovered] = useState(null)

  return (
    <section className="w-full h-[100dvh] snap-start flex items-center bg-[var(--color-bg-page)]">
      <div className="w-full max-w-7xl mx-auto px-5 flex flex-col justify-center h-full py-16">

        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3 font-serif">
            THE FOUNDATION
          </p>
          <h2 className="text-4xl text-white tracking-[0.08em] font-serif leading-tight">
            六大基酒
          </h2>
          <p className="text-base text-[var(--color-text-muted)] italic tracking-wide mt-2">
            悬浮一张卡片，聚光灯会暗淡其余
          </p>
        </motion.div>

        {/* 3×2 聚焦网格 */}
        <div className="grid grid-cols-3 gap-5">
          {spirits.map((s, i) => (
            <SpiritCard
              key={s.eng}
              s={s}
              index={i}
              isHovered={hovered === null ? null : hovered === i}
              onHover={setHovered}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
