"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import {
  BrainCircuit, Archive, FileText, Receipt, BarChart3, Share2,
  ArrowRight, Crown, Check, Zap, Lock, Star,
} from "lucide-react"

/* ─── Animated illustrations ─── */

function AiIllustration() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Neural network nodes */}
      {[[20,20],[20,40],[20,60],[60,15],[60,35],[60,55],[60,75],[100,30],[100,55]].map(([cx, cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r="5" fill={i >= 7 ? "#A78BFA" : i >= 3 ? "rgba(139,92,246,0.55)" : "rgba(139,92,246,0.25)"}
          stroke={i >= 7 ? "rgba(139,92,246,0.6)" : "transparent"} strokeWidth="1.5"
          animate={{ r: [5, 6.5, 5], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      {/* Edges */}
      {[[20,20,60,15],[20,20,60,35],[20,40,60,35],[20,40,60,55],[20,60,60,55],[20,60,60,75],
        [60,15,100,30],[60,35,100,30],[60,55,100,55],[60,75,100,55]].map(([x1,y1,x2,y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(139,92,246,0.2)" strokeWidth="1"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.5 + i * 0.15, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      {/* Score arc */}
      <circle cx="100" cy="42" r="16" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="2.5" />
      <motion.circle cx="100" cy="42" r="16" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round"
        initial={{ strokeDasharray: "0 100.5", rotate: -90 }}
        animate={{ strokeDasharray: "72 100.5" }}
        transition={{ delay: 0.5, duration: 1.4, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 3 }}
        style={{ transformOrigin: "100px 42px", rotate: -90 }}
      />
    </svg>
  )
}

function ReceiptIllustration() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Receipt paper */}
      <rect x="30" y="5" width="50" height="68" rx="4" fill="rgba(229,0,1,0.05)" stroke="rgba(229,0,1,0.18)" strokeWidth="1.2" />
      <rect x="30" y="5" width="50" height="12" rx="4" fill="rgba(229,0,1,0.1)" />
      {[24, 32, 40, 48, 56].map((y, i) => (
        <motion.rect key={i} x="38" y={y} width={i === 4 ? 34 : 20 + (i % 3) * 6} height="3" rx="1.5" fill="rgba(255,255,255,0.12)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          style={{ transformOrigin: "38px 50%" }}
        />
      ))}
      {/* Total line */}
      <rect x="34" y="57" width="42" height="0.8" fill="rgba(229,0,1,0.25)" />
      <motion.rect x="38" y="63" width="34" height="4" rx="2" fill="rgba(229,0,1,0.35)"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        style={{ transformOrigin: "38px 50%" }}
      />
      {/* Scan beam */}
      <motion.rect x="30" y="10" width="50" height="2" rx="1"
        style={{ fill: "url(#scanGrad)" }}
        animate={{ y: [10, 70, 10] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(229,0,1,0)" />
          <stop offset="50%" stopColor="rgba(229,0,1,0.8)" />
          <stop offset="100%" stopColor="rgba(229,0,1,0)" />
        </linearGradient>
      </defs>
      {/* Checkmark */}
      <motion.circle cx="95" cy="20" r="10" fill="rgba(74,222,128,0.15)" stroke="rgba(74,222,128,0.4)" strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
        style={{ transformOrigin: "95px 20px" }}
      />
      <motion.path d="M90 20 L93.5 23.5 L100 16.5" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
      />
    </svg>
  )
}

function PdfIllustration() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Document stack */}
      {[0, 4, 8].map((offset, i) => (
        <rect key={i} x={25 + offset} y={8 - offset} width="55" height="68" rx="5"
          fill={`rgba(52,211,153,${0.03 + i * 0.02})`}
          stroke={`rgba(52,211,153,${0.1 + i * 0.05})`} strokeWidth="1" />
      ))}
      {/* Top document */}
      <rect x="33" y="0" width="55" height="68" rx="5" fill="rgba(10,10,18,0.95)" stroke="rgba(52,211,153,0.2)" strokeWidth="1.2" />
      <rect x="33" y="0" width="55" height="16" rx="5" fill="rgba(52,211,153,0.08)" />
      <line x1="33" y1="16" x2="88" y2="16" stroke="rgba(52,211,153,0.1)" strokeWidth="0.8" />
      {/* Bars */}
      {[[40,55],[50,45],[60,62],[70,38],[78,50]].map(([x, h], i) => (
        <motion.rect key={i} x={x} y={72 - h} width="6" height={h} rx="2"
          fill={i % 2 === 0 ? "rgba(52,211,153,0.55)" : "rgba(52,211,153,0.25)"}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${x}px 72px` }}
        />
      ))}
      {/* Row lines */}
      {[22, 29, 36].map((y, i) => (
        <motion.rect key={i} x="40" y={y} width={30 + (i % 2) * 10} height="3" rx="1.5" fill="rgba(255,255,255,0.08)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          style={{ transformOrigin: "40px 50%" }}
        />
      ))}
      {/* Download arrow */}
      <motion.g
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <circle cx="100" cy="62" r="10" fill="rgba(52,211,153,0.12)" stroke="rgba(52,211,153,0.3)" strokeWidth="1.2" />
        <path d="M100 56 L100 65 M96 62 L100 66 L104 62" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </svg>
  )
}

function TaxIllustration() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Table */}
      <rect x="10" y="8" width="100" height="64" rx="6" fill="rgba(245,158,11,0.04)" stroke="rgba(245,158,11,0.15)" strokeWidth="1" />
      <rect x="10" y="8" width="100" height="16" rx="6" fill="rgba(245,158,11,0.08)" />
      {/* Header cells */}
      {[12, 38, 64, 90].map((x, i) => (
        <rect key={i} x={x} y={12} width={20} height={7} rx="2" fill="rgba(245,158,11,0.2)" />
      ))}
      {/* Rows */}
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          {[12, 38, 64, 90].map((x, col) => (
            <motion.rect key={col} x={x} y={30 + row * 12} width={col === 0 ? 18 : 16} height={5} rx="1.5"
              fill={col === 3 ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)"}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 + row * 0.1 + col * 0.04 }}
              style={{ transformOrigin: `${x}px 50%` }}
            />
          ))}
        </g>
      ))}
      {/* Total row */}
      <rect x="10" y="66" width="100" height="6" rx="3" fill="rgba(245,158,11,0.08)" />
      <motion.rect x="12" y="67" width="18" height="4" rx="2" fill="rgba(245,158,11,0.4)"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8 }}
        style={{ transformOrigin: "12px 50%" }}
      />
      <motion.rect x="90" y="67" width="16" height="4" rx="2" fill="rgba(245,158,11,0.5)"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9 }}
        style={{ transformOrigin: "90px 50%" }}
      />
    </svg>
  )
}

function AnalyticsIllustration() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Line chart */}
      <motion.path
        d="M10 65 L25 52 L40 58 L55 38 L70 45 L85 28 L100 35 L115 18"
        stroke="rgba(244,114,182,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Area fill */}
      <motion.path
        d="M10 65 L25 52 L40 58 L55 38 L70 45 L85 28 L100 35 L115 18 L115 75 L10 75 Z"
        fill="rgba(244,114,182,0.06)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      />
      {/* Year-over-year comparison */}
      <motion.path
        d="M10 70 L25 62 L40 68 L55 55 L70 60 L85 50 L100 52 L115 42"
        stroke="rgba(244,114,182,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round"
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 1.5 }}
      />
      {/* Data points */}
      {[[55, 38], [85, 28], [115, 18]].map(([cx, cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r="4" fill="#F472B6" stroke="rgba(10,10,18,0.9)" strokeWidth="1.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.0 + i * 0.1, type: "spring", stiffness: 300 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      {/* Grid */}
      {[20, 40, 60].map((y) => (
        <line key={y} x1="10" y1={y} x2="115" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
      ))}
      {/* Legend */}
      <rect x="10" y="3" width="8" height="3" rx="1.5" fill="rgba(244,114,182,0.6)" />
      <rect x="22" y="3" width="8" height="3" rx="1.5" fill="rgba(244,114,182,0.25)" />
      <text x="12" y="11" fill="rgba(255,255,255,0.2)" fontSize="5">2026</text>
      <text x="24" y="11" fill="rgba(255,255,255,0.2)" fontSize="5">2025</text>
    </svg>
  )
}

function ShareIllustration() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Central doc */}
      <rect x="45" y="20" width="30" height="38" rx="4" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.25)" strokeWidth="1.2" />
      <rect x="45" y="20" width="30" height="10" rx="4" fill="rgba(99,102,241,0.15)" />
      {[28, 35, 42].map((y, i) => (
        <rect key={i} x="51" y={y} width={i === 2 ? 14 : 10 + i * 3} height="2.5" rx="1.2" fill="rgba(255,255,255,0.08)" />
      ))}
      {/* Connection lines */}
      {[[12, 15], [12, 55], [98, 25], [98, 55]].map(([tx, ty], i) => (
        <motion.line key={i}
          x1="60" y1="39" x2={tx} y2={ty}
          stroke="rgba(99,102,241,0.25)" strokeWidth="1" strokeDasharray="3 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.15 }}
        />
      ))}
      {/* Recipients */}
      {[[12, 15, "#6366F1"], [12, 55, "#8B5CF6"], [98, 25, "#A78BFA"], [98, 55, "#6366F1"]].map(([cx, cy, color], i) => (
        <motion.circle key={i} cx={cx as number} cy={cy as number} r="9"
          fill={`${color}15`} stroke={`${color}35`} strokeWidth="1.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      {/* Share icon */}
      <motion.circle cx="60" cy="64" r="8" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.35)" strokeWidth="1.2"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "60px 64px" }}
      />
      <path d="M57 64 L63 64 M60 61 L63 64 L60 67" stroke="#818CF8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const PRO_FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI Finansal Koç",
    subtitle: "Sana özel tavsiyeler",
    desc: "Son 3 ayın işlemlerini analiz ederek kişisel tasarruf önerileri, harcama uyarıları ve finansal sağlık skoru sunar. Kendi finansal koçun her zaman cebinde.",
    benefits: ["Finansal sağlık skoru (0-100)", "Kategori bazlı harcama analizi", "Aylık tasarruf potansiyeli", "Kişiselleştirilmiş tavsiyeler"],
    Illu: AiIllustration,
    color: "#A78BFA",
    bg: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.14)",
    glow: "rgba(139,92,246,0.12)",
  },
  {
    icon: Archive,
    title: "Fiş & Fatura Galerisi",
    subtitle: "Tüm belgeler güvende",
    desc: "İşlem eklerken çektiğin fiş fotoğrafları buluta kaydedilir. Arama yapabilir, filtreleyebilir, istediğin zaman erişebilirsin.",
    benefits: ["Sınırsız fiş depolama", "Galeri görünümü", "İşlemle eşleştirme", "PDF çıktı"],
    Illu: ReceiptIllustration,
    color: "#E50001",
    bg: "rgba(229,0,1,0.05)",
    border: "rgba(229,0,1,0.12)",
    glow: "rgba(229,0,1,0.1)",
  },
  {
    icon: FileText,
    title: "Aylık PDF Muhasebe Raporu",
    subtitle: "Profesyonel raporlar",
    desc: "Her ay için tek tıkla detaylı PDF muhasebe raporu oluştur. Gelir-gider özeti, kategori kırılımı, trend analizi — muhasebecine gönder ya da arşivle.",
    benefits: ["Otomatik rapor oluşturma", "Gelir/gider özeti", "Kategori bazlı kırılım", "Paylaşım ve arşivleme"],
    Illu: PdfIllustration,
    color: "#34D399",
    bg: "rgba(52,211,153,0.05)",
    border: "rgba(52,211,153,0.12)",
    glow: "rgba(52,211,153,0.1)",
  },
  {
    icon: Receipt,
    title: "KDV & Vergi Raporu",
    subtitle: "Vergi sezonuna hazır ol",
    desc: "Tüm giderlerin üzerinden KDV hesapla. %1, %10 ve %20 oranları arasında seç, aylık ve yıllık tabloyu görüntüle, CSV olarak dışa aktar.",
    benefits: ["KDV dahil/hariç hesaplama", "Aylık döküm tablosu", "CSV dışa aktarma", "3 farklı KDV oranı"],
    Illu: TaxIllustration,
    color: "#FBBF24",
    bg: "rgba(245,158,11,0.05)",
    border: "rgba(245,158,11,0.12)",
    glow: "rgba(245,158,11,0.1)",
  },
  {
    icon: BarChart3,
    title: "Gelişmiş Analitik",
    subtitle: "Derinlemesine görünürlük",
    desc: "Yıllık karşılaştırma, mevsimsel trendler, kategori bazlı öngörüler. Finansal geçmişini ve geleceğini bir arada gör.",
    benefits: ["Yıllık karşılaştırma", "Mevsimsel trend analizi", "Öngörü grafikleri", "Kategori bazlı filtre"],
    Illu: AnalyticsIllustration,
    color: "#F472B6",
    bg: "rgba(244,114,182,0.05)",
    border: "rgba(244,114,182,0.12)",
    glow: "rgba(244,114,182,0.1)",
  },
  {
    icon: Share2,
    title: "Muhasebeci Paylaşımı",
    subtitle: "Güvenli paylaşım linki",
    desc: "Rapor ve belgelerini muhasebecin ya da mali müşavirinle güvenli link üzerinden paylaş. Sona erme tarihi belirle, her zaman iptal et.",
    benefits: ["Şifreli paylaşım linki", "Sona erme tarihi", "Seçili dönem paylaşımı", "Anlık iptal"],
    Illu: ShareIllustration,
    color: "#818CF8",
    bg: "rgba(99,102,241,0.05)",
    border: "rgba(99,102,241,0.12)",
    glow: "rgba(99,102,241,0.1)",
  },
]

function FeatureCard({ feature, index }: { feature: typeof PRO_FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const { icon: Icon, title, subtitle, desc, benefits, Illu, color, bg, border, glow } = feature
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.05 }}
      className="rounded-[20px] overflow-hidden"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 ${!isEven ? "lg:grid-flow-col" : ""}`}>
        {/* Illustration */}
        <div
          className={`p-6 sm:p-8 flex items-center justify-center min-h-[180px] sm:min-h-[220px] ${!isEven ? "lg:order-2" : ""}`}
          style={{ background: `${glow}` }}
        >
          <div className="w-full max-w-[260px] h-[140px] sm:h-[160px]">
            <Illu />
          </div>
        </div>

        {/* Text */}
        <div className={`p-6 sm:p-8 flex flex-col justify-center ${!isEven ? "lg:order-1" : ""}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: `${color}` }}>{subtitle}</p>
              <h3 className="text-lg font-black text-white">{title}</h3>
            </div>
          </div>
          <p className="text-sm text-white/45 leading-relaxed mb-5">{desc}</p>
          <div className="space-y-2">
            {benefits.map((b, i) => (
              <motion.div key={i} className="flex items-center gap-2"
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <div className="h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18` }}>
                  <Check className="h-2.5 w-2.5" style={{ color }} />
                </div>
                <span className="text-xs text-white/55">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ProPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const inView = useInView(heroRef, { once: true })

  return (
    <main className="min-h-screen bg-[#09090E] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[#09090E]">
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[260px] w-[480px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.045), transparent 70%)" }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="sticky top-0 z-50 border-b border-white/[0.05]"
        style={{ background: "rgba(9,9,14,0.92)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sermayem.svg" alt="Sermayem" className="h-[18px] sm:h-[20px] object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:flex text-sm text-white/32 hover:text-white/60 transition-colors px-3 py-2">Giriş Yap</Link>
            <Link href="/auth/signup"
              className="flex items-center gap-1.5 text-[13px] font-bold text-white px-4 py-2 rounded-[10px]"
              style={{ background: "#E50001" }}>
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.06] mb-6"
        >
          <Crown className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs text-amber-400/80 font-semibold">Sermayem Pro</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.2rem] sm:text-[3rem] lg:text-[3.5rem] font-black tracking-tight mb-5"
        >
          Finansını{" "}
          <span style={{ color: "#FCD34D" }}>Pro seviyeye</span>
          <br />taşı.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.16 }}
          className="text-[15px] text-white/35 leading-relaxed mb-8 max-w-[440px] mx-auto"
        >
          AI koç, fiş tarama, PDF raporlar, KDV hesaplama ve çok daha fazlası.
          Tek seferlik ödeme — ömür boyu erişim.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
        >
          <Link href="/auth/signup"
            className="flex items-center gap-2 px-7 py-3.5 rounded-[12px] font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #FCD34D, #F59E0B)", color: "#000" }}>
            <Crown className="h-4 w-4" />
            Pro&apos;ya Geç
          </Link>
          <Link href="/#demo"
            className="flex items-center gap-2 px-7 py-3.5 rounded-[12px] font-medium text-sm text-white/45 border border-white/[0.07] hover:text-white/65 transition-all">
            Demo&apos;yu İncele
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {[
            { Icon: Star, text: "Tek seferlik ödeme" },
            { Icon: Lock, text: "Güvenli ödeme" },
            { Icon: Zap, text: "Anında aktif" },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-[11px] text-white/22">
              <Icon className="h-3 w-3" strokeWidth={1.5} />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Feature count */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
          {PRO_FEATURES.map(({ icon: Icon, title, color }, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-3 rounded-[14px] border border-white/[0.05] bg-white/[0.015] flex flex-col items-center gap-2"
            >
              <div className="h-8 w-8 rounded-[9px] flex items-center justify-center"
                style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <p className="text-[9px] text-white/35 font-medium leading-tight text-center">{title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-4">
        {PRO_FEATURES.map((feature, i) => (
          <FeatureCard key={i} feature={feature} index={i} />
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative text-center rounded-[20px] sm:rounded-[24px] p-8 sm:p-14 border overflow-hidden"
          style={{ background: "rgba(252,211,77,0.04)", borderColor: "rgba(252,211,77,0.15)" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/15 to-transparent" />
          <Crown className="h-10 w-10 mx-auto mb-4" style={{ color: "#FCD34D" }} />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Bir kez öde,{" "}
            <span style={{ color: "#FCD34D" }}>hep kullan.</span>
          </h2>
          <p className="text-white/32 text-sm mb-8 max-w-[280px] mx-auto leading-relaxed">
            Abonelik yok. Gizli ücret yok. Pro özelliklerin tamamı tek seferlik ödemede.
          </p>
          <Link href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-[14px] font-bold text-base"
            style={{ background: "linear-gradient(135deg, #FCD34D, #F59E0B)", color: "#000" }}>
            <Crown className="h-5 w-5" />
            Pro&apos;ya Geç
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-[10px] text-white/15 mt-4">Güvenli ödeme · Anında aktif · Tüm özellikler</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-7">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sermayem.svg" alt="Sermayem" className="h-[17px] object-contain opacity-50" />
          </Link>
          <div className="flex items-center gap-5 text-xs text-white/20 flex-wrap justify-center">
            <Link href="/" className="hover:text-white/40 transition-colors">Ana Sayfa</Link>
            <Link href="/#ozellikler" className="hover:text-white/40 transition-colors">Özellikler</Link>
            <Link href="/#demo" className="hover:text-white/40 transition-colors">Demo</Link>
            <Link href="/auth/signup" className="hover:text-white/40 transition-colors">Kayıt Ol</Link>
          </div>
          <p className="text-[10px] text-white/14">2026 Sermayem</p>
        </div>
      </footer>
    </main>
  )
}
