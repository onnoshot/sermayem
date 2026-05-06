"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUIStore } from "@/lib/stores/ui-store"
import {
  X, Crown, ChevronRight, ChevronLeft, ArrowRight, Check,
  Archive, FileText, BrainCircuit, BarChart3, Receipt, Share2, Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const FEATURES = [
  { icon: Archive, label: "Fiş & Fatura Saklama", desc: "Sınırsız bulut depolama", color: "#60A5FA", border: "rgba(96,165,250,0.25)" },
  { icon: FileText, label: "Aylık PDF Raporu", desc: "Otomatik muhasebe raporu", color: "#34D399", border: "rgba(52,211,153,0.25)" },
  { icon: BrainCircuit, label: "AI Finansal Koç", desc: "Kişisel finansal danışman", color: "#A78BFA", border: "rgba(167,139,250,0.25)" },
  { icon: BarChart3, label: "Gelişmiş Analitik", desc: "Yıllık trendler & tahminler", color: "#FB923C", border: "rgba(251,146,60,0.25)" },
  { icon: Receipt, label: "KDV & Vergi Raporu", desc: "Freelancer'lar için hazır", color: "#FCD34D", border: "rgba(252,211,77,0.25)" },
  { icon: Share2, label: "Muhasebeci Paylaşımı", desc: "Tek tık ile belgeni ilet", color: "#F472B6", border: "rgba(244,114,182,0.25)" },
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
    <div className="flex flex-col h-full px-5 pt-5 pb-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "#FCD34D" }}>6 Güçlü Özellik</p>
        <h3 className="text-lg font-black text-white">Pro Üyelere Özel Her Şey</h3>
      </motion.div>

      <div className="grid grid-cols-2 gap-2 flex-1">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 280, damping: 28 }}
            className="rounded-[14px] p-3 flex gap-2.5 items-start relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${f.border}`,
            }}
          >
            <div
              className="h-8 w-8 rounded-[9px] flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
            >
              <f.icon className="h-4 w-4" style={{ color: f.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white leading-tight">{f.label}</p>
              <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onPrev}
          className="h-11 w-11 rounded-[12px] flex items-center justify-center flex-shrink-0 text-white/35 hover:text-white/60 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02, boxShadow: "0 6px 24px rgba(245,158,11,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 h-11 rounded-[12px] flex items-center justify-center gap-2 font-bold text-sm text-black"
          style={{ background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)", boxShadow: "0 4px 16px rgba(245,158,11,0.3)" }}
        >
          Fiyatı Gör
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  )
}

function Slide3({ onPrev, onPurchase, purchasing }: { onPrev: () => void; onPurchase: () => void; purchasing: boolean }) {
  return (
    <div className="flex flex-col h-full px-5 pt-5 pb-4 gap-3.5">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "#FCD34D" }}>Sınırlı Süre Teklifi</p>
        <h3 className="text-lg font-black text-white">Tek Ödeme, Sonsuz Erişim</h3>
        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Aylık abonelik yok. Bir kez öde, sonsuza kadar kullan.
        </p>
      </motion.div>

      {/* Price card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 26 }}
        className="rounded-[20px] p-5 relative overflow-hidden flex-1 flex flex-col justify-between"
        style={{
          background: "linear-gradient(145deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.05) 100%)",
          border: "1px solid rgba(245,158,11,0.22)",
          boxShadow: "0 0 40px rgba(245,158,11,0.07), inset 0 1px 0 rgba(245,158,11,0.18)",
        }}
      >
        <PricingBackground />

        <div className="relative z-10">
          {/* Discount badge + old price */}
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
            className="flex items-baseline gap-1 mb-0.5"
          >
            <span
              className="text-5xl font-black"
              style={{ color: "#FCD34D", textShadow: "0 0 40px rgba(252,211,77,0.5), 0 0 12px rgba(245,158,11,0.4)" }}
            >
              990
            </span>
            <span className="text-2xl font-black" style={{ color: "rgba(252,211,77,0.7)" }}>TL</span>
          </motion.div>

          <p className="text-[11px] mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
            Tek seferlik ödeme · Sonsuza kadar tüm özellikler
          </p>

          {/* Feature list */}
          <div className="space-y-1.5">
            {[
              "Sınırsız fiş & fatura saklama",
              "Aylık PDF muhasebe raporu",
              "AI Finansal Koç",
              "Gelişmiş analitik & tahminler",
              "KDV & vergi raporu",
              "Muhasebeci paylaşımı",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                <div className="h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
                  <Check className="h-2.5 w-2.5" style={{ color: "#34D399" }} />
                </div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
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
          whileHover={!purchasing ? { scale: 1.02, boxShadow: "0 8px 32px rgba(245,158,11,0.55)" } : {}}
          whileTap={!purchasing ? { scale: 0.97 } : {}}
          className="flex-1 h-12 rounded-[12px] flex items-center justify-center gap-2 font-black text-sm text-black disabled:opacity-60"
          style={{
            background: purchasing ? "rgba(245,158,11,0.5)" : "linear-gradient(135deg, #FCD34D 0%, #F59E0B 45%, #D97706 100%)",
            boxShadow: purchasing ? "none" : "0 4px 24px rgba(245,158,11,0.45)",
          }}
        >
          {purchasing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Zap className="h-4 w-4" />
            </motion.div>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Hemen Pro&apos;ya Geç
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
