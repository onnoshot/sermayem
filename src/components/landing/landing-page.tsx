"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ChevronDown, Crown } from "lucide-react"
import { useRef, useEffect } from "react"
import { DemoSection } from "./demo-section"

/* ─── Animated counter ─── */
function Counter({ to, duration = 1600, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const start = performance.now()
    const el = ref.current
    let raf: number
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      el.textContent = Math.round(eased * to).toLocaleString("tr-TR") + suffix
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, suffix])
  return <span ref={ref}>0</span>
}

/* ─── Mini line chart (for how-it-works steps) ─── */
function MiniLineChart({ color, data }: { color: string; data: number[] }) {
  const ref = useRef<SVGPolylineElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true })
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((v - min) / (max - min + 1)) * 85
    return `${x},${y}`
  }).join(" ")
  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    const len = el.getTotalLength?.() ?? 200
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    el.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)"
    requestAnimationFrame(() => { el.style.strokeDashoffset = "0" })
  }, [inView])
  return (
    <div ref={containerRef} className="w-full h-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <polyline ref={ref} points={pts} fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ─── Hero product card ─── */
const CHART_DATA = [32, 45, 38, 56, 48, 67, 61, 78, 72, 88, 82, 100]
const TXNS = [
  { name: "Maaş", amt: "+45.000", pos: true },
  { name: "Kira", amt: "-12.000", pos: false },
  { name: "Market", amt: "-2.340", pos: false },
]

function ProductCard() {
  const W = 280, H = 72
  const max = Math.max(...CHART_DATA)
  const pts = CHART_DATA.map((v, i) => [
    (i / (CHART_DATA.length - 1)) * W,
    H - 8 - (v / max) * (H - 16),
  ])

  const line = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x.toFixed(1)},${y.toFixed(1)}`
    const [px, py] = pts[i - 1]
    const cx1 = px + (x - px) * 0.44
    const cx2 = x - (x - px) * 0.44
    return `${acc} C ${cx1.toFixed(1)},${py.toFixed(1)} ${cx2.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`
  }, "")

  const area = `${line} L ${W},${H} L 0,${H} Z`
  const [lx, ly] = pts[pts.length - 1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-[26px] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(18,18,28,0.99), rgba(10,10,18,0.99))",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04)",
        }}
      >
        {/* Balance */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[8px] text-white/22 uppercase tracking-[0.24em]">Net Bakiye</p>
            <div className="flex items-center gap-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400 block"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[8px] text-white/18">Canlı</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-[2.4rem] font-black text-white leading-none tabular-nums tracking-tight">142.850</span>
            <span className="text-base text-white/18 font-medium">₺</span>
          </div>

          {/* Area chart */}
          <div className="w-full" style={{ height: 72 }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="hcfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E50001" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#E50001" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path d={area} fill="url(#hcfill)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              />
              <motion.path d={line} fill="none" stroke="rgba(229,0,1,0.7)" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.circle cx={lx} cy={ly} r="4.5" fill="rgba(229,0,1,0.15)"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 2.3, type: "spring", stiffness: 260 }}
              />
              <motion.circle cx={lx} cy={ly} r="2.5" fill="#E50001"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 2.3, type: "spring", stiffness: 260 }}
              />
            </svg>
          </div>
        </div>

        {/* Transactions */}
        <div className="border-t border-white/[0.05] px-6 py-4">
          <p className="text-[7px] text-white/16 uppercase tracking-[0.24em] mb-3">Son İşlemler</p>
          <div className="space-y-2.5">
            {TXNS.map(({ name, amt, pos }, i) => (
              <motion.div key={name} className="flex items-center justify-between"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-[6px] flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: pos ? "rgba(74,222,128,0.7)" : "rgba(255,255,255,0.22)" }} />
                  </div>
                  <span className="text-[11px] text-white/45 font-medium">{name}</span>
                </div>
                <span className="text-[12px] font-semibold tabular-nums"
                  style={{ color: pos ? "rgba(74,222,128,0.8)" : "rgba(255,255,255,0.32)" }}>
                  {amt}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Feature SVG icons (clean, monochromatic) ─── */
function IconLines() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      <style>{`.il{animation:ilUp 0.5s cubic-bezier(0.16,1,0.3,1) both}@keyframes ilUp{from{transform:scaleY(0)}to{transform:scaleY(1)}}`}</style>
      {[[4,20,12],[10,12,20],[16,16,16],[22,8,24],[28,4,28]].map(([x, h, y], i) => (
        <rect key={i} x={x} y={y} width="4" height={h} rx="1.5"
          fill="rgba(255,255,255,0.5)" className="il"
          style={{ animationDelay: `${0.08 * i}s`, transformOrigin: `${x + 2}px 32px` }} />
      ))}
    </svg>
  )
}

function IconRing() {
  const C = 2 * Math.PI * 10
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      <circle cx="16" cy="16" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
      <motion.circle cx="16" cy="16" r="10" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5"
        strokeLinecap="round" strokeDasharray={C} transform="rotate(-90 16 16)"
        initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * 0.28 }}
        transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <text x="16" y="20" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(255,255,255,0.65)">72%</text>
    </svg>
  )
}

function IconTarget() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="7" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3" fill="rgba(255,255,255,0.6)" />
      <motion.line x1="25" y1="7" x2="18" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
    </svg>
  )
}

function IconPulse() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      <motion.path d="M2 16 L7 16 L9 10 L11 22 L13 14 L15 18 L17 16 L30 16"
        stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 1.2, repeat: Infinity, repeatType: "loop", ease: "linear" }}
      />
    </svg>
  )
}

/* ─── Feature data ─── */
const FEATURES = [
  {
    icon: <div className="h-8 w-8"><IconLines /></div>,
    title: "Anlık Gelir-Gider Takibi",
    desc: "Her işlemini anında kaydet. Kategori ve kaynak bazında nereye ne harcadığını gerçek zamanlı gör.",
    stat: "+%23", statLabel: "daha fazla tasarruf",
  },
  {
    icon: <div className="h-8 w-8"><IconRing /></div>,
    title: "Bekleyen Ödemeler Takvimi",
    desc: "Kira, fatura, taksit, tüm bekleyen ödemelerini takvimde takip et. Vadeyi asla kaçırma.",
    stat: "0", statLabel: "kaçırılan ödeme",
  },
  {
    icon: <div className="h-8 w-8"><IconTarget /></div>,
    title: "Hedef ve İlerleme Takibi",
    desc: "Aylık gelir ve tasarruf hedefleri koy. Görsel ilerleme çubuğuyla motivasyonunu canlı tut.",
    stat: "3x", statLabel: "daha hızlı birikim",
  },
  {
    icon: <div className="h-8 w-8"><IconPulse /></div>,
    title: "Akıllı Analiz ve Raporlar",
    desc: "Kaynak bazlı pasta grafikler, aylık trendler ve harcama kırılımlarıyla finansal resmin tamamını gör.",
    stat: "12+", statLabel: "aylık rapor",
  },
]

/* ─── How it works ─── */
const STEPS = [
  { step: "01", title: "Gelirlerini kaydet", desc: "Maaş, freelance, kira, tüm kaynaklarını tanımla.", data: [20, 35, 28, 45, 38, 52, 60, 75, 68, 85, 78, 95], color: "rgba(255,255,255,0.45)" },
  { step: "02", title: "Giderlerini takip et", desc: "Her harcamayı kategorize et, nereye gittiğini gör.", data: [55, 48, 60, 52, 65, 58, 50, 44, 47, 42, 40, 38], color: "rgba(255,255,255,0.3)" },
  { step: "03", title: "Birikimini büyüt", desc: "Net bakiyeni izle, hedeflerine hızla ulaş.", data: [5, 12, 8, 18, 14, 24, 30, 40, 34, 48, 52, 68], color: "rgba(229,0,1,0.65)" },
]

/* ─── Security SVGs (monochromatic) ─── */
function ShieldSvg() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M20 4 L33 9.5 L33 20 C33 28 20 34 20 34 C20 34 7 28 7 20 L7 9.5 Z"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1.3" fill="rgba(255,255,255,0.04)" />
      <motion.path d="M14 20 L18 24 L26 15"
        stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      />
      {[0, 90, 180, 270].map((deg, i) => (
        <motion.circle key={i} r="1.2" fill="rgba(255,255,255,0.3)"
          animate={{
            cx: [20 + 16 * Math.cos((deg * Math.PI) / 180), 20 + 16 * Math.cos(((deg + 360) * Math.PI) / 180)],
            cy: [20 + 16 * Math.sin((deg * Math.PI) / 180), 20 + 16 * Math.sin(((deg + 360) * Math.PI) / 180)],
          }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  )
}

function NoShareSvg() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <circle cx="16" cy="16" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.3" />
      {[[8, 8], [32, 8], [8, 32], [32, 32]].map(([x, y], i) => (
        <g key={i}>
          <motion.line x1="22" y1="16" x2={x} y2={y}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 3"
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
          <motion.g animate={{ opacity: [0.35, 0.85, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}>
            <circle cx={x} cy={y} r="4" fill="rgba(229,0,1,0.08)" stroke="rgba(229,0,1,0.22)" strokeWidth="1" />
            <line x1={x - 2} y1={y - 2} x2={x + 2} y2={y + 2} stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1={x + 2} y1={y - 2} x2={x - 2} y2={y + 2} stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
          </motion.g>
        </g>
      ))}
    </svg>
  )
}

function UptimeSvg() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      {[8, 18, 28].map((y, i) => (
        <g key={i}>
          <rect x="6" y={y} width="28" height="7" rx="1.5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <motion.circle cx="29" cy={y + 3.5} r="1.8" fill="rgba(255,255,255,0.5)"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6 + i * 0.3, repeat: Infinity, delay: i * 0.45 }}
          />
        </g>
      ))}
      <motion.path d="M6 37 L11 37 L13 33 L15 41 L17 35 L19 38 L21 37 L34 37"
        stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, repeat: Infinity, repeatType: "loop", ease: "linear" }}
      />
    </svg>
  )
}

function TurkeyPinSvg() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect x="5" y="14" width="22" height="13" rx="2.5" fill="rgba(229,0,1,0.1)" stroke="rgba(229,0,1,0.25)" strokeWidth="1.2" />
      <circle cx="13" cy="20.5" r="4" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
      <circle cx="14.2" cy="20.5" r="3" fill="rgba(229,0,1,0.12)" />
      <path d="M17 18 L17.7 20 L19.7 20 L18.1 21.2 L18.8 23.2 L17 22 L15.2 23.2 L15.9 21.2 L14.3 20 L16.3 20 Z" fill="rgba(255,255,255,0.38)" />
      <motion.circle cx="32" cy="18" r="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        animate={{ r: [4, 9, 4], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <circle cx="32" cy="18" r="3" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <circle cx="32" cy="18" r="1.2" fill="rgba(255,255,255,0.55)" />
    </svg>
  )
}

const SECURITY = [
  { svg: <div className="h-10 w-10"><ShieldSvg /></div>, title: "AES-256 Şifreleme", desc: "Tüm verileriniz hem aktarım hem depolamada askeri düzey şifrelemeyle korunur. TLS 1.3 transit güvenliği." },
  { svg: <div className="h-10 w-10"><NoShareSvg /></div>, title: "Sıfır Veri Paylaşımı", desc: "Finansal verileriniz hiçbir üçüncü tarafla, reklam ağıyla veya iş ortağıyla kesinlikle paylaşılmaz." },
  { svg: <div className="h-10 w-10"><UptimeSvg /></div>, title: "%99.9 Çalışma Garantisi", desc: "Enterprise altyapı üzerinde yedekli sunucularla kesintisiz hizmet. Otomatik yedekleme ve küresel CDN." },
  { svg: <div className="h-10 w-10"><TurkeyPinSvg /></div>, title: "Türkiye'de Geliştiriliyor", desc: "Türk kullanıcılar için Türk geliştiriciler tarafından yapılıyor. Türkçe destek, yerel ihtiyaçlar." },
]

/* ─── Main ─── */
export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -24])

  return (
    <main className="min-h-screen bg-[#09090E] text-white overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[#09090E]">
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.011) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.011) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[240px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(229,0,1,0.045), transparent 70%)" }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b border-white/[0.045]"
        style={{ background: "rgba(9,9,14,0.88)", backdropFilter: "blur(24px)" }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sermayem.svg" alt="Sermayem" className="h-[18px] sm:h-[20px] object-contain" />
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-white/28">
            <a href="#ozellikler" className="hover:text-white/55 transition-colors">Özellikler</a>
            <a href="#demo" className="hover:text-white/55 transition-colors">Demo</a>
            <Link href="/pro" className="flex items-center gap-1.5 hover:text-amber-400/65 transition-colors" style={{ color: "rgba(251,191,36,0.42)" }}>
              <Crown className="h-3 w-3" />
              Pro
            </Link>
            <a href="#guvenlik" className="hover:text-white/55 transition-colors">Güvenlik</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link href="/auth/login" className="hidden sm:flex text-[13px] text-white/28 hover:text-white/55 transition-colors px-3 py-2">Giriş Yap</Link>
            <Link href="/auth/signup"
              className="flex items-center gap-1.5 text-[13px] font-bold text-white px-4 py-2 rounded-[9px] transition-all active:scale-[0.96]"
              style={{ background: "#E50001" }}>
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </motion.header>

      {/* HERO */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12">
        <motion.div style={{ opacity: heroOpacity, y: heroY }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 }}
                className="flex items-center gap-2 mb-7"
              >
                <motion.span className="h-1.5 w-1.5 rounded-full bg-emerald-400 block"
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-[12px] text-white/32 font-medium tracking-tight">Ücretsiz · Sınırsız işlem · Kart gerekmez</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-[2.5rem] sm:text-[3.2rem] lg:text-[3.8rem] font-black leading-[1.03] tracking-tight mb-5"
              >
                Paranın nereye{" "}
                <br className="hidden sm:block" />
                gittiğini{" "}
                <span className="relative inline-block" style={{ color: "#E50001" }}>
                  artık biliyorsun.
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] rounded-full"
                    style={{ width: "100%", background: "#E50001" }}
                    initial={{ scaleX: 0, originX: "0%" }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.78, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="text-[15px] sm:text-[16px] text-white/32 leading-relaxed mb-9 max-w-[440px]"
              >
                Gelir, gider ve birikimini tek panelde yönet. Sermaye oluştur, hedeflerine ulaş. Tamamen ücretsiz ve sınırsız kullanım.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="flex flex-col sm:flex-row gap-3 mb-9"
              >
                <Link href="/auth/signup"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-[12px] font-bold text-white text-[15px] transition-all active:scale-[0.97] group"
                  style={{ background: "#E50001" }}>
                  Ücretsiz Hesap Oluştur
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a href="#demo"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-[12px] font-medium text-white/42 text-[15px] hover:text-white/62 transition-colors">
                  Demo&apos;yu İncele
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-5 text-[11px] text-white/22"
              >
                {["256-bit güvenlik", "Türkiye'de geliştiriliyor"].map((item, i) => (
                  <span key={item} className="flex items-center gap-1.5">
                    {i > 0 && <span className="h-[3px] w-[3px] rounded-full bg-white/15" />}
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: single product card */}
            <div className="hidden lg:block">
              <ProductCard />
            </div>
          </div>

          {/* Mobile card */}
          <div className="lg:hidden mt-10">
            <ProductCard />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex justify-center mt-14 sm:mt-18"
        >
          <motion.a href="#istatistikler"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            className="flex flex-col items-center gap-1.5 text-white/14 hover:text-white/30 transition-colors"
          >
            <span className="text-[8px] uppercase tracking-[0.26em]">Keşfet</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.a>
        </motion.div>
      </section>

      {/* STATS */}
      <section id="istatistikler" className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.05] rounded-[20px] overflow-hidden">
          {[
            { to: 5000, suffix: "+", label: "Aktif kullanıcı", sub: "ve büyüyor" },
            { to: 23, suffix: "%", label: "Ortalama tasarruf artışı", sub: "ilk 3 ayda" },
            { to: 1200000, suffix: "+", label: "Kayıtlı işlem", sub: "takip ediliyor" },
            { to: 99, suffix: ".9%", label: "Çalışma süresi", sub: "garantili uptime" },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="px-6 py-8 text-center"
              style={{ background: "rgba(9,9,14,1)" }}
            >
              <p className="text-3xl sm:text-[2.2rem] font-black text-white mb-1.5 tabular-nums">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="text-xs text-white/40 font-medium mb-0.5">{s.label}</p>
              <p className="text-[10px] text-white/18">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="ozellikler" className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-14"
        >
          <p className="text-[10px] text-[#E50001] font-bold uppercase tracking-[0.26em] mb-3">Özellikler</p>
          <h2 className="text-2xl sm:text-[2.2rem] font-black text-white tracking-tight mb-2.5">Her şey tek bir yerde.</h2>
          <p className="text-white/30 text-[14px] max-w-[340px] leading-relaxed">Finansal sağlığını takip etmek için ihtiyacın olan her araç.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-white/[0.055] rounded-[20px] overflow-hidden">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-7 sm:p-8"
              style={{ background: "rgba(9,9,14,1)" }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="h-10 w-10">{f.icon}</div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{f.stat}</p>
                  <p className="text-[9px] text-white/22">{f.statLabel}</p>
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">{f.title}</h3>
              <p className="text-[13px] text-white/32 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] border border-white/[0.06] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.013)" }}
        >
          <div className="p-6 sm:p-8 border-b border-white/[0.05]">
            <p className="text-[9px] text-white/22 uppercase tracking-wider mb-1.5">Nasıl çalışır</p>
            <h3 className="text-xl sm:text-2xl font-black text-white">Finansal yolculuğun 3 adımı</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
            {STEPS.map((item, i) => (
              <motion.div key={item.step} className="p-6 sm:p-7"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-black text-white/18 tabular-nums">{item.step}</span>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>
                <div className="h-9 mb-4">
                  <MiniLineChart color={item.color} data={item.data} />
                </div>
                <h4 className="text-[14px] font-bold text-white mb-1.5">{item.title}</h4>
                <p className="text-[12px] text-white/30 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* DEMO */}
      <DemoSection />

      {/* PRO TEASER */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[20px] p-8 sm:p-10 border overflow-hidden"
          style={{ background: "rgba(9,9,14,1)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Crown className="h-4 w-4 text-amber-400/65" />
                <span className="text-[11px] text-amber-400/55 font-semibold uppercase tracking-[0.18em]">Pro Özellikleri</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-3">AI koç, fiş tarama ve çok daha fazlası</h3>
              <p className="text-[13px] text-white/32 leading-relaxed mb-6">
                Pro üyelikle AI finansal koç, PDF raporlar, KDV hesaplama, gelişmiş analitik ve muhasebeci paylaşımı kullanımınıza açılır.
              </p>
              <Link href="/pro"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all active:scale-[0.97]"
                style={{ background: "linear-gradient(135deg, #FCD34D, #F59E0B)", color: "#000" }}>
                <Crown className="h-3.5 w-3.5" />
                Pro Özellikleri İncele
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { label: "AI Finansal Koç", desc: "Son 3 ayın verilerine göre kişisel öneriler" },
                { label: "Akıllı Fiş Tarama", desc: "Fotoğraftan anında işlem oluşturma" },
                { label: "PDF Aylık Rapor", desc: "Muhasebeci formatında otomatik rapor" },
                { label: "KDV Özeti", desc: "Vergi süreçleri için hazır özet" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-white/[0.04]">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400/50 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] font-semibold text-white/70">{label}</p>
                    <p className="text-[10px] text-white/28">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECURITY */}
      <section id="guvenlik" className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-14 text-center"
        >
          <p className="text-[10px] text-[#E50001] font-bold uppercase tracking-[0.26em] mb-3">Güvenlik</p>
          <h2 className="text-2xl sm:text-[2.2rem] font-black text-white tracking-tight mb-3">Bankacılık düzeyinde koruma</h2>
          <p className="text-white/28 text-[14px] max-w-[360px] mx-auto leading-relaxed">
            Verileriniz endüstri standardı şifreleme ve güvenlik altyapısıyla korunuyor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-white/[0.055] rounded-[20px] overflow-hidden">
          {SECURITY.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="p-7 sm:p-8 flex items-start gap-5"
              style={{ background: "rgba(9,9,14,1)" }}
            >
              <div className="flex-shrink-0">{s.svg}</div>
              <div>
                <h3 className="text-[14px] font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[12px] text-white/30 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {["AES-256 şifreleme", "TLS 1.3", "Sıfır veri satışı", "%99.9 uptime SLA"].map((label) => (
            <div key={label} className="flex items-center gap-2 text-[11px] text-white/18">
              <svg viewBox="0 0 8 8" className="w-2 h-2 flex-shrink-0" fill="none">
                <circle cx="4" cy="4" r="3" fill="rgba(52,211,153,0.25)" />
                <path d="M2.5 4 L3.5 5 L5.5 3" stroke="#34D399" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {label}
            </div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative text-center rounded-[20px] p-10 sm:p-14 border border-white/[0.06] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E50001]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <h2 className="text-2xl sm:text-[2.2rem] font-black text-white tracking-tight mb-3">
            Finansal özgürlüğe{" "}
            <span style={{ color: "#E50001" }}>bir adım kal.</span>
          </h2>
          <p className="text-white/28 text-[14px] mb-8 max-w-[280px] mx-auto leading-relaxed">
            Hesap oluşturmak ücretsiz. Kredi kartı gerekmez.
          </p>
          <Link href="/auth/signup"
            className="inline-flex items-center gap-2 px-9 py-3.5 rounded-[12px] font-bold text-white text-[15px] transition-all active:scale-[0.97] group"
            style={{ background: "#E50001" }}>
            Hemen Başla
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="text-[10px] text-white/14 mt-5">Sınırsız işlem. Tamamen ücretsiz. Her zaman.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sermayem.svg" alt="Sermayem" className="h-[17px] object-contain opacity-40" />
          <div className="flex items-center gap-6 text-[12px] text-white/18 flex-wrap justify-center">
            <a href="#ozellikler" className="hover:text-white/38 transition-colors">Özellikler</a>
            <a href="#guvenlik" className="hover:text-white/38 transition-colors">Güvenlik</a>
            <Link href="/blog" className="hover:text-white/38 transition-colors">Blog</Link>
            <Link href="/pro" className="hover:text-white/38 transition-colors">Pro</Link>
            <Link href="/auth/login" className="hover:text-white/38 transition-colors">Giriş Yap</Link>
            <Link href="/auth/signup" className="hover:text-white/38 transition-colors">Kayıt Ol</Link>
          </div>
          <p className="text-[10px] text-white/14">2026 Sermayem. Tüm hakları saklıdır.</p>
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mt-4 pt-4 border-t border-white/[0.03] flex items-center justify-center gap-5 flex-wrap">
          <Link href="/gizlilik" className="text-[10px] text-white/12 hover:text-white/25 transition-colors">Gizlilik Politikası</Link>
          <Link href="/kullanim-kosullari" className="text-[10px] text-white/12 hover:text-white/25 transition-colors">Kullanım Koşulları</Link>
          <Link href="/kvkk" className="text-[10px] text-white/12 hover:text-white/25 transition-colors">KVKK</Link>
          <Link href="/cerez-politikasi" className="text-[10px] text-white/12 hover:text-white/25 transition-colors">Çerez Politikası</Link>
        </div>
      </footer>
    </main>
  )
}
