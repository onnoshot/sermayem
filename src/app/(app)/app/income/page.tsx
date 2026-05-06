import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GlassSurface } from "@/components/ui/glass-surface"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { formatCurrency, formatCurrencyCompact } from "@/lib/format"
import type { Transaction, Source } from "@/types/database"
import { TrendingUp } from "lucide-react"
import { FilteredTransactions } from "@/components/transactions/filtered-transactions"
import { CategoryBreakdown, type CategoryStat } from "@/components/dashboard/category-breakdown"
import { ExportButton } from "@/components/transactions/export-button"

export const metadata = { title: "Gelirler" }

function buildStats(txs: (Transaction & { source: Source | null })[]): CategoryStat[] {
  const completed = txs.filter((t) => t.status === "completed")
  const total = completed.reduce((a, t) => a + t.amount, 0)
  if (total === 0) return []

  const map = new Map<string, CategoryStat>()
  for (const tx of completed) {
    const key = tx.source_id ?? "__none__"
    if (!map.has(key)) {
      map.set(key, {
        sourceId: tx.source_id,
        name: tx.source?.name ?? "Diğer Gelir",
        emoji: tx.source?.emoji ?? "📈",
        color: tx.source?.color ?? "#22C55E",
        total: 0,
        count: 0,
        percentage: 0,
      })
    }
    const e = map.get(key)!
    e.total += tx.amount
    e.count++
  }

  return [...map.values()]
    .map((s) => ({ ...s, percentage: (s.total / total) * 100 }))
    .sort((a, b) => b.total - a.total)
}

export default async function IncomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profileData }, { data: txData }, { data: srcData }] = await Promise.all([
    supabase.from("profiles").select("currency").eq("id", user.id).single(),
    supabase.from("transactions").select("*, source:sources(*)").eq("user_id", user.id).eq("type", "income").order("occurred_on", { ascending: false }),
    supabase.from("sources").select("*").eq("user_id", user.id).eq("type", "income").eq("archived", false),
  ])

  const currency = ((profileData?.currency) || "TRY") as "TRY" | "USD" | "EUR" | "GBP"
  const txs = (txData || []) as (Transaction & { source: Source | null })[]
  const completed = txs.filter((t) => t.status === "completed")
  const pending = txs.filter((t) => t.status === "pending")
  const total = completed.reduce((a, t) => a + t.amount, 0)
  const stats = buildStats(txs)

  return (
    <StaggerChildren>
      <StaggerItem>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[12px] bg-green-500/15 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Gelirler</h1>
              <p className="text-sm text-white/40">
                Toplam: <span className="text-green-400 font-semibold tabular-nums">{formatCurrency(total, currency)}</span>
              </p>
            </div>
          </div>
          <ExportButton type="income" />
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {[
            { label: "Tamamlanan", value: total, count: completed.length, color: "text-green-400" },
            { label: "Bekleyen", value: pending.reduce((a, t) => a + t.amount, 0), count: pending.length, color: "text-purple-400" },
            { label: "Toplam", value: null, count: txs.length, color: "text-white" },
          ].map(({ label, value, count, color }) => (
            <GlassSurface key={label} className="p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-white/40 mb-1">{label}</p>
              {value !== null && (
                <p className={`text-sm sm:text-base font-bold tabular-nums truncate ${color}`}>
                  {formatCurrencyCompact(value, currency)}
                </p>
              )}
              <p className="text-[10px] text-white/30 mt-0.5">{count} işlem</p>
            </GlassSurface>
          ))}
        </div>
      </StaggerItem>

      {stats.length > 1 && (
        <StaggerItem>
          <div className="mb-5">
            <CategoryBreakdown stats={stats} total={total} currency={currency} type="income" />
          </div>
        </StaggerItem>
      )}

      <StaggerItem>
        <GlassSurface className="p-5">
          <FilteredTransactions transactions={txs} sources={srcData || []} currency={currency} />
        </GlassSurface>
      </StaggerItem>
    </StaggerChildren>
  )
}
