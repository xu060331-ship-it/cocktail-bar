import { Link, useLocation } from "react-router-dom"
import { Compass, Search, Sparkles, User } from "lucide-react"
import { useAuth } from "../lib/auth"

const items = [
  { to: "/cocktails", label: "探索", icon: Compass },
  { to: "/search", label: "搜索", icon: Search },
  { to: "/ai-assistant", label: "AI助手", icon: Sparkles },
  { to: "/profile", label: "我的", icon: User, auth: true },
]

export default function MobileBottomNav() {
  const location = useLocation()
  const { user } = useAuth()
  return <nav className="fixed bottom-0 left-0 right-0 z-40 flex min-h-16 items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-bg-nav)]/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur md:hidden" aria-label="移动端主导航">
    {items.filter((item) => !item.auth || user).map(({ to, label, icon: Icon }) => {
      const active = location.pathname === to || location.pathname.startsWith(`${to}/`)
      return <Link key={to} to={to} className={`flex min-w-0 flex-1 flex-col items-center gap-1 py-1 text-[10px] leading-none transition-colors ${active ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}><Icon size={18} strokeWidth={1.5} /><span className="max-w-full truncate px-1">{label}</span></Link>
    })}
  </nav>
}
