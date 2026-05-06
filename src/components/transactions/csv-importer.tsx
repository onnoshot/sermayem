"use client"

import { useState, useRef, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Upload, FileText, X, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import { GlassSurface } from "@/components/ui/glass-surface"
import { Button } from "@/components/ui/button"
import { SourceIcon } from "@/components/sources/source-icon"
import type { Source, Currency } from "@/types/database"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Props {
  sources: Source[]
  currency: Currency
}

interface ParsedRow {
  id: string
  date: string
  description: string
  amount: number
  type: "income" | "expense"
  source_id: string
  valid: boolean
  error?: string
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split(/\r?\n/)
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const rows = lines.slice(1).map((line) => {
    const cols: string[] = []
    let cur = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') { inQuotes = !inQuotes }
      else if (ch === "," && !inQuotes) { cols.push(cur.trim()); cur = "" }
      else cur += ch
    }
    cols.push(cur.trim())
    return cols
  })
  return { headers, rows }
}

function detectColumn(headers: string[], patterns: string[]): number {
  for (const pat of patterns) {
    const idx = headers.findIndex((h) => h.toLowerCase().includes(pat.toLowerCase()))
    if (idx !== -1) return idx
  }
  return -1
}

export function CsvImporter({ sources, currency }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [colMap, setColMap] = useState({ date: -1, description: -1, amount: -1, type: -1 })
  const [headers, setHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<string[][]>([])
  const [defaultSource, setDefaultSource] = useState("")
  const [defaultType, setDefaultType] = useState<"income" | "expense">("expense")
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)

  function processFile(file: File) {
    if (!file.name.endsWith(".csv")) { toast.error("Sadece CSV dosyaları desteklenir"); return }
    setDone(false)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { headers: h, rows: r } = parseCSV(text)
      setHeaders(h)
      setRawRows(r)
      setFileName(file.name)

      const dateIdx = detectColumn(h, ["tarih", "date", "işlem tarihi", "transaction date"])
      const descIdx = detectColumn(h, ["açıklama", "description", "tanım", "narration", "memo", "açıklama/narration"])
      const amountIdx = detectColumn(h, ["tutar", "amount", "miktar", "borç", "alacak", "debit", "credit"])
      const typeIdx = detectColumn(h, ["tür", "type", "işlem türü"])

      const newColMap = { date: dateIdx, description: descIdx, amount: amountIdx, type: typeIdx }
      setColMap(newColMap)
      buildRows(h, r, newColMap, defaultSource, defaultType)
    }
    reader.readAsText(file, "utf-8")
  }

  function buildRows(
    h: string[], r: string[][],
    cm: typeof colMap,
    srcId: string,
    defType: "income" | "expense"
  ) {
    const parsed: ParsedRow[] = r
      .filter((row) => row.some((c) => c.trim()))
      .map((row, i) => {
        const rawDate = cm.date >= 0 ? row[cm.date] : ""
        const rawDesc = cm.description >= 0 ? row[cm.description] : ""
        const rawAmount = cm.amount >= 0 ? row[cm.amount] : ""
        const rawType = cm.type >= 0 ? row[cm.type] : ""

        const cleanAmount = rawAmount.replace(/[^\d.,-]/g, "").replace(",", ".")
        const amount = parseFloat(cleanAmount)

        const typeFromCol = rawType.toLowerCase().includes("gelir") || rawType.toLowerCase().includes("income")
          ? "income"
          : rawType.toLowerCase().includes("gider") || rawType.toLowerCase().includes("expense")
          ? "expense"
          : defType

        const dateMatch = rawDate.match(/(\d{2})[./](\d{2})[./](\d{4})/) || rawDate.match(/(\d{4})-(\d{2})-(\d{2})/)
        let isoDate = ""
        if (dateMatch) {
          if (rawDate.match(/\d{4}-\d{2}-\d{2}/)) {
            isoDate = rawDate.split("T")[0]
          } else {
            isoDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`
          }
        }

        const valid = !!isoDate && !isNaN(amount) && amount > 0 && !!srcId
        return {
          id: `row-${i}`,
          date: isoDate,
          description: rawDesc || `İşlem ${i + 1}`,
          amount: isNaN(amount) ? 0 : Math.abs(amount),
          type: typeFromCol,
          source_id: srcId,
          valid,
          error: !isoDate ? "Tarih okunamadı" : isNaN(amount) || amount <= 0 ? "Tutar geçersiz" : !srcId ? "Kaynak seçilmeli" : undefined,
        }
      })
    setRows(parsed)
  }

  function recompute(newColMap = colMap, newSrc = defaultSource, newType = defaultType) {
    buildRows(headers, rawRows, newColMap, newSrc, newType)
  }

  function removeRow(id: string) {
    setRows((r) => r.filter((row) => row.id !== id))
  }

  async function importRows() {
    const valid = rows.filter((r) => r.valid)
    if (valid.length === 0) { toast.error("İçe aktarılacak geçerli satır yok"); return }
    setImporting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setImporting(false); return }

    const inserts = valid.map((row) => ({
      user_id: user.id,
      source_id: row.source_id,
      type: row.type,
      amount: row.amount,
      description: row.description,
      occurred_on: row.date,
      status: "completed" as const,
      currency,
    }))

    const { error } = await supabase.from("transactions").insert(inserts)
    if (error) { toast.error("İçe aktarma başarısız: " + error.message); setImporting(false); return }
    toast.success(`${valid.length} işlem başarıyla içe aktarıldı`)
    setImporting(false)
    setDone(true)
    setRows([])
    setFileName(null)
    startTransition(() => router.refresh())
  }

  const validCount = rows.filter((r) => r.valid).length
  const invalidCount = rows.filter((r) => !r.valid).length

  if (done) {
    return (
      <GlassSurface className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-green-500/15 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">İçe Aktarma Tamamlandı</p>
            <p className="text-sm text-white/40 mt-1">İşlemler başarıyla kaydedildi.</p>
          </div>
          <Button variant="ghost" onClick={() => setDone(false)}>Yeni Dosya Yükle</Button>
        </div>
      </GlassSurface>
    )
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <GlassSurface className="p-4">
        <p className="text-xs text-white/50 leading-relaxed">
          CSV dosyanızda en az <span className="text-white/70 font-medium">tarih</span>, <span className="text-white/70 font-medium">açıklama</span> ve <span className="text-white/70 font-medium">tutar</span> sütunları olmalıdır.
          Türkçe ve İngilizce sütun başlıkları otomatik tanınır. İlk satır başlık satırı olarak kabul edilir.
        </p>
      </GlassSurface>

      {/* Drop zone */}
      {!fileName && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f) }}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-[20px] p-10 flex flex-col items-center gap-3 cursor-pointer transition-all",
            dragging ? "border-[#E50001]/60 bg-[#E50001]/[0.05]" : "border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02]"
          )}
        >
          <div className="h-14 w-14 rounded-2xl bg-white/[0.06] flex items-center justify-center">
            <Upload className="h-7 w-7 text-white/40" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white/60">CSV dosyanızı buraya sürükleyin</p>
            <p className="text-xs text-white/30 mt-1">veya tıklayarak seçin</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
        </div>
      )}

      {/* File loaded */}
      {fileName && (
        <>
          <GlassSurface className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[12px] bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/80 truncate">{fileName}</p>
                <p className="text-xs text-white/35">{rows.length} satır bulundu</p>
              </div>
              <button
                onClick={() => { setFileName(null); setRows([]); setHeaders([]); setRawRows([]) }}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </GlassSurface>

          {/* Column + source mapping */}
          <GlassSurface className="p-4 space-y-4">
            <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Ayarlar</p>

            {/* Default type */}
            <div>
              <p className="text-[11px] text-white/40 mb-2">Varsayılan İşlem Türü</p>
              <div className="flex gap-2">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setDefaultType(t); recompute(colMap, defaultSource, t) }}
                    className={cn(
                      "flex-1 py-2 rounded-[10px] text-xs font-semibold transition-all border",
                      defaultType === t
                        ? t === "expense" ? "bg-red-500/15 border-red-500/30 text-red-400" : "bg-green-500/15 border-green-500/30 text-green-400"
                        : "bg-white/[0.04] border-white/[0.07] text-white/40 hover:bg-white/[0.07]"
                    )}
                  >
                    {t === "expense" ? "Gider" : "Gelir"}
                  </button>
                ))}
              </div>
            </div>

            {/* Default source */}
            <div>
              <p className="text-[11px] text-white/40 mb-2">Kaynak Kategori</p>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {sources.map((src) => (
                  <button
                    key={src.id}
                    onClick={() => { setDefaultSource(src.id); recompute(colMap, src.id, defaultType) }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-[12px] border text-center transition-all",
                      defaultSource === src.id
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
            </div>
          </GlassSurface>

          {/* Summary */}
          {rows.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <GlassSurface className="p-3 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-[10px] bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40">Geçerli</p>
                  <p className="text-base font-bold text-green-400">{validCount}</p>
                </div>
              </GlassSurface>
              <GlassSurface className="p-3 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-[10px] bg-red-500/15 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40">Hatalı</p>
                  <p className="text-base font-bold text-red-400">{invalidCount}</p>
                </div>
              </GlassSurface>
            </div>
          )}

          {/* Preview rows */}
          {rows.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/40 px-1">Önizleme (ilk 20 satır)</p>
              <AnimatePresence initial={false}>
                {rows.slice(0, 20).map((row) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <GlassSurface className={cn("p-3", !row.valid && "border border-red-500/20 bg-red-500/[0.03]")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-2 w-2 rounded-full flex-shrink-0", row.valid ? "bg-green-400" : "bg-red-400")} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-white/70 truncate">{row.description}</p>
                            <p className={cn("text-xs font-semibold flex-shrink-0", row.type === "income" ? "text-green-400" : "text-red-400")}>
                              {row.type === "income" ? "+" : "-"}{row.amount.toLocaleString("tr-TR")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] text-white/30">{row.date || "Tarih yok"}</p>
                            {row.error && <p className="text-[10px] text-red-400">{row.error}</p>}
                          </div>
                        </div>
                        <button onClick={() => removeRow(row.id)} className="h-6 w-6 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 transition-all flex-shrink-0">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </GlassSurface>
                  </motion.div>
                ))}
              </AnimatePresence>
              {rows.length > 20 && (
                <p className="text-xs text-white/30 text-center py-2">+{rows.length - 20} satır daha</p>
              )}
            </div>
          )}

          {/* Import button */}
          {validCount > 0 && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              loading={importing}
              onClick={importRows}
            >
              {validCount} İşlemi İçe Aktar
            </Button>
          )}
        </>
      )}
    </div>
  )
}
