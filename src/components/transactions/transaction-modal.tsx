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
import { X, TrendingUp, TrendingDown, CheckCircle2, Clock, RefreshCw } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import type { Source, Transaction } from "@/types/database"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function TransactionModal() {
  const { transactionModalOpen, editingTransactionId, prefillDate, closeTransactionModal } = useUIStore()
  const qc = useQueryClient()
  const [sources, setSources] = useState<Source[]>([])
  const [editData, setEditData] = useState<Transaction | null>(null)

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
      const { data: s } = await supabase.from("sources").select("*").eq("archived", false).order("name")
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
  }, [transactionModalOpen, editingTransactionId, reset])

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[8px]"
            onClick={closeTransactionModal}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative w-full max-w-[480px] rounded-[28px] bg-[#0F0F18]/95 backdrop-blur-3xl border border-white/[0.1] shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
            style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}
          >
            {/* Top highlight */}
            <div className="absolute inset-x-0 top-0 h-px rounded-t-[28px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">{editingTransactionId ? "İşlemi Düzenle" : "İşlem Ekle"}</h2>
                <button onClick={closeTransactionModal} className="h-7 w-7 rounded-full bg-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-all">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Type + Status */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Type */}
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Tür</p>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-[14px] bg-white/[0.04] border border-white/[0.06]">
                      {(["income", "expense"] as const).map((t) => (
                        <button key={t} type="button" onClick={() => setValue("type", t)}
                          className={cn("flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-xs font-medium transition-all",
                            watchType === t
                              ? t === "income" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "text-white/40 hover:text-white/60")}>
                          {t === "income" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                          {t === "income" ? "Gelir" : "Gider"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Status */}
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Durum</p>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-[14px] bg-white/[0.04] border border-white/[0.06]">
                      {(["completed", "pending"] as const).map((s) => (
                        <button key={s} type="button" onClick={() => setValue("status", s)}
                          className={cn("flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-xs font-medium transition-all",
                            watchStatus === s
                              ? s === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "text-white/40 hover:text-white/60")}>
                          {s === "completed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                          {s === "completed" ? "Tamamlandı" : "Bekleyen"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Tutar</p>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-2xl font-mono">₺</span>
                    <input
                      {...register("amount", { valueAsNumber: true })}
                      type="number" step="0.01" placeholder="0,00"
                      className="w-full pl-10 pr-4 py-4 rounded-[14px] bg-white/[0.05] border border-white/[0.08] text-white text-3xl font-bold font-mono placeholder:text-white/15 focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
                </div>

                {/* Source */}
                {filteredSources.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Kaynak</p>
                    <Controller name="source_id" control={control} render={({ field }) => (
                      <div className="grid grid-cols-4 gap-2">
                        {filteredSources.map((src) => (
                          <button key={src.id} type="button"
                            onClick={() => field.onChange(field.value === src.id ? null : src.id)}
                            className={cn("flex flex-col items-center gap-1 p-2.5 rounded-[12px] border text-center transition-all",
                              field.value === src.id
                                ? "border-yellow-500/40 bg-yellow-500/10" : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]")}>
                            <span className="text-xl">{src.emoji}</span>
                            <span className="text-[10px] text-white/50 leading-tight line-clamp-1">{src.name}</span>
                          </button>
                        ))}
                      </div>
                    )} />
                  </div>
                )}

                {/* Description + Date */}
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Açıklama" placeholder="Açıklama..." {...register("description")} />
                  <Input label={watchStatus === "pending" ? "Vade Tarihi" : "Tarih"} type="date"
                    {...register(watchStatus === "pending" ? "due_on" : "occurred_on")} />
                </div>

                {/* Recurring */}
                <div className="flex items-center gap-3 p-3 rounded-[12px] bg-white/[0.03] border border-white/[0.06]">
                  <Controller name="is_recurring" control={control} render={({ field }) => (
                    <button type="button" onClick={() => field.onChange(!field.value)}
                      className={cn("h-5 w-9 rounded-full transition-all relative", field.value ? "bg-yellow-500" : "bg-white/10")}>
                      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all", field.value ? "left-4" : "left-0.5")} />
                    </button>
                  )} />
                  <div className="flex items-center gap-1.5 text-sm text-white/60">
                    <RefreshCw className="h-3.5 w-3.5" /> Yinelenen işlem
                  </div>
                  {watchRecurring && (
                    <Controller name="recurrence_rule" control={control} render={({ field }) => (
                      <select {...field} value={field.value ?? ""} className="ml-auto text-xs bg-white/[0.06] border border-white/[0.08] rounded-[8px] px-2 py-1 text-white/70 focus:outline-none">
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
