"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, BarChart3, Zap, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const STEPS = [
  {
    icon: TrendingUp,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.25)",
    title: "Gelir ve Giderleri Ekle",
    description: "Sol menüden \"İşlem Ekle\" butonuna bas, gelir veya gider ekle. Kaynak seçerek her işlemi kategorize edebilirsin.",
    hint: "💡 Yinelenen gelirler için tekrarlayan işlem özelliğini kullan",
  },
  {
    icon: BarChart3,
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.25)",
    title: "Kaynakları Düzenle",
    description: "Kaynaklar sayfasından kendi gelir ve gider kaynaklarını oluştur. Her kaynağa emoji ve renk ver, istediğin zaman düzenle.",
    hint: "💡 İş, freelance, kira gibi kaynaklar oluşturarak takibi kolaylaştır",
  },
  {
    icon: Zap,
    color: "#E50001",
    bg: "rgba(229,0,1,0.12)",
    border: "rgba(229,0,1,0.25)",
    title: "Analizleri İncele",
    description: "Anasayfadaki özet kartlar ve grafikler finansal durumunu anlık gösterir. Aylık gelir-gider dengesini takip et.",
    hint: "💡 Bekleyen işlemler sekmesinde vadeli ödemeleri unutma",
  },
]

const STORAGE_KEY = "sermayem_tutorial_seen"

export function TutorialModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) {
      // Small delay so it feels intentional after onboarding
      const t = setTimeout(() => setOpen(true), 600)
      return () => clearTimeout(t)
    }
  }, [])

  function close() {
    localStorage.setItem(STORAGE_KEY, "1")
    setOpen(false)
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      close()
    }
  }

  const current = STEPS[step]
  const Icon = current.icon

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center sm:justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
            onClick={close}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative w-full sm:max-w-[400px] rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
            style={{
              background: "var(--c-modal)",
              border: "1px solid var(--c-border)",
              boxShadow: "0 -8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Top shine */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Drag indicator */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            <div className="p-6 pb-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {STEPS.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        width: i === step ? 20 : 6,
                        background: i === step ? "#E50001" : "rgba(255,255,255,0.15)",
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-1.5 rounded-full"
                    />
                  ))}
                </div>
                <button
                  onClick={close}
                  className="h-7 w-7 rounded-full bg-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.12] transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                >
                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-5"
                    style={{ background: current.bg, border: `1px solid ${current.border}` }}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Icon className="h-8 w-8" style={{ color: current.color }} />
                  </motion.div>

                  {/* Step number */}
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: current.color }}>
                    Adım {step + 1} / {STEPS.length}
                  </p>

                  <h2 className="text-xl font-bold text-white mb-3">{current.title}</h2>
                  <p className="text-sm text-white/55 leading-relaxed mb-4">{current.description}</p>

                  {/* Hint */}
                  <div className="p-3 rounded-[12px] bg-white/[0.04] border border-white/[0.07] text-xs text-white/40">
                    {current.hint}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-3 rounded-[14px] text-sm text-white/40 hover:text-white/60 bg-white/[0.04] border border-white/[0.07] transition-all"
                  >
                    Geri
                  </button>
                )}
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={next}
                >
                  {step < STEPS.length - 1 ? (
                    <span className="flex items-center gap-1.5">Devam <ChevronRight className="h-4 w-4" /></span>
                  ) : (
                    "Başlayalım!"
                  )}
                </Button>
              </div>

              {/* Skip */}
              {step === 0 && (
                <button onClick={close} className="w-full text-center text-xs text-white/25 hover:text-white/45 mt-3 transition-colors">
                  Geç
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
