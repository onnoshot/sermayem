"use client"

import { usePathname, useRouter } from "next/navigation"
import { useRef, useEffect } from "react"
import { LayoutDashboard, TrendingUp, TrendingDown, BarChart3, Layers } from "lucide-react"
const NAV = [
  { href: "/app", label: "Ana sayfa", icon: LayoutDashboard },
  { href: "/app/income", label: "Gelirler", icon: TrendingUp },
  { href: "/app/expenses", label: "Giderler", icon: TrendingDown },
  { href: "/app/analytics", label: "Analiz", icon: BarChart3 },
  { href: "/app/sources", label: "Kaynaklar", icon: Layers },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const textRefs = useRef<(HTMLElement | null)[]>([])
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href)

  const activeIndex = NAV.findIndex((item) => isActive(item.href))

  useEffect(() => {
    const setLineWidth = () => {
      if (activeIndex < 0) return
      const el = itemRefs.current[activeIndex]
      const textEl = textRefs.current[activeIndex]
      if (el && textEl) {
        el.style.setProperty("--lineWidth", `${textEl.offsetWidth}px`)
      }
    }
    setLineWidth()
    window.addEventListener("resize", setLineWidth)
    return () => window.removeEventListener("resize", setLineWidth)
  }, [activeIndex])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
      {/* Nav bar */}
      <nav
        className="menu"
        role="navigation"
        style={{ "--component-active-color-default": "#E50001" } as React.CSSProperties}
      >
        {NAV.map((item, index) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <button
              key={item.href}
              className={`menu__item${active ? " active" : ""}`}
              onClick={() => router.push(item.href)}
              ref={(el) => { itemRefs.current[index] = el }}
              style={{ "--lineWidth": "0px" } as React.CSSProperties}
              aria-current={active ? "page" : undefined}
            >
              <div className="menu__icon">
                <Icon className="icon" />
              </div>
              <strong
                className={`menu__text${active ? " active" : ""}`}
                ref={(el) => { textRefs.current[index] = el as HTMLElement | null }}
              >
                {item.label}
              </strong>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
