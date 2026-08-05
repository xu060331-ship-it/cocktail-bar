import { Link, useLocation } from "react-router-dom"
import { GlassWater } from "lucide-react"

const navLinks = [
  { to: "/daily", label: "每日推荐" },
  { to: "/cocktails", label: "酒谱" },
  { to: "/spirits", label: "基酒" },
  { to: "/articles", label: "关于酒" },
  { to: "/search", label: "智能搜酒" },
]

export default function Navbar({ transparent = false }) {
  const location = useLocation()

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-8 transition-colors duration-500 ${
        transparent
          ? "bg-transparent border-b border-white/10"
          : "bg-[var(--color-bg-nav)] border-b border-[var(--color-border)]"//
      }`}
    >
      {/* 左侧：Logo + 导航链接 */}
      <nav className="flex items-center gap-7">
        <Link
          to="/"
          className="flex items-center gap-2 text-[var(--color-accent)] text-xl font-bold tracking-wide"
        >
          <GlassWater size={22} strokeWidth={1.5} />
          调酒百科
        </Link>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition-colors ${
                isActive
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-gray)] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          )
        })}
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
