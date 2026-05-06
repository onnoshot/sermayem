"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, X, AlertTriangle } from "lucide-react"
import { GlassSurface } from "@/components/ui/glass-surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SourceIcon } from "@/components/sources/source-icon"
import { formatCurrency, formatCurrencyCompact } from "@/lib/format"
import type { Budget, Source, Currency } from "@/types/database"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface BudgetWithSpending extends Omit<Budget, "source"> {
  spent: number
  source: Source | null
}

interface Props {
  budgets: BudgetWithSpending[]
  sources: Source[]
  currency: Currency
}

export function BudgetManager({ budgets, sources, currency }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BudgetWithSpending | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ source_id: "", monthly_limit: "" })

  const availableSources = sources.filter(
    (s) => (s.type === "expense" || s.type === "both") && !budgets.some((b) => b.source_id === s.id && (!editing || editing.source_id !== s.id))
  )

  function openAdd() { setEditing(null); setForm({ source_id: "", monthly_limit: "" }); setModalOpen(true) }
  function openEdit(b: BudgetWithSpending) {
    setEditing(b)
    setForm({ source_id: b.source_id ?? "", monthly_limit: String(b.monthly_limit) })
    setModalOpen(true)
  }

  async function save() {
    if (!form.source_id || !form.monthly_limit) { toast.error("Tüm alanlar gerekli"); return }
    const limit = parseFloat(form.monthly_limit)
    if (isNaN(limit) || limit <= 0) { toast.error("Geçerli bir limit girin"); return }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editing) {
      const { error } = await supabase.from("budgets").update({ monthly_limit: limit }).eq("id", editing.id)
      if (error) { toast.error("Güncellenemedi"); setSaving(false); return }
      toast.success("Bütçe güncellendi")
    } else {
      const { error } = await supabase.from("budgets").insert({ user_id: user.id, source_id: form.source_id, monthly_limit: limit, currency })
      if (error) { toast.error("Eklenemedi"); setSaving(false); return }
      toast.success("Bütçe eklendi")
    }
    setModalOpen(false); setSaving(false)
    startTransition(() => router.refresh())
  }

  async function deleteBudget(id: string) {
    if (!confirm("Bu bütçeyi silmek istediğine emin misin?")) return
    const supabase = createClient()
    await supabase.from("budgets").delete().eq("id", id)
    toast.success("Silindi")
    startTransition(() => router.refresh())
  }

  const totalLimit = budgets.reduce((a, b) => a + b.monthly_limit, 0)
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0)

  return (
    <>
      {/* Summary */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {[
            { label: "Toplam Limit", value: totalLimit, color: "text-white" },
            { label: "Harcanan", value: totalSpent, color: totalSpent > totalLimit ? "text-red-400" : "text-orange-400" },
            { label: "Kalan", value: totalLimit - totalSpent, color: totalLimit - totalSpent >= 0 ? "text-green-400" : "text-red-400" },
          ].map(({ label, value, color }) => (
            <GlassSurface key={label} className="p-3 sm:p-4">
              <p className="text-[10px] text-white/40 mb-1">{label}</p>
              <p className={`text-sm font-bold tabular-nums font-mono truncate ${color}`}>{formatCurrencyCompact(value, currency)}</p>
            </GlassSurface>
          ))}
        </div>
      )}

      {/* Budget list */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {budgets.map((budget) => {
            const pct = budget.monthly_limit > 0 ? (budget.spent / budget.monthly_limit) * 100 : 0
            const isOver = pct > 100
            const isWarning = pct >= 80 && !isOver
            const barColor = isOver ? "#EF4444" : isWarning ? "#F97316" : "#22C55E"

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                layout
              >
                <GlassSurface className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Source icon */}
                    <div
                      className="h-10 w-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                      style={{ background: `${budget.source?.color ?? "#6B7280"}18`, color: budget.source?.color ?? "#6B7280" }}
                    >
                      <SourceIcon emoji={budget.source?.emoji ?? "💸"} className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="text-sm font-semibold text-white/85 truncate">{budget.source?.name ?? "Kaynak"}</p>
                          {(isOver || isWarning) && (
                            <AlertTriangle className={cn("h-3.5 w-3.5 flex-shrink-0", isOver ? "text-red-400" : "text-orange-400")} />
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <button onClick={() => openEdit(budget)} className="h-7 w-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.07] transition-all">
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button onClick={() => deleteBudget(budget.id)} className="h-7 w-7 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Amounts */}
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/40">
                          <span className="font-mono tabular-nums font-medium" style={{ color: barColor }}>
                            {formatCurrencyCompact(budget.spent, currency)}
                          </span>
                          <span className="text-white/25"> / {formatCurrencyCompact(budget.monthly_limit, currency)}</span>
                        </span>
                        <span className={cn("font-semibold", isOver ? "text-red-400" : "text-white/35")}>
                          {isOver ? `+${formatCurrencyCompact(budget.spent - budget.monthly_limit, currency)} aşıldı` : `%${Math.round(pct)}`}
                        </span>
                      </div>

                      {/* Bar */}
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
                        />
                      </div>
                    </div>
                  </div>
                </GlassSurface>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Add button */}
        <button
          onClick={openAdd}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[16px] border-2 border-dashed border-white/[0.1] hover:border-[#E50001]/40 hover:bg-[#E50001]/[0.03] transition-all text-sm text-white/35 hover:text-white/60"
        >
          <Plus className="h-4 w-4" />
          Bütçe Ekle
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[8px]" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="relative w-full sm:max-w-[420px] rounded-t-[28px] sm:rounded-[24px] p-6"
              style={{ background: "rgba(12,12,22,0.97)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <div className="sm:hidden flex justify-center mb-4"><div className="h-1 w-10 rounded-full bg-white/15" /></div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">{editing ? "Bütçeyi Düzenle" : "Yeni Bütçe"}</h2>
                <button onClick={() => setModalOpen(false)} className="h-8 w-8 rounded-full bg-white/[0.07] flex items-center justify-center text-white/50 hover:text-white transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {!editing && (
                  <div>
                    <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Kategori</p>
                    {availableSources.length === 0 ? (
                      <p className="text-sm text-white/30 text-center py-4">Tüm gider kategorilerine bütçe eklenmiş</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {availableSources.map((src) => (
                          <button
                            key={src.id}
                            onClick={() => setForm((f) => ({ ...f, source_id: src.id }))}
                            className={cn(
                              "flex flex-col items-center gap-1.5 p-2.5 rounded-[12px] border text-center transition-all",
                              form.source_id === src.id
                                ? "border-[#E50001]/40 bg-[#E50001]/10"
                                : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
                            )}
                          >
                            <div className="h-8 w-8 rounded-[9px] flex items-center justify-center" style={{ background: `${src.color}20`, color: src.color }}>
                              <SourceIcon emoji={src.emoji} className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] text-white/50 line-clamp-1">{src.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <Input
                  label={`Aylık Limit (${currency})`}
                  type="number"
                  placeholder="örn. 3000"
                  value={form.monthly_limit}
                  onChange={(e) => setForm((f) => ({ ...f, monthly_limit: e.target.value }))}
                />

                <div className="flex gap-3 pt-1">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={() => setModalOpen(false)}>İptal</Button>
                  <Button variant="primary" size="lg" className="flex-1" loading={saving} onClick={save}>
                    {editing ? "Güncelle" : "Ekle"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
