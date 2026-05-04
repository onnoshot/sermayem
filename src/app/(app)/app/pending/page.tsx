import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GlassSurface } from "@/components/ui/glass-surface"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { formatCurrency, formatDueDate } from "@/lib/format"
import type { Transaction, Source, Currency } from "@/types/database"
import { Clock, TrendingUp, TrendingDown, CheckCircle2, Pencil, Trash2 } from "lucide-react"
import { PendingActions } from "@/components/transactions/pending-actions"

export const metadata = { title: "Bekleyenler" }

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profileData }, { data: txData }] = await Promise.all([
    supabase.from("profiles").select("currency").eq("id", user.id).single(),
    supabase.from("transactions").select("*, source:sources(*)").eq("user_id", user.id).eq("status", "pending").order("due_on", { ascending: true }),
  ])

  const currency = ((profileData?.currency) || "TRY") as Currency
  const txs = (txData || []) as (Transaction & { source: Source | null })[]
  const pendingIncome = txs.filter((t) => t.type === "income")
  const pendingExpense = txs.filter((t) => t.type === "expense")
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
            <p className="text-sm text-white/40">{txs.length} bekleyen işlem</p>
          </div>
        </div>
      </StaggerItem>

      {/* Summary */}
      <StaggerItem>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <GlassSurface className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-white/40">Bekleyen Gelir</span>
            </div>
            <p className="text-xl font-bold text-purple-400 tabular-nums font-mono">{formatCurrency(totalIn, currency)}</p>
            <p className="text-xs text-white/30 mt-1">{pendingIncome.length} işlem</p>
          </GlassSurface>
          <GlassSurface className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-white/40">Bekleyen Gider</span>
            </div>
            <p className="text-xl font-bold text-orange-400 tabular-nums font-mono">{formatCurrency(totalOut, currency)}</p>
            <p className="text-xs text-white/30 mt-1">{pendingExpense.length} işlem</p>
          </GlassSurface>
          <GlassSurface className="p-4">
            <p className="text-xs text-white/40 mb-2">Net Beklenti</p>
            <p className={`text-xl font-bold tabular-nums font-mono ${net >= 0 ? "text-green-400" : "text-red-400"}`}>{net >= 0 ? "+" : ""}{formatCurrency(net, currency)}</p>
            <p className="text-xs text-white/30 mt-1">Gelir − Gider</p>
          </GlassSurface>
        </div>
      </StaggerItem>

      {/* Two columns */}
      <StaggerItem>
        <div className="grid grid-cols-2 gap-4">
          {/* Pending Income */}
          <GlassSurface className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-purple-400" />
              <h3 className="text-sm font-semibold text-white">Bekleyen Gelirler</h3>
              <span className="ml-auto text-xs text-purple-400 font-mono tabular-nums">{formatCurrency(totalIn, currency)}</span>
            </div>
            <PendingActions transactions={pendingIncome} currency={currency} />
          </GlassSurface>

          {/* Pending Expense */}
          <GlassSurface className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-orange-400" />
              <h3 className="text-sm font-semibold text-white">Bekleyen Giderler</h3>
              <span className="ml-auto text-xs text-orange-400 font-mono tabular-nums">{formatCurrency(totalOut, currency)}</span>
            </div>
            <PendingActions transactions={pendingExpense} currency={currency} />
          </GlassSurface>
        </div>
      </StaggerItem>
    </StaggerChildren>
  )
}
