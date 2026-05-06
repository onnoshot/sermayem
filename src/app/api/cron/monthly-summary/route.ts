import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { buildMonthlySummaryEmail } from "@/lib/email-template"

// Runs 1st of every month at 09:00 UTC via vercel.json cron schedule
export async function GET(req: NextRequest) {
  // Protect the endpoint — Vercel Cron sends CRON_SECRET as Authorization header
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Calculate last month's date range
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

  const monthStr = lastMonth.toISOString().split("T")[0].slice(0, 7) // "YYYY-MM"
  const from = `${monthStr}-01`
  const to = lastMonthEnd.toISOString().split("T")[0]
  const prevFrom = twoMonthsAgo.toISOString().split("T")[0].slice(0, 7) + "-01"
  const prevTo = new Date(now.getFullYear(), now.getMonth() - 1, 0).toISOString().split("T")[0]

  // Fetch all users with email_notifications not disabled
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .not("onboarded_at", "is", null)

  if (!profiles?.length) return NextResponse.json({ sent: 0 })

  let sent = 0
  const errors: string[] = []

  for (const profile of profiles) {
    try {
      // Fetch user email from auth.users via service role
      const { data: authUser } = await supabase.auth.admin.getUserById(profile.id)
      const email = authUser?.user?.email
      if (!email) continue

      // Fetch last month's transactions
      const { data: txs } = await supabase
        .from("transactions")
        .select("*, source:sources(name, emoji)")
        .eq("user_id", profile.id)
        .eq("status", "completed")
        .gte("occurred_on", from)
        .lte("occurred_on", to)

      if (!txs?.length) continue

      const income = txs.filter((t) => t.type === "income").reduce((a: number, t: { amount: number }) => a + t.amount, 0)
      const expense = txs.filter((t) => t.type === "expense").reduce((a: number, t: { amount: number }) => a + t.amount, 0)

      // Top categories by expense
      const catMap = new Map<string, { name: string; emoji: string; amount: number }>()
      for (const tx of txs.filter((t) => t.type === "expense")) {
        const key = tx.source?.name ?? "Diğer"
        const entry = catMap.get(key) ?? { name: key, emoji: tx.source?.emoji ?? "💸", amount: 0 }
        entry.amount += tx.amount
        catMap.set(key, entry)
      }
      const topCats = [...catMap.values()].sort((a, b) => b.amount - a.amount)

      // Previous month net for comparison
      const { data: prevTxs } = await supabase
        .from("transactions")
        .select("type, amount")
        .eq("user_id", profile.id)
        .eq("status", "completed")
        .gte("occurred_on", prevFrom)
        .lte("occurred_on", prevTo)

      let prevMonthNet: number | null = null
      if (prevTxs?.length) {
        const prevIncome = prevTxs.filter((t) => t.type === "income").reduce((a: number, t: { amount: number }) => a + t.amount, 0)
        const prevExpense = prevTxs.filter((t) => t.type === "expense").reduce((a: number, t: { amount: number }) => a + t.amount, 0)
        prevMonthNet = prevIncome - prevExpense
      }

      const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0

      const { subject, html } = buildMonthlySummaryEmail({
        firstName: profile.full_name?.split(" ")[0] || "Kullanıcı",
        year: lastMonth.getFullYear(),
        month: lastMonth.getMonth() + 1,
        totalIncome: income,
        totalExpense: expense,
        topCategories: topCats,
        savingsRate,
        prevMonthNet,
        currency: "TRY",
      })

      await resend.emails.send({
        from: "Sermayem <ozet@sermayem.com>",
        to: email,
        subject,
        html,
      })

      sent++
    } catch (err) {
      errors.push(`${profile.id}: ${String(err)}`)
    }
  }

  return NextResponse.json({ sent, errors: errors.length ? errors : undefined })
}
