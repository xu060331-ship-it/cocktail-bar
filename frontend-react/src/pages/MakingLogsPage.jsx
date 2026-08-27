import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Trash2 } from "lucide-react"
import { fetchAPI } from "../lib/api"
import MakingLogForm from "../components/MakingLogForm"

export default function MakingLogsPage() {
  const [logs, setLogs] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetchAPI("/api/making-logs", { headers: { Authorization: `Bearer ${token}` } })
      .then(setLogs).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [])

  async function removeLog(id) {
    if (!window.confirm("确定删除这条调酒记录吗？")) return
    const token = localStorage.getItem("token")
    await fetchAPI(`/api/making-logs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    setLogs((prev) => prev.filter((log) => log.id !== id))
  }

  function updateLog(updated) {
    setLogs((prev) => prev.map((log) => log.id === updated.id ? { ...log, ...updated } : log))
    setEditing(null)
  }

  return <main className="min-h-screen bg-[var(--color-bg-page)] px-5 pb-28 pt-24 text-[var(--color-text-main)]">
    <div className="mx-auto max-w-3xl">
      <p className="mb-3 text-xs tracking-[0.3em] text-[var(--color-accent)]">MAKING LOGS</p>
      <h1 className="mb-2 font-serif text-4xl">调酒记录</h1>
      <p className="mb-8 text-sm text-[var(--color-text-muted)]">记录每一次尝试，让下一杯更接近你喜欢的味道。</p>
      {loading && <div className="space-y-3 animate-pulse"><div className="h-28 rounded-xl bg-[var(--color-bg-card)]" /><div className="h-28 rounded-xl bg-[var(--color-bg-card)]" /></div>}
      {!loading && error && <div className="rounded-xl border border-red-500/20 bg-[var(--color-bg-card)] p-5 text-sm text-red-300">记录加载失败：{error}</div>}
      {!loading && !error && logs.length === 0 && <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center text-sm text-[var(--color-text-muted)]">还没有调酒记录，去酒谱记录你的第一杯酒吧。</div>}
      {!loading && !error && <div className="space-y-3">{logs.map((log) => <article key={log.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-colors hover:border-[var(--color-accent)]">
        <div className="flex items-start justify-between gap-3"><Link to={`/cocktails/${encodeURIComponent(log.cocktail_eng)}`} className="min-w-0 flex-1"><h2 className="font-serif text-lg">{log.chn || log.cocktail_eng}</h2><p className="mt-2 text-xs text-[var(--color-text-muted)]">{new Date(log.made_at).toLocaleDateString("zh-CN")} · {log.brands?.join(" · ") || "未记录品牌"} {log.rating ? ` · ${"★".repeat(log.rating)}` : ""}</p></Link><div className="flex shrink-0 items-center gap-1"><button type="button" onClick={() => setEditing(editing?.id === log.id ? null : log)} className="px-2 py-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]">{editing?.id === log.id ? "收起" : "编辑"}</button><button type="button" title="删除记录" onClick={() => removeLog(log.id)} className="p-2 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 size={15} /></button></div></div>
        {log.modification_note && <p className="mt-3 text-sm text-[var(--color-text-gray)]">改配方：{log.modification_note}</p>}{log.next_time_note && <p className="mt-1 text-sm text-[var(--color-text-gray)]">下次：{log.next_time_note}</p>}
        {log.photo_url && <img src={`${import.meta.env.VITE_API_URL ?? ""}${log.photo_url}`} alt="调酒成品" className="mt-4 max-h-64 w-full rounded-lg object-cover" />}
        {editing?.id === log.id && <MakingLogForm cocktailEng={log.cocktail_eng} initialLog={log} onSaved={updateLog} onCancel={() => setEditing(null)} />}
      </article>)}</div>}
    </div>
  </main>
}
