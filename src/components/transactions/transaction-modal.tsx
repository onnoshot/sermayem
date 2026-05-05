"use client"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { transactionSchema, type TransactionInput } from "@/lib/validations/transaction"
import { createClient } from "@/lib/supabase/client"
import { useUIStore } from "@/lib/stores/ui-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { X, TrendingUp, TrendingDown, CheckCircle2, Clock, RefreshCw, GripHorizontal } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import type { Source, Transaction } from "@/types/database"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function TransactionModal() {
  const { transactionModalOpen, editingTransactionId, prefillDate, closeTransactionModal } = useUIStore()
  const qc = useQueryClient()
  const [sources, setSources] = useState<Source[]>([])
  const [editData, setEditData] = useState<Transaction | null>(null)

  // Lock body scroll on iOS when modal is open
  useEffect(() => {
    if (transactionModalOpen) {
      const y = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${y}px`
      document.body.style.width = "100%"
    } else {
      const top = document.body.style.top
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, -parseInt(top || "0"))
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [transactionModalOpen])

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "income", status: "completed", currency: "TRY", is_recurring: false, occurred_on: format(new Date(), "yyyy-MM-dd") },
  })

  const watchType = watch("type")
  const watchStatus = watch("status")
  const watchRecurring = watch("is_recurring")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: s } = await supabase.from("sources").select("*").eq("user_id", user.id).eq("archived", false).order("name")
      setSources(s || [])
      if (editingTransactionId) {
        const { data: tx } = await supabase.from("transactions").select("*").eq("id", editingTransactionId).single()
        if (tx) {
          setEditData(tx)
          reset({
            type: tx.type, status: tx.status, amount: tx.amount, currency: tx.currency as "TRY"|"USD"|"EUR"|"GBP",
            source_id: tx.source_id, description: tx.description, occurred_on: tx.occurred_on,
            due_on: tx.due_on, is_recurring: tx.is_recurring, recurrence_rule: tx.recurrence_rule as "daily"|"weekly"|"monthly"|"yearly"|null,
          })
        }
      } else {
        setEditData(null)
        reset({
          type: "income",
          status: prefillDate ? "pending" : "completed",
          currency: "TRY",
          is_recurring: false,
          occurred_on: prefillDate || format(new Date(), "yyyy-MM-dd"),
          due_on: prefillDate || undefined,
          source_id: null,
        })
      }
    }
    if (transactionModalOpen) load()
  }, [transactionModalOpen, editingTransactionId, reset, prefillDate])

  async function onSubmit(data: TransactionInput) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingTransactionId) {
      const { error } = await supabase.from("transactions").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editingTransactionId)
      if (error) { toast.error("Güncelleme başarısız"); return }
      toast.success("İşlem güncellendi")
    } else {
      const { error } = await supabase.from("transactions").insert({ ...data, user_id: user.id })
      if (error) { toast.error("İşlem eklenemedi"); return }
      toast.success("İşlem eklendi 🎉")
    }

    qc.invalidateQueries({ queryKey: ["transactions"] })
    qc.invalidateQueries({ queryKey: ["summary"] })
    closeTransactionModal()
  }

  const filteredSources = sources.filter((s) => s.type === watchType || s.type === "both")

  return (
    <AnimatePresence>
      {transactionModalOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-[6px]"
            onClick={closeTransactionModal}
          />

          {/* Sheet container — bottom on mobile, centered on desktop */}
          <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center sm:p-4 pointer-events-none">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="pointer-events-auto w-full sm:max-w-[480px] sm:rounded-[28px] rounded-t-[28px] overflow-hidden"
              style={{
                background: "var(--c-modal)",
                backdropFilter: "blur(40px)",
                border: "1px solid var(--c-border)",
                boxShadow: "0 -8px 48px rgba(0,0,0,0.5), inset 0 1px 0 var(--c-specular)",
                maxHeight: "92dvh",
              }}
            >
              {/* Drag indicator — mobile only */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-white/20" />
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(92dvh - 20px)" }}>
                <div className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">
                      {editingTransactionId ? "İşlemi Düzenle" : "İşlem Ekle"}
                    </h2>
                    <button
                      onClick={closeTransactionModal}
                      className="h-8 w-8 rounded-full bg-white/[0.07] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.12] transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Type + Status — stack vertically on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Type */}
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Tür</p>
                        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-[14px] bg-white/[0.04] border border-white/[0.06]">
                          {(["income", "expense"] as const).map((t) => (
                            <button key={t} type="button" onClick={() => setValue("type", t)}
                              className={cn(
                                "flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-xs font-semibold transition-all",
                                watchType === t
                                  ? t === "income"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "text-white/40 hover:text-white/60"
                              )}>
                              {t === "income"
                                ? <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
                                : <TrendingDown className="h-3.5 w-3.5 flex-shrink-0" />}
                              {t === "income" ? "Gelir" : "Gider"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Durum</p>
                        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-[14px] bg-white/[0.04] border border-white/[0.06]">
                          {(["completed", "pending"] as const).map((s) => (
                            <button key={s} type="button" onClick={() => setValue("status", s)}
                              className={cn(
                                "flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[11px] font-semibold transition-all leading-none",
                                watchStatus === s
                                  ? s === "completed"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                  : "text-white/40 hover:text-white/60"
                              )}>
                              {s === "completed"
                                ? <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                                : <Clock className="h-3.5 w-3.5 flex-shrink-0" />}
                              {s === "completed" ? "Tamamlandı" : "Bekleyen"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Tutar</p>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl font-mono">₺</span>
                        <input
                          {...register("amount", { valueAsNumber: true })}
                          type="number" step="0.01" placeholder="0,00"
                          className="w-full pl-9 pr-4 py-4 rounded-[14px] bg-white/[0.05] border border-white/[0.08] text-white text-2xl sm:text-3xl font-bold font-mono placeholder:text-white/15 focus:outline-none focus:border-[#E50001]/40 focus:bg-white/[0.07] transition-all"
                        />
                      </div>
                      {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
                    </div>

                    {/* Source */}
                    {filteredSources.length > 0 && (
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Kaynak</p>
                        <Controller name="source_id" control={control} render={({ field }) => (
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            {filteredSources.map((src) => (
                              <button key={src.id} type="button"
                                onClick={() => field.onChange(field.value === src.id ? null : src.id)}
                                className={cn(
                                  "flex flex-col items-center gap-1 p-2.5 rounded-[12px] border text-center transition-all",
                                  field.value === src.id
                                    ? "border-[#E50001]/40 bg-[#E50001]/10"
                                    : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
                                )}>
                                <span className="text-lg sm:text-xl">{src.emoji}</span>
                                <span className="text-[10px] text-white/50 leading-tight line-clamp-1">{src.name}</span>
                              </button>
                            ))}
                          </div>
                        )} />
                      </div>
                    )}

                    {/* Description + Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Açıklama" placeholder="Açıklama..." {...register("description")} />
                      <Input
                        label={watchStatus === "pending" ? "Vade Tarihi" : "Tarih"}
                        type="date"
                        {...register(watchStatus === "pending" ? "due_on" : "occurred_on")}
                      />
                    </div>

                    {/* Recurring */}
                    <div className="flex items-center gap-3 p-3 rounded-[12px] bg-white/[0.03] border border-white/[0.06]">
                      <Controller name="is_recurring" control={control} render={({ field }) => (
                        <button
                          type="button"
                          onClick={() => field.onChange(!field.value)}
                          className="relative h-5 w-9 rounded-full transition-all flex-shrink-0"
                          style={{ background: field.value ? "#E50001" : "rgba(255,255,255,0.12)" }}
                        >
                          <span className={cn(
                            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
                            field.value ? "left-4" : "left-0.5"
                          )} />
                        </button>
                      )} />
                      <div className="flex items-center gap-1.5 text-sm text-white/60 min-w-0">
                        <RefreshCw className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">Yinelenen işlem</span>
                      </div>
                      {watchRecurring && (
                        <Controller name="recurrence_rule" control={control} render={({ field }) => (
                          <select
                            {...field}
                            value={field.value ?? ""}
                            className="ml-auto text-xs bg-white/[0.06] border border-white/[0.08] rounded-[8px] px-2 py-1 text-white/70 focus:outline-none flex-shrink-0"
                          >
                            <option value="weekly">Haftalık</option>
                            <option value="monthly">Aylık</option>
                            <option value="yearly">Yıllık</option>
                          </select>
                        )} />
                      )}
                    </div>

                    {/* Submit */}
                    <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
                      {editingTransactionId ? "Güncelle" : "Kaydet"} ✓
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
