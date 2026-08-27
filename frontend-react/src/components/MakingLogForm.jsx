import { useState } from "react"
import { fetchAPI } from "../lib/api"

export default function MakingLogForm({ cocktailEng, onSaved, initialLog = null, onCancel }) {
  const [form, setForm] = useState(() => initialLog ? { ...initialLog, brands: initialLog.brands?.join(", ") || "" } : { made_at: new Date().toISOString().slice(0, 10), brands: "", rating: 0, recipe_modified: false, visibility: "private", modification_note: "", next_time_note: "" })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [photo, setPhoto] = useState(null)
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  async function submit(e) {
    e.preventDefault(); setSaving(true); setFeedback("")
    try {
      const token = localStorage.getItem("token")
      const data = await fetchAPI(initialLog ? `/api/making-logs/${initialLog.id}` : "/api/making-logs", { method: initialLog ? "PUT" : "POST", headers: { Authorization: `Bearer ${token}` }, body: { ...form, cocktail_eng: cocktailEng, brands: form.brands.split(",").map((x) => x.trim()).filter(Boolean) } })
      let saved = data
      if (photo && data.id) { const upload = new FormData(); upload.append("photo", photo); const response = await fetch(`${import.meta.env.VITE_API_URL ?? ""}/api/making-logs/${data.id}/photo`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: upload }); if (!response.ok) throw new Error("照片上传失败"); saved = { ...data, ...(await response.json()) } }
      setFeedback("记录已保存"); onSaved?.(saved); setPhoto(null); setForm((prev) => ({ ...prev, brands: "", rating: 0, modification_note: "", next_time_note: "" }))
    } catch (_) { setFeedback("保存失败，请稍后重试") } finally { setSaving(false) }
  }
  return <form onSubmit={submit} className="mt-5 space-y-4 border-t border-[var(--color-border)] pt-5">
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-[var(--color-text-muted)]">调酒日期<input type="date" value={form.made_at} onChange={(e) => update("made_at", e.target.value)} className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] px-3 py-2 text-sm text-[var(--color-text-main)]" /></label><label className="text-xs text-[var(--color-text-muted)]">使用品牌<input value={form.brands} onChange={(e) => update("brands", e.target.value)} placeholder="多个品牌用逗号分隔" className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] px-3 py-2 text-sm text-[var(--color-text-main)]" /></label></div>
    <div><p className="text-xs text-[var(--color-text-muted)] mb-2">实际评分</p><div className="flex gap-1">{[1,2,3,4,5].map((star) => <button type="button" key={star} onClick={() => update("rating", star)} className={`text-2xl ${star <= form.rating ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}>★</button>)}</div></div>
    <label className="flex items-center gap-2 text-sm text-[var(--color-text-gray)]"><input type="checkbox" checked={form.recipe_modified} onChange={(e) => update("recipe_modified", e.target.checked)} />这次修改了配方</label>
    {form.recipe_modified && <textarea value={form.modification_note} onChange={(e) => update("modification_note", e.target.value)} placeholder="改了哪些比例或材料？" rows={3} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] p-3 text-sm text-[var(--color-text-main)]" />}
    <label className="flex items-start gap-2 text-sm text-[var(--color-text-gray)]"><input type="checkbox" checked={form.visibility === "public"} onChange={(e) => update("visibility", e.target.checked ? "public" : "private")} /><span>申请公开这条记录<span className="mt-1 block text-xs text-[var(--color-text-muted)]">公开内容会先进入审核，通过后其他用户才能看到；私密记录不会提交审核。</span></span></label>
    <textarea value={form.next_time_note} onChange={(e) => update("next_time_note", e.target.value)} placeholder="下次想怎么调整？" rows={3} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] p-3 text-sm text-[var(--color-text-main)]" />
    <label className="block text-xs text-[var(--color-text-muted)]">成品照片（最大 5MB）<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-[var(--color-text-gray)]" /></label>
    <div className="flex items-center justify-between"><div className="flex gap-2"><button disabled={saving} className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-bg-page)] disabled:opacity-50">{saving ? "保存中..." : initialLog ? "保存修改" : "保存这次记录"}</button>{onCancel && <button type="button" onClick={onCancel} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-gray)]">取消</button>}</div>{feedback && <span className={`text-xs ${feedback.includes("失败") ? "text-red-400" : "text-emerald-400"}`}>{feedback}</span>}</div>
  </form>
}
