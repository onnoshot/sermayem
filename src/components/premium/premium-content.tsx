"use client"

import { useState } from "react"
import { Crown, Check, FileText, Archive, BrainCircuit, Receipt, BarChart3, Share2, Zap, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserPlan } from "@/lib/premium"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { toast } from "sonner"

interface Props {
  isPro: boolean
  plan: UserPlan
}

const PRO_FEATURES = [
  {
    icon: Archive,
    title: "Fiş ve Fatura Saklama",
    desc: "Tüm fişlerini ve faturalarını bulutta güvenle sakla. Dilediğin zaman eriş, işlemlere bağla.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: FileText,
    title: "Aylık PDF Muhasebe Raporu",
    desc: "Her ay tüm gelir-gider kalemlerin, kategoriler ve fişlerle birlikte PDF olarak e-postana gönderilir.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: BrainCircuit,
    title: "AI Finansal Koç",
    desc: "Harcama alışkanlıklarını analiz eden, tasarruf fırsatları bulan ve kişiselleştirilmiş tavsiyeler veren yapay zeka asistan.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Gelişmiş Analitik",
    desc: "Yıllık trendler, kategori karşılaştırmaları, gelir-gider öngörüleri ve özelleştirilebilir grafikler.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Receipt,
    title: "KDV ve Vergi Raporu",
    desc: "Freelancer ve serbest meslek sahipleri için KDV hesaplama, gider faturalarını otomatik sınıflandır.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Share2,
    title: "Muhasebeci Paylaşımı",
    desc: "Raporlarını ve işlem geçmişini güvenli bağlantıyla muhasebecine anında ilet. Sınırsız paylaşım.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
] as const

export function PremiumContent({ isPro, plan }: Props) {
  const [downloading, setDownloading] = useState(false)

  async function downloadMonthlyReport() {
    setDownloading(true)
    try {
      const now = new Date()
      const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
      const month = now.getMonth() === 0 ? 12 : now.getMonth()
      const res = await fetch(`/api/pdf/monthly-report?year=${year}&month=${month}`)
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error ?? "PDF oluşturulamadı")
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `sermayem-rapor-${year}-${String(month).padStart(2, "0")}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Rapor indirildi")
    } catch {
      toast.error("Bir hata oluştu")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-5">
      {isPro ? (
        <ActiveProCard plan={plan} onDownload={downloadMonthlyReport} downloading={downloading} />
      ) : (
        <UpgradeCard />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PRO_FEATURES.map((f) => (
          <div
            key={f.title}
            className={cn(
              "rounded-[16px] border border-white/[0.07] bg-white/[0.04] p-4 flex gap-3",
              !isPro && "opacity-70"
            )}
          >
            <div className={cn("h-9 w-9 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5", f.bg)}>
              <f.icon className={cn("h-4.5 w-4.5", f.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{f.title}</p>
                {isPro && <Check className="h-3.5 w-3.5 text-green-400" />}
              </div>
              <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {!isPro && (
        <p className="text-center text-xs text-white/30 pb-2">
          Fiyatlandırma yakında duyurulacak. Erken erişim listesine katılmak için{" "}
          <a href="mailto:onurxvala@gmail.com" className="text-white/50 underline">iletişime geç</a>.
        </p>
      )}
    </div>
  )
}

function ActiveProCard({ plan, onDownload, downloading }: { plan: UserPlan; onDownload: () => void; downloading: boolean }) {
  const periodEnd = plan.current_period_end
    ? format(new Date(plan.current_period_end), "d MMMM yyyy", { locale: tr })
    : null

  return (
    <div className="rounded-[20px] border border-yellow-500/25 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-[12px] bg-yellow-500/20 flex items-center justify-center">
          <Crown className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Pro Üye</p>
          {periodEnd && (
            <p className="text-xs text-white/40">{periodEnd} tarihine kadar aktif</p>
          )}
        </div>
        <span className="ml-auto px-2.5 py-1 rounded-[7px] bg-yellow-500/20 border border-yellow-500/30 text-xs font-bold text-yellow-400">
          AKTİF
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 rounded-[12px] bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] py-3 text-sm font-medium text-white/80 hover:text-white transition-all disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Hazırlanıyor..." : "Geçen Ay Raporunu İndir"}
        </button>

        <button
          onClick={() => {
            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth() + 1
            window.open(`/api/pdf/monthly-report?year=${year}&month=${month}`, "_blank")
          }}
          className="flex items-center justify-center gap-2 rounded-[12px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] py-2.5 text-xs font-medium text-white/50 hover:text-white/70 transition-all"
        >
          <Zap className="h-3.5 w-3.5" />
          Bu Ay İçin Ara Rapor
        </button>
      </div>
    </div>
  )
}

function UpgradeCard() {
  return (
    <div className="rounded-[20px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/8 to-transparent p-6 text-center space-y-4">
      <div className="h-14 w-14 rounded-[16px] bg-yellow-500/15 flex items-center justify-center mx-auto">
        <Crown className="h-7 w-7 text-yellow-400" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">Sermayem Pro</h2>
        <p className="text-sm text-white/40 mt-1">
          Fişleri sakla, PDF raporlar al, AI koçunla finansını optimize et
        </p>
      </div>

      <div className="space-y-2 text-left max-w-xs mx-auto">
        {["Sınırsız fiş ve fatura saklama", "Aylık PDF muhasebe raporu", "AI finansal koç", "Gelişmiş analitik"].map(item => (
          <div key={item} className="flex items-center gap-2 text-sm text-white/60">
            <Check className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>

      <div className="pt-2">
        <div className="inline-flex items-center gap-1.5 px-5 py-3 rounded-[12px] bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-semibold">
          <Crown className="h-4 w-4" />
          Yakında Kullanıma Açılıyor
        </div>
        <p className="text-xs text-white/25 mt-3">
          Erken erişim için <a href="mailto:onurxvala@gmail.com" className="text-white/40 underline">iletişime geç</a>
        </p>
      </div>
    </div>
  )
}
