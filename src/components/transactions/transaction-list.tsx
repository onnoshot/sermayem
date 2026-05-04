"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useUIStore } from "@/lib/stores/ui-store"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { formatCurrencyCompact, formatDate } from "@/lib/format"
import type { Transaction, Source, Currency } from "@/types/database"
import { TrendingUp, TrendingDown, CheckCircle2, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransactionListProps {
  transactions: (Transaction & { source?: Source | null })[]
  currency?: Currency
  showEdit?: boolean
}

export function TransactionList({ transactions, currency = "TRY", showEdit = true }: TransactionListProps) {
  const { openEditTransaction } = useUIStore()
  const qc = useQueryClient()
  const [completing, setCompleting] = useState<string | null>(null)

  async function markCompleted(tx: Transaction) {
    setCompleting(tx.id)
    const supabase = createClient()
    await supabase.from("transactions").update({ status: "completed", occurred_on: new Date().toISOString().split("T")[0] }).eq("id", tx.id)
    toast.success("Tamamlandı ✓")
    qc.invalidateQueries({ queryKey: ["transactions"] })
    qc.invalidateQueries({ queryKey: ["summary"] })
    setCompleting(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-3 opacity-30">💸</div>
        <p className="text-sm text-white/30">Henüz işlem yok</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <AnimatePresence initial={false}>
        {transactions.map((tx, i) => {
          const isIncome = tx.type === "income"
          const isPending = tx.status === "pending"
          const title = tx.description || tx.source?.name || (isIncome ? "Gelir" : "Gider")
          const dateStr = formatDate(isPending && tx.due_on ? tx.due_on : tx.occurred_on, "d MMM yyyy")

          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26, delay: i * 0.025 }}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-[14px] transition-colors",
                isPending ? "bg-white/[0.03]" : "hover:bg-white/[0.03]",
                completing === tx.id && "opacity-40"
              )}
            >
              {/* Icon */}
              <div className={cn(
                "h-10 w-10 rounded-[12px] flex items-center justify-center flex-shrink-0 text-lg",
                !tx.source?.emoji && (isIncome ? "bg-green-500/[0.12]" : "bg-red-500/[0.12]")
              )}>
                {tx.source?.emoji || (isIncome
                  ? <TrendingUp className="h-4.5 w-4.5 text-green-400" />
                  : <TrendingDown className="h-4.5 w-4.5 text-red-400" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white/90 leading-snug" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {tx.source && (
                    <span className="text-[11px] font-medium truncate max-w-[100px]" style={{ color: tx.source.color || "rgba(255,255,255,0.4)" }}>
                      {tx.source.name}
                    </span>
                  )}
                  {tx.source && <span className="text-white/15 text-[10px]">·</span>}
                  <span className="text-[11px] text-white/35">{dateStr}</span>
                  {isPending && <span className="text-[11px] text-purple-400/70">· Bekleyen</span>}
                </div>
              </div>

              {/* Amount — compact in list view */}
              <span className={cn(
                "text-[14px] font-bold tabular-nums font-mono flex-shrink-0",
                isIncome ? "text-green-400" : "text-red-400",
                isPending && "opacity-55"
              )}>
                {isIncome ? "+" : "−"}{formatCurrencyCompact(tx.amount, currency)}
              </span>

              {/* Actions */}
              {showEdit && (
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {isPending && (
                    <button
                      onClick={() => markCompleted(tx)}
                      className="h-8 w-8 rounded-[10px] flex items-center justify-center text-white/25 hover:text-green-400 hover:bg-green-500/10 active:scale-90 transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openEditTransaction(tx.id)}
                    className="h-8 w-8 rounded-[10px] flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/[0.07] active:scale-90 transition-all"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
