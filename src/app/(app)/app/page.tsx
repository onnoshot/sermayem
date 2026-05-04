import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { formatDate } from "@/lib/format"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { GlassSurface } from "@/components/ui/glass-surface"
import { TransactionList } from "@/components/transactions/transaction-list"
import type { Source, Transaction } from "@/types/database"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { BalanceHero } from "@/components/dashboard/balance-hero"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PendingCalendar } from "@/components/pending/pending-calendar"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profile }, { data: allTxs }, { data: sources }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("transactions").select("*, source:sources(*)").eq("user_id", user.id).order("occurred_on", { ascending: false }),
    supabase.from("sources").select("*").eq("user_id", user.id).eq("archived", false),
  ])

  if (!profile?.onboarded_at) redirect("/onboarding")

  const txs = (allTxs || []) as (Transaction & { source: Source | null })[]
  const currency = (profile?.currency || "TRY") as "TRY" | "USD" | "EUR" | "GBP"

  const completed = txs.filter((t) => t.status === "completed")
  const pending = txs.filter((t) => t.status === "pending")
  const totalIncome = completed.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0)
  const totalExpense = completed.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0)
  const totalPendingIncome = pending.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0)
  const totalPendingExpense = pending.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0)
  const net = totalIncome - totalExpense
  const netPending = totalPendingIncome - totalPendingExpense

  const now = new Date()
  const thisMonth = completed.filter((t) => {
    const d = new Date(t.occurred_on)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const monthIncome = thisMonth.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0)
  const monthExpense = thisMonth.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0)

  const hour = now.getHours()
  const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar"

  return (
    <StaggerChildren className="space-y-6">

      {/* Header */}
      <StaggerItem>
        <DashboardHeader
          greeting={greeting}
          firstName={profile?.full_name?.split(" ")[0] || "Kullanıcı"}
          avatarEmoji={profile?.avatar_emoji || "👋"}
          date={formatDate(now, "d MMMM yyyy, EEEE")}
          monthIncome={monthIncome}
          monthExpense={monthExpense}
          currency={currency}
        />
      </StaggerItem>

      {/* Balance Hero */}
      <StaggerItem>
        <BalanceHero
          net={net} totalIncome={totalIncome} totalExpense={totalExpense}
          totalPendingIncome={totalPendingIncome} totalPendingExpense={totalPendingExpense}
          currency={currency} goal={profile?.monthly_income_goal}
        />
      </StaggerItem>

      {/* KPI Cards — 5 cards */}
      <StaggerItem>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiCard
            label="Toplam Gelir"
            value={totalIncome}
            currency={currency}
            icon="TrendingUp"
            gradient="from-green-500 to-emerald-400"
            glow="rgba(34,197,94,0.15)"
            href="/app/income"
            index={0}
          />
          <KpiCard
            label="Toplam Gider"
            value={totalExpense}
            currency={currency}
            icon="TrendingDown"
            gradient="from-red-500 to-rose-400"
            glow="rgba(239,68,68,0.15)"
            href="/app/expenses"
            index={1}
          />
          <KpiCard
            label="Bekleyen Gelir"
            value={totalPendingIncome}
            currency={currency}
            icon="Clock"
            gradient="from-purple-500 to-violet-400"
            glow="rgba(168,85,247,0.15)"
            href="/app/pending"
            index={2}
          />
          <KpiCard
            label="Bekleyen Gider"
            value={totalPendingExpense}
            currency={currency}
            icon="Wallet"
            gradient="from-orange-500 to-amber-400"
            glow="rgba(249,115,22,0.15)"
            href="/app/pending"
            index={3}
          />
          <KpiCard
            label="Ay Sonu Tahmini"
            value={netPending}
            currency={currency}
            icon="Rocket"
            gradient={netPending >= 0 ? "from-yellow-500 to-amber-400" : "from-red-500 to-rose-400"}
            glow={netPending >= 0 ? "rgba(234,179,8,0.18)" : "rgba(239,68,68,0.15)"}
            href="/app/pending"
            index={4}
            showSign
          />
        </div>
      </StaggerItem>

      {/* Charts Row — lazy loaded */}
      <StaggerItem>
        <ChartsSection transactions={txs} completed={completed} sources={sources || []} currency={currency} />
      </StaggerItem>

      {/* Bottom Row */}
      <StaggerItem>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassSurface className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Takvim</h3>
                <p className="text-xs text-white/35 mt-0.5">{pending.length} bekleyen islem</p>
              </div>
              <Link href="/app/pending" className="flex items-center gap-1 text-xs text-[#E50001] hover:text-red-400 transition-colors">
                Bekleyenler <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <PendingCalendar transactions={txs} currency={currency} />
          </GlassSurface>

          <GlassSurface className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white">Son Islemler</h3>
                <p className="text-xs text-white/35 mt-0.5">Tamamlananlar</p>
              </div>
              <Link href="/app/income" className="flex items-center gap-1 text-xs text-[#E50001] hover:text-red-400 transition-colors">
                Tumü <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <TransactionList transactions={completed.slice(0, 5)} currency={currency} showEdit />
          </GlassSurface>
        </div>
      </StaggerItem>

    </StaggerChildren>
  )
}
