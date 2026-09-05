import { useState } from "react"
import { Flag } from "lucide-react"
import { fetchAPI } from "../lib/api"

export default function CommunityReportButton({ contentId }) {
  const [message, setMessage] = useState("")
  async function report() {
    if (!localStorage.getItem("token")) return setMessage("请先登录后再举报")
    const reason = window.prompt("请输入举报原因")
    if (!reason?.trim()) return
    try {
      await fetchAPI("/api/reports", { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, body: { target_type: "community_content", target_id: contentId, reason: reason.trim() } })
      setMessage("举报已提交")
    } catch (err) { setMessage(err.message || "举报提交失败") }
  }
  return <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 z-30 font-ui md:bottom-6 md:left-6"><button type="button" onClick={report} className="inline-flex items-center gap-2 border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-xs text-[var(--color-text-muted)] shadow-lg hover:text-red-300"><Flag size={14} />举报内容</button>{message && <span className="ml-2 text-xs text-[var(--color-accent)]">{message}</span>}</div>
}
