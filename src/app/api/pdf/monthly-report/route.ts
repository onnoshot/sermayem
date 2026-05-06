import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { isPro } from "@/lib/premium"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns"
import { tr } from "date-fns/locale"

export const maxDuration = 60

// GET /api/pdf/monthly-report?year=2026&month=4
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const pro = await isPro()
  if (!pro) return NextResponse.json({ error: "Pro üyelik gerekli" }, { status: 403 })

  const url = new URL(request.url)
  const now = new Date()
  const targetDate = subMonths(now, 1) // default: previous month

  const year = parseInt(url.searchParams.get("year") ?? String(targetDate.getFullYear()))
  const month = parseInt(url.searchParams.get("month") ?? String(targetDate.getMonth() + 1))

  const periodStart = startOfMonth(new Date(year, month - 1)).toISOString().split("T")[0]
  const periodEnd = endOfMonth(new Date(year, month - 1)).toISOString().split("T")[0]
  const monthLabel = format(new Date(year, month - 1), "MMMM yyyy", { locale: tr })

  const [{ data: profileData }, { data: txData }, { data: receiptsData }] = await Promise.all([
    supabase.from("profiles").select("full_name, currency").eq("id", user.id).single(),
    supabase.from("transactions")
      .select("*, source:sources(name, emoji)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("occurred_on", periodStart)
      .lte("occurred_on", periodEnd)
      .order("occurred_on", { ascending: true }),
    supabase.from("receipts")
      .select("id, transaction_id, storage_path, created_at")
      .eq("user_id", user.id)
      .gte("created_at", `${periodStart}T00:00:00Z`)
      .lte("created_at", `${periodEnd}T23:59:59Z`),
  ])

  const currency = profileData?.currency ?? "TRY"
  const fullName = profileData?.full_name ?? user.email ?? "Kullanıcı"
  const transactions = txData ?? []
  const receipts = receiptsData ?? []

  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const net = income - expense

  // Category breakdown
  const categoryMap: Record<string, number> = {}
  for (const tx of transactions.filter(t => t.type === "expense")) {
    const cat = (tx.source as { name: string } | null)?.name ?? "Diğer"
    categoryMap[cat] = (categoryMap[cat] ?? 0) + tx.amount
  }
  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])

  // Build PDF
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const PAGE_W = 595.28  // A4 pt
  const PAGE_H = 841.89
  const MARGIN = 48
  const COL_W = PAGE_W - MARGIN * 2

  let page = pdfDoc.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN

  function fmt(amount: number) {
    return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " " + currency
  }

  function drawText(text: string, x: number, yPos: number, size = 10, bold = false, color = rgb(0.1, 0.1, 0.1)) {
    page.drawText(text, { x, y: yPos, size, font: bold ? fontBold : font, color })
  }

  function drawLine(yPos: number, opacity = 0.15) {
    page.drawLine({ start: { x: MARGIN, y: yPos }, end: { x: PAGE_W - MARGIN, y: yPos }, thickness: 0.5, color: rgb(0, 0, 0), opacity })
  }

  function ensureSpace(needed: number) {
    if (y - needed < MARGIN + 40) {
      page = pdfDoc.addPage([PAGE_W, PAGE_H])
      y = PAGE_H - MARGIN
    }
  }

  // Header bar
  page.drawRectangle({ x: 0, y: PAGE_H - 80, width: PAGE_W, height: 80, color: rgb(0.898, 0, 0.004) })
  drawText("SERMAYEM", MARGIN, PAGE_H - 32, 18, true, rgb(1, 1, 1))
  drawText("Aylık Muhasebe Raporu", MARGIN, PAGE_H - 52, 11, false, rgb(1, 1, 1))
  drawText(monthLabel, PAGE_W - MARGIN - font.widthOfTextAtSize(monthLabel, 11), PAGE_H - 48, 11, false, rgb(1, 1, 1))

  y = PAGE_H - 104

  // User + period info
  drawText(fullName, MARGIN, y, 13, true)
  y -= 18
  drawText(`Dönem: ${periodStart} — ${periodEnd}`, MARGIN, y, 9, false, rgb(0.4, 0.4, 0.4))
  drawText(`Oluşturulma: ${format(new Date(), "dd.MM.yyyy HH:mm")}`, PAGE_W - MARGIN - 160, y, 9, false, rgb(0.4, 0.4, 0.4))
  y -= 24
  drawLine(y)
  y -= 20

  // Summary cards (3 columns)
  const cardW = (COL_W - 16) / 3
  const summaryData = [
    { label: "Toplam Gelir", value: fmt(income), color: rgb(0.13, 0.77, 0.37) },
    { label: "Toplam Gider", value: fmt(expense), color: rgb(0.9, 0.2, 0.2) },
    { label: "Net Bakiye", value: fmt(net), color: net >= 0 ? rgb(0.13, 0.77, 0.37) : rgb(0.9, 0.2, 0.2) },
  ]

  for (let i = 0; i < summaryData.length; i++) {
    const x = MARGIN + i * (cardW + 8)
    page.drawRectangle({ x, y: y - 50, width: cardW, height: 58, color: rgb(0.97, 0.97, 0.97), borderColor: rgb(0.88, 0.88, 0.88), borderWidth: 0.5 })
    drawText(summaryData[i].label, x + 10, y - 18, 8, false, rgb(0.5, 0.5, 0.5))
    const valSize = summaryData[i].value.length > 14 ? 10 : 12
    drawText(summaryData[i].value, x + 10, y - 36, valSize, true, summaryData[i].color)
  }
  y -= 70

  // Category breakdown
  if (categories.length > 0) {
    ensureSpace(20 + categories.length * 22 + 30)
    drawText("Kategori Dağılımı", MARGIN, y, 12, true)
    y -= 16
    drawLine(y)
    y -= 14

    for (const [cat, amt] of categories) {
      ensureSpace(22)
      const pct = expense > 0 ? Math.round((amt / expense) * 100) : 0
      drawText(cat, MARGIN, y, 9)
      const amtStr = fmt(amt)
      drawText(amtStr, PAGE_W - MARGIN - font.widthOfTextAtSize(amtStr, 9) - 48, y, 9, true)
      drawText(`%${pct}`, PAGE_W - MARGIN - 36, y, 9, false, rgb(0.5, 0.5, 0.5))

      // mini bar
      const barMaxW = 80
      const barW = Math.max(2, (pct / 100) * barMaxW)
      page.drawRectangle({ x: PAGE_W - MARGIN - 36 - barMaxW - 8, y: y - 1, width: barMaxW, height: 4, color: rgb(0.9, 0.9, 0.9) })
      page.drawRectangle({ x: PAGE_W - MARGIN - 36 - barMaxW - 8, y: y - 1, width: barW, height: 4, color: rgb(0.898, 0, 0.004) })

      y -= 18
    }
    y -= 10
  }

  // Transaction list
  if (transactions.length > 0) {
    ensureSpace(40)
    drawText("İşlem Listesi", MARGIN, y, 12, true)
    y -= 16
    drawLine(y)
    y -= 14

    // Header row
    drawText("Tarih", MARGIN, y, 8, true, rgb(0.5, 0.5, 0.5))
    drawText("Açıklama", MARGIN + 60, y, 8, true, rgb(0.5, 0.5, 0.5))
    drawText("Kategori", MARGIN + 260, y, 8, true, rgb(0.5, 0.5, 0.5))
    drawText("Tutar", PAGE_W - MARGIN - 60, y, 8, true, rgb(0.5, 0.5, 0.5))
    y -= 12
    drawLine(y, 0.08)
    y -= 12

    for (const tx of transactions) {
      ensureSpace(18)
      const isIncome = tx.type === "income"
      const dateStr = format(new Date(tx.occurred_on), "dd.MM")
      const desc = (tx.description ?? "—").substring(0, 30)
      const srcName = ((tx.source as { name: string } | null)?.name ?? "—").substring(0, 20)
      const amtStr = (isIncome ? "+" : "-") + fmt(tx.amount)

      drawText(dateStr, MARGIN, y, 8)
      drawText(desc, MARGIN + 60, y, 8)
      drawText(srcName, MARGIN + 260, y, 8, false, rgb(0.45, 0.45, 0.45))
      drawText(amtStr, PAGE_W - MARGIN - font.widthOfTextAtSize(amtStr, 8), y, 8, true, isIncome ? rgb(0.13, 0.77, 0.37) : rgb(0.9, 0.2, 0.2))
      y -= 16
    }
    y -= 8
  }

  // Receipts count note
  if (receipts.length > 0) {
    ensureSpace(30)
    drawLine(y)
    y -= 16
    drawText(`Bu döneme ait ${receipts.length} fiş/fatura kaydedilmiştir.`, MARGIN, y, 9, false, rgb(0.4, 0.4, 0.4))
    y -= 14
  }

  // Footer
  const lastPage = pdfDoc.getPages().at(-1)!
  lastPage.drawText(
    `Sermayem.com — ${format(new Date(), "dd.MM.yyyy")} tarihinde oluşturuldu`,
    { x: MARGIN, y: 24, size: 7, font, color: rgb(0.65, 0.65, 0.65) }
  )
  lastPage.drawText(
    `Sayfa ${pdfDoc.getPageCount()}/${pdfDoc.getPageCount()}`,
    { x: PAGE_W - MARGIN - 50, y: 24, size: 7, font, color: rgb(0.65, 0.65, 0.65) }
  )

  const pdfBytes = await pdfDoc.save()

  const filename = `sermayem-rapor-${year}-${String(month).padStart(2, "0")}.pdf`

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdfBytes.byteLength),
    },
  })
}
