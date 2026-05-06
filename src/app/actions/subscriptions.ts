"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function dismissSubscription(subKey: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from("dismissed_subscriptions").upsert(
    { user_id: user.id, sub_key: subKey },
    { onConflict: "user_id,sub_key" }
  )

  revalidatePath("/app/subscriptions")
}

export async function restoreAllSubscriptions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from("dismissed_subscriptions").delete().eq("user_id", user.id)

  revalidatePath("/app/subscriptions")
}
