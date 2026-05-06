"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, TrendingUp, TrendingDown, BarChart3, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/app", label: "Ana Sayfa", icon: LayoutDashboard },
  { href: "/app/income", label: "Gelirler", icon: TrendingUp },
  { href: "/app/expenses", label: "Giderler", icon: TrendingDown },
  { href: "/app/analytics", label: "Analiz", icon: BarChart3 },
  { href: "/app/sources", label: "Kaynaklar", icon: Layers },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden flex items-stretch justify-around border-t border-white/[0.07]"
      style={{
        background: "rgba(10,10,18,0.96)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        paddingBottom: "calc(0.375rem + env(safe-area-inset-bottom))",
      }}
    >
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-col items-center justify-center gap-[5px] flex-1 pt-2.5 pb-1 min-w-0"
          >
            {/* Active top-of-bar indicator */}
            <span
              className={cn(
                "absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-b-full transition-all duration-300",
                active ? "w-6 bg-[#E50001]" : "w-0 bg-transparent"
              )}
            />

            <Icon
              className={cn(
                "flex-shrink-0 transition-colors duration-200",
                active ? "text-[#E50001]" : "text-white/30"
              )}
              style={{ width: 22, height: 22 }}
              strokeWidth={active ? 2.2 : 1.7}
            />

            <span
              className={cn(
                "text-[10px] leading-none transition-colors duration-200 truncate max-w-full px-1",
                active ? "text-[#E50001] font-semibold" : "text-white/30 font-medium"
              )}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
