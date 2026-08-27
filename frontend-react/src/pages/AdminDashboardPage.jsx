import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FileText, Image, Flag, Users, ArrowRight } from "lucide-react"
import { fetchAPI } from "../lib/api"

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  useEffect(() => { let active = true; const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` }; Promise.all([fetchAPI("/api/admin/overview", { headers }), fetchAPI("/api/admin/content-submissions", { headers }).catch(() => []), fetchAPI("/api/admin/reports", { headers }).catch(() => [])]).then(([overview, submissions, reports]) => { if (active) setData({ overview, submissions, reports }) }).catch((err) => { if (active) setError(err.message) }); return () => { active = false } }, [])
  if (error) return <main className="min-h-screen px-5 pt-32 text-center font-ui text-sm text-red-300">后台加载失败：{error}</main>
  if (!data) return <main className="flex min-h-screen items-center justify-center font-ui text-sm text-[var(--color-text-muted)]">后台加载中...</main>
  const pendingContent = data.submissions.filter((item) => item.status === "pending").length
  const pendingReports = data.reports.filter((item) => item.status === "pending").length
  const cards = [["内容管理", `${data.overview.cocktails.length + data.overview.articles.length} 条内容`, "/admin/content", FileText], ["用户投稿", `${pendingContent} 条待审核`, "/admin/content", Users], ["举报处理", `${pendingReports} 条待处理`, "/admin/reports", Flag], ["图片管理", "替换酒款和文章配图", "/admin/images", Image]]
  return <main className="min-h-screen bg-[var(--color-bg-page)] px-5 pb-24 pt-24 text-[var(--color-text-main)]"><div className="mx-auto max-w-6xl"><p className="mb-3 font-ui text-xs tracking-[0.3em] text-[var(--color-accent)]">ADMIN WORKSPACE</p><h1 className="font-serif text-4xl">后台工作台</h1><p className="mt-3 font-ui text-sm text-[var(--color-text-muted)]">内容、投稿、举报和媒体管理集中在这里。</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([title, value, to, Icon]) => <Link key={title} to={to} className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-colors hover:border-[var(--color-accent)]"><Icon size={18} className="text-[var(--color-accent)]" /><h2 className="mt-5 font-serif text-lg">{title}</h2><p className="mt-2 font-ui text-sm text-[var(--color-text-muted)]">{value}</p><span className="mt-5 flex items-center gap-1 font-ui text-xs text-[var(--color-accent)]">进入管理 <ArrowRight size={13} /></span></Link>)}</div><div className="mt-10 border-t border-[var(--color-border)] pt-6 font-ui text-xs text-[var(--color-text-muted)]">酒款 {data.overview.cocktails.length} · 文章 {data.overview.articles.length} · AI 内容 {data.overview.ai?.length || 0} · 错误日志 {data.overview.errors?.length || 0}</div></div></main>
}
