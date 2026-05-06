"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import type { Source } from "@/types/database"
import { cn } from "@/lib/utils"
import { SourceIcon, ICON_OPTIONS } from "./source-icon"

const COLORS = ["#EAB308","#22C55E","#EF4444","#3B82F6","#A855F7","#F97316","#EC4899","#14B8A6","#FF6B35","#007AFF","#8B5CF6","#06B6D4"]
const TYPE_LABELS = { income: "Gelir", expense: "Gider", both: "Her İkisi" }

interface SourcesGridProps { sources: Source[] }

export function SourcesGrid({ sources }: SourcesGridProps) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Source | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    emoji: "📷",
    color: "#EAB308",
    type: "income" as "income" | "expense" | "both",
  })

  function openAdd() {
    setEditing(null)
    setForm({ name: "", emoji: "📷", color: "#EAB308", type: "income" })
    setModalOpen(true)
  }
  function openEdit(s: Source) {
    setEditing(s)
    setForm({ name: s.name, emoji: s.emoji, color: s.color, type: s.type })
    setModalOpen(true)
  }

  async function save() {
    if (!form.name.trim()) { toast.error("Kaynak adı gerekli"); return }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editing) {
      const { error } = await supabase.from("sources").update(form).eq("id", editing.id)
      if (error) { toast.error("Güncellenemedi"); setSaving(false); return }
      toast.success("Kaynak güncellendi")
    } else {
      const { error } = await supabase.from("sources").insert({ ...form, user_id: user.id })
      if (error) {
        toast.error(error.message.includes("unique") ? "Bu isimde kaynak zaten var" : "Eklenemedi")
        setSaving(false)
        return
      }
      toast.success("Kaynak eklendi")
    }
    setModalOpen(false); setSaving(false); router.refresh()
  }

  async function deleteSrc(id: string) {
    if (!confirm("Bu kaynağı silmek istediğine emin misin?")) return
    const supabase = createClient()
    await supabase.from("sources").delete().eq("id", id)
    toast.success("Silindi"); router.refresh()
  }

  async function archiveSrc(src: Source) {
    const supabase = createClient()
    await supabase.from("sources").update({ archived: !src.archived }).eq("id", src.id)
    toast.success(src.archived ? "Arşivden çıkarıldı" : "Arşivlendi"); router.refresh()
  }

  const active = sources.filter((s) => !s.archived)
  const archived = sources.filter((s) => s.archived)

  const selectedIconEntry = ICON_OPTIONS.find((o) => o.emoji === form.emoji)

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {active.map((src) => (
          <motion.div
            key={src.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            layout
            className="group relative rounded-[20px] p-5 flex flex-col items-center gap-3 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.14] transition-all cursor-pointer"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}
          >
            {/* Icon badge */}
            <div
              className="h-14 w-14 rounded-[18px] flex items-center justify-center"
              style={{
                background: `${src.color}18`,
                border: `1px solid ${src.color}30`,
                color: src.color,
              }}
            >
              <SourceIcon emoji={src.emoji} className="h-7 w-7" />
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-white/85">{src.name}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{TYPE_LABELS[src.type]}</p>
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(src)}
                className="h-6 w-6 rounded-[6px] bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.14] transition-all"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={() => archiveSrc(src)}
                className="h-6 w-6 rounded-[6px] bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
              >
                <Archive className="h-3 w-3" />
              </button>
              <button
                onClick={() => deleteSrc(src.id)}
                className="h-6 w-6 rounded-[6px] bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add new */}
        <button
          onClick={openAdd}
          className="rounded-[20px] p-5 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/[0.1] hover:border-[#E50001]/40 hover:bg-[#E50001]/[0.03] transition-all min-h-[130px]"
        >
          <div className="h-10 w-10 rounded-full border border-white/[0.1] flex items-center justify-center text-white/30 hover:text-[#E50001]">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-xs text-white/30">Yeni Kaynak</span>
        </button>
      </div>

      {/* Archived */}
      {archived.length > 0 && (
        <div className="mt-8">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Arşivlenenler</p>
          <div className="flex flex-wrap gap-2">
            {archived.map((src) => (
              <button
                key={src.id}
                onClick={() => archiveSrc(src)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-white/30 hover:text-white/60 transition-all"
              >
                <SourceIcon emoji={src.emoji} className="h-3.5 w-3.5" />
                {src.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[8px]"
              onClick={() => setModalOpen(false)}
            />

            {/* Bottom sheet on mobile, modal on desktop */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="relative w-full sm:max-w-[440px] rounded-t-[28px] sm:rounded-[24px] overflow-hidden"
              style={{
                background: "rgba(12,12,22,0.97)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
                maxHeight: "90dvh",
              }}
            >
              {/* Drag handle — mobile */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-white/15" />
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(90dvh - 16px)" }}>
                <div className="p-6">
                  <h2 className="text-lg font-bold text-white mb-5">
                    {editing ? "Kaynağı Düzenle" : "Yeni Kaynak"}
                  </h2>

                  <div className="space-y-5">
                    <Input
                      label="Kaynak Adı"
                      placeholder="örn. Maaş, Market, Kira..."
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />

                    {/* Icon picker */}
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2.5">İkon</p>

                      {/* Selected preview */}
                      <div className="flex items-center gap-3 mb-3 p-3 rounded-[14px] bg-white/[0.04] border border-white/[0.07]">
                        <div
                          className="h-11 w-11 rounded-[13px] flex items-center justify-center flex-shrink-0"
                          style={{ background: `${form.color}20`, border: `1px solid ${form.color}35`, color: form.color }}
                        >
                          <SourceIcon emoji={form.emoji} className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/80">{selectedIconEntry?.label ?? "Özel"}</p>
                          <p className="text-[11px] text-white/30">Seçili ikon</p>
                        </div>
                      </div>

                      {/* Icon grid */}
                      <div className="grid grid-cols-6 gap-1.5">
                        {ICON_OPTIONS.map((entry) => {
                          const isSelected = form.emoji === entry.emoji
                          return (
                            <button
                              key={entry.emoji}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, emoji: entry.emoji }))}
                              title={entry.label}
                              className={cn(
                                "h-10 w-full rounded-[10px] flex items-center justify-center transition-all",
                                isSelected
                                  ? "border border-[#E50001]/50 scale-110"
                                  : "bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.09] hover:border-white/[0.14]"
                              )}
                              style={isSelected ? { background: `${form.color}20`, color: form.color } : { color: "rgba(255,255,255,0.5)" }}
                            >
                              <entry.Icon className="h-4.5 w-4.5" />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Color picker */}
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2.5">Renk</p>
                      <div className="flex flex-wrap gap-2">
                        {COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, color: c }))}
                            className={cn(
                              "h-7 w-7 rounded-full transition-all",
                              form.color === c && "ring-2 ring-white/60 ring-offset-2 ring-offset-[#0C0C16] scale-110"
                            )}
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Type picker */}
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2.5">Tür</p>
                      <div className="flex gap-2">
                        {(["income", "expense", "both"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, type: t }))}
                            className={cn(
                              "flex-1 py-2.5 rounded-[11px] text-xs font-semibold transition-all border",
                              form.type === t
                                ? "bg-[#E50001]/15 border-[#E50001]/40 text-[#E50001]"
                                : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/60"
                            )}
                          >
                            {TYPE_LABELS[t]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Button variant="ghost" size="lg" className="flex-1" onClick={() => setModalOpen(false)}>
                        İptal
                      </Button>
                      <Button variant="primary" size="lg" className="flex-1" loading={saving} onClick={save}>
                        {editing ? "Güncelle" : "Ekle"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
