import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GlassSurface } from "@/components/ui/glass-surface"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { formatCurrencyCompact } from "@/lib/format"
import type { Transaction, Source, Currency } from "@/types/database"
import { Clock, TrendingUp, TrendingDown } from "lucide-react"
import { PendingCalendar } from "@/components/pending/pending-calendar"

export const metadata = { title: "Bekleyenler" }

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profileData }, { data: txData }] = await Promise.all([
    supabase.from("profiles").select("currency").eq("id", user.id).single(),
    supabase.from("transactions").select("*, source:sources(*)").eq("user_id", user.id).order("due_on", { ascending: true }),
  ])

  const currency = ((profileData?.currency) || "TRY") as Currency
  const txs = (txData || []) as (Transaction & { source: Source | null })[]

  const pendingTxs = txs.filter((t) => t.status === "pending")
  const pendingIncome = pendingTxs.filter((t) => t.type === "income")
  const pendingExpense = pendingTxs.filter((t) => t.type === "expense")
  const totalIn = pendingIncome.reduce((a, t) => a + t.amount, 0)
  const totalOut = pendingExpense.reduce((a, t) => a + t.amount, 0)
  const net = totalIn - totalOut

  return (
    <StaggerChildren>
      <StaggerItem>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-[12px] bg-purple-500/15 flex items-center justify-center">
            <Clock className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Bekleyenler</h1>
            <p className="text-sm text-white/40">{pendingTxs.length} bekleyen işlem</p>
          </div>
        </div>
      </StaggerItem>

      {/* Summary chips */}
      <StaggerItem>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          <GlassSurface className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs text-white/40 truncate">Bekl. Gelir</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-green-400 tabular-nums font-mono truncate">
              {formatCurrencyCompact(totalIn, currency)}
            </p>
            <p className="text-[10px] text-white/30 mt-0.5">{pendingIncome.length} işlem</p>
          </GlassSurface>

          <GlassSurface className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingDown className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs text-white/40 truncate">Bekl. Gider</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-red-400 tabular-nums font-mono truncate">
              {formatCurrencyCompact(totalOut, currency)}
            </p>
            <p className="text-[10px] text-white/30 mt-0.5">{pendingExpense.length} işlem</p>
          </GlassSurface>

          <GlassSurface className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-white/40 mb-1.5">Net Beklenti</p>
            <p className={`text-base sm:text-lg font-bold tabular-nums font-mono truncate ${net >= 0 ? "text-green-400" : "text-red-400"}`}>
              {net >= 0 ? "+" : ""}{formatCurrencyCompact(net, currency)}
            </p>
            <p className="text-[10px] text-white/30 mt-0.5">Gelir / Gider</p>
          </GlassSurface>
        </div>
      </StaggerItem>

      {/* Calendar */}
      <StaggerItem>
        <GlassSurface className="p-4 sm:p-5">
          <PendingCalendar transactions={txs} currency={currency} />
        </GlassSurface>
      </StaggerItem>
    </StaggerChildren>
  )
}
