"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Crown, Loader2 } from "lucide-react"

export function AdminProToggle({ userId, isPro }: { userId: string; isPro: boolean }) {
  const [pro, setPro] = useState(isPro)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch("/api/admin/set-pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, pro: !pro }),
    })
    if (res.ok) {
      setPro(!pro)
      toast.success(pro ? "Pro paketi kaldırıldı" : "Pro yapıldı")
    } else {
      const d = await res.json()
      toast.error(d.error ?? "Hata")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all disabled:opacity-50"
      style={pro
        ? { background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", color: "#FCD34D" }
        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
      }
    >
      {loading
        ? <Loader2 className="h-3 w-3 animate-spin" />
        : <Crown className="h-3 w-3" />
      }
      {pro ? "PRO" : "Ücretsiz"}
    </button>
  )
}
