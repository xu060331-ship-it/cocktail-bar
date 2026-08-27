// VITE_API_URL 不设置或为空 → 相对路径（通过 Nginx 代理，适用于所有设备）
// 本地调试：VITE_API_URL=http://localhost:3000
const API_URL = import.meta.env.VITE_API_URL ?? ""
const REQUEST_TIMEOUT = 15000


export async function fetchAPI(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...opts.headers }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), opts.timeout || REQUEST_TIMEOUT)
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: opts.method || "GET",
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal || controller.signal,
    })
  } catch (err) {
    if (err.name === "AbortError") throw new Error("请求超时，请稍后重试")
    throw new Error("网络连接失败，请检查网络后重试")
  } finally {
    clearTimeout(timeout)
  }
  if (!res.ok) {
    let detail = ""
    try {
      const payload = await res.json()
      detail = payload.error || payload.message || ""
    } catch (_) {
      // Some proxy errors return HTML or an empty response.
    }
    const error = new Error(detail || `API error: ${res.status}`)
    error.status = res.status
    throw error
  }
  return res.json()
}

export { API_URL }
