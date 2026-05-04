"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useUIStore } from "@/lib/stores/ui-store"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Transaction, Source, Currency } from "@/types/database"
import { TrendingUp, TrendingDown, Pencil, Trash2, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransactionListProps {
  transactions: (Transaction & { source?: Source | null })[]
  currency?: Currency
  showEdit?: boolean
}

export function TransactionList({ transactions, currency = "TRY", showEdit = true }: TransactionListProps) {
  const { openEditTransaction } = useUIStore()
  const qc = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setPendingDelete(id)
    const supabase = createClient()
    const { error } = await supabase.from("transactions").delete().eq("id", id)
    if (error) { toast.error("Silinemedi"); setPendingDelete(null); return }
    toast.success("İşlem silindi", {
      action: { label: "Geri Al", onClick: () => toast.info("Bu özellik yakında!") },
    })
    qc.invalidateQueries({ queryKey: ["transactions"] })
    qc.invalidateQueries({ queryKey: ["summary"] })
    setPendingDelete(null)
  }

  async function markCompleted(tx: Transaction) {
    const supabase = createClient()
    await supabase.from("transactions").update({ status: "completed", occurred_on: new Date().toISOString().split("T")[0] }).eq("id", tx.id)
    toast.success("Tamamlandı olarak işaretlendi ✓")
    qc.invalidateQueries({ queryKey: ["transactions"] })
    qc.invalidateQueries({ queryKey: ["summary"] })
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3 opacity-40">💸</div>
        <p className="text-sm text-white/30">Henüz işlem yok</p>
        <p className="text-xs text-white/20 mt-1">Sağ üstteki "İşlem Ekle" butonunu kullan</p>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <AnimatePresence initial={false}>
        {transactions.map((tx, i) => {
          const isIncome = tx.type === "income"
          const isPending = tx.status === "pending"
          return (
            <motion.div key={tx.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.03 }}
              className={cn("group flex items-center gap-3 p-3.5 rounded-[14px] border transition-all hover:bg-white/[0.04]",
                isPending ? "border-white/[0.06] bg-white/[0.02]" : "border-transparent bg-white/[0.02]",
                pendingDelete === tx.id && "opacity-40"
              )}
            >
              {/* Icon */}
              <div className={cn("h-9 w-9 rounded-[10px] flex items-center justify-center flex-shrink-0 text-base",
                tx.source?.emoji ? "text-xl" : isIncome ? "bg-green-500/10" : "bg-red-500/10"
              )}>
                {tx.source?.emoji || (isIncome ? <TrendingUp className="h-4 w-4 text-green-400" /> : <TrendingDown className="h-4 w-4 text-red-400" />)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">
                  {tx.description || tx.source?.name || (isIncome ? "Gelir" : "Gider")}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {tx.source && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full border" style={{ borderColor: tx.source.color + "40", color: tx.source.color, background: tx.source.color + "15" }}>
                      {tx.source.name}
                    </span>
                  )}
                  <span className="text-[10px] text-white/30">{formatDate(isPending && tx.due_on ? tx.due_on : tx.occurred_on, "d MMM yyyy")}</span>
                  {isPending && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Bekleyen</span>}
                </div>
              </div>

              {/* Amount */}
              <div className={cn("text-sm font-bold tabular-nums font-mono flex-shrink-0", isIncome ? "text-green-400" : "text-red-400", isPending && "opacity-60")}>
                {isIncome ? "+" : "-"}{formatCurrency(tx.amount, currency)}
              </div>

              {/* Actions — visible on hover */}
              {showEdit && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {isPending && (
                    <button onClick={() => markCompleted(tx)} title="Tamamlandı işaretle"
                      className="h-7 w-7 rounded-[8px] flex items-center justify-center text-white/30 hover:text-green-400 hover:bg-green-500/10 transition-all">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button onClick={() => openEditTransaction(tx.id)} title="Düzenle"
                    className="h-7 w-7 rounded-[8px] flex items-center justify-center text-white/30 hover:text-white/80 hover:bg-white/[0.06] transition-all">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(tx.id)} title="Sil"
                    className="h-7 w-7 rounded-[8px] flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
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
