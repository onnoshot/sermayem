"use client"
import dynamic from "next/dynamic"
import type { Transaction, Source, Currency } from "@/types/database"

const TrendChart = dynamic(
  () => import("@/components/dashboard/trend-chart").then((m) => m.TrendChart),
  {
    ssr: false,
    loading: () => <div className="h-[260px] rounded-[20px] bg-white/[0.04] animate-pulse" />,
  }
)

const SourcesDonut = dynamic(
  () => import("@/components/dashboard/sources-donut").then((m) => m.SourcesDonut),
  {
    ssr: false,
    loading: () => <div className="h-[260px] rounded-[20px] bg-white/[0.04] animate-pulse" />,
  }
)

interface ChartsSectionProps {
  transactions: Transaction[]
  completed: Transaction[]
  sources: Source[]
  currency: Currency
}

export function ChartsSection({ transactions, completed, sources, currency }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <TrendChart transactions={transactions} currency={currency} />
      </div>
      <div>
        <SourcesDonut transactions={completed} sources={sources} currency={currency} />
      </div>
    </div>
  )
}
