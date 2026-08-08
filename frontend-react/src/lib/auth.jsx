import { createContext, useContext, useState, useEffect } from "react"
import { fetchAPI } from "./api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 页面加载时检查 localStorage 里的 token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchAPI("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((data) => setUser(data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // 登录
  async function login(email, password) {
    const data = await fetchAPI("/api/auth/login", {
      method: "POST",
      body: { email, password },
    })
    localStorage.setItem("token", data.token)
    setUser(data.user)
    return data.user
  }

  // 注册
  async function register(email, password, nickname) {
    const data = await fetchAPI("/api/auth/register", {
      method: "POST",
      body: { email, password, nickname },
    })
    localStorage.setItem("token", data.token)
    setUser(data.user)
    return data.user
  }

  // 退出
  function logout() {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// 辅助函数：获取带认证头的请求选项
export function authHeaders() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}
