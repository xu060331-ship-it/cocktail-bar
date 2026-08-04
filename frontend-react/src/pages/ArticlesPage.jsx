import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Clock, User } from "lucide-react"

const categories = ["全部", "鸡尾酒历史", "酿造工艺", "基酒知识", "调酒师故事", "酒具百科", "品鉴笔记"]

// 精选文章（置顶大图）
const featured = {
  title: "鸡尾酒的诞生：从药房到酒吧的三百年旅程",
  cat: "鸡尾酒历史",
  author: "调酒百科编辑部",
  date: "2026年7月15日",
  readTime: "12 分钟",
  summary: "1806年5月13日，纽约《平衡与哥伦比亚知识库》周报首次在印刷品中定义了\"鸡尾酒\"这个词。但它的真正起源要追溯到更早——古罗马的药酒、中世纪的香料酒、18世纪英国潘趣酒的热潮。这是一段关于药、苦味、甜味和酒精如何走到一起的故事。",
  image: "🥂",
}

// 文章列表（含不同权重的排版）
const articles = [
  {
    title: "禁酒令与美国鸡尾酒的黄金时代",
    cat: "鸡尾酒历史",
    author: "林一",
    date: "2026年6月28日",
    readTime: "10 分钟",
    summary: "1920年到1933年，美国禁酒令催生了地下酒吧（Speakeasy）文化。当烈酒变得稀缺且劣质，调酒师不得不用果汁、糖浆和利口酒来掩盖劣质酒的味道——无意中创造了现代鸡尾酒的黄金时代。",
    featured: true,
  },
  {
    title: "橡木桶里的炼金术：威士忌陈年全解",
    cat: "酿造工艺",
    author: "陈默",
    date: "2026年6月20日",
    readTime: "15 分钟",
    summary: "一片橡木如何改变一桶无色透明的新酒？从美国白橡到欧洲橡木，从波本桶到雪莉桶，从炭化程度到桶的大小——这里没有魔法，只有时间、木材和酒精的化学反应。",
    featured: true,
  },
  {
    title: "安格斯特拉苦精：从军医的药箱到每一间酒吧的吧台",
    cat: "基酒知识",
    author: "周言",
    date: "2026年6月10日",
    readTime: "7 分钟",
    summary: "那张过大的标签是印刷错误的结果——兄弟俩一个负责设计标签、一个负责订购瓶子，没有沟通尺寸。错误变成了标志，一用就是两百年。",
    featured: false,
  },
  {
    title: "吧台背后的物理学家：摇和法 vs 搅拌法的科学",
    cat: "调酒师故事",
    author: "林一",
    date: "2026年5月22日",
    readTime: "6 分钟",
    summary: "摇和不仅是混合——它是在给鸡尾酒注入空气、水分和温度。搅拌则保持酒液的丝滑质感。一位麻省理工毕业的调酒师用实验室设备测量了两种技法的差异。",
    featured: false,
  },
  {
    title: "雪莉酒的秘密：被低估的鸡尾酒灵魂",
    cat: "品鉴笔记",
    author: "陈默",
    date: "2026年5月15日",
    readTime: "9 分钟",
    summary: "Fino的清瘦、Oloroso的坚果、PX的蜜糖——雪莉酒不是一种酒，而是一整个风味宇宙。它既是开胃酒，也是鸡尾酒的秘密武器。",
    featured: false,
  },
  {
    title: "马天尼杯：一个世纪的形状之争",
    cat: "酒具百科",
    author: "周言",
    date: "2026年5月8日",
    readTime: "5 分钟",
    summary: "V形、圆底、带脚还是不带脚？马天尼杯的形状在百年间经历了多次演变。有人说V形是为了不让橄榄滑出来，有人说只是因为它看起来优雅。真相更复杂。",
    featured: false,
  },
  {
    title: "日本威士忌：一个世纪的追赶与超越",
    cat: "酿造工艺",
    author: "林一",
    date: "2026年4月30日",
    readTime: "11 分钟",
    summary: "从竹鹤政孝远赴苏格兰学艺，到山崎55年在拍卖会上创下纪录，日本用一百年走完了苏格兰五百年的路。水楢木桶带来的线香和檀木风味，是全球威士忌版图上独一无二的东方签名。",
    featured: true,
  },
  {
    title: "调酒师的秘密武器：冰的物理学",
    cat: "调酒师故事",
    author: "陈默",
    date: "2026年4月18日",
    readTime: "6 分钟",
    summary: "透明冰、碎冰、大冰球、冰柱——不同的冰不仅仅是形状不同。融化速度、表面积、稀释率，一个优秀的调酒师在摇壶之前就已经在计算冰的贡献了。",
    featured: false,
  },
  {
    title: "味美思：从古罗马药酒到现代开胃酒的传奇",
    cat: "基酒知识",
    author: "周言",
    date: "2026年4月5日",
    readTime: "8 分钟",
    summary: "味美思是加了药草和香料的加强葡萄酒。古罗马人用它入药，18世纪的意大利人把它当作开胃酒。今天，没有一瓶味美思在吧台上，就没有马天尼，也没有曼哈顿。",
    featured: false,
  },
]

export default function ArticlesPage() {
  const [activeCat, setActiveCat] = useState("全部")
  const [hoveredArticle, setHoveredArticle] = useState(null)

  const filtered = activeCat === "全部" ? articles : articles.filter((a) => a.cat === activeCat)

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
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3">LEARN & EXPLORE</p>
          <h1 className="text-5xl text-white font-serif mb-3">关于酒</h1>
          <p className="text-[var(--color-text-gray)] text-lg">
            鸡尾酒的历史、酿造的科学、调酒师的哲学。每一篇文章都是一扇通往更深处的门。
          </p>
        </motion.div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                activeCat === cat
                  ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] font-semibold"
                  : "bg-[var(--color-bg-card)] text-[var(--color-text-gray)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 精选置顶文章 — 大图横幅 */}
        {activeCat === "全部" && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <Link
              to={`/articles/${encodeURIComponent(featured.title)}`}
              className="group block bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-accent)] transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row">
                {/* 图片区 */}
                <div className="lg:w-[45%] h-64 lg:h-auto bg-[var(--color-accent-dim)] flex items-center justify-center text-7xl shrink-0">
                  {featured.image}
                </div>
                {/* 文字区 */}
                <div className="flex-1 p-10 flex flex-col justify-center">
                  <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full self-start mb-4">
                    {featured.cat}
                  </span>
                  <h2 className="text-2xl lg:text-3xl text-white font-serif leading-snug mb-4 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-6">
                    {featured.summary}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1"><User size={12} strokeWidth={1.5} /> {featured.author}</span>
                    <span>{featured.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} strokeWidth={1.5} /> {featured.readTime}</span>
                    <span className="ml-auto text-[var(--color-accent)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      阅读全文 <ArrowRight size={14} strokeWidth={1.5} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* 文章列表 — 混合布局：重要文章横排占宽，普通文章竖排 */}
        <div className="space-y-6">
          {filtered.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredArticle(i)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              <Link
                to={`/articles/${encodeURIComponent(article.title)}`}
                className={`block bg-[var(--color-bg-card)] border rounded-2xl transition-all duration-500 group ${
                  hoveredArticle === i ? "border-[var(--color-accent)] shadow-[0_0_40px_rgba(201,169,110,0.06)]" : "border-[var(--color-border)]"
                } ${article.featured ? "p-8" : "px-8 py-6"}`}
              >
                <div className={`flex gap-6 ${article.featured ? "flex-col sm:flex-row" : "flex-row items-center"}`}>
                  {/* 重要文章：大图在左 */}
                  {article.featured && (
                    <div className="sm:w-48 h-36 bg-[var(--color-accent-dim)] rounded-xl flex items-center justify-center text-4xl shrink-0">
                      🍷
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* 标签行 */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-full shrink-0">
                        {article.cat}
                      </span>
                      {article.featured && (
                        <span className="text-[10px] text-[var(--color-text-muted)] tracking-wide">深度长文</span>
                      )}
                      {!article.featured && (
                        <span className="text-xs text-[var(--color-text-muted)]">{article.date}</span>
                      )}
                    </div>

                    {/* 标题 */}
                    <h3 className={`text-white font-serif leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-300 ${article.featured ? "text-xl" : "text-base"}`}>
                      {article.title}
                    </h3>

                    {/* 摘要 */}
                    <p className={`text-[var(--color-text-gray)] leading-relaxed mb-3 ${article.featured ? "text-sm" : "text-xs line-clamp-2"}`}>
                      {article.summary}
                    </p>

                    {/* 底部信息 */}
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1"><User size={12} strokeWidth={1.5} /> {article.author}</span>
                      {article.featured && <span>{article.date}</span>}
                      <span className="flex items-center gap-1"><Clock size={12} strokeWidth={1.5} /> {article.readTime}</span>
                      <span className={`ml-auto text-[var(--color-accent)] flex items-center gap-1 transition-opacity duration-300 ${hoveredArticle === i ? "opacity-100" : "opacity-0"}`}>
                        阅读 <ArrowRight size={14} strokeWidth={1.5} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 pt-8 border-t border-[var(--color-border)]"
        >
          <p className="text-sm text-[var(--color-text-muted)]">
            更多文章正在撰写中，由调酒师社区的贡献者持续更新
          </p>
        </motion.div>
      </div>
    </div>
  )
}
