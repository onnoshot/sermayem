"use client"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/format"
import type { Transaction, Currency } from "@/types/database"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { tr } from "date-fns/locale"

interface TrendChartProps {
  transactions: Transaction[]
  currency: Currency
}

export function TrendChart({ transactions, currency }: TrendChartProps) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i)
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    const monthTxs = transactions.filter((t) => {
      const d = new Date(t.occurred_on)
      return d >= start && d <= end && t.status === "completed"
    })
    return {
      name: format(date, "MMM", { locale: tr }),
      Gelir: monthTxs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0),
      Gider: monthTxs.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0),
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative rounded-[20px] border border-white/[0.08] overflow-hidden h-full"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)" }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Aylık Trend</h3>
            <p className="text-xs text-white/35 mt-0.5">Son 6 ay — Gelir vs Gider</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="text-xs text-white/40">Gelir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="text-xs text-white/40">Gider</span>
            </div>
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={months} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.35)", fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
              <Tooltip
                contentStyle={{ background: "rgba(10,10,18,0.97)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 12, padding: "10px 14px" }}
                formatter={(value, name) => [formatCurrency(Number(value ?? 0), currency), String(name ?? "")]}
                cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="Gelir" stroke="#22C55E" strokeWidth={2.5} fill="url(#gInc)" dot={false} activeDot={{ r: 5, fill: "#22C55E", stroke: "#08080C", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="Gider" stroke="#EF4444" strokeWidth={2.5} fill="url(#gExp)" dot={false} activeDot={{ r: 5, fill: "#EF4444", stroke: "#08080C", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
