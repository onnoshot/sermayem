"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  type: "income" | "expense" | "all"
  className?: string
}

export function ExportButton({ type, className }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch(`/api/export?type=${type}`)
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "export.csv"
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all",
        "bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/75 border border-white/[0.07]",
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Download className="h-3.5 w-3.5" />
      {loading ? "İndiriliyor..." : "CSV İndir"}
    </button>
  )
}
