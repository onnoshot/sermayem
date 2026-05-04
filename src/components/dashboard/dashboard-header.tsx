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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-[22px] overflow-hidden border border-white/[0.07] p-4 sm:p-5 lg:p-6"
      style={{
        background: "rgba(255,255,255,0.035)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/25 to-transparent" />
      <div className="absolute -top-16 -left-10 h-48 w-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(234,179,8,0.07), transparent 70%)" }} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: avatar + greeting */}
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-[16px] flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 border border-white/[0.1]"
            style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.18), rgba(217,119,6,0.1))" }}
          >
            {avatarEmoji}
          </motion.div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-white/35 uppercase tracking-[0.18em] mb-0.5 sm:mb-1">{date}</p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-none">
              {greeting},{" "}
              <span className="text-yellow-400">{firstName}</span>
            </h1>
          </div>
        </div>

        {/* Right: monthly stats */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[12px] sm:rounded-[14px] border border-green-500/20 bg-green-500/[0.07]">
            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-[9px] sm:text-[10px] text-green-400/60 uppercase tracking-wider leading-none mb-0.5">Bu Ay Gelir</p>
              <p className="text-xs sm:text-sm font-bold font-mono text-green-400 tabular-nums">{formatCurrency(monthIncome, currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[12px] sm:rounded-[14px] border border-red-500/20 bg-red-500/[0.07]">
            <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-[9px] sm:text-[10px] text-red-400/60 uppercase tracking-wider leading-none mb-0.5">Bu Ay Gider</p>
              <p className="text-xs sm:text-sm font-bold font-mono text-red-400 tabular-nums">{formatCurrency(monthExpense, currency)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
