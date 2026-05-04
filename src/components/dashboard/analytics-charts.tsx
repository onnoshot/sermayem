"use client"
import { GlassSurface } from "@/components/ui/glass-surface"
import { formatCurrency } from "@/lib/format"
import type { Transaction, Source, Currency } from "@/types/database"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface AnalyticsChartsProps {
  monthlyData: { month: string; income: number; expense: number; net: number }[]
  transactions: (Transaction & { source?: Source | null })[]
  currency: Currency
}

export function AnalyticsCharts({ monthlyData, transactions, currency }: AnalyticsChartsProps) {
  // Top sources by income
  const sourceMap: Record<string, { name: string; emoji: string; color: string; total: number }> = {}
  transactions.filter((t) => t.type === "income" && t.source).forEach((t) => {
    const src = t.source!
    if (!sourceMap[src.id]) sourceMap[src.id] = { name: src.name, emoji: src.emoji, color: src.color, total: 0 }
    sourceMap[src.id].total += t.amount
  })
  const topSources = Object.values(sourceMap).sort((a, b) => b.total - a.total).slice(0, 5)

  return (
    <div className="space-y-4">
      {/* Monthly bar chart */}
      <GlassSurface className="p-6">
        <h3 className="text-sm font-semibold text-white mb-1">12 Aylık Özet</h3>
        <p className="text-xs text-white/40 mb-5">Gelir vs Gider karşılaştırması</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} barGap={4} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
              <Tooltip contentStyle={{ background: "rgba(15,15,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [formatCurrency(Number(value ?? 0), currency), ""]} />
              <Bar dataKey="income" fill="#22C55E" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassSurface>

      {/* Top sources */}
      <GlassSurface className="p-6">
        <h3 className="text-sm font-semibold text-white mb-1">En Yüksek Gelir Kaynakları</h3>
        <p className="text-xs text-white/40 mb-5">Tüm zamanlar</p>
        {topSources.length === 0 ? (
          <p className="text-sm text-white/25 text-center py-8">Henüz gelir kaydı yok</p>
        ) : (
          <div className="space-y-3">
            {topSources.map((src, i) => {
              const max = topSources[0].total
              return (
                <div key={src.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs text-white/25 text-right">{i + 1}</span>
                  <span className="text-lg">{src.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-white/70">{src.name}</span>
                      <span className="text-xs font-mono tabular-nums text-white/60">{formatCurrency(src.total, currency)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(src.total / max) * 100}%`, background: src.color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </GlassSurface>
    </div>
  )
}
