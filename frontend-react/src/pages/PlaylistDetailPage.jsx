import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../lib/auth"
import { fetchAPI } from "../lib/api"
import { cocktailImg } from "../lib/images"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trash2 } from "lucide-react"

export default function PlaylistDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const token = localStorage.getItem("token")
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } }
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetchAPI(`/api/playlists/${id}`, authHeaders)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id, user])

  async function removeItem(eng) {
    await fetchAPI(`/api/playlists/${id}/items/${encodeURIComponent(eng)}`, { method: "DELETE", headers: authHeaders.headers })
    setData({ ...data, cocktails: data.cocktails.filter(c => c.eng !== eng) })
  }

  if (loading) return <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 flex items-center justify-center"><p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p></div>
  if (!data) return <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 flex items-center justify-center"><p className="text-xl text-[var(--color-text-muted)]">酒单不存在</p></div>

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5">
        <Link to="/profile" className="flex items-center gap-2 text-sm text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors mb-6">
          <ArrowLeft size={14} /> 返回个人中心
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl text-[var(--color-text-main)] font-serif mb-2">{data.playlist.name}</h1>
          {data.playlist.description && <p className="text-sm text-[var(--color-text-muted)]">{data.playlist.description}</p>}
          <p className="text-xs text-[var(--color-text-muted)] mt-3">{data.cocktails.length} 款酒</p>
        </motion.div>

        {data.cocktails.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)]">酒单还是空的</p>
            <Link to="/cocktails" className="text-sm text-[var(--color-accent)] hover:underline mt-4 inline-block">去酒谱添加</Link>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {data.cocktails.map((c, i) => (
                <motion.div key={c.eng} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ delay: i * 0.03 }}>
                  <div className="flex items-center gap-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 group hover:border-[var(--color-accent)] transition-all">
                    <Link to={`/cocktails/${encodeURIComponent(c.eng)}`} className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-dim)] overflow-hidden shrink-0"><img src={cocktailImg(c.eng)} alt={c.eng} className="w-full h-full object-cover" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors">
                          {c.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || c.eng}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)] italic">{c.eng}</p>
                      </div>
                    </Link>
                    <button onClick={() => removeItem(c.eng)} className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors p-1 shrink-0"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
