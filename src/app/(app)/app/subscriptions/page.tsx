import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { GlassSurface } from "@/components/ui/glass-surface"
import { SubscriptionList } from "@/components/subscriptions/subscription-list"
import { detectSubscriptions } from "@/lib/subscriptions"
import type { Transaction, Source, Currency } from "@/types/database"
import { RefreshCw } from "lucide-react"

export const metadata = { title: "Abonelikler" }

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profileData }, { data: txData }, { data: dismissedData }] = await Promise.all([
    supabase.from("profiles").select("currency").eq("id", user.id).single(),
    supabase
      .from("transactions")
      .select("*, source:sources(*)")
      .eq("user_id", user.id)
      .eq("type", "expense")
      .eq("status", "completed")
      .order("occurred_on", { ascending: false }),
    supabase.from("dismissed_subscriptions").select("sub_key").eq("user_id", user.id),
  ])

  const currency = ((profileData?.currency) || "TRY") as Currency
  const txs = (txData || []) as (Transaction & { source: Source | null })[]
  const dismissed = (dismissedData || []).map((d) => d.sub_key)

  const subscriptions = detectSubscriptions(txs, dismissed)

  return (
    <StaggerChildren className="space-y-6">
      <StaggerItem>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[12px] bg-teal-500/15 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="h-5 w-5 text-teal-400" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Abonelikler</h1>
            <p className="text-sm text-white/40">
              {subscriptions.length > 0
                ? `${subscriptions.length} tekrar eden ödeme tespit edildi`
                : "Tekrar eden ödeme analizi"}
            </p>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <GlassSurface className="p-5">
          <SubscriptionList
            subscriptions={subscriptions}
            dismissedCount={dismissed.length}
            currency={currency}
          />
        </GlassSurface>
      </StaggerItem>

      {/* Info card */}
      <StaggerItem>
        <GlassSurface className="p-4">
          <p className="text-xs text-white/25 leading-relaxed">
            Abonelik tespiti: Aynı kaynaktan veya aynı açıklamayla 25–35 gün aralığında tekrar eden giderler otomatik olarak listelenir. İstemediğin abonelikleri X ile gizleyebilirsin.
          </p>
        </GlassSurface>
      </StaggerItem>
    </StaggerChildren>
  )
}
