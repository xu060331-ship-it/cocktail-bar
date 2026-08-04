import { useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Clock, User, Sparkles, RefreshCw } from "lucide-react"
import cocktailsData from "../data/cocktails.json"

// 用今天的日期做伪随机种子 — 同一天刷出来的一样
function seededRandom(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  }
  return () => {
    h = (h * 1103515245 + 12345) | 0
    return (h >>> 0) / 0xffffffff
  }
}

function pick(arr, rand, n) {
  const shuffled = [...arr].sort(() => rand() - 0.5)
  return shuffled.slice(0, n)
}

const spirits = [
  { eng: "Gin", name: "金酒", emoji: "🍸", slug: "gin", desc: "杜松子的清香，药草的层次。从伦敦干金到日本精酿，植物学家们用几百种药草编织风味迷宫。" },
  { eng: "Vodka", name: "伏特加", emoji: "🍶", slug: "vodka", desc: "纯粹到极致——水与乙醇的二重奏。俄罗斯的黑麦、波兰的马铃薯、瑞典的冬小麦。" },
  { eng: "Rum", name: "朗姆", emoji: "🥃", slug: "rum", desc: "甘蔗的灵魂在加勒比海的橡木桶里跳舞。白朗姆清爽、金朗姆醇厚、黑朗姆深沉。" },
  { eng: "Tequila", name: "龙舌兰", emoji: "🌵", slug: "tequila", desc: "墨西哥烈日下，一株蓝色龙舌兰需要七年才能成熟。从 blanco 到 añejo。" },
  { eng: "Whisky", name: "威士忌", emoji: "🥃", slug: "whisky", desc: "橡木桶里的时间艺术。苏格兰的烟熏、爱尔兰的顺滑、波本的甜美。" },
  { eng: "Brandy", name: "白兰地", emoji: "🍇", slug: "brandy", desc: "葡萄酒的灵魂升华。干邑的优雅、雅文邑的粗犷、卡尔瓦多斯的苹果香。" },
]

const articles = [
  { title: "鸡尾酒的诞生：从药房到酒吧的三百年旅程", cat: "鸡尾酒历史", author: "调酒百科编辑部", readTime: "12 分钟", summary: "1806年5月13日，纽约《平衡与哥伦比亚知识库》周报首次在印刷品中定义了“鸡尾酒”这个词。这是一段关于药、苦味、甜味和酒精如何走到一起的故事。" },
  { title: "禁酒令与美国鸡尾酒的黄金时代", cat: "鸡尾酒历史", author: "林一", readTime: "10 分钟", summary: "1920年到1933年，禁酒令催生了地下酒吧文化。调酒师不得不用果汁和糖浆来掩盖劣质酒的味道——无意中创造了现代鸡尾酒的黄金时代。" },
  { title: "橡木桶里的炼金术：威士忌陈年全解", cat: "酿造工艺", author: "陈默", readTime: "15 分钟", summary: "一片橡木如何改变一桶无色透明的新酒？从美国白橡到欧洲橡木，从波本桶到雪莉桶——这里没有魔法，只有时间、木材和酒精的化学反应。" },
  { title: "安格斯特拉苦精：从军医的药箱到每一间酒吧的吧台", cat: "基酒知识", author: "周言", readTime: "7 分钟", summary: "那张过大的标签是印刷错误的结果——兄弟俩一个设计标签、一个订购瓶子，没有沟通尺寸。错误变成了标志，一用就是两百年。" },
  { title: "吧台背后的物理学家：摇和法 vs 搅拌法的科学", cat: "调酒师故事", author: "林一", readTime: "6 分钟", summary: "一位麻省理工毕业的调酒师用实验室设备测量了摇和的物理原理——不仅是混合，更是在给鸡尾酒注入空气、水分和温度。" },
  { title: "雪莉酒的秘密：被低估的鸡尾酒灵魂", cat: "品鉴笔记", author: "陈默", readTime: "9 分钟", summary: "Fino的清瘦、Oloroso的坚果、PX的蜜糖——雪莉酒不是一种酒，而是一整个风味宇宙。它既是开胃酒，也是鸡尾酒的秘密武器。" },
  { title: "日本威士忌：一个世纪的追赶与超越", cat: "酿造工艺", author: "林一", readTime: "11 分钟", summary: "从竹鹤政孝远赴苏格兰学艺，到山崎55年在拍卖会上创下纪录，日本用一百年走完了苏格兰五百年的路。水楢木桶是独一无二的东方签名。" },
  { title: "马天尼杯：一个世纪的形状之争", cat: "酒具百科", author: "周言", readTime: "5 分钟", summary: "V形、圆底、带脚还是不带脚？马天尼杯的形状在百年间经历了多次演变。有人说V形是为了不让橄榄滑出来。" },
]

export default function DailyPage() {
  const today = new Date().toISOString().slice(0, 10)

  const picks = useMemo(() => {
    const rand = seededRandom(today)
    return {
      cocktail: pick(cocktailsData, rand, 1)[0],
      spirit: pick(spirits, rand, 1)[0],
      articles: pick(articles, rand, 2),
    }
  }, [today])

  const cocktail = picks.cocktail
  const spirit = picks.spirit

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-5">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={18} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <p className="text-xs tracking-[0.3em] text-[var(--color-accent)]">{today} · 每日精选</p>
          </div>
          <h1 className="text-5xl text-white font-serif mb-3">今日推荐</h1>
          <p className="text-[var(--color-text-gray)] text-lg">
            每天一杯鸡尾酒、一款基酒、两篇文章。算法由日期决定——今天看到的内容，今天独一无二。
          </p>
        </motion.div>

        {/* ===== 第一行：鸡尾酒大卡 + 基酒卡 ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 鸡尾酒 — 占 2/3 宽 */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2"
          >
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden h-full group hover:border-[var(--color-accent)] transition-all duration-500">
              <div className="flex flex-col sm:flex-row h-full">
                {/* 大图 */}
                <div className="sm:w-[40%] h-48 sm:h-auto bg-[var(--color-accent-dim)] flex items-center justify-center text-6xl shrink-0">
                  🍸
                </div>
                {/* 内容 */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] bg-[var(--color-accent)] text-[var(--color-bg-page)] px-2.5 py-0.5 rounded-full font-semibold">
                        今日鸡尾酒
                      </span>
                      <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full">
                        {cocktail.cat}
                      </span>
                    </div>
                    <h2 className="text-2xl text-white font-serif mb-1">{cocktail.chn?.replace(/[（(][^）)]*[）)]/g, "").trim()}</h2>
                    <p className="text-sm text-[var(--color-text-muted)] italic mb-4">{cocktail.eng}</p>
                    <p className="text-sm text-[var(--color-text-gray)] leading-relaxed">
                      {cocktail.ingredients?.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                  <Link
                    to={`/cocktails/${encodeURIComponent(cocktail.eng)}`}
                    className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] mt-4 group-hover:underline"
                  >
                    查看完整配方 <ArrowRight size={14} strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 基酒 — 占 1/3 宽 */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1"
          >
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 h-full flex flex-col group hover:border-[var(--color-accent)] transition-all duration-500">
              <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full self-start mb-4">
                今日基酒
              </span>
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-dim)] flex items-center justify-center text-3xl mb-5">
                {spirit.emoji}
              </div>
              <h3 className="text-xl text-white font-serif mb-1">{spirit.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] italic mb-4">{spirit.eng}</p>
              <p className="text-sm text-[var(--color-text-gray)] leading-relaxed flex-1">{spirit.desc}</p>
              <Link
                to={`/spirits/${spirit.slug}`}
                className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] mt-4 group-hover:underline"
              >
                探索{spirit.name}的世界 <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ===== 第二行：两篇文章 ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {picks.articles.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/articles/${encodeURIComponent(article.title)}`}
                className="block bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 h-full group hover:border-[var(--color-accent)] transition-all duration-500"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] bg-[var(--color-accent)] text-[var(--color-bg-page)] px-2.5 py-0.5 rounded-full font-semibold">
                    今日文章 {i + 1}
                  </span>
                  <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full">
                    {article.cat}
                  </span>
                </div>
                <h3 className="text-lg text-white font-serif leading-snug mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-5">
                  {article.summary}
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1"><User size={12} strokeWidth={1.5} /> {article.author}</span>
                  <span className="flex items-center gap-1"><Clock size={12} strokeWidth={1.5} /> {article.readTime}</span>
                  <span className="ml-auto text-[var(--color-accent)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    阅读 <ArrowRight size={14} strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 底部说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-14 pt-8 border-t border-[var(--color-border)]"
        >
          <p className="text-xs text-[var(--color-text-muted)] flex items-center justify-center gap-2">
            <RefreshCw size={12} strokeWidth={1.5} />
            内容基于日期种子随机选取 · 每天刷新 · 明天再来会有新的推荐
          </p>
        </motion.div>
      </div>
    </div>
  )
}
