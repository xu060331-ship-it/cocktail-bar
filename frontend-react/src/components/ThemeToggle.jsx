import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  )

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  function toggle() {
    setTheme(t => t === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggle}
      className="text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors p-1"
      title={theme === "dark" ? "切换亮色模式" : "切换暗色模式"}
    >
      {theme === "dark" ? (
        <Sun size={16} strokeWidth={1.5} />
      ) : (
        <Moon size={16} strokeWidth={1.5} />
      )}
    </button>
  )
}
