import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAPI } from "../lib/api"
import { useAuth } from "../lib/auth"
import { Sparkles } from "lucide-react"

export default function PersonaSwitcher({ currentId, onSwitch, onMemoryLoaded }) {
  const { user } = useAuth()
  const [personas, setPersonas] = useState([])
  const [open, setOpen] = useState(false)
  const [memory, setMemory] = useState(null)

  useEffect(() => {
    fetchAPI("/api/ai/personas")
      .then(setPersonas)
      .catch(() => {})

    // 加载用户记忆
    if (user) {
      const token = localStorage.getItem("token")
      fetchAPI("/api/ai/memory", { headers: { Authorization: `Bearer ${token}` } })
        .then((data) => {
          setMemory(data)
          if (onMemoryLoaded) onMemoryLoaded(data)
          // 恢复偏好角色
          if (data?.preferred_persona && data.preferred_persona !== currentId && onSwitch) {
            onSwitch(data.preferred_persona)
          }
        })
        .catch(() => {})
    }
  }, [user])

  const current = personas.find(p => p.id === currentId) || personas[0]

  function handleSelect(persona) {
    onSwitch(persona.id)
    setOpen(false)
    // 保存偏好
    if (user) {
      const token = localStorage.getItem("token")
      fetchAPI("/api/ai/memory", {
        method: "PUT",
        body: { preferred_persona: persona.id },
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
  }

  if (personas.length === 0) return null

  return (
    <div className="relative">
      {/* 当前角色按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-3 py-1.5 hover:border-[var(--color-accent)] transition-all group"
      >
        <span className="text-lg">{current?.avatar || "🍸"}</span>
        <span className="text-xs text-[var(--color-text-gray)] group-hover:text-white transition-colors">
          {current?.name || "小酒"}
        </span>
        <span className="text-[9px] text-[var(--color-text-muted)]">{current?.label || ""}</span>
        <Sparkles size={11} strokeWidth={1.5} className="text-[var(--color-accent)]" />
      </button>

      {/* 角色选择面板 */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full mt-2 right-0 z-50 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-3 shadow-xl min-w-[220px]"
            >
              <p className="text-[10px] text-[var(--color-text-muted)] mb-2 px-1">选择你的调酒师</p>
              {personas.map((p) => {
                const isActive = p.id === currentId
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all mb-1 ${
                      isActive
                        ? "bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/30"
                        : "hover:bg-[var(--color-bg-page)] border border-transparent"
                    }`}
                  >
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: p.color + "20" }}
                    >
                      {p.avatar}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-serif ${isActive ? "text-[var(--color-accent)]" : "text-white"}`}>
                          {p.name}
                        </span>
                        <span className="text-[9px] text-[var(--color-text-muted)]">{p.label}</span>
                      </div>
                      <p className="text-[10px] text-[var(--color-text-muted)] truncate">{p.description}</p>
                    </div>
                    {isActive && (
                      <span className="text-[10px] text-[var(--color-accent)] bg-[var(--color-accent-dim)] px-1.5 py-0.5 rounded-full shrink-0">
                        当前
                      </span>
                    )}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
