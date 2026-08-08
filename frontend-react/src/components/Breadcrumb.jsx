import { Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

// items: [{ label: "酒谱", to: "/cocktails" }, { label: "Dry Martini" }]
export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-8">
      <Link to="/" className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-1">
        <Home size={12} strokeWidth={1.5} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={10} strokeWidth={1.5} />
          {item.to ? (
            <Link to={item.to} className="hover:text-[var(--color-accent)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--color-text-gray)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
