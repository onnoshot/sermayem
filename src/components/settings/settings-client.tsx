"use client"

import { Shield, Lock } from "lucide-react"

export function SettingsClient() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 py-2">
        <div className="h-9 w-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }}>
          <Lock className="h-4 w-4 text-emerald-400/70" />
        </div>
        <div>
          <p className="text-sm font-medium text-white/70">Veri Şifreleme</p>
          <p className="text-xs text-white/30 mt-0.5">256-bit SSL/TLS ile korunuyor</p>
        </div>
      </div>
      <div className="flex items-center gap-3 py-2">
        <div className="h-9 w-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }}>
          <Shield className="h-4 w-4 text-emerald-400/70" />
        </div>
        <div>
          <p className="text-sm font-medium text-white/70">Güvenli Kimlik Dogrulama</p>
          <p className="text-xs text-white/30 mt-0.5">Verilerini yalnızca sen görebilirsin</p>
        </div>
      </div>
    </div>
  )
}
