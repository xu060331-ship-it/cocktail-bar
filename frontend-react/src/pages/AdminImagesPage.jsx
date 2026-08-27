import { useState } from "react"
import { fetchAPI } from "../lib/api"

export default function AdminImagesPage() {
  const [type, setType] = useState("cocktails")
  const [id, setId] = useState("")
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const submit = async (e) => {
    e.preventDefault(); setMessage("")
    if (!id || !file) return setMessage("请选择内容并上传图片")
    const body = new FormData(); body.append("image", file)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? ""}/api/admin/images/${type}/${id}`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, body })
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "图片上传失败")
      setMessage("图片已更新，刷新对应页面即可看到")
    } catch (err) { setMessage(err.message) }
  }
  return <main className="min-h-screen bg-[var(--color-bg-page)] px-5 pb-24 pt-24 text-[var(--color-text-main)]"><form onSubmit={submit} className="mx-auto max-w-2xl space-y-5"><p className="font-ui text-xs tracking-[0.3em] text-[var(--color-accent)]">CONTENT MEDIA</p><h1 className="font-serif text-4xl">后台图片管理</h1><p className="font-ui text-sm text-[var(--color-text-muted)]">替换酒款或文章的主图，上传后立即保存到服务器。</p><select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 font-ui text-sm"><option value="cocktails">酒款</option><option value="articles">文章</option></select><input required value={id} onChange={(e) => setId(e.target.value)} placeholder="内容 ID，例如 1" inputMode="numeric" className="w-full border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 font-ui text-sm" /><input required type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 font-ui text-sm" /><p className="font-ui text-xs text-[var(--color-text-muted)]">支持 JPG、PNG、WebP，最大 5MB。</p><button className="bg-[var(--color-accent)] px-5 py-3 font-ui text-sm font-semibold text-[var(--color-bg-page)]">上传并替换</button>{message && <p className="font-ui text-sm text-[var(--color-accent)]">{message}</p>}</form></main>
}
