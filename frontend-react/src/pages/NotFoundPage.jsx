import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
      <div className="text-center px-5">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-8xl md:text-9xl font-bold text-[var(--color-accent)] mb-6"
        >
          404
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-white mb-3"
        >
          页面未找到
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm text-[var(--color-text-muted)] mb-10 max-w-md mx-auto leading-relaxed"
        >
          这杯酒可能还没被发明出来——或者你走错了酒吧。试试回到首页继续探索。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-bg-page)] px-6 py-3 rounded-full text-sm font-semibold hover:brightness-110 transition-all"
          >
            <Home size={16} strokeWidth={1.5} />
            回到首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-gray)] hover:text-white transition-colors border border-[var(--color-border)] rounded-full px-5 py-3"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            返回上页
          </button>
        </motion.div>
      </div>
    </div>
  )
}
