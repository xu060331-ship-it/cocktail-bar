// VITE_API_URL 不设置或为空 → 相对路径（通过 Nginx 代理，适用于所有设备）
// 本地调试：VITE_API_URL=http://localhost:3000
const API_URL = import.meta.env.VITE_API_URL ?? ""


export async function fetchAPI(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...opts.headers }
  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
