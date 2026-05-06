"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUIStore } from "@/lib/stores/ui-store"
import {
  X, Crown, ChevronRight, ChevronLeft, ArrowRight, Check, Zap,
  Archive, FileText, BrainCircuit, BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─── Mini animated illustrations ─────────────────────────────────────────────

function IlluFis() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="w-full h-full">
      <rect x="5" y="6" width="20" height="28" rx="2.5" fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.35)" strokeWidth="1.2" />
      <path d="M5 29 L8 33 L11 29 L14 33 L17 29 L20 33 L23 29 L25 33" fill="none" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
      {[11, 15, 19, 23].map((y, i) => (
        <motion.rect key={i} x="9" y={y} width={i % 2 === 0 ? 10 : 7} height="1.8" rx="0.9" fill="rgba(96,165,250,0.45)"
          animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} />
      ))}
      <motion.rect x="4" y="11" width="22" height="2" rx="1" fill="rgba(96,165,250,0.8)"
        animate={{ y: [11, 28, 11] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 4px rgba(96,165,250,0.8))" }} />
      <motion.g animate={{ opacity: [0, 1, 1, 0], y: [4, 0, 0, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}>
        <ellipse cx="35" cy="14" rx="7" ry="5.5" fill="rgba(96,165,250,0.12)" stroke="rgba(96,165,250,0.45)" strokeWidth="1.2" />
        <motion.path d="M32 14 L34.5 16.5 L38.5 11.5" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: [0, 0, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }} />
      </motion.g>
      <motion.line x1="26" y1="18" x2="28" y2="15" stroke="rgba(96,165,250,0.4)" strokeWidth="1" strokeDasharray="2 2"
        animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.4 }} />
    </svg>
  )
}

function IlluPDF() {
  const bars = [
    { x: 9, maxH: 16, delay: 0 },
    { x: 16, maxH: 22, delay: 0.15 },
    { x: 23, maxH: 13, delay: 0.3 },
    { x: 30, maxH: 19, delay: 0.45 },
  ]
  return (
    <svg viewBox="0 0 44 44" fill="none" className="w-full h-full">
      <rect x="4" y="4" width="24" height="30" rx="3" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.3)" strokeWidth="1.2" />
      <rect x="4" y="4" width="9" height="5" rx="1" fill="rgba(52,211,153,0.3)" />
      <text x="6" y="8.5" fontSize="3.5" fill="white" fontWeight="bold">PDF</text>
      {[13, 16].map((y, i) => (
        <rect key={i} x="8" y={y} width={i === 0 ? 15 : 11} height="1.5" rx="0.75" fill="rgba(52,211,153,0.2)" />
      ))}
      <line x1="8" y1="34" x2="36" y2="34" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />
      {bars.map((b, i) => (
        <motion.rect key={i} x={b.x} y={34} width="4" height={0} rx="1" fill="#34D399"
          animate={{ y: [34, 34 - b.maxH, 34], height: [0, b.maxH, 0] }}
          transition={{ duration: 2.5, delay: b.delay, repeat: Infinity, repeatDelay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ filter: "drop-shadow(0 0 3px rgba(52,211,153,0.5))" }} />
      ))}
    </svg>
  )
}

function IlluAI() {
  const nodes = [
    { cx: 22, cy: 12 },
    { cx: 10, cy: 24 },
    { cx: 34, cy: 24 },
    { cx: 16, cy: 36 },
    { cx: 28, cy: 36 },
  ]
  const edges: [number, number][] = [[0,1],[0,2],[1,3],[1,4],[2,3],[2,4]]
  return (
    <svg viewBox="0 0 44 44" fill="none" className="w-full h-full">
      {edges.map(([a, b], i) => (
        <motion.line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(167,139,250,0.3)" strokeWidth="1"
          animate={{ opacity: [0.15, 0.7, 0.15] }} transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }} />
      ))}
      {edges.slice(0,3).map(([a, b], i) => (
        <motion.circle key={i} r="1.5" fill="#A78BFA"
          animate={{ cx: [nodes[a].cx, nodes[b].cx, nodes[a].cx], cy: [nodes[a].cy, nodes[b].cy, nodes[a].cy], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      {nodes.map((n, i) => (
        <motion.g key={i}>
          <motion.circle cx={n.cx} cy={n.cy} r="4.5" fill="rgba(167,139,250,0.12)" stroke="rgba(167,139,250,0.4)" strokeWidth="1.2"
            animate={{ r: [4.5, 5.5, 4.5] }} transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }} />
          {i === 0 && <circle cx={n.cx} cy={n.cy} r="2" fill="#A78BFA" style={{ filter: "drop-shadow(0 0 4px #A78BFA)" }} />}
        </motion.g>
      ))}
    </svg>
  )
}

function IlluAnalitik() {
  const pts: [number, number][] = [[6,34],[12,28],[18,22],[24,25],[30,16],[36,10],[40,12]]
  return (
    <svg viewBox="0 0 44 44" fill="none" className="w-full h-full">
      {[10,18,26,34].map(y => (
        <line key={y} x1="6" y1={y} x2="40" y2={y} stroke="rgba(251,146,60,0.1)" strokeWidth="0.8" />
      ))}
      <line x1="6" y1="10" x2="6" y2="36" stroke="rgba(251,146,60,0.2)" strokeWidth="0.8" />
      <line x1="6" y1="36" x2="40" y2="36" stroke="rgba(251,146,60,0.2)" strokeWidth="0.8" />
      <motion.path d="M6 34 L12 28 L18 22 L24 25 L30 16 L36 10 L40 12 L40 36 Z"
        fill="rgba(251,146,60,0.08)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
      <motion.path d="M6 34 L12 28 L18 22 L24 25 L30 16 L36 10 L40 12"
        stroke="#FB923C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 4px rgba(251,146,60,0.6))" }} />
      {pts.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="2.5" fill="#FB923C"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.22, duration: 0.3, repeat: Infinity, repeatDelay: 2.76 }} />
      ))}
    </svg>
  )
}

function IlluVergi() {
  const checks = [{ y: 18 }, { y: 24 }, { y: 30 }]
  return (
    <svg viewBox="0 0 44 44" fill="none" className="w-full h-full">
      <rect x="4" y="4" width="26" height="36" rx="3" fill="rgba(252,211,77,0.07)" stroke="rgba(252,211,77,0.3)" strokeWidth="1.2" />
      <path d="M24 4 L30 10 L24 10 Z" fill="rgba(252,211,77,0.2)" />
      <circle cx="35" cy="12" r="7" fill="rgba(252,211,77,0.12)" stroke="rgba(252,211,77,0.4)" strokeWidth="1.2" />
      <text x="31.5" y="16.5" fontSize="9" fill="#FCD34D" fontWeight="bold">₺</text>
      <rect x="8" y="10" width="12" height="2" rx="1" fill="rgba(252,211,77,0.3)" />
      {checks.map((c, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.5, duration: 0.3, repeat: Infinity, repeatDelay: 2.5 }}>
          <circle cx="12" cy={c.y} r="3.5" fill="rgba(52,211,153,0.15)" stroke="rgba(52,211,153,0.4)" strokeWidth="1" />
          <motion.path d={`M10 ${c.y} L12 ${c.y+2} L15 ${c.y-2}`} fill="none" stroke="#34D399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: [0, 0, 1] }}
            transition={{ delay: 0.4 + i * 0.5, duration: 0.3, repeat: Infinity, repeatDelay: 2.5 }} />
          <rect x="19" y={c.y - 1} width={i === 0 ? 9 : 7} height="1.8" rx="0.9" fill="rgba(252,211,77,0.3)" />
        </motion.g>
      ))}
    </svg>
  )
}

function IlluPaylasim() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="w-full h-full">
      <rect x="2" y="14" width="10" height="16" rx="2" fill="rgba(244,114,182,0.1)" stroke="rgba(244,114,182,0.4)" strokeWidth="1.2" />
      <rect x="4" y="17" width="6" height="7" rx="1" fill="rgba(244,114,182,0.12)" />
      <rect x="5.5" y="26" width="3" height="1.5" rx="0.75" fill="rgba(244,114,182,0.4)" />
      <rect x="32" y="16" width="11" height="8" rx="1.5" fill="rgba(244,114,182,0.1)" stroke="rgba(244,114,182,0.4)" strokeWidth="1.2" />
      <rect x="30" y="24" width="15" height="2" rx="1" fill="rgba(244,114,182,0.2)" stroke="rgba(244,114,182,0.3)" strokeWidth="1" />
      <motion.circle cx="22" cy="22" r="5" fill="rgba(244,114,182,0.12)" stroke="rgba(244,114,182,0.5)" strokeWidth="1.5"
        animate={{ r: [5, 6, 5] }} transition={{ duration: 2, repeat: Infinity }} />
      <path d="M20 22 L22 20 L24 22 M22 20 L22 25" fill="none" stroke="#F472B6" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="12" y1="22" x2="17" y2="22" stroke="rgba(244,114,182,0.25)" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="27" y1="22" x2="32" y2="22" stroke="rgba(244,114,182,0.25)" strokeWidth="1" strokeDasharray="2 2" />
      {[0, 0.4, 0.8].map((d, i) => (
        <motion.circle key={i} r="1.5" fill="#F472B6"
          animate={{ cx: [12, 17], cy: [22, 22], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: d, repeat: Infinity, repeatDelay: 1.2 }} />
      ))}
      {[0.3, 0.7].map((d, i) => (
        <motion.circle key={i} r="1.5" fill="#F472B6"
          animate={{ cx: [27, 32], cy: [22, 22], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: d, repeat: Infinity, repeatDelay: 1.2 }} />
      ))}
    </svg>
  )
}

const FEATURES_V2 = [
  {
    Illu: IlluFis,
    label: "Fiş & Fatura Saklama",
    desc: "Fişini tara, buluta gönder. Yıllarca güvende — istediğin an bul.",
    color: "#60A5FA", bg: "rgba(96,165,250,0.07)", border: "rgba(96,165,250,0.2)",
  },
  {
    Illu: IlluPDF,
    label: "Aylık PDF Raporu",
    desc: "Her ay sonunda muhasebe raporun otomatik hazır — indir, paylaş.",
    color: "#34D399", bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.2)",
  },
  {
    Illu: IlluAI,
    label: "AI Finansal Koç",
    desc: "Harcama alışkanlıklarını analiz eder, sana özel tasarruf önerileri sunar.",
    color: "#A78BFA", bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.2)",
  },
  {
    Illu: IlluAnalitik,
    label: "Gelişmiş Analitik",
    desc: "Yıllık trend grafikleri, gelecek ay tahminleri, kategori bazlı derin analiz.",
    color: "#FB923C", bg: "rgba(251,146,60,0.07)", border: "rgba(251,146,60,0.2)",
  },
  {
    Illu: IlluVergi,
    label: "KDV & Vergi Raporu",
    desc: "Freelancer ve serbest çalışanlar için vergi döneminde hazır rapor.",
    color: "#FCD34D", bg: "rgba(252,211,77,0.07)", border: "rgba(252,211,77,0.2)",
  },
  {
    Illu: IlluPaylasim,
    label: "Muhasebeci Paylaşımı",
    desc: "Tek tıkla muhasebecine ilet. Dosya karmaşası, e-posta derdi yok.",
    color: "#F472B6", bg: "rgba(244,114,182,0.07)", border: "rgba(244,114,182,0.2)",
  },
]

// --- SVG Illustrations ---

function CrownIllustration() {
  const orbiters = [
    { icon: Archive, color: "#60A5FA", angle: -60 },
    { icon: FileText, color: "#34D399", angle: 30 },
    { icon: BrainCircuit, color: "#A78BFA", angle: 120 },
    { icon: BarChart3, color: "#FB923C", angle: 210 },
  ]

  return (
    <div className="relative w-52 h-52 mx-auto flex-shrink-0">
      {/* Outer rotating dashed ring */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(245,158,11,0.4)" />
            <stop offset="50%" stopColor="rgba(245,158,11,0.1)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0.4)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="100" cy="100" r="88"
          fill="none" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="6 5"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        />
        <motion.circle
          cx="100" cy="100" r="64"
          fill="none" stroke="rgba(245,158,11,0.08)" strokeWidth="1" strokeDasharray="3 7"
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        />
      </svg>

      {/* Glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.5) 0%, transparent 65%)" }}
      />

      {/* Central crown */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div
            className="h-[76px] w-[76px] rounded-[22px] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.22) 0%, rgba(217,119,6,0.14) 100%)",
              border: "1px solid rgba(245,158,11,0.4)",
              boxShadow: "0 0 32px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.1), inset 0 1px 0 rgba(245,158,11,0.35)",
            }}
          >
            <CrownSVG />
          </div>
        </motion.div>
      </div>

      {/* Orbiting icons */}
      {orbiters.map((o, i) => {
        const rad = (o.angle * Math.PI) / 180
        const r = 80
        const x = 100 + Math.cos(rad) * r
        const y = 100 + Math.sin(rad) * r
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.12, type: "spring", stiffness: 260, damping: 20 }}
            className="absolute"
            style={{ left: x - 16, top: y - 16 }}
          >
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 2.4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
              className="h-8 w-8 rounded-[10px] flex items-center justify-center"
              style={{
                background: `${o.color}18`,
                border: `1px solid ${o.color}35`,
                boxShadow: `0 0 12px ${o.color}20`,
              }}
            >
              <o.icon className="h-3.5 w-3.5" style={{ color: o.color }} />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

function CrownSVG() {
  return (
    <svg viewBox="0 0 48 40" className="h-9 w-9" fill="none">
      <defs>
        <linearGradient id="crownFill" x1="0" y1="0" x2="48" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id="crownGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d="M4 32 L8 14 L16 22 L24 4 L32 22 L40 14 L44 32 Z"
        fill="url(#crownFill)"
        filter="url(#crownGlow)"
      />
      <rect x="4" y="34" width="40" height="5" rx="2.5" fill="url(#crownFill)" opacity="0.9" />
      <circle cx="24" cy="4" r="2.5" fill="#FDE68A" />
      <circle cx="8" cy="14" r="2" fill="#FDE68A" />
      <circle cx="40" cy="14" r="2" fill="#FDE68A" />
    </svg>
  )
}

function PricingBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="priceGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(245,158,11,0.6)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#priceGlow)" />
      {[...Array(5)].map((_, i) => (
        <motion.circle
          key={i}
          cx={60 + i * 70}
          cy={100}
          r={3}
          fill="rgba(245,158,11,0.5)"
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}
    </svg>
  )
}

// --- Slides ---

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -320, opacity: 0 }),
}

function Slide1({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-between h-full px-7 pt-5 pb-4">
      <CrownIllustration />

      <div className="text-center space-y-2.5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center"
        >
          <span className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border"
            style={{ background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.3)", color: "#FCD34D" }}>
            Sermayem Pro
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="text-2xl sm:text-3xl font-black text-white leading-tight"
        >
          Finansını bir sonraki<br />seviyeye taşı
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.30 }}
          className="text-sm text-white/40 leading-relaxed max-w-[260px] mx-auto"
        >
          Fişleri sakla, AI koçundan öneriler al, aylık muhasebeni otomatikleştir.
        </motion.p>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        onClick={onNext}
        whileHover={{ scale: 1.03, boxShadow: "0 6px 28px rgba(245,158,11,0.45)" }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] font-bold text-sm text-black"
        style={{ background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)", boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}
      >
        Özellikleri Keşfet
        <ChevronRight className="h-4.5 w-4.5" />
      </motion.button>
    </div>
  )
}

function Slide2({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <div className="flex flex-col h-full pt-4 pb-4 gap-3">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center px-5 flex-shrink-0">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#FCD34D" }}>6 Güçlü Özellik</p>
        <h3 className="text-xl font-black text-white">Pro Üyelere Özel Her Şey</h3>
      </motion.div>

      {/* Scrollable feature list */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 pr-3" style={{ scrollbarWidth: "none" }}>
        {FEATURES_V2.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.09, type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center gap-3 rounded-[16px] p-2.5 relative overflow-hidden"
            style={{ background: f.bg, border: `1px solid ${f.border}` }}
          >
            {/* Animated illustration */}
            <div
              className="h-[58px] w-[58px] rounded-[12px] flex items-center justify-center flex-shrink-0 p-1"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${f.border}` }}
            >
              <f.Illu />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white leading-tight">{f.label}</p>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.desc}</p>
            </div>

            {/* Accent glow */}
            <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
              style={{ background: `linear-gradient(to left, ${f.color}06, transparent)` }} />
          </motion.div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 px-4 flex-shrink-0">
        <button onClick={onPrev}
          className="h-11 w-11 rounded-[12px] flex items-center justify-center flex-shrink-0 text-white/35 hover:text-white/60 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <motion.button onClick={onNext}
          whileHover={{ scale: 1.02, boxShadow: "0 6px 24px rgba(245,158,11,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 h-11 rounded-[12px] flex items-center justify-center gap-2 font-bold text-sm text-black"
          style={{ background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)", boxShadow: "0 4px 16px rgba(245,158,11,0.3)" }}>
          Fiyatı Gör
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  )
}

function Slide3({ onPrev, onPurchase, purchasing }: { onPrev: () => void; onPurchase: () => void; purchasing: boolean }) {
  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-4 gap-3">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "#FCD34D" }}>Sınırlı Süre Teklifi</p>
        <h3 className="text-xl font-black text-white">Tek Ödeme, Ömür Boyu Erişim</h3>
      </motion.div>

      {/* Price card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 26 }}
        className="rounded-[20px] p-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.05) 100%)",
          border: "1px solid rgba(245,158,11,0.22)",
          boxShadow: "0 0 40px rgba(245,158,11,0.07), inset 0 1px 0 rgba(245,158,11,0.18)",
        }}
      >
        <PricingBackground />
        <div className="relative z-10">
          {/* Discount + old price */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-1"
          >
            <span className="text-sm font-medium line-through" style={{ color: "rgba(255,255,255,0.3)" }}>1.490 TL</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
              style={{ background: "rgba(239,68,68,0.2)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              %34 İndirim
            </span>
          </motion.div>

          {/* Main price */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 18 }}
            className="flex items-baseline gap-1 mb-2"
          >
            <span className="text-5xl font-black" style={{ color: "#FCD34D", textShadow: "0 0 40px rgba(252,211,77,0.5), 0 0 12px rgba(245,158,11,0.4)" }}>
              990
            </span>
            <span className="text-2xl font-black" style={{ color: "rgba(252,211,77,0.7)" }}>TL</span>
          </motion.div>

          {/* One-time emphasis chips */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-1.5 mb-3"
          >
            {[
              { label: "Tek seferlik", pulse: true },
              { label: "Aylık abonelik yok", pulse: false },
              { label: "Sonsuza kadar", pulse: false },
            ].map((chip) => (
              <div key={chip.label} className="relative flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>
                {chip.pulse && (
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                  />
                )}
                <span className="text-[10px] font-bold" style={{ color: "#34D399" }}>{chip.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Feature list - compact */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {[
              "Sınırsız fiş saklama",
              "Aylık PDF raporu",
              "AI Finansal Koç",
              "Gelişmiş analitik",
              "KDV & vergi raporu",
              "Muhasebeci paylaşımı",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                className="flex items-center gap-1.5"
              >
                <div className="h-3.5 w-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
                  <Check className="h-2 w-2" style={{ color: "#34D399" }} />
                </div>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* One-time banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="rounded-[14px] px-4 py-2.5 flex items-center gap-3 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.04) 100%)",
          border: "1px solid rgba(245,158,11,0.2)",
        }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
          className="flex-shrink-0"
        >
          <Crown className="h-5 w-5" style={{ color: "#FCD34D" }} />
        </motion.div>
        <div>
          <p className="text-xs font-black" style={{ color: "#FCD34D" }}>Bir kez ode, hep kullan</p>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Rakipler aylik abonelik alıyor. Biz almıyoruz.
          </p>
        </div>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="ml-auto flex-shrink-0"
        >
          <ArrowRight className="h-4 w-4" style={{ color: "rgba(245,158,11,0.5)" }} />
        </motion.div>
      </motion.div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          className="h-12 w-12 rounded-[12px] flex items-center justify-center flex-shrink-0 text-white/35 hover:text-white/60 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <motion.button
          onClick={onPurchase}
          disabled={purchasing}
          whileHover={!purchasing ? { scale: 1.02, boxShadow: "0 8px 36px rgba(245,158,11,0.6)" } : {}}
          whileTap={!purchasing ? { scale: 0.97 } : {}}
          className="flex-1 h-12 rounded-[12px] flex items-center justify-center gap-2 font-black text-sm text-black disabled:opacity-60 relative overflow-hidden"
          style={{
            background: purchasing ? "rgba(245,158,11,0.5)" : "linear-gradient(135deg, #FCD34D 0%, #F59E0B 45%, #D97706 100%)",
            boxShadow: purchasing ? "none" : "0 4px 24px rgba(245,158,11,0.45)",
          }}
        >
          {!purchasing && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", width: "50%" }}
            />
          )}
          {purchasing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Zap className="h-4 w-4" />
            </motion.div>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              990 TL — Hemen Pro&apos;ya Geç
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

// --- Main Modal ---

export function ProUpgradeModal() {
  const { proModalOpen, closeProModal } = useUIStore()
  const [slide, setSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [purchasing, setPurchasing] = useState(false)

  function goTo(next: number) {
    setDirection(next > slide ? 1 : -1)
    setSlide(next)
  }

  function handleClose() {
    closeProModal()
    setTimeout(() => { setSlide(0); setDirection(1) }, 400)
  }

  async function handlePurchase() {
    setPurchasing(true)
    try {
      const res = await fetch("/api/upgrade", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        toast.success("Pro pakete geçildi! Hoş geldin 🎉")
        handleClose()
        setTimeout(() => window.location.reload(), 800)
      } else {
        toast.error(data.error ?? "Bir hata oluştu")
      }
    } catch {
      toast.error("Bağlantı hatası")
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <AnimatePresence>
      {proModalOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/72 backdrop-blur-[10px]"
            onClick={handleClose}
          />

          {/* Sheet */}
          <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center sm:p-4 pointer-events-none">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 330, damping: 34 }}
              className="pointer-events-auto w-full sm:max-w-[460px] rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative"
              style={{
                background: "linear-gradient(165deg, #0D0A06 0%, #100C04 100%)",
                border: "1px solid rgba(245,158,11,0.18)",
                boxShadow: "0 -12px 60px rgba(0,0,0,0.65), 0 0 100px rgba(245,158,11,0.06), inset 0 1px 0 rgba(245,158,11,0.18)",
                maxHeight: "92dvh",
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.7) 50%, transparent 100%)" }} />

              {/* Drag handle */}
              <div className="sm:hidden flex justify-center pt-3">
                <div className="h-1 w-10 rounded-full bg-white/15" />
              </div>

              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full flex items-center justify-center text-white/35 hover:text-white/65 hover:bg-white/[0.08] transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Slides */}
              <div className="relative overflow-hidden" style={{ height: 520 }}>
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={slide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 310, damping: 34 }}
                    className="absolute inset-0"
                  >
                    {slide === 0 && <Slide1 onNext={() => goTo(1)} />}
                    {slide === 1 && <Slide2 onNext={() => goTo(2)} onPrev={() => goTo(0)} />}
                    {slide === 2 && <Slide3 onPrev={() => goTo(1)} onPurchase={handlePurchase} purchasing={purchasing} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center items-center gap-2 py-4">
                {[0, 1, 2].map(i => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ width: i === slide ? 24 : 6, opacity: i === slide ? 1 : 0.3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="h-1.5 rounded-full"
                      style={{ background: i === slide ? "#FCD34D" : "rgba(255,255,255,0.4)" }}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
