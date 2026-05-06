"use client"

import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { GlassSurface } from "@/components/ui/glass-surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Profile } from "@/types/database"
import { cn } from "@/lib/utils"
import { AvatarIcon, IconPicker, AVATAR_OPTIONS, resolveIconId } from "@/components/ui/avatar-icon"
import { Mail, TrendingUp, PiggyBank, Camera, X, Loader2 } from "lucide-react"
import { useUIStore } from "@/lib/stores/ui-store"

const CURRENCIES = [
  { code: "TRY", symbol: "₺", label: "Türk Lirası", color: "#E30A17" },
  { code: "USD", symbol: "$", label: "Dolar",        color: "#1A4BC4" },
  { code: "EUR", symbol: "€", label: "Euro",         color: "#003399" },
  { code: "GBP", symbol: "£", label: "Sterlin",      color: "#012169" },
] as const

export function ProfileForm({ profile, userEmail }: { profile: Profile | null; userEmail: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null)
  const { setProfileAvatarUrl } = useUIStore()
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    avatar_emoji: resolveIconId(profile?.avatar_emoji),
    currency: (profile?.currency || "TRY") as "TRY" | "USD" | "EUR" | "GBP",
    monthly_income_goal: profile?.monthly_income_goal?.toString() || "",
    monthly_savings_goal: profile?.monthly_savings_goal?.toString() || "",
  })

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error("Fotoğraf 5MB'dan küçük olmalı"); return }

    setUploading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setUploading(false); return }

    const ext = file.name.split(".").pop() || "jpg"
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) { toast.error("Yükleme başarısız"); setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path)
    const urlWithBust = `${publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase.from("profiles")
      .update({ avatar_url: urlWithBust })
      .eq("id", user.id)

    if (updateError) { toast.error("Profil güncellenemedi"); setUploading(false); return }

    setAvatarUrl(urlWithBust)
    setProfileAvatarUrl(urlWithBust)
    toast.success("Profil fotoğrafı güncellendi")
    setUploading(false)
    router.refresh()
  }

  async function removePhoto() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id)
    setAvatarUrl(null)
    setProfileAvatarUrl(null)
    router.refresh()
  }

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
    toast.success("Profil güncellendi")
    setSaving(false); router.refresh()
  }

  return (
    <div className="max-w-lg space-y-4">

      {/* Avatar hero */}
      <GlassSurface className="p-6">
        <div className="flex items-center gap-5 mb-6">
          {/* Avatar with always-visible camera badge */}
          <div className="relative flex-shrink-0">
            <AvatarIcon id={form.avatar_emoji} avatarUrl={avatarUrl} size="2xl" glow />
            {/* Camera badge — always visible */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1.5 -right-1.5 h-8 w-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-[#0C0C16] transition-transform hover:scale-110 active:scale-95 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #E50001, #B91C1C)", boxShadow: "0 2px 12px rgba(229,0,1,0.4)" }}
            >
              {uploading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Camera className="h-3.5 w-3.5" />
              }
            </button>
            {/* Remove photo */}
            {avatarUrl && (
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-white truncate">
              {form.full_name || "İsimsiz Kullanıcı"}
            </p>
            <p className="text-sm text-white/40 truncate">{userEmail}</p>
            <p className="mt-1.5 text-xs text-white/30">
              {avatarUrl ? "Fotoğrafı değiştirmek için kamera ikonuna tıkla" : "Profil fotoğrafı eklemek için kamera ikonuna tıkla"}
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

        {!avatarUrl && (
          <>
            <p className="text-[11px] text-white/35 uppercase tracking-widest font-semibold mb-3">Avatar Seç</p>
            <IconPicker
              value={form.avatar_emoji}
              onChange={(id) => setForm(f => ({ ...f, avatar_emoji: id }))}
              pool={AVATAR_OPTIONS}
              columns={6}
            />
          </>
        )}
        {avatarUrl && (
          <p className="text-[11px] text-white/25 mt-1">Fotoğraf aktif — avatar ikonu gizlendi</p>
        )}
      </GlassSurface>

      {/* Kişisel bilgiler */}
      <GlassSurface className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Kişisel Bilgiler</h3>
        <div className="space-y-3">
          <Input
            label="Ad Soyad"
            value={form.full_name}
            onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
            placeholder="Adın ve soyadın"
          />
          <div>
            <p className="text-[11px] text-white/35 uppercase tracking-widest font-semibold mb-1.5">E-posta</p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-[12px] bg-white/[0.03] border border-white/[0.06]">
              <Mail className="h-4 w-4 text-white/25 flex-shrink-0" />
              <p className="text-sm text-white/40 truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      </GlassSurface>

      {/* Para birimi */}
      <GlassSurface className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Para Birimi</h3>
        <div className="grid grid-cols-2 gap-2">
          {CURRENCIES.map((c) => {
            const active = form.currency === c.code
            return (
              <button
                key={c.code}
                onClick={() => setForm(f => ({ ...f, currency: c.code }))}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-[14px] border text-left transition-all",
                  active
                    ? "border-white/20 bg-white/[0.07]"
                    : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05]"
                )}
              >
                <div
                  className="h-9 w-9 rounded-[10px] flex items-center justify-center flex-shrink-0 text-white font-black text-base"
                  style={{
                    background: active ? c.color : `${c.color}80`,
                    boxShadow: active ? `0 4px 12px ${c.color}40` : "none",
                  }}
                >
                  {c.symbol}
                </div>
                <div>
                  <p className={cn("text-xs font-semibold", active ? "text-white" : "text-white/60")}>{c.label}</p>
                  <p className="text-[10px] text-white/30">{c.code}</p>
                </div>
                {active && (
                  <div className="ml-auto h-4 w-4 rounded-full border-2 border-white/60 flex items-center justify-center flex-shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </GlassSurface>

      {/* Aylık hedefler */}
      <GlassSurface className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Aylık Hedefler</h3>
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <TrendingUp className="h-4 w-4 text-green-400/60" />
            </div>
            <input
              type="number"
              placeholder="Gelir hedefi (TL)"
              value={form.monthly_income_goal}
              onChange={(e) => setForm(f => ({ ...f, monthly_income_goal: e.target.value }))}
              className="w-full pl-11 pr-4 py-3 rounded-[12px] bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.06] transition-all"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <PiggyBank className="h-4 w-4 text-blue-400/60" />
            </div>
            <input
              type="number"
              placeholder="Tasarruf hedefi (TL)"
              value={form.monthly_savings_goal}
              onChange={(e) => setForm(f => ({ ...f, monthly_savings_goal: e.target.value }))}
              className="w-full pl-11 pr-4 py-3 rounded-[12px] bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>
      </GlassSurface>

      <Button variant="primary" size="lg" loading={saving} onClick={save} className="w-full">
        Kaydet
      </Button>
    </div>
  )
}
