import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative w-full h-[100dvh] overflow-hidden snap-start">
      {/* 视频背景 */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/dry-martini.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 深色遮罩 — 暖黑调，呼应视频灯光 */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0a0806]/50 via-[#0a0806]/35 to-[#0a0806]/88" />

      {/* 文字层 */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-5">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs tracking-[0.35em] text-[var(--color-accent)] mb-5 font-serif"
        >
          C O C K T A I L  ·  B A R
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-7xl text-white font-bold leading-[1.1] mb-5 font-serif"
        >
          欢迎来到
          <br />
          调酒百科
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-[var(--color-text-gray)] mb-12 tracking-wide"
        >
          每一杯酒，都有一段横跨百年的故事
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/daily"
            className="inline-block bg-[var(--color-accent)] text-[var(--color-bg-page)] px-10 py-3.5 rounded-full text-base font-bold tracking-wide hover:brightness-110 hover:scale-[1.04] active:scale-[0.97] transition-all duration-200"
          >
            开始探索
          </Link>
        </motion.div>
      </div>

      {/* 向下滚动指示器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[var(--color-text-muted)] text-xs"
      >
        <ChevronDown
          size={20}
          strokeWidth={1}
          className="animate-bounce"
        />
      </motion.div>
    </section>
  )
}
