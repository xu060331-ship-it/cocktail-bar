import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"

const spirits = [
  {
    eng: "Gin", name: "金酒", emoji: "🍸",
    desc: "杜松子的清香是一切的开端。从伦敦干金到老汤姆金，从荷兰 genever 到日本精酿金酒——植物学家们用几百种药草编织风味迷宫。",
    regions: "英国 · 荷兰 · 日本 · 美国 · 西班牙",
    cocktails: ["干马天尼", "内格罗尼", "金菲士", "新加坡司令", "白色佳人", "飞行"],
  },
  {
    eng: "Vodka", name: "伏特加", emoji: "🍶",
    desc: "纯粹到极致——水与乙醇的二重奏。俄罗斯的黑麦、波兰的马铃薯、瑞典的冬小麦，每一片冻土都孕育着自己的纯净哲学。",
    regions: "俄罗斯 · 波兰 · 瑞典 · 法国 · 美国",
    cocktails: ["大都会", "血腥玛丽", "莫斯科骡子", "咖啡马天尼", "黑俄罗斯", "长岛冰茶"],
  },
  {
    eng: "Rum", name: "朗姆", emoji: "🥃",
    desc: "甘蔗的灵魂在加勒比海的橡木桶里跳舞。白朗姆的清爽、金朗姆的醇厚、黑朗姆的深沉——同一片甘蔗田，三种截然不同的灵魂。",
    regions: "古巴 · 波多黎各 · 牙买加 · 巴巴多斯 · 马提尼克",
    cocktails: ["莫吉托", "大吉利", "迈泰", "椰林飘香", "自由古巴", "僵尸"],
  },
  {
    eng: "Tequila", name: "龙舌兰", emoji: "🌵",
    desc: "墨西哥烈日下，一株蓝色龙舌兰需要七年才能成熟。从 blanco 的青涩到 añejo 的深邃，每一口都是沙漠与时间的对话。梅斯卡尔则用烟熏诉说着更古老的传说。",
    regions: "墨西哥（哈利斯科 · 瓦哈卡 · 米却肯）",
    cocktails: ["玛格丽特", "龙舌兰日出", "帕洛玛", "恶魔", "一柱成名"],
  },
  {
    eng: "Whisky", name: "威士忌", emoji: "🥃",
    desc: "橡木桶里的时间艺术。苏格兰的泥煤烟熏、爱尔兰的三次蒸馏、波本的甜美香草、黑麦的辛辣骨架——同一个名字，大西洋两岸各自成王国。",
    regions: "苏格兰 · 爱尔兰 · 美国 · 加拿大 · 日本 · 印度",
    cocktails: ["古典鸡尾酒", "曼哈顿", "威士忌酸", "花花公子", "盘尼西林", "薄荷茱莉普"],
  },
  {
    eng: "Brandy", name: "白兰地", emoji: "🍇",
    desc: "葡萄酒的灵魂升华。干邑的优雅、雅文邑的粗犷、卡尔瓦多斯的苹果香、皮斯科的南美风情——每一瓶都是水果在蒸馏器里的涅槃。",
    regions: "法国（干邑 · 雅文邑 · 诺曼底）· 西班牙 · 秘鲁 · 智利",
    cocktails: ["边车", "亚历山大", "萨泽拉克", "法国连接", "大都市"],
  },
]

export default function SpiritsPage() {
  const [showSeventh, setShowSeventh] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3">THE FOUNDATION</p>
          <h1 className="text-5xl text-white font-serif mb-3">基酒百科</h1>
          <p className="text-[var(--color-text-gray)] text-lg max-w-2xl">
            六大基酒是所有鸡尾酒的起点。选择一款基酒，探索它的世界——从产地到风味，从经典配方到你尚未听说的变奏。
          </p>
        </motion.div>

        {/* 六大基酒卡片 — 2列大卡 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {spirits.map((s, i) => (
            <motion.div
              key={s.eng}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/spirits/${s.eng.toLowerCase()}`}
                className="block bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 h-full group hover:border-[var(--color-accent)] hover:shadow-[0_0_60px_rgba(201,169,110,0.06)] transition-all duration-500"
              >
                {/* 图标 + 名字 */}
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-dim)] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
                    {s.emoji}
                  </div>
                  <div>
                    <h3 className="text-2xl text-white font-serif">{s.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] italic tracking-wide">{s.eng}</p>
                  </div>
                </div>

                {/* 描述 */}
                <p className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-5">{s.desc}</p>

                {/* 产区 */}
                <div className="flex items-start gap-2 mb-5">
                  <span className="text-[10px] text-[var(--color-text-muted)] shrink-0 mt-0.5">产区</span>
                  <p className="text-xs text-[var(--color-text-gray)]">{s.regions}</p>
                </div>

                {/* 代表鸡尾酒 */}
                <div className="border-t border-[var(--color-border)] pt-4 flex items-center gap-2">
                  <span className="text-[10px] text-[var(--color-text-muted)] shrink-0">代表酒款</span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.cocktails.map((c) => (
                      <span key={c} className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                  <ArrowRight size={14} strokeWidth={1.5} className="text-[var(--color-accent)] ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 第七大基酒？ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setShowSeventh(!showSeventh)}
            className="w-full p-8 flex items-center justify-between text-left hover:bg-[var(--color-accent-dim)] transition-colors duration-300"
          >
            <div className="flex items-center gap-4">
              <Sparkles size={22} strokeWidth={1.5} className="text-[var(--color-accent)]" />
              <div>
                <h3 className="text-xl text-white font-serif">第七大基酒？</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">利口酒、加强酒、苦酒——那些不属于六大基酒但不可或缺的存在</p>
              </div>
            </div>
            <motion.div animate={{ rotate: showSeventh ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={20} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showSeventh && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-8 border-t border-[var(--color-border)]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                    {/* 利口酒 */}
                    <div>
                      <h4 className="text-sm text-[var(--color-accent)] font-serif mb-4">利口酒 Liqueurs</h4>
                      <ul className="space-y-2 text-sm text-[var(--color-text-gray)]">
                        <li>· 君度 Cointreau（橙皮）</li>
                        <li>· 金巴利 Campari（苦草药）</li>
                        <li>· 甜味美思 Sweet Vermouth</li>
                        <li>· 干味美思 Dry Vermouth</li>
                        <li>· 阿佩罗 Aperol（橙香）</li>
                        <li>· 百利甜 Baileys（奶油）</li>
                        <li>· 查特酒 Chartreuse（130种草药）</li>
                        <li>· 黑樱桃利口酒 Maraschino</li>
                        <li>· 加利亚诺 Galliano（香草）</li>
                        <li>· 杏仁糖浆 Orgeat</li>
                      </ul>
                    </div>

                    {/* 加强酒 */}
                    <div>
                      <h4 className="text-sm text-[var(--color-accent)] font-serif mb-4">加强酒 Fortified Wines</h4>
                      <ul className="space-y-2 text-sm text-[var(--color-text-gray)]">
                        <li>· 雪莉酒 Sherry（Fino / Oloroso）</li>
                        <li>· 波特酒 Port（Ruby / Tawny）</li>
                        <li>· 马德拉 Madeira</li>
                        <li>· 马萨拉 Marsala</li>
                        <li>· 味美思 Vermouth（干 / 甜）</li>
                        <li>· 杜本内 Dubonnet</li>
                        <li>· 利莱 Lillet</li>
                      </ul>
                    </div>

                    {/* 苦酒与烈性酒 */}
                    <div>
                      <h4 className="text-sm text-[var(--color-accent)] font-serif mb-4">苦酒 & 其他烈酒</h4>
                      <ul className="space-y-2 text-sm text-[var(--color-text-gray)]">
                        <li>· 安格斯特拉苦精 Angostura</li>
                        <li>· 佩肖苦精 Peychaud's</li>
                        <li>· 橙味苦精 Orange Bitters</li>
                        <li>· 苦艾酒 Absinthe</li>
                        <li>· 阿夸维特 Aquavit（北欧）</li>
                        <li>· 烧酎 Shochu（日本）</li>
                        <li>· 白酒 Baijiu（中国）</li>
                        <li>· 格拉巴 Grappa（意大利）</li>
                        <li>· 皮斯科 Pisco（秘鲁/智利）</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--color-text-muted)] italic mt-8 pt-6 border-t border-[var(--color-border)]">
                    利口酒不是基酒，但没有它们就没有鸡尾酒的层次感。它们是调酒师的调色盘——用苦味、甜味、药草和果香为基酒画上最后一笔。
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
