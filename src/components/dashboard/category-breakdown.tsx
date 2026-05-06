"use client"

import { useState, useEffect } from "react"
import { GlassSurface } from "@/components/ui/glass-surface"
import { SourceIcon } from "@/components/sources/source-icon"
import { formatCurrencyCompact, formatCurrency } from "@/lib/format"
import type { Currency } from "@/types/database"

export interface CategoryStat {
  sourceId: string | null
  name: string
  emoji: string
  color: string
  total: number
  count: number
  percentage: number
}

interface Props {
  stats: CategoryStat[]
  total: number
  currency: Currency
  type: "income" | "expense"
}

export function CategoryBreakdown({ stats, total, currency, type }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!stats.length || total === 0) return null

  const accentColor = type === "income" ? "#22C55E" : "#EF4444"

  return (
    <GlassSurface className="p-5">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[11px] text-white/35 uppercase tracking-widest mb-1">Kaynak Dağılımı</p>
          <p className="text-xl font-bold tabular-nums font-mono" style={{ color: accentColor }}>
            {formatCurrency(total, currency)}
          </p>
        </div>
        <p className="text-[11px] text-white/30 mb-1">{stats.length} kaynak</p>
      </div>

      {/* Stacked rainbow bar */}
      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-5">
        {stats.map((stat) => (
          <div
            key={stat.sourceId ?? stat.name}
            className="h-full rounded-full"
            style={{
              width: mounted ? `${stat.percentage}%` : "0%",
              background: stat.color,
              transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
            }}
            title={`${stat.name} — ${stat.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Per-source list */}
      <div className="space-y-3">
        {stats.map((stat, i) => (
          <div key={stat.sourceId ?? stat.name}>
            <div className="flex items-center gap-2.5 mb-1.5">
              {/* Icon */}
              <div
                className="h-7 w-7 rounded-[9px] flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}18`, color: stat.color }}
              >
                <SourceIcon emoji={stat.emoji} className="h-3.5 w-3.5" />
              </div>

              {/* Name */}
              <span className="text-sm font-medium text-white/75 flex-1 min-w-0 truncate">{stat.name}</span>

              {/* Stats */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md"
                  style={{ background: `${stat.color}18`, color: stat.color }}
                >
                  {stat.percentage < 1 ? "<1" : Math.round(stat.percentage)}%
                </span>
                <span className="text-sm font-bold tabular-nums font-mono text-white/85 w-24 text-right">
                  {formatCurrencyCompact(stat.total, currency)}
                </span>
              </div>
            </div>

            {/* Animated bar */}
            <div className="h-1 rounded-full overflow-hidden ml-9.5" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: mounted ? `${stat.percentage}%` : "0%",
                  background: stat.color,
                  opacity: 0.75,
                  transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 50}ms`,
                }}
              />
            </div>

            {/* Sub-info */}
            <p className="text-[10px] text-white/25 mt-1 ml-9.5">{stat.count} işlem</p>
          </div>
        ))}
      </div>
    </GlassSurface>
  )
}
