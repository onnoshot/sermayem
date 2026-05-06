"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { transactionSchema, type TransactionInput } from "@/lib/validations/transaction"
import { createClient } from "@/lib/supabase/client"
import { useUIStore } from "@/lib/stores/ui-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { X, TrendingUp, TrendingDown, CheckCircle2, Clock, RefreshCw, Sparkles, ScanLine, CheckCheck, AlertCircle, Camera, Image as ImageIcon } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import type { Source, Transaction } from "@/types/database"
import { SourceIcon } from "@/components/sources/source-icon"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ScanResult {
  amount: number | null
  description: string
  date: string
  type: "income" | "expense"
  category: string
  currency?: string
  notes?: string
}

// Compress + resize image client-side before sending to API.
// Phone photos are 3-15MB; we need to get under 800KB for reliable API transfer.
async function compressImage(file: File, maxSizePx = 1600, quality = 0.88): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new window.Image()
      img.onerror = reject
      img.onload = () => {
        const { width, height } = img
        let w = width, h = height

        // Scale down if larger than maxSizePx
        if (w > maxSizePx || h > maxSizePx) {
          if (w > h) { h = Math.round((h / w) * maxSizePx); w = maxSizePx }
          else { w = Math.round((w / h) * maxSizePx); h = maxSizePx }
        }

        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0, w, h)

        // Start at target quality, reduce if still too big
        let q = quality
        const tryEncode = () => {
          const dataUrl = canvas.toDataURL("image/jpeg", q)
          const approxKB = Math.round((dataUrl.length * 0.75) / 1024)
          if (approxKB > 900 && q > 0.5) {
            q -= 0.1
            tryEncode()
          } else {
            resolve(dataUrl)
          }
        }
        tryEncode()
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function TransactionModal() {
  const { transactionModalOpen, editingTransactionId, prefillDate, closeTransactionModal } = useUIStore()
  const qc = useQueryClient()
  const [sources, setSources] = useState<Source[]>([])
  const [editData, setEditData] = useState<Transaction | null>(null)
  const [aiSuggestion, setAiSuggestion] = useState<{ sourceId: string; sourceName: string; sourceEmoji: string; confidence: string } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Receipt scanner state
  const [scanState, setScanState] = useState<"idle" | "compressing" | "scanning" | "done" | "error">("idle")
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [scanPreview, setScanPreview] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string>("")
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

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
  const watchSourceId = watch("source_id")
  const watchDescription = watch("description")

  const fetchSuggestion = useCallback(async (desc: string, type: string, srcs: Source[]) => {
    if (desc.trim().length < 3 || !srcs.length) { setAiSuggestion(null); return }
    setAiLoading(true)
    try {
      const filtered = srcs.filter((s) => s.type === type || s.type === "both")
      const res = await fetch("/api/suggest-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc, type, sources: filtered.map((s) => ({ id: s.id, name: s.name, emoji: s.emoji })) }),
      })
      const json = await res.json()
      if (json.sourceId) setAiSuggestion(json)
      else setAiSuggestion(null)
    } catch {
      setAiSuggestion(null)
    } finally {
      setAiLoading(false)
    }
  }, [])

  useEffect(() => {
    if (editingTransactionId) { setAiSuggestion(null); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setAiSuggestion(null)
    debounceRef.current = setTimeout(() => {
      if (watchDescription) fetchSuggestion(watchDescription, watchType, sources)
    }, 650)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDescription, watchType])

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
    if (transactionModalOpen) {
      load()
      setScanState("idle")
      setScanResult(null)
      setScanPreview(null)
      setScanError("")
    }
  }, [transactionModalOpen, editingTransactionId, reset, prefillDate])

  async function handleReceiptFile(file: File) {
    if (!file.type.startsWith("image/") && !file.name.match(/\.(heic|heif)$/i)) {
      toast.error("Lütfen bir görüntü dosyası seçin")
      return
    }

    setScanState("compressing")
    setScanResult(null)
    setScanError("")

    try {
      // Client-side compress: resize to max 1600px, JPEG ~88% quality → ~300-600KB
      const compressed = await compressImage(file)
      setScanPreview(compressed)
      setScanState("scanning")

      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: compressed, mimeType: "image/jpeg" }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Sunucu hatası" }))
        throw new Error(err.error || "Tarama başarısız")
      }

      const result = await res.json() as ScanResult
      setScanResult(result)
      setScanState("done")
    } catch (err) {
      console.error(err)
      const msg = err instanceof Error ? err.message : "Fiş taranamadı"
      setScanError(msg)
      setScanState("error")
    }
  }

  function applyScanResult() {
    if (!scanResult) return

    // Fill form fields
    if (scanResult.amount !== null && scanResult.amount > 0) {
      setValue("amount", scanResult.amount)
    }
    if (scanResult.description) {
      setValue("description", scanResult.description)
    }
    if (scanResult.date) {
      setValue("occurred_on", scanResult.date)
    }
    setValue("type", "expense")
    setValue("status", "completed")

    // Auto-match source: try description first, then category keywords
    const expenseSources = sources.filter((s) => s.type === "expense" || s.type === "both")
    if (expenseSources.length > 0 && scanResult.category) {
      const catLower = scanResult.category.toLowerCase()
      const descLower = (scanResult.description || "").toLowerCase()

      // Keyword maps for Turkish categories
      const categoryKeywords: Record<string, string[]> = {
        "market": ["market", "bakkal", "manav", "migros", "bim", "a101", "şok", "carrefour", "metro", "kiler", "hakmar"],
        "restoran/kafe": ["restoran", "kafe", "restaurant", "cafe", "starbucks", "mcdonald", "burger", "pizza", "yemek", "lokanta"],
        "fatura": ["fatura", "elektrik", "su", "gaz", "internet", "telefon", "turkcell", "vodafone", "turk telekom"],
        "ulaşım": ["benzin", "akaryakıt", "otopark", "taksi", "shell", "opet", "bp", "total"],
        "sağlık": ["eczane", "hastane", "klinik", "optik", "pharmacy"],
        "giyim": ["mavi", "lcw", "lc waikiki", "zara", "h&m", "koton", "boyner", "giyim", "ayakkabı"],
        "elektronik": ["teknosa", "mediamarkt", "saturn", "vatan", "elektronik"],
      }

      const keywords = categoryKeywords[catLower] || []
      const matched = expenseSources.find((s) => {
        const sName = s.name.toLowerCase()
        return keywords.some((k) => sName.includes(k) || descLower.includes(k)) ||
          sName.includes(catLower) ||
          catLower.includes(sName)
      })

      if (matched) setValue("source_id", matched.id)
    }

    setScanState("idle")
    setScanPreview(null)
    setScanResult(null)
    toast.success("Fiş bilgileri aktarıldı")
  }

  function dismissScan() {
    setScanState("idle")
    setScanPreview(null)
    setScanResult(null)
    setScanError("")
  }

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

          {/* Sheet container */}
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
                    <div className="flex items-center gap-2">
                      {/* Receipt scan — only for new transactions */}
                      {!editingTransactionId && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            title="Kamerayla çek"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all border border-purple-500/25 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40"
                          >
                            <Camera className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Kamera</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            title="Galeriden seç"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all border border-purple-500/25 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40"
                          >
                            <ImageIcon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Galeri</span>
                          </button>
                        </div>
                      )}
                      <button
                        onClick={closeTransactionModal}
                        className="h-8 w-8 rounded-full bg-white/[0.07] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.12] transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Camera input — forces device camera on mobile */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleReceiptFile(f); e.target.value = "" }}
                  />
                  {/* Gallery input — opens photo library */}
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*,image/heic,image/heif"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleReceiptFile(f); e.target.value = "" }}
                  />

                  {/* Scanner overlay */}
                  <AnimatePresence>
                    {scanState !== "idle" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        className="overflow-hidden mb-4"
                      >
                        <div
                          className="rounded-[16px] border overflow-hidden"
                          style={{
                            borderColor: scanState === "done" ? "rgba(34,197,94,0.25)" : scanState === "error" ? "rgba(239,68,68,0.25)" : "rgba(168,85,247,0.25)",
                            background: scanState === "done" ? "rgba(34,197,94,0.05)" : scanState === "error" ? "rgba(239,68,68,0.05)" : "rgba(168,85,247,0.05)",
                          }}
                        >
                          <div className="p-3.5">

                            {/* Compressing */}
                            {scanState === "compressing" && (
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-[10px] bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                                  <ScanLine className="h-5 w-5 text-purple-400 animate-pulse" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-purple-300">Görüntü hazırlanıyor...</p>
                                  <p className="text-[11px] text-white/30 mt-0.5">Boyut optimize ediliyor</p>
                                </div>
                              </div>
                            )}

                            {/* Scanning */}
                            {scanState === "scanning" && (
                              <div className="flex items-center gap-3">
                                {scanPreview && (
                                  <div className="h-14 w-14 rounded-[10px] overflow-hidden flex-shrink-0 border border-white/10">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={scanPreview} alt="Fiş" className="h-full w-full object-cover" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <ScanLine className="h-4 w-4 text-purple-400 animate-pulse" />
                                    <span className="text-sm font-semibold text-purple-300">Fiş okunuyor...</span>
                                  </div>
                                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <motion.div
                                      className="h-full rounded-full bg-purple-500"
                                      animate={{ width: ["5%", "65%", "88%"] }}
                                      transition={{ duration: 8, ease: "easeOut" }}
                                    />
                                  </div>
                                  <p className="text-[11px] text-white/30 mt-1.5">Tutar, tarih ve kategori tespit ediliyor</p>
                                </div>
                                <button onClick={dismissScan} className="h-6 w-6 rounded-full flex items-center justify-center text-white/25 hover:text-white/50 transition-all flex-shrink-0">
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}

                            {/* Done */}
                            {scanState === "done" && scanResult && (
                              <div className="flex items-start gap-3">
                                {scanPreview && (
                                  <div className="h-16 w-16 rounded-[10px] overflow-hidden flex-shrink-0 border border-white/10">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={scanPreview} alt="Fiş" className="h-full w-full object-cover" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <CheckCheck className="h-4 w-4 text-green-400 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-green-400">Fiş okundu</span>
                                  </div>
                                  <div className="space-y-0.5">
                                    {scanResult.amount !== null && (
                                      <p className="text-xs text-white/60">
                                        <span className="text-white/35">Tutar: </span>
                                        <span className="font-mono font-semibold text-white/90">
                                          {scanResult.amount?.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                                        </span>
                                      </p>
                                    )}
                                    {scanResult.description && (
                                      <p className="text-xs text-white/60 truncate">
                                        <span className="text-white/35">Yer: </span>
                                        <span className="text-white/80">{scanResult.description}</span>
                                      </p>
                                    )}
                                    {scanResult.category && (
                                      <p className="text-xs text-white/60">
                                        <span className="text-white/35">Kategori: </span>
                                        <span className="text-white/80">{scanResult.category}</span>
                                      </p>
                                    )}
                                    {scanResult.date && (
                                      <p className="text-xs text-white/60">
                                        <span className="text-white/35">Tarih: </span>
                                        <span className="text-white/80">{scanResult.date}</span>
                                      </p>
                                    )}
                                    {scanResult.amount === null && (
                                      <p className="text-xs text-orange-400">Tutar okunamadı — lütfen manuel girin</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1.5 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={applyScanResult}
                                    className="px-3 py-1.5 rounded-[9px] text-xs font-semibold bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/25 transition-all"
                                  >
                                    Uygula
                                  </button>
                                  <button
                                    type="button"
                                    onClick={dismissScan}
                                    className="px-3 py-1.5 rounded-[9px] text-xs font-medium text-white/30 hover:text-white/50 transition-all"
                                  >
                                    İptal
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Error */}
                            {scanState === "error" && (
                              <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-[10px] bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <AlertCircle className="h-4.5 w-4.5 text-red-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-red-400">Fiş okunamadı</p>
                                  <p className="text-[11px] text-white/35 mt-0.5 leading-relaxed">
                                    {scanError || "Daha net, iyi aydınlatılmış bir fotoğraf deneyin"}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1.5 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => { dismissScan(); galleryInputRef.current?.click() }}
                                    className="px-2.5 py-1.5 rounded-[9px] text-xs font-semibold bg-white/[0.06] text-white/50 hover:bg-white/10 transition-all"
                                  >
                                    Tekrar
                                  </button>
                                  <button onClick={dismissScan} className="px-2.5 py-1.5 rounded-[9px] text-xs text-white/25 hover:text-white/50 transition-all">
                                    Kapat
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Type + Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                <SourceIcon emoji={src.emoji} className="h-5 w-5" />
                                <span className="text-[10px] text-white/50 leading-tight line-clamp-1">{src.name}</span>
                              </button>
                            ))}
                          </div>
                        )} />
                      </div>
                    )}

                    {/* Description + Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Input label="Açıklama" placeholder="Açıklama..." {...register("description")} />
                        <AnimatePresence>
                          {(aiLoading || (aiSuggestion && !watchSourceId)) && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, y: -4, height: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden"
                            >
                              {aiLoading ? (
                                <div className="flex items-center gap-1.5 px-2 py-1">
                                  <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
                                  <span className="text-[11px] text-white/30">Kategori öneriliyor...</span>
                                </div>
                              ) : aiSuggestion ? (
                                <button
                                  type="button"
                                  onClick={() => { setValue("source_id", aiSuggestion.sourceId); setAiSuggestion(null) }}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-purple-500/10 transition-colors group"
                                >
                                  <Sparkles className="h-3 w-3 text-purple-400 flex-shrink-0" />
                                  <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">
                                    <span className="mr-0.5">{aiSuggestion.sourceEmoji}</span>
                                    <span className="font-medium text-purple-300">{aiSuggestion.sourceName}</span>
                                    <span className="ml-1">önerildi — seç</span>
                                  </span>
                                </button>
                              ) : null}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
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
