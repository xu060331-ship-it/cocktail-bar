import { GlassWater } from "lucide-react"

export default function Navbar({ transparent = false }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-8 transition-colors duration-500 ${
        transparent
          ? "bg-transparent border-b border-white/10"
          : "bg-[var(--color-bg-nav)] border-b border-[var(--color-border)]"
      }`}
    >
      {/* 左侧：Logo + 导航链接 */}
      <nav className="flex items-center gap-7">
        <a
          href="/"
          className="flex items-center gap-2 text-[var(--color-accent)] text-xl font-bold tracking-wide"
        >
          <GlassWater size={22} strokeWidth={1.5} />
          调酒百科
        </a>
        <a href="/daily" className="text-sm text-[var(--color-text-gray)] hover:text-white transition-colors">
          每日推荐
        </a>
        <a href="#" className="text-sm text-[var(--color-text-gray)] hover:text-white transition-colors">
          酒谱
        </a>
        <a href="#" className="text-sm text-[var(--color-text-gray)] hover:text-white transition-colors">
          基酒
        </a>
        <a href="#" className="text-sm text-[var(--color-text-gray)] hover:text-white transition-colors">
          关于酒
        </a>
      </nav>

      {/* 右侧：搜索 + 按钮 */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="搜索酒名、基酒、口味"
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none w-56"
        />
        <button className="text-sm text-[var(--color-text-gray)] hover:text-white transition-colors">
          登录
        </button>
        <button className="text-sm bg-[var(--color-accent)] text-[var(--color-bg-page)] px-4 py-2 rounded-full font-semibold hover:brightness-110 transition-all">
          注册
        </button>
      </div>
    </header>
  )
}
