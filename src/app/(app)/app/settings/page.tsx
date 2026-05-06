import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { Settings } from "lucide-react"
import { LogoutButton } from "@/components/shared/logout-button"
import { ThemeToggle } from "@/components/settings/theme-toggle"
import { GlassSurface } from "@/components/ui/glass-surface"
import { getUserPlan, isProPlan } from "@/lib/premium"
import { SettingsClient } from "@/components/settings/settings-client"

export const metadata = { title: "Ayarlar" }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const plan = await getUserPlan()
  const pro = isProPlan(plan)

  return (
    <StaggerChildren>
      <StaggerItem>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-[12px] bg-slate-500/15 flex items-center justify-center">
            <Settings className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Ayarlar</h1>
            <p className="text-sm text-white/40">Hesap ve uygulama tercihlerin</p>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="max-w-lg space-y-4">

          {/* Hesap */}
          <GlassSurface className="p-5">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Hesap</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                <div>
                  <p className="text-sm font-medium text-white/70">E-posta</p>
                  <p className="text-xs text-white/35 mt-0.5">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-white/70">Üyelik</p>
                  <p className="text-xs text-white/35 mt-0.5">
                    {pro ? "Pro — Tüm özellikler aktif" : "Ücretsiz plan"}
                  </p>
                </div>
                {pro ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    PRO
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.06] text-white/40 border border-white/10">
                    Ücretsiz
                  </span>
                )}
              </div>
            </div>
          </GlassSurface>

          {/* Görünüm */}
          <GlassSurface className="p-5">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Görünüm</h3>
            <ThemeToggle />
          </GlassSurface>

          {/* Güvenlik */}
          <GlassSurface className="p-5">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Güvenlik</h3>
            <SettingsClient />
          </GlassSurface>

          {/* Uygulama */}
          <GlassSurface className="p-5">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Uygulama</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Versiyon</p>
                <p className="text-xs text-white/30">1.0.0</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Platform</p>
                <p className="text-xs text-white/30">Web</p>
              </div>
            </div>
          </GlassSurface>

          {/* Tehlikeli alan */}
          <GlassSurface className="p-5">
            <h3 className="text-xs font-bold text-red-400/60 uppercase tracking-widest mb-4">Tehlikeli Alan</h3>
            <LogoutButton />
          </GlassSurface>

        </div>
      </StaggerItem>
    </StaggerChildren>
  )
}
