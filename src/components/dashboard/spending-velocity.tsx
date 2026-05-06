"use client"

import { useState, useEffect } from "react"
import { GlassSurface } from "@/components/ui/glass-surface"
import { formatCurrencyCompact, formatCurrency } from "@/lib/format"
import type { Currency } from "@/types/database"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  currentMonthExpense: number
  lastMonthExpense: number
  currency: Currency
  dayOfMonth: number
  daysInMonth: number
}

export function SpendingVelocity({ currentMonthExpense, lastMonthExpense, currency, dayOfMonth, daysInMonth }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const r = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(r) }, [])

  const progressRatio = dayOfMonth / daysInMonth
  const daysLeft = daysInMonth - dayOfMonth

  // Projected end-of-month expense
  const projected = progressRatio > 0 ? currentMonthExpense / progressRatio : 0

  // Velocity vs last month
  const velocityVsLast = lastMonthExpense > 0 ? ((projected - lastMonthExpense) / lastMonthExpense) * 100 : 0
  const isFaster = velocityVsLast > 5
  const isSlower = velocityVsLast < -5

  // Progress bar color
  const barColor = progressRatio > 0.85 && currentMonthExpense > lastMonthExpense * 0.9
    ? "#EF4444"
    : progressRatio > 0.6
    ? "#F97316"
    : "#22C55E"

  return (
    <GlassSurface className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-3.5 w-3.5 text-white/30" />
        <span className="text-[11px] text-white/35 uppercase tracking-widest">Harcama Hızı</span>
      </div>

      {/* Main numbers */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xl font-bold tabular-nums text-white">
            {formatCurrencyCompact(currentMonthExpense, currency)}
          </p>
          <p className="text-xs text-white/35 mt-0.5">bu ay harcandı</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold tabular-nums text-white/60">
            {formatCurrencyCompact(projected, currency)}
          </p>
          <p className="text-xs text-white/30 mt-0.5">ay sonu tahmini</p>
        </div>
      </div>

      {/* Month progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-white/25 mb-1">
          <span>Ayın {dayOfMonth}. günü</span>
          <span>{daysLeft} gün kaldı</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden relative">
          {/* Month elapsed */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: mounted ? `${progressRatio * 100}%` : "0%",
              background: "rgba(255,255,255,0.1)",
              transition: "width 0.7s ease",
            }}
          />
          {/* Spending progress */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: mounted && lastMonthExpense > 0
                ? `${Math.min((currentMonthExpense / lastMonthExpense) * progressRatio * 100, 100)}%`
                : "0%",
              background: barColor,
              opacity: 0.8,
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      </div>

      {/* Velocity badge */}
      {lastMonthExpense > 0 && (
        <div className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
          isFaster ? "bg-red-500/12 text-red-400" : isSlower ? "bg-green-500/12 text-green-400" : "bg-white/[0.06] text-white/40"
        )}>
          <span>{isFaster ? "↑" : isSlower ? "↓" : "→"}</span>
          {isFaster
            ? `Geçen aya göre %${Math.abs(velocityVsLast).toFixed(0)} daha hızlı`
            : isSlower
            ? `Geçen aya göre %${Math.abs(velocityVsLast).toFixed(0)} daha yavaş`
            : "Geçen ayla benzer hız"}
        </div>
      )}
    </GlassSurface>
  )
}
