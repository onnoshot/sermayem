import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

const ADMIN_EMAIL = "onurxvala@gmail.com"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { userId, pro } = await req.json() as { userId: string; pro: boolean }
  if (!userId) return NextResponse.json({ error: "userId gerekli" }, { status: 400 })

  const admin = createAdminClient()

  if (pro) {
    const { error } = await admin.from("user_plans").upsert({
      user_id: userId,
      plan: "pro",
      status: "active",
      pro_until: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: "user_id" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await admin.from("user_plans").upsert({
      user_id: userId,
      plan: "free",
      status: "active",
      pro_until: null,
    }, { onConflict: "user_id" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
