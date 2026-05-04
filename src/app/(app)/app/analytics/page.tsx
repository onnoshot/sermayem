import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GlassSurface } from "@/components/ui/glass-surface"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { formatCurrency, formatMonthYear } from "@/lib/format"
import type { Transaction, Source, Currency } from "@/types/database"
import { BarChart3 } from "lucide-react"
import { LazyAnalyticsCharts } from "@/components/dashboard/lazy-analytics-charts"
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns"

export const metadata = { title: "Analiz" }

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profileData }, { data: txData }] = await Promise.all([
    supabase.from("profiles").select("currency, monthly_income_goal, monthly_savings_goal").eq("id", user.id).single(),
    supabase.from("transactions").select("*, source:sources(*)").eq("user_id", user.id).eq("status", "completed").order("occurred_on", { ascending: false }),
  ])

  const currency = ((profileData?.currency) || "TRY") as Currency
  const txs = (txData || []) as (Transaction & { source: Source | null })[]

  // Build 12 months data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i)
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    const monthTxs = txs.filter((t) => {
      const d = new Date(t.occurred_on)
      return d >= start && d <= end
    })
    const income = monthTxs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0)
    const expense = monthTxs.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0)
    return { month: format(date, "MMM yy"), income, expense, net: income - expense }
  })

  // Current month stats
  const now = new Date()
  const curStart = startOfMonth(now)
  const curEnd = endOfMonth(now)
  const curMonthTxs = txs.filter((t) => { const d = new Date(t.occurred_on); return d >= curStart && d <= curEnd })
  const curIncome = curMonthTxs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0)
  const curExpense = curMonthTxs.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0)
  const savingsRate = curIncome > 0 ? ((curIncome - curExpense) / curIncome) * 100 : 0

  return (
    <StaggerChildren>
      <StaggerItem>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-[12px] bg-blue-500/15 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Analiz</h1>
            <p className="text-sm text-white/40">{formatMonthYear(now.getFullYear(), now.getMonth())}</p>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
          {[
            { label: "Bu Ay Gelir", value: curIncome, color: "text-green-400" },
            { label: "Bu Ay Gider", value: curExpense, color: "text-red-400" },
            { label: "Net", value: curIncome - curExpense, color: curIncome >= curExpense ? "text-green-400" : "text-red-400" },
            { label: "Tasarruf Oranı", value: null, pct: savingsRate, color: savingsRate >= 20 ? "text-green-400" : savingsRate >= 0 ? "text-yellow-400" : "text-red-400" },
          ].map(({ label, value, pct, color }) => (
            <GlassSurface key={label} className="p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-white/40 mb-1">{label}</p>
              <p className={`text-base sm:text-lg font-bold tabular-nums font-mono ${color}`}>
                {pct !== undefined ? `%${pct.toFixed(1)}` : formatCurrency(value || 0, currency)}
              </p>
            </GlassSurface>
          ))}
        </div>
      </StaggerItem>

      <StaggerItem>
        <LazyAnalyticsCharts monthlyData={monthlyData} transactions={txs} currency={currency} />
      </StaggerItem>
    </StaggerChildren>
  )
}
