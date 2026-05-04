import { GlassSurface } from "@/components/ui/glass-surface"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/shared/logout-button"

export const metadata = { title: "Ayarlar" }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  return (
    <StaggerChildren>
      <StaggerItem>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-[12px] bg-slate-500/15 flex items-center justify-center">
            <Settings className="h-5 w-5 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Ayarlar</h1>
        </div>
      </StaggerItem>
      <StaggerItem>
        <div className="max-w-lg space-y-4">
          <GlassSurface className="p-6">
            <h3 className="text-sm font-semibold text-white mb-1">Hesap</h3>
            <p className="text-xs text-white/40 mb-4">{user.email}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                <span className="text-sm text-white/70">Üyelik</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 font-medium">Free</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-white/70">Faz 2 — Pro plan yakında</span>
                <span className="text-xs text-white/30">₺79/ay</span>
              </div>
            </div>
          </GlassSurface>
          <GlassSurface className="p-6">
            <h3 className="text-sm font-semibold text-red-400 mb-4">Tehlikeli Alan</h3>
            <LogoutButton />
          </GlassSurface>
        </div>
      </StaggerItem>
    </StaggerChildren>
  )
}
