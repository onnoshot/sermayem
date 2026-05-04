"use client"
import dynamic from "next/dynamic"
import type { Transaction, Source, Currency } from "@/types/database"

const AnalyticsCharts = dynamic(
  () => import("@/components/dashboard/analytics-charts").then((m) => m.AnalyticsCharts),
  {
    ssr: false,
    loading: () => <div className="h-[400px] rounded-[20px] bg-white/[0.04] animate-pulse" />,
  }
)

interface LazyAnalyticsChartsProps {
  monthlyData: { month: string; income: number; expense: number; net: number }[]
  transactions: (Transaction & { source?: Source | null })[]
  currency: Currency
}

export function LazyAnalyticsCharts(props: LazyAnalyticsChartsProps) {
  return <AnalyticsCharts {...props} />
}
