"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, isToday,
  addMonths, subMonths,
} from "date-fns"
import { tr } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus, CheckCircle2, Pencil, Trash2 } from "lucide-react"
import { useUIStore } from "@/lib/stores/ui-store"
import { useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { formatCurrencyCompact, formatCurrency } from "@/lib/format"
import type { Transaction, Source, Currency } from "@/types/database"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const WEEK_DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]

interface Props {
  transactions: (Transaction & { source: Source | null })[]
  currency: Currency
}

export function PendingCalendar({ transactions, currency }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const { openAddTransactionWithDate, openEditTransaction } = useUIStore()
  const qc = useQueryClient()
  const router = useRouter()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  function getTxsForDay(date: Date) {
    const dateStr = format(date, "yyyy-MM-dd")
    return transactions.filter((tx) => {
      const txDate = tx.status === "pending" ? tx.due_on : tx.occurred_on
      return txDate === dateStr
    })
  }

  function handleDayClick(date: Date) {
    if (!isSameMonth(date, currentDate)) return
    const dayTxs = getTxsForDay(date)
    if (dayTxs.length === 0) {
      openAddTransactionWithDate(format(date, "yyyy-MM-dd"))
    } else {
      setSelectedDay((prev) => (prev && isSameDay(prev, date) ? null : date))
    }
  }

  async function markDone(tx: Transaction) {
    const supabase = createClient()
    await supabase.from("transactions").update({ status: "completed", occurred_on: new Date().toISOString().split("T")[0] }).eq("id", tx.id)
    toast.success("Tamamlandi")
    router.refresh()
  }

  async function deleteTx(id: string) {
    const supabase = createClient()
    await supabase.from("transactions").delete().eq("id", id)
    toast.success("Silindi")
    router.refresh()
  }

  const selectedDayTxs = selectedDay ? getTxsForDay(selectedDay) : []

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => { setCurrentDate(subMonths(currentDate, 1)); setSelectedDay(null) }}
          className="h-9 w-9 rounded-[10px] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-[15px] font-bold text-white capitalize">
          {format(currentDate, "MMMM yyyy", { locale: tr })}
        </h2>
        <button
          onClick={() => { setCurrentDate(addMonths(currentDate, 1)); setSelectedDay(null) }}
          className="h-9 w-9 rounded-[10px] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week day header */}
      <div className="grid grid-cols-7">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] text-white/25 font-medium py-1.5">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-[3px]">
        {days.map((day) => {
          const dayTxs = getTxsForDay(day)
          const income = dayTxs.filter((t) => t.type === "income")
          const expense = dayTxs.filter((t) => t.type === "expense")
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isSelected = !!selectedDay && isSameDay(day, selectedDay)
          const isT = isToday(day)
          const hasData = dayTxs.length > 0

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              disabled={!isCurrentMonth}
              className={cn(
                "relative flex flex-col items-center justify-start pt-2 pb-1.5 rounded-[10px] min-h-[52px] transition-all",
                !isCurrentMonth && "opacity-20 cursor-default",
                isCurrentMonth && !isSelected && !hasData && "hover:bg-white/[0.04] active:bg-white/[0.06]",
                isCurrentMonth && !isSelected && hasData && "bg-white/[0.04] hover:bg-white/[0.07] active:bg-white/[0.09]",
                isSelected && "bg-purple-500/15 border border-purple-500/30",
                isT && !isSelected && "ring-1 ring-inset ring-purple-500/40",
              )}
            >
              <span className={cn(
                "text-[13px] font-semibold leading-none",
                isT ? "text-purple-400" : "text-white/75",
                isSelected && "text-white",
                !isCurrentMonth && "text-white/30",
              )}>
                {format(day, "d")}
              </span>

              {hasData && (
                <div className="flex gap-[3px] mt-1.5 flex-wrap justify-center max-w-[36px]">
                  {income.slice(0, 2).map((_, i) => (
                    <div key={`i${i}`} className="h-[5px] w-[5px] rounded-full bg-green-400" />
                  ))}
                  {income.length > 2 && (
                    <div className="h-[5px] w-[5px] rounded-full bg-green-400 opacity-50" />
                  )}
                  {expense.slice(0, 2).map((_, i) => (
                    <div key={`e${i}`} className="h-[5px] w-[5px] rounded-full bg-red-400" />
                  ))}
                  {expense.length > 2 && (
                    <div className="h-[5px] w-[5px] rounded-full bg-red-400 opacity-50" />
                  )}
                </div>
              )}

              {!hasData && isCurrentMonth && (
                <div className="mt-1 opacity-0 group-hover:opacity-100">
                  <Plus className="h-3 w-3 text-white/20" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Today button */}
      {!isSameMonth(new Date(), currentDate) && (
        <button
          onClick={() => { setCurrentDate(new Date()); setSelectedDay(null) }}
          className="text-xs text-purple-400/60 hover:text-purple-400 transition-colors"
        >
          Bugune don
        </button>
      )}

      {/* Selected day detail */}
      <AnimatePresence>
        {selectedDay && selectedDayTxs.length > 0 && (
          <motion.div
            key={selectedDay.toISOString()}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.03] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white capitalize">
                  {format(selectedDay, "d MMMM yyyy", { locale: tr })}
                </h3>
                <button
                  onClick={() => openAddTransactionWithDate(format(selectedDay, "yyyy-MM-dd"))}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ekle
                </button>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {selectedDayTxs.map((tx) => {
                  const isIncome = tx.type === "income"
                  const isPending = tx.status === "pending"
                  const title = tx.description || tx.source?.name || (isIncome ? "Gelir" : "Gider")
                  return (
                    <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                      <div
                        className="h-8 w-8 rounded-[9px] flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: (tx.source?.color || (isIncome ? "#22c55e" : "#ef4444")) + "18" }}
                      >
                        {tx.source?.emoji || (isIncome ? "💰" : "💸")}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-white/85 truncate">{title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {tx.source && (
                            <span className="text-[11px]" style={{ color: tx.source.color || "rgba(255,255,255,0.35)" }}>
                              {tx.source.name}
                            </span>
                          )}
                          {isPending && (
                            <span className="text-[10px] text-purple-400/70 border border-purple-500/25 rounded-full px-1.5 py-0.5">
                              Bekleyen
                            </span>
                          )}
                        </div>
                      </div>

                      <span className={cn(
                        "text-sm font-bold tabular-nums font-mono flex-shrink-0 mr-1",
                        isIncome ? "text-green-400" : "text-red-400",
                        isPending && "opacity-60",
                      )}>
                        {isIncome ? "+" : "-"}{formatCurrencyCompact(tx.amount, currency)}
                      </span>

                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {isPending && (
                          <button
                            onClick={() => markDone(tx)}
                            className="h-7 w-7 rounded-[8px] flex items-center justify-center text-white/25 hover:text-green-400 hover:bg-green-500/10 active:scale-90 transition-all"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditTransaction(tx.id)}
                          className="h-7 w-7 rounded-[8px] flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/[0.07] active:scale-90 transition-all"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTx(tx.id)}
                          className="h-7 w-7 rounded-[8px] flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 active:scale-90 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add hint */}
      <p className="text-center text-[11px] text-white/20">
        Bos bir gune tiklayarak yeni islem ekleyebilirsin
      </p>
    </div>
  )
}
