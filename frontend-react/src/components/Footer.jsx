import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { GlassWater, ArrowUpRight } from "lucide-react"

const footerLinks = [
  { label: "酒谱", to: "/cocktails" },
  { label: "基酒百科", to: "/spirits" },
  { label: "关于酒", to: "/articles" },
  { label: "关于我们", to: "/about" },
]

export default function Footer() {
  return (
    <footer className="w-full min-h-[60dvh] md:h-[100dvh] snap-start flex items-center bg-[var(--color-bg-nav)]">
      <div className="w-full max-w-7xl mx-auto px-5 h-full flex flex-col justify-between py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col justify-center"
        >
          <Link to="/" className="flex items-center gap-2 text-[var(--color-accent)] text-xl font-bold tracking-wide mb-8">
            <GlassWater size={22} strokeWidth={1.5} />
            调酒百科
          </Link>

          <h2 className="text-3xl md:text-5xl lg:text-6xl text-[var(--color-text-main)] font-serif leading-tight mb-8 max-w-2xl">
            每一杯酒，
            <br />
            都有一段横跨百年
            <br />
            的故事。
          </h2>

          <div className="flex flex-wrap gap-6 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="flex items-center gap-1 text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                {link.label} <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* 下部：版权 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-between pt-8 border-t border-[var(--color-border)]"
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
