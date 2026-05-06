"use client"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  LayoutDashboard, TrendingUp, TrendingDown, Clock, Layers,
  BarChart3, User, Settings, LogOut, Plus, ChevronLeft, ChevronRight, X,
  Wallet, Target, Crown, Sparkles,
} from "lucide-react"
import { useUIStore } from "@/lib/stores/ui-store"
import type { Profile } from "@/types/database"
import { useEffect, useState } from "react"

const NAV = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, color: "from-yellow-500 to-amber-400", glow: "rgba(234,179,8,0.3)" },
  { href: "/app/income", label: "Gelirler", icon: TrendingUp, color: "from-green-500 to-emerald-400", glow: "rgba(34,197,94,0.3)" },
  { href: "/app/expenses", label: "Giderler", icon: TrendingDown, color: "from-red-500 to-rose-400", glow: "rgba(239,68,68,0.3)" },
  { href: "/app/pending", label: "Bekleyenler", icon: Clock, color: "from-purple-500 to-violet-400", glow: "rgba(168,85,247,0.3)" },
  { href: "/app/sources", label: "Kaynaklar", icon: Layers, color: "from-blue-500 to-cyan-400", glow: "rgba(59,130,246,0.3)" },
  { href: "/app/analytics", label: "Analiz", icon: BarChart3, color: "from-pink-500 to-fuchsia-400", glow: "rgba(236,72,153,0.3)" },
  { href: "/app/budgets", label: "Bütçeler", icon: Wallet, color: "from-blue-500 to-indigo-400", glow: "rgba(59,130,246,0.3)" },
  { href: "/app/goals", label: "Hedefler", icon: Target, color: "from-green-500 to-emerald-400", glow: "rgba(34,197,94,0.3)" },
]

const BOTTOM_NAV = [
  { href: "/app/profile", label: "Profil", icon: User },
  { href: "/app/settings", label: "Ayarlar", icon: Settings },
]

interface SidebarProps {
  profile: Profile | null
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, toggleSidebar, setSidebarOpen, openAddTransaction, openProModal } = useUIStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      setSidebarOpen(!e.matches)
    }
    setIsMobile(mq.matches)
    if (mq.matches) setSidebarOpen(false)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [setSidebarOpen])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const isActive = (href: string) => href === "/app" ? pathname === "/app" : pathname.startsWith(href)

  return (
    <motion.aside
      animate={
        isMobile
          ? { x: sidebarOpen ? 0 : -264, width: 256 }
          : { x: 0, width: sidebarOpen ? 256 : 76 }
      }
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-white/[0.06] overflow-hidden"
      style={{ background: "var(--c-sidebar)", backdropFilter: "blur(40px)", transition: "background 0.3s ease" }}
    >
      {/* Header */}
      <div className={cn("flex items-center h-[68px] border-b border-white/[0.06] px-4 gap-3 flex-shrink-0", !sidebarOpen && "justify-center px-0")}>
        {!sidebarOpen && (
          <motion.div
            className="h-9 w-9 rounded-[11px] flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/[0.04]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="Sermayem" className="h-6 w-6 object-contain" />
          </motion.div>
        )}

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sermayem.svg" alt="Sermayem" className="h-6 object-contain object-left" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(sidebarOpen && !isMobile) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
          )}
          {(sidebarOpen && isMobile) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
        {(!sidebarOpen && !isMobile) && (
          <button onClick={toggleSidebar} className="absolute bottom-1 right-0 left-0 mx-auto w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-white/50 transition-all" style={{ position: 'absolute', top: '50%', right: '-2px', transform: 'translateY(-50%)', left: 'auto' }}>
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Add Transaction Button */}
      <div className={cn("p-3 flex-shrink-0", !sidebarOpen && "px-2")}>
        <motion.button
          onClick={openAddTransaction}
          whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(229,0,1,0.45)" }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-[14px] font-bold text-white transition-all",
            "shadow-[0_0_20px_rgba(229,0,1,0.25)]",
            sidebarOpen ? "px-4 py-3 text-sm justify-start" : "h-11 w-11 justify-center mx-auto px-0"
          )}
          style={{ background: "linear-gradient(135deg, #E50001, #B91C1C)" }}
        >
          <Plus className="h-5 w-5 flex-shrink-0" strokeWidth={2.5} />
          {sidebarOpen && <span>İşlem Ekle</span>}
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto pb-2">
        {NAV.map(({ href, label, icon: Icon, color, glow }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} onClick={() => isMobile && setSidebarOpen(false)}>
              <motion.div
                whileHover={{ x: sidebarOpen ? 2 : 0 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-3 rounded-[12px] transition-all duration-200 relative",
                  sidebarOpen ? "px-3 py-2.5" : "h-11 w-11 mx-auto justify-center",
                  active
                    ? "bg-white/[0.08] border border-white/[0.1]"
                    : "hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-200",
                    sidebarOpen ? "h-9 w-9" : "h-10 w-10",
                    active
                      ? `bg-gradient-to-br ${color}`
                      : "bg-white/[0.06]"
                  )}
                  style={active ? { boxShadow: `0 4px 12px ${glow}` } : undefined}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", active ? "text-white" : "text-white/45")} strokeWidth={active ? 2 : 1.8} />
                </div>

                {sidebarOpen && (
                  <span className={cn("text-sm font-semibold transition-colors whitespace-nowrap", active ? "text-white" : "text-white/45")}>
                    {label}
                  </span>
                )}

                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute right-2 h-1.5 w-1.5 rounded-full bg-[#E50001]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] px-2 py-3 space-y-1 flex-shrink-0">
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} onClick={() => isMobile && setSidebarOpen(false)}>
            <div className={cn(
              "flex items-center gap-3 rounded-[12px] text-white/35 hover:bg-white/[0.05] hover:text-white/65 transition-all",
              sidebarOpen ? "px-3 py-2.5" : "h-11 w-11 mx-auto justify-center"
            )}>
              <div className="h-9 w-9 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                <Icon className="h-4.5 w-4.5" />
              </div>
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
            </div>
          </Link>
        ))}

        {/* Pro upgrade button */}
        <motion.button
          onClick={() => { openProModal(); isMobile && setSidebarOpen(false) }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(245,158,11,0.35)" }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-[12px] font-bold text-[13px] transition-all mb-1",
            sidebarOpen ? "px-3.5 py-2.5 justify-start" : "h-11 w-11 justify-center mx-auto px-0"
          )}
          style={{
            background: "linear-gradient(135deg, rgba(252,211,77,0.14) 0%, rgba(245,158,11,0.08) 100%)",
            border: "1px solid rgba(245,158,11,0.28)",
            boxShadow: "0 0 12px rgba(245,158,11,0.1)",
          }}
        >
          <div className="h-5 w-5 flex items-center justify-center flex-shrink-0">
            {sidebarOpen
              ? <Sparkles className="h-4 w-4 text-amber-400" />
              : <Crown className="h-4 w-4 text-amber-400" />
            }
          </div>
          {sidebarOpen && (
            <span style={{ color: "#FCD34D" }}>Pro Paket Al</span>
          )}
        </motion.button>

        {/* Profile card */}
        <div className={cn(
          "flex items-center gap-3 rounded-[12px] mt-1 p-2.5 bg-white/[0.04] border border-white/[0.07]",
          !sidebarOpen && "justify-center"
        )}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600/15 to-red-500/15 border border-red-500/20 flex items-center justify-center text-lg flex-shrink-0">
            {profile?.avatar_emoji || "🎯"}
          </div>
          {sidebarOpen && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/80 truncate">{profile?.full_name || "Kullanıcı"}</p>
                <p className="text-xs text-white/30">{profile?.currency || "TRY"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                title="Çıkış yap"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
