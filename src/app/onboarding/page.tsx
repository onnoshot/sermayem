"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassSurface } from "@/components/ui/glass-surface"
import { AmbientBackground } from "@/components/ambient-background"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronRight } from "lucide-react"

const AVATARS = ["🎯","📸","🦁","🔥","⚡","🌊","💎","🚀","🎬","🏆","🦊","✨"]
const CURRENCIES = [
  { code: "TRY", label: "Türk Lirası", symbol: "₺", flag: "🇹🇷" },
  { code: "USD", label: "Amerikan Doları", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", label: "İngiliz Sterlini", symbol: "£", flag: "🇬🇧" },
] as const

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    avatar_emoji: "🎯",
    currency: "TRY" as "TRY"|"USD"|"EUR"|"GBP",
    monthly_income_goal: "",
    monthly_savings_goal: "",
  })

  const steps = ["Hoş geldin", "Para birimi", "Hedefler"]

  async function finish() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name || null,
      avatar_emoji: form.avatar_emoji,
      currency: form.currency,
      monthly_income_goal: form.monthly_income_goal ? parseFloat(form.monthly_income_goal) : null,
      monthly_savings_goal: form.monthly_savings_goal ? parseFloat(form.monthly_savings_goal) : null,
      onboarded_at: new Date().toISOString(),
    })

    if (error) { toast.error("Hata: " + error.message); setSaving(false); return }
    router.push("/app")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <AmbientBackground />
      <div className="w-full max-w-[440px]">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${i === 0 ? "w-8" : "w-8"} ${i <= step ? "bg-yellow-500" : "bg-white/10"}`} />
            </div>
          ))}
          <span className="ml-auto text-xs text-white/40">{step + 1} / {steps.length}</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
              <GlassSurface className="p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{form.avatar_emoji}</div>
                  <h1 className="text-2xl font-bold text-white mb-1">Hoş geldin!</h1>
                  <p className="text-sm text-white/50">Seni tanıyalım</p>
                </div>
                <div className="mb-5">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Avatar Seç</p>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATARS.map((a) => (
                      <button key={a} onClick={() => setForm((f) => ({ ...f, avatar_emoji: a }))}
                        className={`h-10 w-10 rounded-xl text-xl flex items-center justify-center transition-all ${form.avatar_emoji === a ? "bg-yellow-500/20 border border-yellow-500/50 scale-110" : "bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="Adın" placeholder="Onur" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
                <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => setStep(1)}>
                  Devam <ChevronRight className="h-4 w-4" />
                </Button>
              </GlassSurface>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
              <GlassSurface className="p-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-1">Para birimi</h1>
                  <p className="text-sm text-white/50">Hangi para birimi ile takip etmek istersin?</p>
                </div>
                <div className="space-y-2 mb-6">
                  {CURRENCIES.map((c) => (
                    <button key={c.code} onClick={() => setForm((f) => ({ ...f, currency: c.code }))}
                      className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all text-left ${form.currency === c.code ? "border-yellow-500/50 bg-yellow-500/10" : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"}`}>
                      <span className="text-2xl">{c.flag}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{c.label}</p>
                        <p className="text-xs text-white/40">{c.code} · {c.symbol}</p>
                      </div>
                      {form.currency === c.code && <div className="h-2 w-2 rounded-full bg-yellow-500" />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(0)}>Geri</Button>
                  <Button variant="primary" size="lg" className="flex-1" onClick={() => setStep(2)}>
                    Devam <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </GlassSurface>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
              <GlassSurface className="p-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-1">Aylık hedefler</h1>
                  <p className="text-sm text-white/50">İstersen atla, sonra da ayarlayabilirsin.</p>
                </div>
                <div className="space-y-4 mb-6">
                  <Input label="Aylık Gelir Hedefi" type="number" placeholder="50000" value={form.monthly_income_goal}
                    onChange={(e) => setForm((f) => ({ ...f, monthly_income_goal: e.target.value }))}
                    hint="Bu ay ne kadar kazanmak istiyorsun?" />
                  <Input label="Aylık Tasarruf Hedefi" type="number" placeholder="10000" value={form.monthly_savings_goal}
                    onChange={(e) => setForm((f) => ({ ...f, monthly_savings_goal: e.target.value }))}
                    hint="Bu ay ne kadar biriktirmek istiyorsun?" />
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>Geri</Button>
                  <Button variant="primary" size="lg" className="flex-1" loading={saving} onClick={finish}>
                    Başla 🚀
                  </Button>
                </div>
                <button onClick={finish} className="w-full text-center text-xs text-white/30 hover:text-white/50 mt-3 transition-colors">
                  Şimdilik atla
                </button>
              </GlassSurface>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
