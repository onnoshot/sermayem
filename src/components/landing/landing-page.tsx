"use client"
import { motion, useScroll, useTransform, useInView, animate, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ChevronDown, CreditCard, Infinity as InfinityIcon, Zap, TrendingUp, TrendingDown, Clock, Lock } from "lucide-react"
import { useRef, useEffect, useState } from "react"

/* ─── Animated counter ─── */
function Counter({ to, duration = 1.6, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("tr-TR") + suffix },
    })
    return controls.stop
  }, [inView, to, duration, suffix])
  return <span ref={ref}>0</span>
}

/* ─── SVG Icons (replacing emojis) ─── */
function IconChart() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <motion.rect x="4" y="24" width="6" height="12" rx="2" fill="#4ADE80"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.2, duration: 0.6, ease: [0.16,1,0.3,1] }} style={{ transformOrigin: "bottom" }} />
      <motion.rect x="13" y="16" width="6" height="20" rx="2" fill="#4ADE80" opacity="0.7"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.35, duration: 0.6, ease: [0.16,1,0.3,1] }} style={{ transformOrigin: "bottom" }} />
      <motion.rect x="22" y="8" width="6" height="28" rx="2" fill="#E50001"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.5, duration: 0.6, ease: [0.16,1,0.3,1] }} style={{ transformOrigin: "bottom" }} />
      <motion.rect x="31" y="12" width="6" height="24" rx="2" fill="#E50001" opacity="0.7"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.65, duration: 0.6, ease: [0.16,1,0.3,1] }} style={{ transformOrigin: "bottom" }} />
      <motion.line x1="2" y1="36" x2="38" y2="36" stroke="rgba(255,255,255,0.12)" strokeWidth="1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, duration: 0.4 }} />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <motion.rect x="4" y="8" width="32" height="28" rx="4" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
      <rect x="4" y="8" width="32" height="10" rx="4" fill="rgba(168,85,247,0.12)" />
      {[12, 20, 28].map((x, i) => (
        <motion.line key={x} x1={x} y1="6" x2={x} y2="12" stroke="rgba(168,85,247,0.8)" strokeWidth="2" strokeLinecap="round"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.1 + 0.3 }} style={{ transformOrigin: "center" }} />
      ))}
      {[[10,22],[18,22],[26,22],[34,22],[10,30],[18,30],[26,30]].map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r="2" fill="rgba(168,85,247,0.5)"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06 + 0.5, type: "spring", stiffness: 300 }} />
      ))}
      <motion.circle cx="34" cy="30" r="2" fill="#A855F7"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: "spring", stiffness: 300 }} />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <motion.circle cx="20" cy="20" r="16" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
      <motion.circle cx="20" cy="20" r="10" stroke="rgba(59,130,246,0.45)" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.5 }} />
      <motion.circle cx="20" cy="20" r="4" fill="#3B82F6"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 280 }} />
      <motion.line x1="20" y1="2" x2="20" y2="8" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" strokeLinecap="round"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
      <motion.line x1="32" y1="8" x2="24" y2="16" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.4 }} />
    </svg>
  )
}

function IconPie() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <motion.path d="M20 20 L20 4 A16 16 0 0 1 34.9 28 Z" fill="rgba(249,115,22,0.7)"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5, ease: [0.16,1,0.3,1] }} style={{ transformOrigin: "20px 20px" }} />
      <motion.path d="M20 20 L34.9 28 A16 16 0 0 1 5.1 28 Z" fill="rgba(249,115,22,0.45)"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.5, ease: [0.16,1,0.3,1] }} style={{ transformOrigin: "20px 20px" }} />
      <motion.path d="M20 20 L5.1 28 A16 16 0 0 1 20 4 Z" fill="rgba(249,115,22,0.25)"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5, ease: [0.16,1,0.3,1] }} style={{ transformOrigin: "20px 20px" }} />
      <circle cx="20" cy="20" r="6" fill="#09090E" />
      <motion.circle cx="20" cy="20" r="2" fill="rgba(249,115,22,0.8)"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: "spring" }} />
    </svg>
  )
}

function IconShield() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <motion.path d="M20 4 L34 10 L34 22 C34 30 20 36 20 36 C20 36 6 30 6 22 L6 10 Z"
        stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" fill="rgba(34,197,94,0.08)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d="M13 20 L17.5 24.5 L27 15"
        stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.5 }} />
    </svg>
  )
}

function IconLock() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <motion.rect x="8" y="18" width="24" height="18" rx="3" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" fill="rgba(34,197,94,0.06)"
        initial={{ y: 4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} />
      <motion.path d="M13 18 L13 13 C13 8.6 27 8.6 27 13 L27 18"
        stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
      <motion.circle cx="20" cy="27" r="3" fill="#4ADE80"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring", stiffness: 300 }} />
    </svg>
  )
}

function IconNoShare() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <motion.circle cx="14" cy="14" r="5" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
      <motion.circle cx="28" cy="14" r="5" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.5 }} />
      <motion.path d="M19 14 L23 14" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5 }} />
      <motion.line x1="22" y1="10" x2="30" y2="18" stroke="#F87171" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.35 }} />
    </svg>
  )
}

function IconTR() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <motion.rect x="4" y="10" width="32" height="20" rx="3" fill="rgba(229,0,1,0.12)" stroke="rgba(229,0,1,0.3)" strokeWidth="1.5"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }} style={{ transformOrigin: "center" }} />
      <motion.path d="M16 17 C15 17 12 18 12 20 C12 22 15 23 16 23 C14 23 11.5 22 11 20 C11 18 14 17 16 17 Z"
        fill="rgba(255,255,255,0.6)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }} />
      <motion.path d="M19 16 L20 18.5 L22.5 18.5 L20.5 20 L21.5 22.5 L19 21 L16.5 22.5 L17.5 20 L15.5 18.5 L18 18.5 Z"
        fill="rgba(255,255,255,0.55)"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 260 }} style={{ transformOrigin: "19px 19px" }} />
    </svg>
  )
}

/* ─── Animated line chart ─── */
function MiniLineChart({ color, data }: { color: string; data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((v - min) / (max - min + 1)) * 85
    return `${x},${y}`
  }).join(" ")
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.16,1,0.3,1] }} />
    </svg>
  )
}

/* ─── Product mockup ─── */
const MOCK_TXS = [
  { icon: <TrendingUp className="h-3 w-3 text-green-400" />, name: "Maaş", amount: "+45.000", pos: true },
  { icon: <TrendingDown className="h-3 w-3 text-red-400" />, name: "Kira", amount: "-12.000", pos: false },
  { icon: <TrendingDown className="h-3 w-3 text-red-400" />, name: "Market", amount: "-2.340", pos: false },
]

const INCOME_DATA = [28, 35, 31, 42, 38, 55, 48, 62, 57, 71, 68, 89]
const EXPENSE_DATA = [22, 28, 24, 30, 29, 38, 33, 44, 40, 48, 43, 46]

function ProductMockup() {
  return (
    <div className="relative w-full" style={{ height: "clamp(380px, 50vw, 560px)" }}>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0"
        style={{ right: "clamp(28px, 6%, 44px)" }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[24px] overflow-hidden"
          style={{
            background: "linear-gradient(150deg, rgba(20,20,34,0.99) 0%, rgba(10,10,18,0.99) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.05]">
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-[0.2em] mb-1">Net Bakiye</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[1.9rem] sm:text-[2.2rem] font-black text-white leading-none tabular-nums">142.850</span>
                <span className="text-sm font-semibold text-white/22">TL</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-green-400"
              />
              <span className="text-[9px] text-green-400/60 font-medium">Canlı</span>
            </div>
          </div>

          {/* Bar chart area */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] text-white/22 uppercase tracking-wider">Son 12 Ay</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-3 rounded-full bg-green-500/70" />
                  <span className="text-[9px] text-white/25">Gelir</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-3 rounded-full bg-red-500/70" />
                  <span className="text-[9px] text-white/25">Gider</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-[2px] h-16">
              {INCOME_DATA.map((inc, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-[1px]" style={{ height: "100%" }}>
                  <motion.div
                    className="w-full rounded-t-[2px]"
                    style={{ background: "rgba(34,197,94,0.55)", height: `${(inc / 89) * 60}%`, transformOrigin: "bottom" }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.8 + i * 0.04, duration: 0.4, ease: "easeOut" }}
                  />
                  <motion.div
                    className="w-full rounded-t-[2px]"
                    style={{ background: i === 11 ? "rgba(229,0,1,0.8)" : "rgba(239,68,68,0.35)", height: `${(EXPENSE_DATA[i] / 89) * 60}%` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.85 + i * 0.04, duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex border-t border-white/[0.05]">
            {[
              { label: "Toplam Gelir", value: "+89.2K", color: "#4ADE80" },
              { label: "Toplam Gider", value: "-46.3K", color: "#F87171" },
              { label: "Net", value: "+42.9K", color: "#FBBF24" },
            ].map((s, i) => (
              <div key={i} className={`flex-1 py-3 px-4 ${i < 2 ? "border-r border-white/[0.05]" : ""}`}>
                <p className="text-[8px] text-white/22 mb-0.5">{s.label}</p>
                <p className="text-xs font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Transaction mini card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20"
        style={{ bottom: "clamp(16px, 4%, 24px)", right: 0, width: "clamp(155px, 42%, 196px)" }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="rounded-[16px] overflow-hidden"
          style={{
            background: "rgba(10,10,18,0.99)",
            border: "1px solid rgba(255,255,255,0.065)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
          }}
        >
          <div className="px-3 pt-3 pb-1 border-b border-white/[0.05]">
            <p className="text-[8px] text-white/22 uppercase tracking-wider">Son İşlemler</p>
          </div>
          <div className="p-3 space-y-2">
            {MOCK_TXS.map((t) => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-[5px] bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  {t.icon}
                </div>
                <span className="text-[9px] text-white/45 flex-1 truncate">{t.name}</span>
                <span className="text-[9px] font-bold tabular-nums" style={{ color: t.pos ? "#4ADE80" : "#F87171" }}>{t.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Pending badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 20 }}
        className="absolute z-30"
        style={{ top: "-8px", right: "clamp(36px, 12%, 56px)" }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="px-2.5 py-1.5 rounded-[9px] flex items-center gap-2"
          style={{
            background: "rgba(10,10,18,0.97)",
            border: "1px solid rgba(168,85,247,0.22)",
          }}
        >
          <Clock className="h-3 w-3 text-purple-400" />
          <span className="text-[10px] font-medium text-purple-300/75 whitespace-nowrap">3 bekleyen ödeme</span>
        </motion.div>
      </motion.div>

      {/* Goal badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.85, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-30"
        style={{ bottom: 0, left: 0 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="px-3 py-2 rounded-[12px] flex items-center gap-2.5"
          style={{
            background: "rgba(8,8,16,0.97)",
            border: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <div className="relative h-8 w-8 flex-shrink-0">
            <svg viewBox="0 0 32 32" className="h-full w-full -rotate-90">
              <circle cx="16" cy="16" r="11" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <motion.circle cx="16" cy="16" r="11" fill="none" stroke="#4ADE80" strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 69.1" }}
                animate={{ strokeDasharray: "49.7 69.1" }}
                transition={{ delay: 1.2, duration: 1.2, ease: [0.16,1,0.3,1] }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-green-400">72%</span>
          </div>
          <div>
            <p className="text-[8px] text-white/22 leading-none mb-0.5">Aylık hedef</p>
            <p className="text-[11px] font-bold text-green-400">tamamlandı</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ─── Feature cards data ─── */
const FEATURES = [
  {
    icon: <div className="h-10 w-10"><IconChart /></div>,
    title: "Anlık Gelir-Gider Takibi",
    desc: "Her işlemini anında kaydet. Kategori ve kaynak bazında nereye ne harcadığını gerçek zamanlı gör.",
    accent: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.12)",
    stat: { value: "+%23", label: "daha fazla tasarruf" },
  },
  {
    icon: <div className="h-10 w-10"><IconCalendar /></div>,
    title: "Bekleyen Ödemeler Takvimi",
    desc: "Kira, fatura, taksit — tüm bekleyen ödemelerini takvimde takip et. Vadeyi asla kaçırma.",
    accent: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.12)",
    stat: { value: "0", label: "kaçırılan ödeme" },
  },
  {
    icon: <div className="h-10 w-10"><IconTarget /></div>,
    title: "Hedef ve İlerleme Takibi",
    desc: "Aylık gelir ve tasarruf hedefleri koy. Görsel ilerleme çubuğuyla motivasyonunu canlı tut.",
    accent: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.12)",
    stat: { value: "3x", label: "daha hızlı birikim" },
  },
  {
    icon: <div className="h-10 w-10"><IconPie /></div>,
    title: "Akıllı Analiz ve Raporlar",
    desc: "Kaynak bazlı pasta grafikler, aylık trendler ve harcama kırılımlarıyla finansal resmin tamamını gör.",
    accent: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.12)",
    stat: { value: "12+", label: "aylık rapor" },
  },
]

const SECURITY = [
  { icon: <div className="h-8 w-8"><IconLock /></div>, title: "256-bit AES Şifreleme", desc: "Tüm verileriniz uçtan uca şifrelenerek saklanır." },
  { icon: <div className="h-8 w-8"><IconNoShare /></div>, title: "Sıfır Veri Paylaşımı", desc: "Verileriniz hiçbir üçüncü tarafla kesinlikle paylaşılmaz." },
  { icon: <div className="h-8 w-8"><IconShield /></div>, title: "Supabase Altyapısı", desc: "Dünya standartlarında güvenlik ve yedekleme altyapısı." },
  { icon: <div className="h-8 w-8"><IconTR /></div>, title: "Türkiye'de Geliştiriliyor", desc: "Türk kullanıcılar için Türk geliştiriciler tarafından yapılıyor." },
]

/* ─── Main component ─── */
export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.55], [0, -32])

  return (
    <main className="min-h-screen bg-[#09090E] text-white overflow-x-hidden">

      {/* ─── Static background ─── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[#09090E]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        {/* Subtle grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Single top accent glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[300px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(229,0,1,0.06), transparent 70%)" }} />
      </div>

      {/* ─── Header ─── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b border-white/[0.05]"
        style={{ background: "rgba(9,9,14,0.92)", backdropFilter: "blur(24px)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sermayem.svg" alt="Sermayem" className="h-[18px] sm:h-[20px] object-contain" />

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/35">
            <a href="#ozellikler" className="hover:text-white/65 transition-colors">Özellikler</a>
            <a href="#istatistikler" className="hover:text-white/65 transition-colors">İstatistikler</a>
            <a href="#guvenlik" className="hover:text-white/65 transition-colors">Güvenlik</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:flex text-sm text-white/35 hover:text-white/65 transition-colors px-3 py-2">
              Giriş Yap
            </Link>
            <Link href="/auth/signup"
              className="flex items-center gap-1.5 text-[13px] font-bold text-white px-4 py-2 rounded-[10px] transition-all active:scale-[0.96]"
              style={{ background: "#E50001" }}>
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-4 sm:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12">
        <motion.div style={{ opacity: heroOpacity, y: heroY }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] mb-6"
              >
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-green-400"
                />
                <span className="text-xs text-white/45 font-medium">Ücretsiz · Sınırsız işlem · Kart gerekmez</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-[2.4rem] sm:text-[3.2rem] lg:text-[3.8rem] font-black leading-[1.04] tracking-tight mb-5"
              >
                Paranın nereye{" "}
                <br className="hidden sm:block" />
                gittiğini{" "}
                <span className="relative inline-block">
                  <span style={{ color: "#E50001" }}>artık biliyorsun.</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] rounded-full"
                    style={{ background: "#E50001", width: "100%" }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: [0.16,1,0.3,1] }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="text-[15px] sm:text-[16px] text-white/38 leading-relaxed mb-8 max-w-[460px]"
              >
                Gelir, gider ve birikimini tek panelde yönet. Sermaye oluştur, hedeflerine ulaş. Tamamen ücretsiz, sınırsız kullanım.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.33 }}
                className="flex flex-col sm:flex-row gap-3 mb-8"
              >
                <Link href="/auth/signup"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] font-bold text-white text-[15px] transition-all active:scale-[0.97] group"
                  style={{ background: "#E50001" }}
                >
                  Ücretsiz Hesap Oluştur
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="/auth/login"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] font-medium text-white/50 text-[15px] border border-white/[0.07] hover:text-white/70 hover:border-white/[0.12] transition-all">
                  Giriş Yap
                </Link>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
              >
                {[
                  { Icon: Lock, text: "Güvenli" },
                  { Icon: CreditCard, text: "Kart gerekmez" },
                  { Icon: InfinityIcon, text: "Sınırsız işlem" },
                  { Icon: Zap, text: "Anında kurulum" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-[11px] text-white/25">
                    <Icon className="h-3 w-3" strokeWidth={1.5} />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — mockup desktop */}
            <div className="hidden lg:block">
              <ProductMockup />
            </div>
          </div>

          {/* Mobile mockup */}
          <div className="lg:hidden mt-10 px-1">
            <ProductMockup />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex justify-center mt-12 sm:mt-16"
        >
          <motion.a href="#ozellikler"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="flex flex-col items-center gap-1.5 text-white/15 hover:text-white/35 transition-colors"
          >
            <span className="text-[9px] uppercase tracking-[0.22em]">Keşfet</span>
            <ChevronDown className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </section>

      {/* ─── STATS infographic ─── */}
      <section id="istatistikler" className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { to: 5000, suffix: "+", label: "Aktif kullanıcı", sub: "ve büyüyor" },
            { to: 23, suffix: "%", label: "Ortalama tasarruf artışı", sub: "ilk 3 ayda" },
            { to: 1200000, suffix: "+", label: "Kayıtlı işlem", sub: "takip ediliyor" },
            { to: 99, suffix: ".9%", label: "Çalışma süresi", sub: "garantili uptime" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16,1,0.3,1] }}
              className="p-4 sm:p-6 rounded-[18px] border border-white/[0.07] bg-white/[0.02] text-center"
            >
              <p className="text-2xl sm:text-3xl font-black text-white mb-1 tabular-nums">
                <Counter to={s.to} suffix={s.suffix} duration={1.8} />
              </p>
              <p className="text-xs font-semibold text-white/60 mb-0.5">{s.label}</p>
              <p className="text-[10px] text-white/22">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="ozellikler" className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 sm:mb-12"
        >
          <p className="text-[11px] text-[#E50001] font-bold uppercase tracking-[0.22em] mb-3">Özellikler</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">Her şey tek bir yerde</h2>
          <p className="text-white/35 text-[15px] max-w-[380px] leading-relaxed">
            Finansal sağlığını takip etmek için ihtiyacın olan her araç, tek çatı altında.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2, transition: { duration: 0.18 } }}
              className="relative p-6 sm:p-7 rounded-[20px] group cursor-default"
              style={{ background: f.accent, border: `1px solid ${f.border}` }}
            >
              <div className="flex items-start justify-between mb-4">
                {f.icon}
                <div className="text-right">
                  <p className="text-lg font-black text-white">{f.stat.value}</p>
                  <p className="text-[10px] text-white/28">{f.stat.label}</p>
                </div>
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/42 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TREND infographic ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-[20px] sm:rounded-[24px] border border-white/[0.07] bg-white/[0.02] overflow-hidden"
        >
          <div className="p-6 sm:p-8 border-b border-white/[0.05]">
            <p className="text-[11px] text-white/25 uppercase tracking-wider mb-1">İnfografik</p>
            <h3 className="text-xl sm:text-2xl font-black text-white">Kullanıcıların finansal yolculuğu</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
            {[
              {
                step: "01",
                title: "Gelirlerini kaydet",
                desc: "Maaş, freelance, kira — tüm kaynaklarını tanımla.",
                data: [20, 35, 28, 45, 38, 52, 60, 75, 68, 85, 78, 95],
                color: "#4ADE80",
              },
              {
                step: "02",
                title: "Giderlerini takip et",
                desc: "Her harcamayı kategorize et, nereye gittiğini gör.",
                data: [55, 48, 60, 52, 65, 58, 50, 44, 47, 42, 40, 38],
                color: "#F87171",
              },
              {
                step: "03",
                title: "Birikimini büyüt",
                desc: "Net bakiyeni izle, hedeflerine hızla ulaş.",
                data: [5, 12, 8, 18, 14, 24, 30, 40, 34, 48, 52, 68],
                color: "#FBBF24",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black text-white/20 font-mono">{item.step}</span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>
                <div className="h-12 mb-4">
                  <MiniLineChart color={item.color} data={item.data} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-white/35 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── SECURITY ─── */}
      <section id="guvenlik" className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-[20px] sm:rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8 lg:p-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8"><IconShield /></div>
            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5">Güvenlik</p>
              <h2 className="text-xl sm:text-2xl font-black text-white">Verileriniz güvende</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECURITY.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                className="flex items-start gap-4 p-4 sm:p-5 rounded-[14px] border border-white/[0.05] bg-white/[0.02] cursor-default"
              >
                {s.icon}
                <div>
                  <p className="text-[13px] font-semibold text-white/80 mb-0.5">{s.title}</p>
                  <p className="text-xs text-white/38 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-center rounded-[20px] sm:rounded-[24px] p-8 sm:p-12 lg:p-16 border border-white/[0.07] overflow-hidden"
        >
          {/* Subtle accent line top */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E50001]/40 to-transparent" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.55 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[2.8rem] font-black text-white tracking-tight mb-4">
              Finansal özgürlüğe{" "}
              <span style={{ color: "#E50001" }}>bir adım kal.</span>
            </h2>
            <p className="text-white/35 text-[15px] mb-8 max-w-[320px] mx-auto leading-relaxed">
              Hesap oluşturmak ücretsiz. Kredi kartı gerekmez. Hemen başla.
            </p>
            <Link href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-[13px] font-bold text-white text-[15px] sm:text-[16px] transition-all active:scale-[0.97] group"
              style={{ background: "#E50001" }}
            >
              Hemen Başla
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="text-[10px] text-white/18 mt-4">Sınırsız işlem kayıt. Tamamen ücretsiz. Her zaman.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sermayem.svg" alt="Sermayem" className="h-[18px] object-contain opacity-60" />
          <div className="flex items-center gap-5 sm:gap-7 text-xs text-white/22 flex-wrap justify-center">
            <a href="#ozellikler" className="hover:text-white/45 transition-colors">Özellikler</a>
            <a href="#guvenlik" className="hover:text-white/45 transition-colors">Güvenlik</a>
            <Link href="/blog" className="hover:text-white/45 transition-colors">Blog</Link>
            <Link href="/auth/login" className="hover:text-white/45 transition-colors">Giriş Yap</Link>
            <Link href="/auth/signup" className="hover:text-white/45 transition-colors">Kayıt Ol</Link>
          </div>
          <p className="text-[10px] text-white/15">2026 Sermayem. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </main>
  )
}
