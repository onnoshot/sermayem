import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GlassSurface } from "@/components/ui/glass-surface"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { formatCurrency } from "@/lib/format"
import type { Transaction, Source } from "@/types/database"
import { TrendingDown } from "lucide-react"
import { FilteredTransactions } from "@/components/transactions/filtered-transactions"

export const metadata = { title: "Giderler" }

export default async function ExpensesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profileData }, { data: txData }, { data: srcData }] = await Promise.all([
    supabase.from("profiles").select("currency").eq("id", user.id).single(),
    supabase.from("transactions").select("*, source:sources(*)").eq("user_id", user.id).eq("type", "expense").order("occurred_on", { ascending: false }),
    supabase.from("sources").select("*").eq("user_id", user.id).eq("type", "expense").eq("archived", false),
  ])

  const currency = ((profileData?.currency) || "TRY") as "TRY"|"USD"|"EUR"|"GBP"
  const txs = (txData || []) as (Transaction & { source: Source | null })[]
  const completed = txs.filter((t) => t.status === "completed")
  const pending = txs.filter((t) => t.status === "pending")
  const total = completed.reduce((a, t) => a + t.amount, 0)

  return (
    <StaggerChildren>
      <StaggerItem>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-[12px] bg-red-500/15 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Giderler</h1>
            <p className="text-sm text-white/40">Toplam: <span className="text-red-400 font-semibold tabular-nums">{formatCurrency(total, currency)}</span></p>
          </div>
        </div>
      </StaggerItem>
      <StaggerItem>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Tamamlanan", value: total, count: completed.length, color: "text-red-400" },
            { label: "Bekleyen", value: pending.reduce((a, t) => a + t.amount, 0), count: pending.length, color: "text-orange-400" },
            { label: "Toplam İşlem", value: null, count: txs.length, color: "text-white" },
          ].map(({ label, value, count, color }) => (
            <GlassSurface key={label} className="p-4">
              <p className="text-xs text-white/40 mb-1">{label}</p>
              {value !== null && <p className={`text-lg font-bold tabular-nums font-mono ${color}`}>{formatCurrency(value, currency)}</p>}
              <p className="text-xs text-white/30 mt-0.5">{count} işlem</p>
            </GlassSurface>
          ))}
        </div>
      </StaggerItem>
      <StaggerItem>
        <GlassSurface className="p-5">
          <FilteredTransactions transactions={txs} sources={srcData || []} currency={currency} />
        </GlassSurface>
      </StaggerItem>
    </StaggerChildren>
  )
}
