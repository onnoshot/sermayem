"use client"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/format"
import type { Currency } from "@/types/database"
import { TrendingUp, TrendingDown } from "lucide-react"

interface DashboardHeaderProps {
  greeting: string
  firstName: string
  avatarEmoji: string
  date: string
  monthIncome: number
  monthExpense: number
  currency: Currency
}

export function DashboardHeader({ greeting, firstName, avatarEmoji, date, monthIncome, monthExpense, currency }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[20px] border border-white/[0.07] p-4 sm:p-5"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: avatar + greeting */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-[14px] flex items-center justify-center text-xl flex-shrink-0 border border-white/[0.08] bg-white/[0.04]">
            {avatarEmoji}
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.18em] mb-0.5">{date}</p>
            <h1 className="text-[22px] sm:text-2xl font-black text-white tracking-tight leading-none">
              {greeting}, <span className="text-yellow-400">{firstName}</span>
            </h1>
          </div>
        </div>

        {/* Right: monthly stats */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] border border-white/[0.07] bg-white/[0.03]">
            <TrendingUp className="h-3 w-3 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-[9px] text-white/30 uppercase tracking-wider leading-none mb-0.5">Gelir</p>
              <p className="text-xs font-bold font-mono text-green-400 tabular-nums">{formatCurrency(monthIncome, currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] border border-white/[0.07] bg-white/[0.03]">
            <TrendingDown className="h-3 w-3 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-[9px] text-white/30 uppercase tracking-wider leading-none mb-0.5">Gider</p>
              <p className="text-xs font-bold font-mono text-red-400 tabular-nums">{formatCurrency(monthExpense, currency)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
