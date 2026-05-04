"use client"
import { useState, useMemo } from "react"
import { TransactionList } from "./transaction-list"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Transaction, Source, Currency } from "@/types/database"
import { cn } from "@/lib/utils"

interface FilteredTransactionsProps {
  transactions: (Transaction & { source?: Source | null })[]
  sources: Source[]
  currency: Currency
}

export function FilteredTransactions({ transactions, sources, currency }: FilteredTransactionsProps) {
  const [search, setSearch] = useState("")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = !search || (t.description || "").toLowerCase().includes(search.toLowerCase()) || (t.source?.name || "").toLowerCase().includes(search.toLowerCase())
      const matchSource = sourceFilter === "all" || t.source_id === sourceFilter
      const matchStatus = statusFilter === "all" || t.status === statusFilter
      return matchSearch && matchSource && matchStatus
    })
  }, [transactions, search, sourceFilter, statusFilter])

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Ara..."
            className="w-full pl-9 pr-3 py-2 rounded-[10px] bg-white/[0.04] border border-white/[0.07] text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-yellow-400/40 transition-all"
          />
        </div>
        {/* Status filter */}
        <div className="flex gap-1 p-1 rounded-[10px] bg-white/[0.03] border border-white/[0.06]">
          {[["all", "Tümü"], ["completed", "Tamamlandı"], ["pending", "Bekleyen"]].map(([v, l]) => (
            <button key={v} onClick={() => setStatusFilter(v)}
              className={cn("px-3 py-1 rounded-[8px] text-xs font-medium transition-all",
                statusFilter === v ? "bg-yellow-500/15 text-yellow-400" : "text-white/40 hover:text-white/60")}>
              {l}
            </button>
          ))}
        </div>
        {/* Source filter */}
        {sources.length > 0 && (
          <div className="flex gap-1 p-1 rounded-[10px] bg-white/[0.03] border border-white/[0.06] flex-wrap">
            <button onClick={() => setSourceFilter("all")}
              className={cn("px-2.5 py-1 rounded-[8px] text-xs transition-all", sourceFilter === "all" ? "bg-yellow-500/15 text-yellow-400" : "text-white/40 hover:text-white/60")}>
              Tümü
            </button>
            {sources.map((s) => (
              <button key={s.id} onClick={() => setSourceFilter(s.id)}
                className={cn("px-2.5 py-1 rounded-[8px] text-xs transition-all flex items-center gap-1",
                  sourceFilter === s.id ? "bg-yellow-500/15 text-yellow-400" : "text-white/40 hover:text-white/60")}>
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-white/30 mb-3">{filtered.length} işlem</p>
      <TransactionList transactions={filtered} currency={currency} showEdit />
    </div>
  )
}
