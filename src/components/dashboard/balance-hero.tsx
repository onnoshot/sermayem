"use client"
import { motion } from "framer-motion"
import { AnimatedNumber } from "@/components/motion/animated-number"
import { formatCurrency } from "@/lib/format"
import type { Currency } from "@/types/database"
import { TrendingUp, TrendingDown, Rocket } from "lucide-react"

interface BalanceHeroProps {
  net: number
  totalIncome: number
  totalExpense: number
  totalPendingIncome: number
  totalPendingExpense: number
  currency: Currency
  goal?: number | null
}

export function BalanceHero({
  net, totalIncome, totalExpense,
  totalPendingIncome, totalPendingExpense,
  currency, goal,
}: BalanceHeroProps) {
  const isPositive = net >= 0
  const sym = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }[currency]
  const total = totalIncome + totalExpense
  const incomeRatio = total > 0 ? (totalIncome / total) * 100 : 50
  const goalProgress = goal ? Math.min(100, (totalIncome / goal) * 100) : null
  const netPending = totalPendingIncome - totalPendingExpense
  const projectedNet = net + netPending

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-[28px] overflow-hidden border border-white/[0.08]"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(44px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-20 -right-20 h-64 w-64 rounded-full pointer-events-none"
        style={{ background: isPositive ? "radial-gradient(circle, rgba(234,179,8,0.12), transparent 70%)" : "radial-gradient(circle, rgba(239,68,68,0.12), transparent 70%)" }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-12">

          {/* LEFT — big number + bars */}
          <div>
            <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-3">Net Bakiye</p>

            <div className="mb-6">
              <span className={`text-5xl lg:text-7xl font-black tracking-tight leading-none font-mono ${isPositive ? "text-white" : "text-red-400"}`}>
                <AnimatedNumber
                  value={Math.abs(net)}
                  format={(v) => {
                    const n = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)
                    return currency === "TRY" ? `${n} TL` : `${sym}${n}`
                  }}
                  duration={1.4}
                />
              </span>
            </div>

            {/* Income / Expense bars */}
            <div className="space-y-3 max-w-md">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">Gelir</span>
                  </div>
                  <span className="text-xs font-mono text-green-400">{formatCurrency(totalIncome, currency)}</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #22C55E, #4ADE80)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${incomeRatio}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-xs text-red-400 font-medium">Gider</span>
                  </div>
                  <span className="text-xs font-mono text-red-400">{formatCurrency(totalExpense, currency)}</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #EF4444, #F87171)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - incomeRatio}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — stats column */}
          <div className="flex flex-row lg:flex-col items-stretch gap-3 lg:min-w-[200px]">

            {/* Ay Sonu Tahmini */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 lg:flex-none p-4 rounded-2xl border relative overflow-hidden"
              style={{
                background: netPending >= 0 ? "rgba(234,179,8,0.08)" : "rgba(239,68,68,0.08)",
                borderColor: netPending >= 0 ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-3.5 w-3.5 text-yellow-400" />
                <p className="text-[11px] text-white/40 uppercase tracking-wider">Ay Sonu Tahmini</p>
              </div>
              <p className={`text-xl font-black font-mono tabular-nums ${netPending >= 0 ? "text-yellow-400" : "text-red-400"}`}>
                {netPending >= 0 ? "+" : ""}{formatCurrency(netPending, currency)}
              </p>
              <p className="text-[10px] text-white/25 mt-1">Bekleyenler tamamlandığında</p>
              <p className={`text-xs font-mono mt-2 ${projectedNet >= 0 ? "text-white/60" : "text-red-400/60"}`}>
                Toplam: {formatCurrency(projectedNet, currency)}
              </p>
            </motion.div>

            {/* Goal progress */}
            {goalProgress !== null && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 lg:flex-none p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex flex-col items-center justify-center gap-3"
              >
                <div className="relative h-16 w-16">
                  <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
                    <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                    <motion.circle
                      cx="32" cy="32" r="24" fill="none" stroke="#EAB308" strokeWidth="5"
                      strokeDasharray={`${(goalProgress / 100) * 150.8} 150.8`}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 150.8" }}
                      animate={{ strokeDasharray: `${(goalProgress / 100) * 150.8} 150.8` }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-yellow-400">{goalProgress.toFixed(0)}%</span>
                  </div>
                </div>
                <p className="text-[11px] text-white/30 text-center">Aylık Hedef</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
