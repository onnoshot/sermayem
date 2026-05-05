"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { TrendingUp } from "lucide-react"

// ─── Animated counter ─────────────────────────────────────────────
function CountUp({ to, duration = 1800, delay = 300 }: { to: number; duration?: number; delay?: number }) {
  const [val, setVal] = useState(0)
  const raf = useRef<number>()
  const t0 = useRef<number>()

  useEffect(() => {
    const timer = setTimeout(() => {
      const tick = (ts: number) => {
        if (!t0.current) t0.current = ts
        const p = Math.min((ts - t0.current) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(eased * to))
        if (p < 1) raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(timer); if (raf.current) cancelAnimationFrame(raf.current) }
  }, [to, duration, delay])

  return <>{val.toLocaleString("tr-TR")}</>
}

// ─── Animated SVG area chart ───────────────────────────────────────
const CHART_DATA = [22, 30, 25, 44, 34, 56, 46, 66, 53, 80, 64, 100]
const CHART_MONTHS = ["O", "Ş", "M", "N", "M", "H", "T", "A", "E", "E", "K", "A"]

function AreaChart() {
  const W = 340, H = 88
  const pts = CHART_DATA.map((v, i) => ({
    x: (i / (CHART_DATA.length - 1)) * W,
    y: H - 6 - ((v / 100) * (H - 14)),
  }))
  const linePath = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    const prev = pts[i - 1]
    const cx1 = prev.x + (p.x - prev.x) * 0.42
    const cx2 = p.x - (p.x - prev.x) * 0.42
    return `${acc} C ${cx1.toFixed(1)} ${prev.y.toFixed(1)} ${cx2.toFixed(1)} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  }, "")
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`
  const last = pts[pts.length - 1]

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 88 }}>
        <defs>
          <linearGradient id="acfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E50001" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#E50001" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={areaPath} fill="url(#acfill)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.7 }} />
        <motion.path d={linePath} fill="none" stroke="#E50001" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 2.0, ease: [0.4, 0, 0.2, 1] }} />
        {/* Pulse dot at latest value */}
        <motion.circle cx={last.x} cy={last.y} r="10"
          fill="rgba(229,0,1,0.12)"
          initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }}
          transition={{ delay: 2.6, duration: 0.5 }} />
        <motion.circle cx={last.x} cy={last.y} r="4"
          fill="#E50001"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 2.6, type: "spring", stiffness: 320 }} />
      </svg>
      <div className="flex justify-between mt-1.5 px-0">
        {CHART_MONTHS.map((m, i) => (
          <span key={i} className="text-[8px] text-white/18" style={{ width: `${100 / CHART_MONTHS.length}%`, textAlign: "center", display: "block" }}>{m}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Circular savings ring ─────────────────────────────────────────
function RingProgress({ pct, color, label }: { pct: number; color: string; label: string }) {
  const R = 24, C = 2 * Math.PI * R
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 56 56" className="w-12 h-12">
        <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <motion.circle cx="28" cy="28" r={R} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={C} transform="rotate(-90 28 28)"
          initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C - (pct / 100) * C }}
          transition={{ delay: 1.1, duration: 1.6, ease: "easeOut" }} />
        <text x="28" y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{pct}%</text>
      </svg>
      <span className="text-[9px] text-white/30 text-center leading-tight">{label}</span>
    </div>
  )
}

// ─── Live activity feed ────────────────────────────────────────────
const LIVE_ITEMS = [
  { emoji: "🎯", text: "Kullanıcı tasarruf hedefini geçti", badge: "+%23", color: "#4ADE80" },
  { emoji: "💼", text: "Yeni maaş işlemi eklendi", badge: "+45K TL", color: "#4ADE80" },
  { emoji: "🏆", text: "3. ay üst üste hedefe ulaşıldı", badge: "Seri!", color: "#FBBF24" },
  { emoji: "📊", text: "Aylık rapor otomatik hazırlandı", badge: "Haz 2026", color: "#A78BFA" },
]

function LiveFeed() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % LIVE_ITEMS.length), 3000)
    return () => clearInterval(id)
  }, [])
  const item = LIVE_ITEMS[idx]
  return (
    <AnimatePresence mode="wait">
      <motion.div key={idx}
        initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }}
        transition={{ duration: 0.28 }}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[12px]"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="h-7 w-7 rounded-[8px] bg-white/[0.06] flex items-center justify-center text-sm flex-shrink-0">{item.emoji}</div>
        <span className="text-xs text-white/38 flex-1 leading-tight">{item.text}</span>
        <span className="text-[11px] font-semibold flex-shrink-0" style={{ color: item.color }}>{item.badge}</span>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Desktop left panel ────────────────────────────────────────────
function LeftPanel() {
  return (
    <motion.aside
      className="hidden lg:flex w-[500px] xl:w-[540px] flex-shrink-0 flex-col justify-between p-10 xl:p-12 sticky top-0 h-screen overflow-hidden border-r border-white/[0.04]"
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo + live badge */}
      <div className="flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sermayem.svg" alt="Sermayem" className="h-6 object-contain" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.18)", color: "#4ADE80" }}>
          <motion.span className="h-1.5 w-1.5 rounded-full bg-green-400 block"
            animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          Canlı
        </motion.div>
      </div>

      {/* Center */}
      <div className="space-y-4">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[2.2rem] xl:text-[2.6rem] font-black leading-[1.08] tracking-tight text-white mb-2.5">
            Paranı kontrol et,{" "}
            <span style={{ background: "linear-gradient(135deg,#E50001,#FF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              geleceğini
            </span>{" "}
            şekillendir.
          </h1>
          <p className="text-[13px] text-white/32 leading-relaxed">
            2.847+ kullanıcı Sermayem ile finansal özgürlüğüne kavuşuyor.
          </p>
        </motion.div>

        {/* Main card — balance + animated chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[22px] p-5 overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(12,12,22,0.99), rgba(6,6,14,0.99))",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 28px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-start justify-between mb-0.5">
            <div>
              <p className="text-[9px] text-white/28 uppercase tracking-[0.2em] mb-1.5">Net Birikim</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[2.1rem] xl:text-[2.4rem] font-black text-white leading-none tabular-nums">
                  ₺<CountUp to={142850} duration={1800} delay={500} />
                </span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.18)" }}>
              <TrendingUp className="h-3 w-3" />
              +%18.4
            </motion.div>
          </div>
          <p className="text-[10px] text-white/22 mb-4">+₺12.400 bu ay · 12 aylık seyir</p>
          <AreaChart />
        </motion.div>

        {/* Metrics grid */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.55 }}
        >
          <div className="flex flex-col items-center justify-center p-3 rounded-[16px] gap-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.055)" }}>
            <RingProgress pct={72} color="#4ADE80" label="Tasarruf hedefi" />
          </div>
          <div className="p-3.5 rounded-[16px] flex flex-col justify-between"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.055)" }}>
            <p className="text-[9px] text-white/28 uppercase tracking-wider mb-2">Bu Ay</p>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-white/35">Gelir</span>
                <span className="text-[11px] font-bold text-green-400 tabular-nums">+₺<CountUp to={45000} duration={2000} delay={600} /></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/35">Gider</span>
                <span className="text-[11px] font-bold text-red-400 tabular-nums">-₺<CountUp to={32600} duration={2200} delay={700} /></span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-[16px] gap-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.055)" }}>
            <RingProgress pct={58} color="#A78BFA" label="Gider kontrolü" />
          </div>
        </motion.div>

        {/* Live activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.span className="h-1.5 w-1.5 rounded-full bg-green-400 block"
              animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            <span className="text-[9px] text-white/22 uppercase tracking-[0.14em]">Canlı aktivite</span>
          </div>
          <LiveFeed />
        </motion.div>
      </div>

      {/* Bottom trust row */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-5 flex-wrap"
      >
        {[
          { icon: "🔒", text: "256-bit şifreleme" },
          { icon: "💳", text: "Kart gerekmez" },
          { icon: "∞", text: "Sınırsız işlem" },
        ].map((t) => (
          <div key={t.text} className="flex items-center gap-1.5 text-[11px] text-white/22">
            <span>{t.icon}</span><span>{t.text}</span>
          </div>
        ))}
      </motion.div>
    </motion.aside>
  )
}

// ─── Mobile header ─────────────────────────────────────────────────
const MOBILE_CHIPS = [
  { icon: "🔒", label: "256-bit güvenlik" },
  { icon: "📈", label: "+%18 tasarruf" },
  { icon: "💰", label: "0₺/ay" },
  { icon: "🎯", label: "Hedef takibi" },
  { icon: "∞", label: "Sınırsız işlem" },
]

function MobileHeader() {
  return (
    <div className="lg:hidden w-full px-5 pt-10 pb-5">
      {/* Logo + live */}
      <motion.div className="flex items-center justify-between mb-5"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sermayem.svg" alt="Sermayem" className="h-6 object-contain" />
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.18)", color: "#4ADE80" }}>
          <motion.span className="h-1.5 w-1.5 rounded-full bg-green-400 block"
            animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          Canlı
        </div>
      </motion.div>

      {/* Animated metric card */}
      <motion.div
        className="mb-4 p-4 rounded-[18px]"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, rgba(229,0,1,0.07), rgba(185,28,28,0.03))",
          border: "1px solid rgba(229,0,1,0.14)",
        }}
      >
        <p className="text-[10px] text-white/28 uppercase tracking-wider mb-2">2.847 kullanıcı takip ediyor</p>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white tabular-nums">
                ₺<CountUp to={142850} duration={1600} delay={300} />
              </span>
            </div>
            <p className="text-[10px] text-white/28 mt-0.5">ortalama net birikim</p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
            style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.18)" }}>
            <TrendingUp className="h-3 w-3" />
            +%18.4
          </div>
        </div>
      </motion.div>

      {/* Scrollable chips */}
      <div className="w-full overflow-x-auto pb-1" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        <div className="flex gap-2 w-max">
          {MOBILE_CHIPS.map((f, i) => (
            <motion.span key={f.label}
              initial={{ opacity: 0, y: 8, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 280, damping: 22 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-white/[0.09] bg-white/[0.04] text-white/55 whitespace-nowrap">
              {f.icon} {f.label}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <motion.div className="flex items-center gap-3 mt-5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-[11px] text-white/24 font-medium">Hemen başla</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </motion.div>
    </div>
  )
}

// ─── Layout ────────────────────────────────────────────────────────
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-h-dvh bg-[#020208] relative">

      {/* Background — dark navy + grid + aurora blobs (distinct from landing page) */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#020208]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.016]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }} />
        {/* Purple aurora top-right */}
        <motion.div className="absolute -top-[20%] -right-[12%] h-[750px] w-[750px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.11), transparent 65%)" }}
          animate={{ x: [0, -45, 0], y: [0, 38, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }} />
        {/* Teal aurora bottom-left */}
        <motion.div className="absolute -bottom-[15%] -left-[10%] h-[650px] w-[650px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.07), transparent 65%)" }}
          animate={{ x: [0, 36, 0], y: [0, -28, 0] }}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }} />
        {/* Faint red center */}
        <motion.div className="absolute top-[38%] left-[38%] h-[480px] w-[480px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(229,0,1,0.04), transparent 70%)" }}
          animate={{ scale: [1, 1.28, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
        {/* Edge vignette */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(2,2,8,0.65) 100%)" }} />
      </div>

      <div className="flex min-h-screen min-h-dvh flex-col lg:flex-row">
        <LeftPanel />
        <MobileHeader />

        {/* Form panel */}
        <div className="flex-1 flex flex-col justify-start lg:justify-center lg:items-center lg:p-12 pb-8">
          <motion.div
            className="w-full lg:max-w-[400px] px-4 lg:px-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
          <p className="text-[11px] text-white/14 mt-5 text-center lg:hidden pb-2">
            2026 Sermayem
          </p>
        </div>
      </div>
    </div>
  )
}
