import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { spiritImg } from "../lib/images"
import { fetchAPI } from "../lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"

const seventhData = [
  { title: "利口酒 Liqueurs", desc: "利口酒不是基酒，但没有它们就没有鸡尾酒的层次感。", items: [
    { name: "君度 Cointreau", desc: "法国橙皮利口酒——用海地、巴西和西班牙的苦橙皮与甜橙皮混合浸渍——橙香清澈、微苦与糖浆甜完美平衡。它是玛格丽特、边车和大都会不可或缺的橙味维度。" },
    { name: "金巴利 Campari", desc: "意大利苦味利口酒——用多达60种药草和水果在酒精和水中浸渍——标志性的深红色和独特的苦甜味是内格罗尼和美国佬的灵魂。金巴利的完整配方是严格保密的商业机密。" },
    { name: "甜味美思 Sweet Vermouth", desc: "意大利甜味美思——以白葡萄酒为基酒加入数十种药草和香料浸泡——最后加糖平衡苦味。曼哈顿和内格罗尼如果没有一瓶好的甜味美思就无法存在。代表：Cocchi Storico、Cinzano 1757。" },
    { name: "干味美思 Dry Vermouth", desc: "法国干味美思——不加糖或少加糖——药草味脆、尖锐、干燥。它是干马天尼的另一半。代表：Noilly Prat Original Dry。" },
    { name: "查特酒 Chartreuse", desc: "法国查特酒——由卡尔特教团修士按1737年配方用超过130种药草秘制。绿色查特酒（55% ABV）是全世界最复杂的利口酒之一。黄色查特酒（40% ABV）更柔和更甜。" },
    { name: "黑樱桃利口酒 Maraschino", desc: "意大利黑樱桃利口酒——用马尔拉斯卡樱桃连果肉带碎核蒸馏——带有独特的微苦杏仁和樱桃芳香。它是飞行鸡尾酒和最后的话的关键配料。代表：Luxardo Maraschino。" },
  ]},
  { title: "加强酒 Fortified Wines", desc: "加强酒是加入白兰地的葡萄酒，保留了葡萄酒的复杂风味，拥有烈酒的力度。", items: [
    { name: "雪莉酒 Sherry", desc: "西班牙赫雷斯产的加强葡萄酒——Fino在酒花下陈年——尖锐、杏仁、咸味；Oloroso暴露于空气中氧化——饱满、坚果、皮革；PX用晒干的葡萄酿造——深黑、蜜糖、无花果干。调酒界最被低估的原料。" },
    { name: "波特酒 Port", desc: "葡萄牙杜罗河谷的加强红葡萄酒。Ruby——果香浓郁、深红宝石色；Tawny——在橡木桶中氧化陈年、深琥珀色、坚果和太妃糖风味。可用于替代甜味美思调制深色烈酒鸡尾酒。" },
    { name: "马德拉 Madeira", desc: "葡萄牙马德拉岛——经过独特的\"马德拉化\"高温加热工艺——赋予烘烤坚果、焦糖和烟熏风味。世界上最耐储存的葡萄酒——开瓶后数月不变质。" },
    { name: "利莱 Lillet", desc: "法国加香型加强葡萄酒——波尔多白葡萄酒基酒加入柑橘利口酒和奎宁水——微甜、花香。Lillet Blanc是20世纪初餐前酒的经典——冷藏后纯饮或加冰。" },
  ]},
  { title: "苦酒 & 其他烈酒", desc: "苦精不是鸡尾酒——它是鸡尾酒的调味品。几滴苦精在Old Fashioned中改变一切。", items: [
    { name: "安格斯特拉苦精 Angostura Bitters", desc: "特立尼达岛产芳香苦精——1824年由德国军医在西蒙·玻利瓦尔军队中发明。44种秘密原料——龙胆根、肉桂、丁香、豆蔻。Old Fashioned需要两滴，曼哈顿也需要两滴——全世界每一间酒吧吧台上都有一瓶。" },
    { name: "苦艾酒 Absinthe", desc: "瑞士/法国茴香烈酒——用大茴香、茴香和大艾草蒸馏——强烈的茴香和药草风味。19世纪末被多国禁止——现代科学推翻其致幻说法。2007年美国解禁。饮用时加冰水——水让茴香化合物析出形成白色浑浊。" },
    { name: "皮斯科 Pisco", desc: "秘鲁和智利产的白兰地——芳香葡萄品种蒸馏——不加水不陈年——保留葡萄最原始的花果香。皮斯科酸是南美洲最著名的鸡尾酒。秘鲁和智利两国都声称皮斯科是本国国饮。" },
    { name: "白酒 Baijiu", desc: "中国白酒——全球销量最大的烈酒——年消费量超100亿升。以高粱为原料用特有的\"曲\"（霉菌和酵母发酵剂）在泥窖中固态发酵蒸馏。酱香型（茅台）和浓香型是两大主力香型。" },
    { name: "阿夸维特 Aquavit", desc: "北欧谷物烈酒——以葛缕子或莳萝为主要调味植物——斯堪的纳维亚的国饮。挪威Linie品牌的酒桶会装船经过赤道航行后再开桶——温度波动据说可加速成熟。" },
    { name: "烧酎 Shochu", desc: "日本烧酎——红薯、大麦或米为原料——单次蒸馏——约25% ABV——比威士忌轻但比清酒烈。可以纯饮、加冰、加热水或作为低酒精度鸡尾酒基酒。" },
  ]},
]

function SeventhItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer group">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-[var(--color-text-gray)] group-hover:text-white transition-colors">{item.name}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
          <ChevronDown size={12} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed pt-2 pb-3 pl-1">{item.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SpiritsPage() {
  const [spirits, setSpirits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSeventh, setShowSeventh] = useState(false)

  useEffect(() => {
    fetchAPI("/api/spirits")
      .then((data) => {
        setSpirits(data)
        setLoading(false)
      })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-3">基酒数据加载失败</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-[var(--color-accent)] border border-[var(--color-accent)] rounded-full px-6 py-2 hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-page)] transition-colors">
            重新加载
          </button>
        </div>
      </div>
    )
  }

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
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-dim)] overflow-hidden group-hover:scale-110 transition-transform duration-500 shrink-0">
                    <img src={spiritImg(s.slug || s.eng)} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <h3 className="text-2xl text-white font-serif">{s.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] italic tracking-wide">{s.eng}</p>
                  </div>
                </div>

                {/* 描述 */}
                <p className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-5">{s.desc}</p>

                <div className="border-t border-[var(--color-border)] pt-4 flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-muted)]">点击探索 {s.name} 的世界</span>
                  <ArrowRight size={14} strokeWidth={1.5} className="text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    {seventhData.map((col) => (
                      <div key={col.title}>
                        <h4 className="text-sm text-[var(--color-accent)] font-serif mb-3">{col.title}</h4>
                        <p className="text-xs text-[var(--color-text-muted)] mb-4">{col.desc}</p>
                        <div className="space-y-3">
                          {col.items.map((item) => (
                            <SeventhItem key={item.name} item={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
