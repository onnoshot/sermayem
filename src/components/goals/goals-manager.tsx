"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, X, PlusCircle, MinusCircle } from "lucide-react"
import { GlassSurface } from "@/components/ui/glass-surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AvatarIcon, IconPicker, GOAL_ICONS, resolveIconId } from "@/components/ui/avatar-icon"
import { formatCurrency, formatCurrencyCompact, formatDate } from "@/lib/format"
import type { SavingsGoal, Currency } from "@/types/database"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { differenceInDays } from "date-fns"

const COLORS = ["#EAB308", "#22C55E", "#EF4444", "#3B82F6", "#A855F7", "#F97316", "#EC4899", "#14B8A6"]

interface Props {
  goals: SavingsGoal[]
  currency: Currency
}

export function GoalsManager({ goals, currency }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [updateModal, setUpdateModal] = useState<SavingsGoal | null>(null)
  const [editing, setEditing] = useState<SavingsGoal | null>(null)
  const [saving, setSaving] = useState(false)
  const [updateAmount, setUpdateAmount] = useState("")
  const [updateMode, setUpdateMode] = useState<"add" | "set">("add")
  const [form, setForm] = useState({
    name: "", emoji: "target", color: "#EAB308",
    target_amount: "", current_amount: "", deadline: "",
  })

  function openAdd() {
    setEditing(null)
    setForm({ name: "", emoji: "target", color: "#EAB308", target_amount: "", current_amount: "0", deadline: "" })
    setModalOpen(true)
  }
  function openEdit(g: SavingsGoal) {
    setEditing(g)
    setForm({ name: g.name, emoji: resolveIconId(g.emoji, GOAL_ICONS), color: g.color, target_amount: String(g.target_amount), current_amount: String(g.current_amount), deadline: g.deadline ?? "" })
    setModalOpen(true)
  }

  async function save() {
    if (!form.name.trim() || !form.target_amount) { toast.error("Ad ve hedef tutar gerekli"); return }
    const target = parseFloat(form.target_amount)
    const current = parseFloat(form.current_amount || "0")
    if (isNaN(target) || target <= 0) { toast.error("Geçerli bir hedef tutar girin"); return }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      name: form.name.trim(), emoji: form.emoji, color: form.color,
      target_amount: target, current_amount: Math.min(current, target),
      currency, deadline: form.deadline || null,
    }

    if (editing) {
      const { error } = await supabase.from("savings_goals").update(payload).eq("id", editing.id)
      if (error) { toast.error("Güncellenemedi"); setSaving(false); return }
      toast.success("Hedef güncellendi")
    } else {
      const { error } = await supabase.from("savings_goals").insert({ ...payload, user_id: user.id })
      if (error) { toast.error("Eklenemedi"); setSaving(false); return }
      toast.success("Hedef eklendi")
    }
    setModalOpen(false); setSaving(false)
    startTransition(() => router.refresh())
  }

  async function deleteGoal(id: string) {
    if (!confirm("Bu hedefi silmek istediğine emin misin?")) return
    const supabase = createClient()
    await supabase.from("savings_goals").delete().eq("id", id)
    toast.success("Silindi")
    startTransition(() => router.refresh())
  }

  async function updateGoalAmount() {
    if (!updateModal) return
    const amount = parseFloat(updateAmount)
    if (isNaN(amount) || amount < 0) { toast.error("Geçerli bir tutar girin"); return }
    const supabase = createClient()
    const newAmount = updateMode === "add"
      ? Math.min(updateModal.current_amount + amount, updateModal.target_amount)
      : Math.min(amount, updateModal.target_amount)
    const { error } = await supabase.from("savings_goals").update({ current_amount: newAmount }).eq("id", updateModal.id)
    if (error) { toast.error("Güncellenemedi"); return }
    toast.success(newAmount >= updateModal.target_amount ? "Hedefe ulaştın! 🎉" : "Güncellendi")
    setUpdateModal(null); setUpdateAmount("")
    startTransition(() => router.refresh())
  }

  const totalTarget = goals.reduce((a, g) => a + g.target_amount, 0)
  const totalCurrent = goals.reduce((a, g) => a + g.current_amount, 0)

  return (
    <>
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {[
            { label: "Toplam Hedef", value: totalTarget, color: "text-white" },
            { label: "Birikilen", value: totalCurrent, color: "text-green-400" },
            { label: "Kalan", value: totalTarget - totalCurrent, color: "text-white/60" },
          ].map(({ label, value, color }) => (
            <GlassSurface key={label} className="p-3 sm:p-4">
              <p className="text-[10px] text-white/40 mb-1">{label}</p>
              <p className={`text-sm font-bold tabular-nums truncate ${color}`}>{formatCurrencyCompact(value, currency)}</p>
            </GlassSurface>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence initial={false}>
          {goals.map((goal) => {
            const pct = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0
            const done = pct >= 100
            const daysLeft = goal.deadline ? differenceInDays(new Date(goal.deadline), new Date()) : null

            return (
              <motion.div key={goal.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} layout>
                <GlassSurface className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <AvatarIcon id={goal.emoji} size="md" pool={GOAL_ICONS} />
                      <div>
                        <p className="text-sm font-semibold text-white/85">{goal.name}</p>
                        {daysLeft !== null && (
                          <p className={cn("text-[10px]", daysLeft < 0 ? "text-red-400" : daysLeft < 30 ? "text-orange-400" : "text-white/30")}>
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} gün geçti` : daysLeft === 0 ? "Bugün son gün!" : `${daysLeft} gün kaldı`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(goal)} className="h-7 w-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.07] transition-all">
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button onClick={() => deleteGoal(goal.id)} className="h-7 w-7 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="flex justify-between text-xs mb-2">
                    <span className="tabular-nums font-semibold" style={{ color: done ? "#22C55E" : goal.color }}>
                      {formatCurrencyCompact(goal.current_amount, currency)}
                    </span>
                    <span className="text-white/30 tabular-nums">
                      {formatCurrencyCompact(goal.target_amount, currency)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(pct, 100)}%`, background: done ? "#22C55E" : goal.color }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: done ? "#22C55E" : "rgba(255,255,255,0.35)" }}>
                      {done ? "Tamamlandı!" : `%${Math.round(pct)} tamamlandı`}
                    </span>
                    {!done && (
                      <button
                        onClick={() => { setUpdateModal(goal); setUpdateAmount(""); setUpdateMode("add") }}
                        className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                        style={{ background: `${goal.color}18`, color: goal.color }}
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Para Ekle
                      </button>
                    )}
                  </div>
                </GlassSurface>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Add button */}
        <button
          onClick={openAdd}
          className="flex flex-col items-center justify-center gap-2 py-8 rounded-[20px] border-2 border-dashed border-white/[0.1] hover:border-[#E50001]/40 hover:bg-[#E50001]/[0.03] transition-all"
        >
          <div className="h-10 w-10 rounded-full border border-white/[0.1] flex items-center justify-center text-white/30">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-xs text-white/30">Yeni Hedef</span>
        </button>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[8px]" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="relative w-full sm:max-w-[440px] rounded-t-[28px] sm:rounded-[24px] overflow-hidden"
              style={{ background: "rgba(12,12,22,0.97)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.09)", maxHeight: "90dvh" }}
            >
              <div className="sm:hidden flex justify-center pt-3 pb-1"><div className="h-1 w-10 rounded-full bg-white/15" /></div>
              <div className="overflow-y-auto" style={{ maxHeight: "calc(90dvh - 16px)" }}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">{editing ? "Hedefi Düzenle" : "Yeni Hedef"}</h2>
                    <button onClick={() => setModalOpen(false)} className="h-8 w-8 rounded-full bg-white/[0.07] flex items-center justify-center text-white/50 hover:text-white transition-all">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Input label="Hedef Adı" placeholder="örn. Araba, Tatil, Acil Fon" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />

                    {/* Icon picker */}
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">İkon</p>
                      <IconPicker
                        value={form.emoji}
                        onChange={(id) => setForm((f) => ({ ...f, emoji: id }))}
                        pool={GOAL_ICONS}
                        columns={8}
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Renk</p>
                      <div className="flex gap-2">
                        {COLORS.map((c) => (
                          <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, color: c }))}
                            className={cn("h-7 w-7 rounded-full transition-all flex-shrink-0", form.color === c && "ring-2 ring-white/60 ring-offset-2 ring-offset-[#0C0C16] scale-110")}
                            style={{ background: c }} />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input label={`Hedef Tutar (${currency})`} type="number" placeholder="50000" value={form.target_amount} onChange={(e) => setForm((f) => ({ ...f, target_amount: e.target.value }))} />
                      <Input label={`Mevcut Birikim (${currency})`} type="number" placeholder="0" value={form.current_amount} onChange={(e) => setForm((f) => ({ ...f, current_amount: e.target.value }))} />
                    </div>

                    <Input label="Hedef Tarihi (isteğe bağlı)" type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />

                    <div className="flex gap-3 pt-1">
                      <Button variant="ghost" size="lg" className="flex-1" onClick={() => setModalOpen(false)}>İptal</Button>
                      <Button variant="primary" size="lg" className="flex-1" loading={saving} onClick={save}>{editing ? "Güncelle" : "Ekle"}</Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Amount update modal */}
      <AnimatePresence>
        {updateModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[8px]" onClick={() => setUpdateModal(null)} />
            <motion.div
              initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="relative w-full sm:max-w-[380px] rounded-t-[28px] sm:rounded-[24px] p-6"
              style={{ background: "rgba(12,12,22,0.97)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <div className="sm:hidden flex justify-center mb-4"><div className="h-1 w-10 rounded-full bg-white/15" /></div>
              <div className="flex items-center gap-3 mb-4">
                <AvatarIcon id={updateModal.emoji} size="sm" pool={GOAL_ICONS} />
                <div>
                  <h2 className="text-base font-bold text-white">{updateModal.name}</h2>
                  <p className="text-xs text-white/35">{formatCurrencyCompact(updateModal.current_amount, currency)} / {formatCurrencyCompact(updateModal.target_amount, currency)}</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {(["add", "set"] as const).map((mode) => (
                  <button key={mode} onClick={() => setUpdateMode(mode)}
                    className={cn("flex-1 py-2 rounded-[10px] text-xs font-semibold border transition-all",
                      updateMode === mode ? "bg-[#E50001]/15 border-[#E50001]/40 text-[#E50001]" : "bg-white/[0.03] border-white/[0.07] text-white/40")}>
                    {mode === "add" ? "Ekle" : "Olarak Ayarla"}
                  </button>
                ))}
              </div>

              <Input
                label={`Tutar (${currency})`}
                type="number"
                placeholder={updateMode === "add" ? "Eklenecek miktar" : "Toplam birikim"}
                value={updateAmount}
                onChange={(e) => setUpdateAmount(e.target.value)}
              />

              <div className="flex gap-3 mt-4">
                <Button variant="ghost" size="lg" className="flex-1" onClick={() => setUpdateModal(null)}>İptal</Button>
                <Button variant="primary" size="lg" className="flex-1" onClick={updateGoalAmount}>Kaydet</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
