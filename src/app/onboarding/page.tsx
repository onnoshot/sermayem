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
import { AvatarIcon, IconPicker, AVATAR_OPTIONS, resolveIconId } from "@/components/ui/avatar-icon"

const CURRENCIES = [
  { code: "TRY", label: "Türk Lirası",      symbol: "₺", color: "#E30A17" },
  { code: "USD", label: "Amerikan Doları",   symbol: "$", color: "#1A4BC4" },
  { code: "EUR", label: "Euro",              symbol: "€", color: "#003399" },
  { code: "GBP", label: "İngiliz Sterlini", symbol: "£", color: "#012169" },
] as const

const GENDERS = [
  { value: "erkek", label: "Erkek" },
  { value: "kadin", label: "Kadın" },
  { value: "belirtmek_istemiyorum", label: "Belirtmek istemiyorum" },
] as const

const AGES = Array.from({ length: 100 }, (_, i) => i + 1)

const CITIES = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin",
  "Aydın","Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa",
  "Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Düzce","Edirne","Elazığ",
  "Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari",
  "Hatay","Iğdır","Isparta","İstanbul","İzmir","Kahramanmaraş","Karabük","Karaman",
  "Kars","Kastamonu","Kayseri","Kırıkkale","Kırklareli","Kırşehir","Kilis","Kocaeli",
  "Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla","Muş","Nevşehir",
  "Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas",
  "Şanlıurfa","Şırnak","Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova",
  "Yozgat","Zonguldak",
]

const steps = ["Hoş geldin", "Hakkında", "Para birimi", "Hedefler"]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    avatar_emoji: "target",
    age: "",
    gender: "" as "erkek" | "kadin" | "belirtmek_istemiyorum" | "",
    city: "",
    currency: "TRY" as "TRY" | "USD" | "EUR" | "GBP",
    monthly_income_goal: "",
    monthly_savings_goal: "",
  })

  async function finish() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name || null,
      avatar_emoji: form.avatar_emoji,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      city: form.city || null,
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
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${i <= step ? "bg-[#E50001]" : "bg-white/10"}`} />
            </div>
          ))}
          <span className="ml-1 text-xs text-white/40 flex-shrink-0">{step + 1} / {steps.length}</span>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0: Avatar + Ad */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
              <GlassSurface className="p-8">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <AvatarIcon id={form.avatar_emoji} size="2xl" glow />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1">Hoş geldin!</h1>
                  <p className="text-sm text-white/50">Seni tanıyalım</p>
                </div>
                <div className="mb-5">
                  <p className="text-[11px] text-white/35 uppercase tracking-widest font-semibold mb-3">Avatar Seç</p>
                  <IconPicker
                    value={form.avatar_emoji}
                    onChange={(id) => setForm(f => ({ ...f, avatar_emoji: id }))}
                    pool={AVATAR_OPTIONS}
                    columns={6}
                  />
                </div>
                <Input label="Adın" placeholder="Onur" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
                <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => setStep(1)}>
                  Devam <ChevronRight className="h-4 w-4" />
                </Button>
              </GlassSurface>
            </motion.div>
          )}

          {/* STEP 1: Demografik bilgiler */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
              <GlassSurface className="p-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-1">Hakkında</h1>
                  <p className="text-sm text-white/50">İstersen atlayabilirsin</p>
                </div>
                <div className="space-y-5">
                  {/* Cinsiyet */}
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Cinsiyet</p>
                    <div className="flex flex-col gap-2">
                      {GENDERS.map((g) => (
                        <button key={g.value} onClick={() => setForm((f) => ({ ...f, gender: g.value }))}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] border text-sm transition-all text-left ${form.gender === g.value ? "border-[#E50001]/50 bg-[#E50001]/10 text-white" : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"}`}>
                          <span>{g.label}</span>
                          {form.gender === g.value && <div className="h-2 w-2 rounded-full bg-[#E50001]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Yaş + Şehir */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Yaş</label>
                      <select
                        value={form.age}
                        onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                        className="w-full rounded-[12px] px-4 py-3 text-[16px] sm:text-sm bg-white/[0.05] border border-white/[0.08] text-white/90 focus:outline-none focus:border-[#E50001]/50 focus:bg-white/[0.07] transition-all"
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" style={{ background: "#0F0F18" }}>Seç</option>
                        {AGES.map((a) => (
                          <option key={a} value={a} style={{ background: "#0F0F18" }}>{a}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Şehir</label>
                      <select
                        value={form.city}
                        onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                        className="w-full rounded-[12px] px-4 py-3 text-[16px] sm:text-sm bg-white/[0.05] border border-white/[0.08] text-white/90 focus:outline-none focus:border-[#E50001]/50 focus:bg-white/[0.07] transition-all"
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" style={{ background: "#0F0F18" }}>Seç</option>
                        {CITIES.map((c) => (
                          <option key={c} value={c} style={{ background: "#0F0F18" }}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(0)}>Geri</Button>
                  <Button variant="primary" size="lg" className="flex-1" onClick={() => setStep(2)}>
                    Devam <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <button onClick={() => setStep(2)} className="w-full text-center text-xs text-white/30 hover:text-white/50 mt-3 transition-colors">
                  Şimdilik atla
                </button>
              </GlassSurface>
            </motion.div>
          )}

          {/* STEP 2: Para birimi */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
              <GlassSurface className="p-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-1">Para birimi</h1>
                  <p className="text-sm text-white/50">Hangi para birimi ile takip etmek istersin?</p>
                </div>
                <div className="space-y-2 mb-6">
                  {CURRENCIES.map((c) => {
                    const active = form.currency === c.code
                    return (
                      <button key={c.code} onClick={() => setForm((f) => ({ ...f, currency: c.code }))}
                        className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all text-left ${active ? "border-[#E50001]/50 bg-[#E50001]/10" : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"}`}>
                        <div
                          className="h-10 w-10 rounded-[10px] flex items-center justify-center flex-shrink-0 text-white font-black text-lg"
                          style={{ background: active ? c.color : `${c.color}80` }}
                        >
                          {c.symbol}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{c.label}</p>
                          <p className="text-xs text-white/40">{c.code} · {c.symbol}</p>
                        </div>
                        {active && <div className="h-2 w-2 rounded-full bg-[#E50001]" />}
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>Geri</Button>
                  <Button variant="primary" size="lg" className="flex-1" onClick={() => setStep(3)}>
                    Devam <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </GlassSurface>
            </motion.div>
          )}

          {/* STEP 3: Hedefler */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
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
                  <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(2)}>Geri</Button>
                  <Button variant="primary" size="lg" className="flex-1" loading={saving} onClick={finish}>
                    Başlayalım
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
