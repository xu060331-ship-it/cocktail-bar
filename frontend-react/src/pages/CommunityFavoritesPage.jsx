import { useEffect, useState } from "react"
import { ArrowLeft, FileText, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { fetchAPI } from "../lib/api"

const labels = { flashcard: "学习卡片", encyclopedia: "百科词条", article: "文章" }
export default function CommunityFavoritesPage() {
  const [items, setItems] = useState(null); const [error, setError] = useState("")
  useEffect(() => { fetchAPI("/api/community/favorites", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then(setItems).catch((e) => setError(e.message)) }, [])
  if (error) return <main className="min-h-screen px-5 pt-32 text-center font-ui"><p className="text-sm text-red-300">{error}</p></main>
  if (!items) return <main className="flex min-h-screen items-center justify-center pt-16 font-ui text-sm text-[var(--color-text-muted)]">收藏加载中...</main>
  return <main className="min-h-screen bg-[var(--color-bg-page)] px-5 pb-24 pt-24 text-[var(--color-text-main)]"><div className="mx-auto max-w-4xl"><Link to="/profile" className="mb-10 inline-flex items-center gap-2 font-ui text-sm text-[var(--color-text-gray)] hover:text-[var(--color-accent)]"><ArrowLeft size={16} />返回个人中心</Link><header className="mb-8"><p className="font-ui text-xs tracking-[0.3em] text-[var(--color-accent)]">SAVED COMMUNITY</p><h1 className="mt-3 font-serif text-4xl">我的社区收藏</h1><p className="mt-3 font-ui text-sm text-[var(--color-text-muted)]">收藏的文章、百科和学习卡片。</p></header>{items.length === 0 ? <div className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-12 text-center font-ui text-sm text-[var(--color-text-muted)]">还没有收藏公开内容</div> : <div className="space-y-3">{items.map((item) => <Link key={item.content_id} to={`/community/${item.content_id}`} className="flex items-start gap-4 border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-colors hover:border-[var(--color-accent)]"><FileText size={18} className="mt-1 shrink-0 text-[var(--color-accent)]" /><div className="min-w-0 flex-1"><p className="font-ui text-xs text-[var(--color-accent)]">{labels[item.content_type] || "社区内容"}</p><h2 className="mt-2 font-serif text-xl">{item.title}</h2>{item.summary && <p className="mt-2 line-clamp-2 font-ui text-sm leading-6 text-[var(--color-text-gray)]">{item.summary}</p>}<p className="mt-3 font-ui text-xs text-[var(--color-text-muted)]">收藏于 {new Date(item.created_at).toLocaleDateString("zh-CN")}</p></div><Star size={16} className="shrink-0 text-[var(--color-accent)]" fill="currentColor" /></Link>)}</div>}</div></main>
}
