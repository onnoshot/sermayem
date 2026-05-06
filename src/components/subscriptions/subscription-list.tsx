"use client"

import { useState, useTransition, useOptimistic } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassSurface } from "@/components/ui/glass-surface"
import { dismissSubscription, restoreAllSubscriptions } from "@/app/actions/subscriptions"
import type { DetectedSubscription } from "@/lib/subscriptions"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Currency } from "@/types/database"
import { X, RotateCcw, Calendar, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  subscriptions: DetectedSubscription[]
  dismissedCount: number
  currency: Currency
}

export function SubscriptionList({ subscriptions, dismissedCount, currency }: Props) {
  const [isPending, startTransition] = useTransition()
  const [optimisticSubs, removeOptimistic] = useOptimistic(
    subscriptions,
    (state, keyToRemove: string) => state.filter((s) => s.key !== keyToRemove)
  )
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)

  function handleDismiss(key: string) {
    startTransition(async () => {
      removeOptimistic(key)
      await dismissSubscription(key)
    })
  }

  function handleRestoreAll() {
    setShowRestoreConfirm(false)
    startTransition(async () => {
      await restoreAllSubscriptions()
    })
  }

  const totalMonthly = optimisticSubs.reduce((a, s) => a + s.monthlyAmount, 0)
  const totalYearly = optimisticSubs.reduce((a, s) => a + s.yearlyAmount, 0)

  if (optimisticSubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
          <RefreshCw className="h-7 w-7 text-white/20" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-base font-semibold text-white/50">
            {dismissedCount > 0 ? "Tüm abonelikler gizlendi" : "Henüz tespit edilmedi"}
          </p>
          <p className="text-sm text-white/25 mt-1 max-w-xs">
            {dismissedCount > 0
              ? "Gizlenen abonelikleri geri getirmek için sıfırla."
              : "Aynı kaynaktan tekrar eden giderler otomatik olarak tespit edilecek."}
          </p>
        </div>
        {dismissedCount > 0 && (
          <button
            onClick={() => setShowRestoreConfirm(true)}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors px-4 py-2 rounded-xl border border-white/[0.07] hover:bg-white/[0.04]"
          >
            <RotateCcw className="h-4 w-4" />
            {dismissedCount} gizleneni geri getir
          </button>
        )}
        <AnimatePresence>
          {showRestoreConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex flex-col items-center gap-2 mt-2"
            >
              <p className="text-xs text-white/40">Emin misin?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleRestoreAll}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #E50001, #B91C1C)" }}
                >
                  Evet, geri getir
                </button>
                <button
                  onClick={() => setShowRestoreConfirm(false)}
                  className="px-4 py-2 rounded-xl text-sm text-white/40 border border-white/[0.07] hover:bg-white/[0.04] transition-all"
                >
                  İptal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <GlassSurface className="p-4">
          <p className="text-[11px] text-white/35 mb-1">Aylık Toplam</p>
          <p className="text-xl font-bold tabular-nums text-white font-mono">
            {formatCurrency(totalMonthly, currency)}
          </p>
          <p className="text-[11px] text-white/25 mt-1">{optimisticSubs.length} abonelik</p>
        </GlassSurface>
        <GlassSurface className="p-4">
          <p className="text-[11px] text-white/35 mb-1">Yıllık Tahmini</p>
          <p className="text-xl font-bold tabular-nums text-orange-400 font-mono">
            {formatCurrency(totalYearly, currency)}
          </p>
          <p className="text-[11px] text-white/25 mt-1">yıllık maliyet</p>
        </GlassSurface>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {optimisticSubs.map((sub) => (
            <SubscriptionCard
              key={sub.key}
              sub={sub}
              currency={currency}
              onDismiss={() => handleDismiss(sub.key)}
              disabled={isPending}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Restore link */}
      {dismissedCount > 0 && (
        <div className="pt-2 text-center">
          {!showRestoreConfirm ? (
            <button
              onClick={() => setShowRestoreConfirm(true)}
              className="text-xs text-white/25 hover:text-white/50 transition-colors flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {dismissedCount} gizlenen abonelik
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-xs text-white/40">Tümünü geri getir?</span>
              <button onClick={handleRestoreAll} className="text-xs text-[#E50001] font-semibold">Evet</button>
              <button onClick={() => setShowRestoreConfirm(false)} className="text-xs text-white/30">İptal</button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

function SubscriptionCard({
  sub,
  currency,
  onDismiss,
  disabled,
}: {
  sub: DetectedSubscription
  currency: Currency
  onDismiss: () => void
  disabled: boolean
}) {
  const nextDate = new Date(sub.nextEstimatedDate)
  const now = new Date()
  const daysUntilNext = Math.ceil((nextDate.getTime() - now.getTime()) / 86_400_000)
  const isOverdue = daysUntilNext < 0
  const isSoon = daysUntilNext >= 0 && daysUntilNext <= 7

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
    >
      <GlassSurface className="p-4">
        <div className="flex items-start gap-3">
          {/* Emoji badge */}
          <div
            className="h-11 w-11 rounded-[13px] flex items-center justify-center text-xl flex-shrink-0 border border-white/[0.07]"
            style={{ backgroundColor: `${sub.color}18` }}
          >
            {sub.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate capitalize">{sub.name}</p>
                {sub.description && sub.description !== sub.name && (
                  <p className="text-[11px] text-white/30 truncate mt-0.5">{sub.description}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold tabular-nums text-white font-mono">
                  {formatCurrency(sub.amount, currency)}
                </p>
                <p className="text-[10px] text-white/35 mt-0.5">{sub.periodLabel.toLowerCase()}</p>
              </div>
            </div>

            {/* Date row */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-white/25" />
                  <span className="text-[11px] text-white/35">
                    Son: {formatDate(sub.lastDate, "d MMM")}
                  </span>
                </div>
                <div className={cn(
                  "text-[11px] font-medium px-2 py-0.5 rounded-full",
                  isOverdue
                    ? "bg-red-500/15 text-red-400"
                    : isSoon
                    ? "bg-orange-500/15 text-orange-400"
                    : "bg-white/[0.06] text-white/35"
                )}>
                  {isOverdue
                    ? `${Math.abs(daysUntilNext)} gün gecikti`
                    : daysUntilNext === 0
                    ? "Bugün"
                    : `${daysUntilNext} gün sonra`}
                </div>
              </div>

              {/* Dismiss */}
              <button
                onClick={onDismiss}
                disabled={disabled}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/[0.06] transition-all active:scale-90 disabled:opacity-40"
                title="Gizle"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </GlassSurface>
    </motion.div>
  )
}
