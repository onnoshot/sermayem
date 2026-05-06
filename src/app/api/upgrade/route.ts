import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// POST /api/upgrade — marks the current user as Pro.
// TODO: Before going live, gate this behind verified payment
// (Stripe webhook or checkout session verification).
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Set plan to 'pro' with no expiry (lifetime)
  const { error } = await supabase
    .from("user_plans")
    .upsert(
      {
        user_id: user.id,
        plan: "pro",
        status: "active",
        // Lifetime: set pro_until 100 years from now
        pro_until: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "user_id" }
    )

  if (error) {
    console.error("upgrade error:", error)
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
