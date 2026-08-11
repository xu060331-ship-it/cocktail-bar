import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { GlassWater, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3">ABOUT</p>
          <h1 className="text-5xl text-[var(--color-text-main)] font-serif mb-4">关于我们</h1>
        </motion.div>

        <div className="space-y-12 text-[var(--color-text-gray)] leading-loose">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <GlassWater size={18} strokeWidth={1.5} className="inline mr-2 text-[var(--color-accent)]" />
            调酒百科是一个面向中文读者的鸡尾酒知识平台。我们收录了国际调酒师协会（IBA）官方认证的 101 款鸡尾酒配方，以及 25 款全球酒吧必点经典，涵盖难忘经典、当代经典、新时代和酒吧经典四大类别。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { num: "126", label: "款经典鸡尾酒" },
              { num: "6", label: "大基酒分类详解" },
              { num: "10", label: "篇深度调酒文化文章" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 text-center">
                <p className="text-3xl text-[var(--color-accent)] font-serif mb-2">{stat.num}</p>
                <p className="text-sm text-[var(--color-text-gray)]">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            每一款鸡尾酒都配有完整的配方、调制方法和历史故事。六大基酒栏目深入探索金酒、伏特加、朗姆、龙舌兰、威士忌和白兰地的世界——从产地、流派到经典配方。关于酒文章涵盖鸡尾酒历史、酿造工艺、调酒师故事与品鉴笔记。
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            内容来源包括国际调酒师协会官方酒谱、烈酒认证课程教材、以及全球调酒师社区的贡献。我们致力于用中文呈现最专业、最全面的鸡尾酒知识——让每一位对调酒感兴趣的人，都能在这里找到属于他的那一杯。
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-16 pt-8 border-t border-[var(--color-border)]"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline">
            <ArrowRight size={14} strokeWidth={1.5} />
            返回首页
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
