import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { GlassWater, Menu, X, LogOut, User, TrendingUp } from "lucide-react"
import { useAuth } from "../lib/auth"
import AuthModal from "./AuthModal"

const navLinks = [
  { to: "/daily", label: "每日推荐" },
  { to: "/cocktails", label: "酒谱" },
  { to: "/spirits", label: "基酒" },
  { to: "/articles", label: "关于酒" },
  { to: "/search", label: "智能搜酒" },
]

export default function Navbar({ transparent = false }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [navSearch, setNavSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState("login")

  const handleNavSearch = (e) => {
    if (e.key === "Enter" && navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`)
      setMenuOpen(false)
      setNavSearch("")
    }
  }

  const handleNavClick = () => {
    setMenuOpen(false)
  }

  // 桌面端右侧按钮（复用）
  const AuthButtons = ({ mobile = false }) => {
    if (user) {
      return (
        <div className={`flex items-center ${mobile ? "flex-col gap-3 w-full" : "gap-3"}`}>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-1.5 text-sm text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors ${mobile ? "w-full justify-center py-2.5 border border-[var(--color-border)] rounded-full" : ""}`}
          >
            <User size={14} strokeWidth={1.5} />
            {user.nickname || user.email}
          </Link>
          {!mobile && (
            <Link to="/popular" className="text-sm text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1">
              <TrendingUp size={14} strokeWidth={1.5} />
            </Link>
          )}
          <button
            onClick={() => { logout(); setMenuOpen(false) }}
            className={`text-sm text-[var(--color-text-muted)] hover:text-white transition-colors flex items-center gap-1 ${mobile ? "w-full justify-center py-2 border border-[var(--color-border)] rounded-full" : ""}`}
          >
            <LogOut size={14} strokeWidth={1.5} />
            {mobile ? "退出登录" : ""}
          </button>
        </div>
      )
    }

    return (
      <div className={`flex ${mobile ? "gap-3 w-full" : "gap-3"}`}>
        <button
          onClick={() => { setAuthMode("login"); setAuthOpen(true); setMenuOpen(false) }}
          className={`text-sm text-[var(--color-text-gray)] hover:text-white transition-colors ${mobile ? "flex-1 text-center border border-[var(--color-border)] rounded-full py-2.5" : ""}`}
        >
          登录
        </button>
        <button
          onClick={() => { setAuthMode("register"); setAuthOpen(true); setMenuOpen(false) }}
          className={`text-sm bg-[var(--color-accent)] text-[var(--color-bg-page)] rounded-full font-semibold hover:brightness-110 transition-all ${mobile ? "flex-1 text-center py-2.5" : "px-4 py-2"}`}
        >
          注册
        </button>
      </div>
    )
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 md:px-8 transition-colors duration-500 ${
          transparent
            ? "bg-transparent border-b border-white/10"
            : "bg-[var(--color-bg-nav)] border-b border-[var(--color-border)]"
        }`}
      >
        {/* 左侧组：Logo + 导航链接 */}
        <div className="flex items-center gap-7">
          <Link
            to="/"
            className="flex items-center gap-2 text-[var(--color-accent)] text-lg md:text-xl font-bold tracking-wide shrink-0"
            onClick={handleNavClick}
          >
            <GlassWater size={22} strokeWidth={1.5} />
            调酒百科
          </Link>

          {/* 桌面端：导航链接 */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition-colors whitespace-nowrap ${
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
        </div>

        {/* 桌面端右侧：搜索 + 认证 */}
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            onKeyDown={handleNavSearch}
            placeholder="搜索酒名、基酒、口味"
            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none w-56"
          />
          <AuthButtons />
        </div>

        {/* 手机端：汉堡按钮 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[var(--color-text-gray)] hover:text-white transition-colors p-2"
        >
          {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>

        {/* 手机端：下拉菜单 */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[var(--color-bg-nav)] border-b border-[var(--color-border)] md:hidden">
            <nav className="flex flex-col py-4 px-6 gap-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleNavClick}
                    className={`text-base py-1 transition-colors ${
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
            <div className="flex items-center gap-3 px-6 pb-5">
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onKeyDown={handleNavSearch}
                placeholder="搜索酒名、口味..."
                className="flex-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none"
              />
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <AuthButtons mobile />
            </div>
          </div>
        )}
      </header>

      {/* 登录/注册弹窗 */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </>
  )
}
