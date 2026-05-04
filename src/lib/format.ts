import { format, formatDistance, isToday, isTomorrow, differenceInDays } from "date-fns"
import { tr } from "date-fns/locale"
import type { Currency } from "@/types/database"

export function formatCurrency(amount: number, currency: Currency = "TRY"): string {
  if (currency === "TRY") {
    return `${new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} TL`
  }
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrencyCompact(amount: number, currency: Currency = "TRY"): string {
  if (currency === "TRY") {
    if (Math.abs(amount) >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M TL`
    if (Math.abs(amount) >= 1_000) return `${(amount / 1_000).toFixed(1)}K TL`
    return formatCurrency(amount, currency)
  }
  const sym = { USD: "$", EUR: "€", GBP: "£" }[currency as "USD" | "EUR" | "GBP"] ?? ""
  if (Math.abs(amount) >= 1_000_000) return `${sym}${(amount / 1_000_000).toFixed(1)}M`
  if (Math.abs(amount) >= 1_000) return `${sym}${(amount / 1_000).toFixed(1)}K`
  return formatCurrency(amount, currency)
}

export function formatDate(date: string | Date, fmt = "d MMMM yyyy"): string {
  return format(new Date(date), fmt, { locale: tr })
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), "dd.MM.yyyy", { locale: tr })
}

export function formatRelative(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: tr })
}

export function formatDueDate(date: string | Date): { label: string; urgent: boolean; overdue: boolean } {
  const d = new Date(date)
  const days = differenceInDays(d, new Date())
  if (days < 0) return { label: `${Math.abs(days)} gün geçti`, urgent: false, overdue: true }
  if (isToday(d)) return { label: "Bugün", urgent: true, overdue: false }
  if (isTomorrow(d)) return { label: "Yarın", urgent: true, overdue: false }
  if (days <= 3) return { label: `${days} gün kaldı`, urgent: true, overdue: false }
  return { label: formatDate(d, "d MMM"), urgent: false, overdue: false }
}

export function formatMonthYear(year: number, month: number): string {
  return format(new Date(year, month), "MMMM yyyy", { locale: tr })
}

export function formatPercent(value: number, decimals = 1): string {
  return `%${value.toFixed(decimals)}`
}
