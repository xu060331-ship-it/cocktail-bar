import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const navigate = useNavigate()
  return <button type="button" onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"><ArrowLeft size={15} strokeWidth={1.5} />返回</button>
}
