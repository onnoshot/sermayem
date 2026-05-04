"use client"
import { useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useUIStore } from "@/lib/stores/ui-store"
import { toast } from "sonner"
import { formatCurrency, formatDueDate } from "@/lib/format"
import type { Transaction, Source, Currency } from "@/types/database"
import { CheckCircle2, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface PendingActionsProps {
  transactions: (Transaction & { source?: Source | null })[]
  currency: Currency
}

export function PendingActions({ transactions, currency }: PendingActionsProps) {
  const qc = useQueryClient()
  const { openEditTransaction } = useUIStore()
  const router = useRouter()

  async function markDone(tx: Transaction) {
    const supabase = createClient()
    await supabase.from("transactions").update({ status: "completed", occurred_on: new Date().toISOString().split("T")[0] }).eq("id", tx.id)
    toast.success("✓ Tamamlandı", { description: tx.description || tx.type === "income" ? "Gelir alındı" : "Gider ödendi" })
    router.refresh()
  }

  async function deleteTx(id: string) {
    const supabase = createClient()
    await supabase.from("transactions").delete().eq("id", id)
    toast.success("Silindi")
    router.refresh()
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="text-3xl mb-2 opacity-30">✅</div>
        <p className="text-xs text-white/25">Bekleyen işlem yok</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => {
        const due = tx.due_on ? formatDueDate(tx.due_on) : null
        const isIncome = tx.type === "income"
        return (
          <div key={tx.id} className="group flex items-center gap-3 p-3 rounded-[12px] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all">
            <div className="h-8 w-8 rounded-[8px] flex items-center justify-center text-base flex-shrink-0" style={{ background: (tx.source?.color || "#888") + "18" }}>
              {tx.source?.emoji || (isIncome ? "💰" : "💸")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/80 truncate">{tx.description || tx.source?.name || (isIncome ? "Gelir" : "Gider")}</p>
              {due && (
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border mt-0.5 inline-block",
                  due.overdue ? "text-red-400 border-red-500/30 bg-red-500/10" :
                  due.urgent ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" :
                  "text-white/30 border-white/10")}>
                  {due.label}
                </span>
              )}
            </div>
            <span className={cn("text-sm font-bold tabular-nums font-mono flex-shrink-0", isIncome ? "text-purple-400" : "text-orange-400")}>
              {isIncome ? "+" : "-"}{formatCurrency(tx.amount, currency)}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => markDone(tx)} className="h-6 w-6 rounded-[6px] flex items-center justify-center text-white/30 hover:text-green-400 hover:bg-green-500/10 transition-all">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => openEditTransaction(tx.id)} className="h-6 w-6 rounded-[6px] flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all">
                <Pencil className="h-3 w-3" />
              </button>
              <button onClick={() => deleteTx(tx.id)} className="h-6 w-6 rounded-[6px] flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
