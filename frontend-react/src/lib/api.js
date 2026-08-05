const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export async function fetchAPI(path) {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
