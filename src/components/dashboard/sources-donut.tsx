"use client"
import { GlassSurface } from "@/components/ui/glass-surface"
import { formatCurrency } from "@/lib/format"
import type { Transaction, Source, Currency } from "@/types/database"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface SourcesDonutProps {
  transactions: (Transaction & { source?: Source | null })[]
  sources: Source[]
  currency: Currency
}

export function SourcesDonut({ transactions, sources, currency }: SourcesDonutProps) {
  const incomeBySource = transactions
    .filter((t) => t.type === "income" && t.source_id)
    .reduce<Record<string, number>>((acc, t) => {
      if (t.source_id) acc[t.source_id] = (acc[t.source_id] || 0) + t.amount
      return acc
    }, {})

  const data = sources
    .filter((s) => incomeBySource[s.id])
    .map((s) => ({ name: s.name, value: incomeBySource[s.id], color: s.color, emoji: s.emoji }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  const total = data.reduce((a, d) => a + d.value, 0)

  return (
    <GlassSurface className="p-5 h-full">
      <h3 className="text-sm font-semibold text-white mb-1">Kaynak Dağılımı</h3>
      <p className="text-xs text-white/40 mb-4">Gelir kaynaklarına göre</p>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <div className="text-3xl mb-2 opacity-30">🥧</div>
          <p className="text-xs text-white/25">Henüz gelir yok</p>
        </div>
      ) : (
        <>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "rgba(15,15,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(Number(value ?? 0), currency), ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="text-sm">{d.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs text-white/60 truncate">{d.name}</span>
                    <span className="text-xs font-mono text-white/70 tabular-nums">{((d.value / total) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-0.5 rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.value / total) * 100}%`, background: d.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </GlassSurface>
  )
}
