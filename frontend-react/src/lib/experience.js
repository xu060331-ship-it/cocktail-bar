import { useState, useEffect, useCallback } from "react"
import { fetchAPI } from "./api"
import { useAuth } from "./auth"

/**
 * Hook: 管理用户的调配/品尝记录
 * 返回 { made, tasted, madeSet, tastedSet, toggle, loading }
 */
export function useExperience() {
  const { user } = useAuth()
  const [madeSet, setMadeSet] = useState(new Set())
  const [tastedSet, setTastedSet] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // 加载记录
  useEffect(() => {
    if (!user) {
      setMadeSet(new Set())
      setTastedSet(new Set())
      setLoaded(true)
      return
    }
    setLoading(true)
    const token = localStorage.getItem("token")
    fetchAPI("/api/experience", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setMadeSet(new Set(data.made))
        setTastedSet(new Set(data.tasted))
        setLoaded(true)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  // 切换标记
  const toggle = useCallback(async (eng, action) => {
    const token = localStorage.getItem("token")
    if (!token) return

    // Optimistic update
    if (action === "made") {
      setMadeSet((prev) => {
        const next = new Set(prev)
        if (next.has(eng)) next.delete(eng)
        else next.add(eng)
        return next
      })
    } else {
      setTastedSet((prev) => {
        const next = new Set(prev)
        if (next.has(eng)) next.delete(eng)
        else next.add(eng)
        return next
      })
    }

    try {
      await fetchAPI(`/api/experience/${encodeURIComponent(eng)}`, {
        method: "POST",
        body: { action },
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (err) {
      // Revert on error
      if (action === "made") {
        setMadeSet((prev) => {
          const next = new Set(prev)
          if (next.has(eng)) next.delete(eng)
          else next.add(eng)
          return next
        })
      } else {
        setTastedSet((prev) => {
          const next = new Set(prev)
          if (next.has(eng)) next.delete(eng)
          else next.add(eng)
          return next
        })
      }
    }
  }, [])

  return {
    madeSet,
    tastedSet,
    toggle,
    loading,
    loaded,
    count: { made: madeSet.size, tasted: tastedSet.size },
  }
}
