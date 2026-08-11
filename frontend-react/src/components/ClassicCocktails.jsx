import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cocktailImg } from "../lib/images"

const feature = {
  name: "干马天尼",
  eng: "Dry Martini",
  emoji: "🍸",
  spirit: "金酒",
  method: "搅拌法",
  recipe: "金酒 60ml · 干味美思 10ml",
  note: "摇晃，不要搅拌 — 詹姆斯·邦德",
  desc: "鸡尾酒之王。冰镇马天尼杯，橄榄一颗，清澈如北极冰层下的海水。它是优雅的极致，也是007的签名。",
}

const threeCards = [
  {
    name: "大吉利", eng: "Daiquiri", emoji: "🍋", spirit: "朗姆", method: "摇和法",
    recipe: "白朗姆 60ml · 青柠汁 20ml · 细砂糖",
    note: "海明威在哈瓦那的日常伴侣",
  },
  {
    name: "花花公子", eng: "Boulevardier", emoji: "🥃", spirit: "威士忌", method: "搅拌法",
    recipe: "波本 45ml · 金巴利 · 甜味美思",
    note: "内格罗尼的威士忌变奏",
  },
  {
    name: "亚历山大", eng: "Alexander", emoji: "🍫", spirit: "白兰地", method: "摇和法",
    recipe: "白兰地 30ml · 可可利口酒 · 鲜奶油",
    note: "丝滑如甜点，二十世纪初的社交名饮",
  },
]

export default function ClassicCocktails() {
  return (
    <section className="w-full min-h-[100dvh] snap-start flex bg-[var(--color-bg-page)]">
      <div className="w-full max-w-7xl mx-auto px-5 flex flex-col lg:flex-row gap-6 md:gap-10 h-full pt-16 md:pt-24 pb-10 md:pb-16">

        {/* ===== 左侧：一张大卡（桌面端占 40%，手机端全宽） ===== */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[42%] shrink-0 flex flex-col min-h-[320px]"
        >
          {/* 区块标题 */}
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3 font-serif">IBA OFFICIAL</p>
            <h2 className="text-4xl text-[var(--color-text-main)] tracking-[0.08em] font-serif leading-tight">
              经典鸡尾酒
            </h2>
          </div>

          {/* 大卡 */}
          <div className="flex-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col">
            {/* 大图区 */}
            <div className="h-[55%] bg-[var(--color-accent-dim)] border-b border-[var(--color-border)] overflow-hidden">
              <img src={cocktailImg(feature.eng)} alt={feature.name} className="w-full h-full object-cover" />
            </div>
            {/* 信息区 */}
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="text-[11px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-3 py-1 rounded-full">{feature.spirit}</span>
                  <span className="text-[11px] bg-[var(--color-border)] text-[var(--color-text-gray)] px-3 py-1 rounded-full">{feature.method}</span>
                </div>
                <h3 className="text-2xl text-[var(--color-text-main)] font-serif mb-1">{feature.name}</h3>
                <p className="text-xs text-[var(--color-text-muted)] italic mb-4">{feature.eng}</p>
                <p className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-4">{feature.desc}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-4 mt-2">{feature.recipe}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== 右侧：3 张小卡竖排（占 58%） ===== */}
        <div className="flex-1 flex flex-col">
          {/* 区块标题占位（跟左侧对齐高度） */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-[var(--color-text-muted)] italic tracking-wide">
              每一杯都是调酒史上的里程碑
            </p>
            <Link to="/cocktails" className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline">
              查看全部 <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>

          {/* 3 张卡竖排 */}
          <div className="flex-1 flex flex-col gap-4">
            {threeCards.map((c, i) => (
              <motion.div
                key={c.eng}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 6, borderColor: "var(--color-accent)" }}
                className="flex-1 flex items-center gap-5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl px-6 cursor-pointer transition-colors duration-500"
              >
                {/* 小圆图 */}
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent-dim)] border border-[var(--color-border)] overflow-hidden shrink-0">
                  <img src={cocktailImg(c.eng)} alt={c.name} className="w-full h-full object-cover" />
                </div>
                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg text-[var(--color-text-main)] font-serif">{c.name}</h3>
                    <span className="text-xs text-[var(--color-text-muted)] italic">{c.eng}</span>
                  </div>
                  <div className="flex gap-2 mb-1.5">
                    <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-0.5 rounded-full">{c.spirit}</span>
                    <span className="text-[10px] bg-[var(--color-border)] text-[var(--color-text-gray)] px-2 py-0.5 rounded-full">{c.method}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-gray)]">{c.recipe}</p>
                </div>
                {/* 名句 */}
                <p className="text-[11px] text-[var(--color-text-muted)] italic text-right shrink-0 max-w-[120px] leading-snug hidden lg:block">
                  {c.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
