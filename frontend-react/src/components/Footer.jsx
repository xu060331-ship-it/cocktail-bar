import { motion } from "framer-motion"
import { GlassWater } from "lucide-react"

const footerLinks = [
  {
    title: "探索",
    links: ["酒谱", "基酒百科", "威士忌入门", "鸡尾酒历史"],
  },
  {
    title: "关于",
    links: ["关于我们", "内容来源", "投稿文章", "联系我们"],
  },
  {
    title: "更多",
    links: ["每日推荐", "品鉴笔记", "酿造工艺", "配方实验室"],
  },
]

export default function Footer() {
  return (
    <footer className="w-full h-[100dvh] snap-start flex items-center bg-[var(--color-bg-nav)]">
      <div className="w-full max-w-5xl mx-auto px-5 py-20">
        {/* 上部：Logo + 三列链接 */}
        <div className="grid grid-cols-4 gap-12 mb-20">
          {/* Logo 列 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="/" className="flex items-center gap-2 text-[var(--color-accent)] text-xl font-bold tracking-wide mb-4">
              <GlassWater size={22} strokeWidth={1.5} />
              调酒百科
            </a>
            <p className="text-sm text-[var(--color-text-gray)] leading-relaxed">
              每一杯酒，
              <br />
              都有一段横跨百年
              <br />
              的故事。
            </p>
          </motion.div>

          {/* 三列链接 */}
          {footerLinks.map((col, colIndex) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: colIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h4 className="text-sm text-white font-bold mb-4 tracking-wide">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* 分割线 */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.9 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-[var(--color-border)] pt-8 flex items-center justify-between"
        >
          <p className="text-xs text-[var(--color-text-muted)]">
            2026 调酒百科 · Cocktail Bar
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            内容贡献自全球调酒师社区
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
