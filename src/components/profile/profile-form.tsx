"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { GlassSurface } from "@/components/ui/glass-surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Profile } from "@/types/database"
import { cn } from "@/lib/utils"

const AVATARS = ["🎯","📸","🦁","🔥","⚡","🌊","💎","🚀","🎬","🏆","🦊","✨"]
const CURRENCIES = [
  { code: "TRY", symbol: "₺", flag: "🇹🇷", label: "Türk Lirası" },
  { code: "USD", symbol: "$", flag: "🇺🇸", label: "Dolar" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", label: "Euro" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", label: "Sterlin" },
] as const

export function ProfileForm({ profile, userEmail }: { profile: Profile | null; userEmail: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    avatar_emoji: profile?.avatar_emoji || "🎯",
    currency: profile?.currency || "TRY",
    monthly_income_goal: profile?.monthly_income_goal?.toString() || "",
    monthly_savings_goal: profile?.monthly_savings_goal?.toString() || "",
  })

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name || null,
      avatar_emoji: form.avatar_emoji,
      currency: form.currency,
      monthly_income_goal: form.monthly_income_goal ? parseFloat(form.monthly_income_goal) : null,
      monthly_savings_goal: form.monthly_savings_goal ? parseFloat(form.monthly_savings_goal) : null,
    }).eq("id", (await supabase.auth.getUser()).data.user!.id)
    if (error) { toast.error("Güncellenemedi"); setSaving(false); return }
    toast.success("Profil güncellendi ✓")
    setSaving(false); router.refresh()
  }

  return (
    <div className="max-w-lg space-y-4">
      <GlassSurface className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Kişisel Bilgiler</h3>

        {/* Avatar */}
        <div className="mb-5">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Avatar</p>
          <div className="flex gap-2 flex-wrap">
            {AVATARS.map((a) => (
              <button key={a} onClick={() => setForm((f) => ({ ...f, avatar_emoji: a }))}
                className={cn("h-10 w-10 rounded-[10px] text-xl flex items-center justify-center transition-all",
                  form.avatar_emoji === a ? "bg-yellow-500/20 border border-yellow-500/50 scale-110" : "bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]")}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Input label="Ad Soyad" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} placeholder="Adın ve soyadın" />
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1.5">E-posta</p>
            <p className="px-4 py-3 rounded-[12px] bg-white/[0.03] border border-white/[0.06] text-sm text-white/40">{userEmail}</p>
          </div>
        </div>
      </GlassSurface>

      <GlassSurface className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Para Birimi</h3>
        <div className="grid grid-cols-2 gap-2">
          {CURRENCIES.map((c) => (
            <button key={c.code} onClick={() => setForm((f) => ({ ...f, currency: c.code }))}
              className={cn("flex items-center gap-2.5 p-3 rounded-[12px] border text-left transition-all",
                form.currency === c.code ? "border-yellow-500/40 bg-yellow-500/10" : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]")}>
              <span className="text-xl">{c.flag}</span>
              <div>
                <p className="text-xs font-medium text-white/80">{c.label}</p>
                <p className="text-[10px] text-white/30">{c.code} · {c.symbol}</p>
              </div>
            </button>
          ))}
        </div>
      </GlassSurface>

      <GlassSurface className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Aylık Hedefler</h3>
        <div className="space-y-3">
          <Input label="Gelir Hedefi" type="number" placeholder="50000" value={form.monthly_income_goal}
            onChange={(e) => setForm((f) => ({ ...f, monthly_income_goal: e.target.value }))}
            hint="Bu ay ne kadar kazanmak istiyorsun?" />
          <Input label="Tasarruf Hedefi" type="number" placeholder="10000" value={form.monthly_savings_goal}
            onChange={(e) => setForm((f) => ({ ...f, monthly_savings_goal: e.target.value }))}
            hint="Bu ay ne kadar biriktirmek istiyorsun?" />
        </div>
      </GlassSurface>

      <Button variant="primary" size="lg" loading={saving} onClick={save} className="w-full">
        Kaydet ✓
      </Button>
    </div>
  )
}
