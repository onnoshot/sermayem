import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { BudgetManager } from "@/components/budgets/budget-manager"
import type { Budget, Source, Currency } from "@/types/database"
import { Wallet } from "lucide-react"
import { startOfMonth, endOfMonth } from "date-fns"

export const metadata = { title: "Bütçeler" }

export default async function BudgetsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const now = new Date()
  const monthStart = startOfMonth(now).toISOString().split("T")[0]
  const monthEnd = endOfMonth(now).toISOString().split("T")[0]

  const [{ data: profileData }, { data: budgetData }, { data: srcData }, { data: txData }] = await Promise.all([
    supabase.from("profiles").select("currency").eq("id", user.id).single(),
    supabase.from("budgets").select("*, source:sources(*)").eq("user_id", user.id),
    supabase.from("sources").select("*").eq("user_id", user.id).eq("archived", false),
    supabase.from("transactions")
      .select("source_id, amount")
      .eq("user_id", user.id)
      .eq("type", "expense")
      .eq("status", "completed")
      .gte("occurred_on", monthStart)
      .lte("occurred_on", monthEnd),
  ])

  const currency = ((profileData?.currency) || "TRY") as Currency
  const budgets = (budgetData || []) as (Budget & { source: Source | null })[]
  const sources = (srcData || []) as Source[]

  // Build spending map for this month
  const spendingMap: Record<string, number> = {}
  for (const tx of txData || []) {
    if (tx.source_id) {
      spendingMap[tx.source_id] = (spendingMap[tx.source_id] ?? 0) + tx.amount
    }
  }

  const budgetsWithSpending = budgets.map((b) => ({
    ...b,
    spent: b.source_id ? (spendingMap[b.source_id] ?? 0) : 0,
  }))

  return (
    <StaggerChildren className="space-y-6">
      <StaggerItem>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[12px] bg-blue-500/15 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Bütçeler</h1>
            <p className="text-sm text-white/40">Kategoriye göre aylık harcama limitlerini yönet</p>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <BudgetManager budgets={budgetsWithSpending} sources={sources} currency={currency} />
      </StaggerItem>
    </StaggerChildren>
  )
}
