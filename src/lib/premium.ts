import { createClient } from "@/lib/supabase/server"

export type Plan = "free" | "pro" | "business"

export interface UserPlan {
  plan: Plan
  status: string
  current_period_end: string | null
  cancel_at_period_end: boolean
  pro_until: string | null
}

export async function getUserPlan(): Promise<UserPlan> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return defaultFreePlan()

  const { data } = await supabase
    .from("user_plans")
    .select("plan, status, current_period_end, cancel_at_period_end, pro_until")
    .eq("user_id", user.id)
    .single()

  if (!data) return defaultFreePlan()
  return data as UserPlan
}

export async function isPro(): Promise<boolean> {
  const plan = await getUserPlan()
  return isProPlan(plan)
}

export function isProPlan(plan: UserPlan): boolean {
  if (plan.plan === "free") {
    // Check manual pro_until override
    if (plan.pro_until && new Date(plan.pro_until) > new Date()) return true
    return false
  }
  if (plan.status === "past_due") return false
  if (plan.status === "cancelled") {
    // Grace period: still pro until period end
    if (plan.current_period_end && new Date(plan.current_period_end) > new Date()) return true
    return false
  }
  return plan.plan === "pro" || plan.plan === "business"
}

function defaultFreePlan(): UserPlan {
  return {
    plan: "free",
    status: "active",
    current_period_end: null,
    cancel_at_period_end: false,
    pro_until: null,
  }
}
