import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, GlassWater } from "lucide-react"
import cocktailsData from "../data/cocktails.json"

// 新加坡司令的完整历史
const singaporeSlingStory = {
  origin: {
    title: "诞生：1915 年的莱佛士酒店",
    body: `新加坡司令诞生于 1915 年，地点是新加坡莱佛士酒店（Raffles Hotel）的长酒吧（Long Bar）。创造者是时任酒吧调酒师严崇文（Ngiam Tong Boon）。

当时的社交礼仪规定，女士不能在公共场合饮用烈酒。但莱佛士酒店的女士们看着男士们畅饮金酒和威士忌，心中难免不平。严崇文看到了这个需求——他想要创造一款"看起来像果汁、喝起来是鸡尾酒"的饮品，让女士们在社交场合也能优雅地手持一杯红色饮品，而不被指责"饮酒失态"。

他在金酒的基础上加入了樱桃利口酒、橙皮利口酒、菠萝汁和青柠汁，用大量果汁遮盖酒味，再用石榴糖浆调出诱人的粉红色——新加坡司令就此诞生。`,
  },
  funFact: {
    title: "趣味事实：从长酒吧到全世界",
    body: `新加坡司令的名字来源于"司令"（Sling）——这是一种 19 世纪末在美国流行起来的饮料类型，指的是用烈酒、水、糖和柠檬汁调制的长饮。严崇文在前人的基础上做了革命性的改造：用果汁代替水、加入多种利口酒增加复杂度、用石榴糖浆赋予标志性的粉红色。

莱佛士酒店至今每天还在卖出数百杯新加坡司令。酒吧的地板上铺满了花生壳——长酒吧有个传统：吃花生可以随手把壳丢在地上。这是新加坡唯一一个"乱扔垃圾合法"的地方。

原始配方在 1930 年代遗失，现在的酒保们使用的是后人根据记忆和笔记重建的版本。但那个"粉红色的骗局"——看起来像果汁、实际上是烈酒——至今仍是全世界鸡尾酒单上最受欢迎的饮品之一。`,
  },
  legacy: {
    title: "延伸：一座城市的名片",
    body: `新加坡司令早已超越了"一杯酒"的定义，成为新加坡的文化符号。新加坡航空在头等舱和商务舱免费供应新加坡司令；新加坡的旅游宣传片里少不了长酒吧和这杯粉红色的身影；全球几乎每一家自称"经典"的鸡尾酒吧都会把它写进酒单。

但讽刺的是，今天你在世界各地喝到的新加坡司令，大多不是严崇文的原始版本。商业化生产让很多酒吧用预调糖浆代替新鲜果汁，用菠萝罐头汁代替鲜榨菠萝汁，出品变成一杯甜腻的粉色糖水。

真正的拥护者坚持：新加坡司令必须是现调的，用新鲜菠萝汁、新鲜青柠汁，金酒必须是伦敦干金，石榴糖浆只能放一点点。"粉红色是伪装，金酒是灵魂。"`,
  },
}

// 从 JSON 取配料
function getCocktail(engName) {
  return cocktailsData.find((c) => c.eng === engName) || null
}

export default function CocktailDetailPage() {
  const { name } = useParams()
  const cocktail = getCocktail(name)

  if (!cocktail) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">未找到该鸡尾酒</p>
          <Link to="/cocktails" className="text-[var(--color-accent)] hover:underline">返回酒谱</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif">
      {/* 返回按钮 */}
      <div className="fixed top-20 left-6 z-40">
        <Link
          to="/cocktails"
          className="flex items-center gap-2 text-sm text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-4 py-2"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          返回酒谱
        </Link>
      </div>

      {/* Hero 大图 */}
      <div className="w-full h-[55vh] bg-[var(--color-accent-dim)] flex items-center justify-center text-8xl border-b border-[var(--color-border)]">
        🍹
      </div>

      {/* 内容区 */}
      <div className="max-w-3xl mx-auto px-5 py-16">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-4">SINGAPORE SLING</p>
          <h1 className="text-5xl md:text-6xl text-white font-serif leading-tight mb-4">新加坡司令</h1>
          <p className="text-lg text-[var(--color-text-muted)] italic">Singapore Sling</p>

          <div className="flex gap-3 mt-6">
            <span className="text-xs bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-3 py-1 rounded-full">金酒基</span>
            <span className="text-xs bg-[var(--color-border)] text-[var(--color-text-gray)] px-3 py-1 rounded-full">摇和法</span>
            <span className="text-xs bg-[var(--color-border)] text-[var(--color-text-gray)] px-3 py-1 rounded-full">IBA 当代经典</span>
          </div>
        </motion.div>

        {/* 历史故事 — 三段式 */}
        {[singaporeSlingStory.origin, singaporeSlingStory.funFact, singaporeSlingStory.legacy].map((section, i) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] text-[var(--color-accent)] tracking-[0.2em] font-serif">
                {["起源", "趣闻", "延伸"][i]}
              </span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>
            <h2 className="text-2xl text-white font-serif mb-6 leading-snug">{section.title}</h2>
            {section.body.split("\n\n").map((para, pi) => (
              <p key={pi} className="text-[var(--color-text-gray)] leading-loose text-base mb-5">
                {para.trim()}
              </p>
            ))}
          </motion.section>
        ))}

        {/* 配料 + 调制方法 */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <GlassWater size={18} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <h2 className="text-xl text-white font-serif">配方与调制</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 配料 */}
            <div>
              <h3 className="text-sm text-[var(--color-accent)] tracking-wide mb-4">配料</h3>
              <ul className="space-y-3">
                {cocktail.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* 调制方法 */}
            <div>
              <h3 className="text-sm text-[var(--color-accent)] tracking-wide mb-4">
                <Clock size={14} strokeWidth={1.5} className="inline mr-1" />
                调制步骤
              </h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                  <span className="text-xs text-[var(--color-accent)] font-bold mt-0.5 shrink-0">01</span>
                  将所有配料加入摇酒壶，加冰用力摇和 10-12 秒
                </li>
                <li className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                  <span className="text-xs text-[var(--color-accent)] font-bold mt-0.5 shrink-0">02</span>
                  双重过滤倒入装满碎冰的飓风杯中
                </li>
                <li className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                  <span className="text-xs text-[var(--color-accent)] font-bold mt-0.5 shrink-0">03</span>
                  苏打水补满，轻轻提拉混合
                </li>
                <li className="flex items-start gap-3 text-sm text-[var(--color-text-gray)]">
                  <span className="text-xs text-[var(--color-accent)] font-bold mt-0.5 shrink-0">04</span>
                  用菠萝角、樱桃和薄荷枝装饰杯口
                </li>
              </ol>
            </div>
          </div>
        </motion.section>

        {/* 底部分割 + 返回 */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)] text-center">
          <Link to="/cocktails" className="text-sm text-[var(--color-accent)] hover:underline">
            返回酒谱，探索更多经典
          </Link>
        </div>
      </div>
    </div>
  )
}
