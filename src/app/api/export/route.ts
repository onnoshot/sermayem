import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") // "income" | "expense" | "all"

  let query = supabase
    .from("transactions")
    .select("*, source:sources(name, emoji, type, color)")
    .eq("user_id", user.id)
    .order("occurred_on", { ascending: false })

  if (type === "income") query = query.eq("type", "income")
  else if (type === "expense") query = query.eq("type", "expense")

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = data || []

  const header = ["Tarih", "Tür", "Kategori", "Açıklama", "Tutar", "Durum", "Notlar"]
  const csvRows = rows.map((tx) => [
    tx.occurred_on,
    tx.type === "income" ? "Gelir" : "Gider",
    (tx.source as { name: string } | null)?.name ?? "",
    `"${(tx.description ?? "").replace(/"/g, '""')}"`,
    tx.amount,
    tx.status === "completed" ? "Tamamlandı" : "Bekliyor",
    `"${(tx.notes ?? "").replace(/"/g, '""')}"`,
  ])

  const csv = [header, ...csvRows].map((r) => r.join(",")).join("\n")

  const filename = `sermayem-${type ?? "islemler"}-${new Date().toISOString().split("T")[0]}.csv`

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
