import type { Transaction, Source } from "@/types/database"

export interface DetectedSubscription {
  key: string
  name: string
  emoji: string
  color: string
  sourceId: string | null
  description: string | null
  amount: number
  currency: string
  period: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly"
  periodLabel: string
  periodDays: number
  monthlyAmount: number
  yearlyAmount: number
  transactionCount: number
  lastDate: string
  nextEstimatedDate: string
}

const PERIODS = [
  { id: "weekly" as const, label: "Haftalık", days: 7, min: 5, max: 9 },
  { id: "biweekly" as const, label: "İki Haftada Bir", days: 14, min: 12, max: 16 },
  { id: "monthly" as const, label: "Aylık", days: 30, min: 25, max: 35 },
  { id: "quarterly" as const, label: "3 Aylık", days: 91, min: 80, max: 100 },
  { id: "yearly" as const, label: "Yıllık", days: 365, min: 335, max: 395 },
]

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function classifyPeriod(days: number) {
  return PERIODS.find((p) => days >= p.min && days <= p.max) ?? null
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

function normalizeKey(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ")
}

export function detectSubscriptions(
  txs: (Transaction & { source: Source | null })[],
  dismissed: string[]
): DetectedSubscription[] {
  const expenseTxs = txs.filter((t) => t.type === "expense" && t.status === "completed")

  const groups = new Map<string, (Transaction & { source: Source | null })[]>()

  for (const tx of expenseTxs) {
    let key: string
    if (tx.source_id && tx.description) {
      key = `${tx.source_id}:${normalizeKey(tx.description)}`
    } else if (tx.source_id) {
      key = tx.source_id
    } else if (tx.description) {
      key = `desc:${normalizeKey(tx.description)}`
    } else {
      continue
    }
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(tx)
  }

  const results: DetectedSubscription[] = []

  for (const [key, group] of groups) {
    if (dismissed.includes(key)) continue
    if (group.length < 2) continue

    const sorted = [...group].sort((a, b) => a.occurred_on.localeCompare(b.occurred_on))

    const intervals: number[] = []
    for (let i = 1; i < sorted.length; i++) {
      const a = new Date(sorted[i - 1].occurred_on).getTime()
      const b = new Date(sorted[i].occurred_on).getTime()
      intervals.push(Math.round((b - a) / 86_400_000))
    }

    const medianInterval = median(intervals)
    const period = classifyPeriod(medianInterval)
    if (!period) continue

    const tol = medianInterval * 0.4
    const consistent = intervals.every((iv) => Math.abs(iv - medianInterval) <= tol)
    if (!consistent) continue

    const amounts = sorted.map((t) => t.amount)
    const medAmount = median(amounts)
    const source = sorted[sorted.length - 1].source

    results.push({
      key,
      name: source?.name || (sorted[0].description ? normalizeKey(sorted[0].description) : "Abonelik"),
      emoji: source?.emoji || "🔄",
      color: source?.color || "#14B8A6",
      sourceId: sorted[0].source_id,
      description: sorted[0].description,
      amount: medAmount,
      currency: sorted[0].currency as string,
      period: period.id,
      periodLabel: period.label,
      periodDays: period.days,
      monthlyAmount: (medAmount * 30) / period.days,
      yearlyAmount: (medAmount * 365) / period.days,
      transactionCount: sorted.length,
      lastDate: sorted[sorted.length - 1].occurred_on,
      nextEstimatedDate: addDays(sorted[sorted.length - 1].occurred_on, period.days),
    })
  }

  return results.sort((a, b) => b.monthlyAmount - a.monthlyAmount)
}
