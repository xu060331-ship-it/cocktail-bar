import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Trash2 } from "lucide-react"
import { fetchAPI } from "../lib/api"
import { useAuth } from "../lib/auth"

const typeLabels = { flashcard: "学习卡片", encyclopedia: "百科词条", article: "文章" }
export default function MySubmissionsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  useEffect(() => { if (!user) { setLoading(false); return }; fetchAPI("/api/submissions/mine", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then(setItems).catch(() => {}).finally(() => setLoading(false)) }, [user])
  if (!user) return <main className="min-h-screen px-5 pt-32 text-center"><h1 className="font-serif text-3xl">请先登录</h1></main>
  const visible = items.filter((item) => filter === "all" || item.status === filter)
  const remove = async (id) => { if (!window.confirm("删除这条审核中的投稿吗？")) return; await fetchAPI(`/api/submissions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); setItems((v) => v.filter((item) => item.id !== id)) }
  return <main className="min-h-screen bg-[var(--color-bg-page)] px-5 pb-24 pt-24 text-[var(--color-text-main)]"><div className="mx-auto max-w-4xl"><div className="mb-10 flex items-end justify-between gap-4"><div><p className="mb-3 font-ui text-xs tracking-[0.3em] text-[var(--color-accent)]">CREATOR CENTER</p><h1 className="font-serif text-4xl">我的投稿</h1><p className="mt-3 font-ui text-sm text-[var(--color-text-muted)]">管理你提交的学习内容，查看审核反馈。</p></div><Link to="/submit" className="flex items-center gap-1 border border-[var(--color-accent)] px-3 py-2 font-ui text-sm text-[var(--color-accent)]"><Plus size={15} />新投稿</Link></div><div className="mb-6 flex gap-2">{[["all","全部"],["pending","审核中"],["approved","已通过"],["rejected","已拒绝"]].map(([value,label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`border px-4 py-2 font-ui text-sm ${filter === value ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-[var(--color-border)] text-[var(--color-text-muted)]"}`}>{label} {value === "all" ? items.length : items.filter((i) => i.status === value).length}</button>)}</div>{loading ? <p className="font-ui text-sm text-[var(--color-text-muted)]">投稿加载中...</p> : visible.length === 0 ? <div className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-12 text-center font-ui text-sm text-[var(--color-text-muted)]">暂无投稿记录</div> : <div className="space-y-3">{visible.map((item) => <article key={item.id} className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-ui text-xs text-[var(--color-accent)]">{typeLabels[item.content_type] || item.content_type}</p><h2 className="mt-2 font-serif text-xl">{item.title}</h2></div><span className={`font-ui text-xs ${item.status === "approved" ? "text-emerald-400" : item.status === "rejected" ? "text-red-400" : "text-amber-400"}`}>{item.status === "approved" ? "已通过" : item.status === "rejected" ? "已拒绝" : "审核中"}</span></div>{item.status === "rejected" && item.reviewer_note && <p className="mt-4 border-l-2 border-red-400/50 pl-3 font-ui text-sm text-red-300">拒绝原因：{item.reviewer_note}</p>}<p className="mt-3 font-ui text-xs text-[var(--color-text-muted)]">提交于 {new Date(item.created_at).toLocaleDateString("zh-CN")}</p></article>)}</div>}</div></main>
}
