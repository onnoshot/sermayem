import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { GoalsManager } from "@/components/goals/goals-manager"
import type { SavingsGoal, Currency } from "@/types/database"
import { Target } from "lucide-react"

export const metadata = { title: "Hedefler" }

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profileData }, { data: goalsData }] = await Promise.all([
    supabase.from("profiles").select("currency").eq("id", user.id).single(),
    supabase.from("savings_goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ])

  const currency = ((profileData?.currency) || "TRY") as Currency
  const goals = (goalsData || []) as SavingsGoal[]

  return (
    <StaggerChildren className="space-y-6">
      <StaggerItem>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[12px] bg-green-500/15 flex items-center justify-center">
            <Target className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Hedefler</h1>
            <p className="text-sm text-white/40">Tasarruf hedeflerini belirle ve takip et</p>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <GoalsManager goals={goals} currency={currency} />
      </StaggerItem>
    </StaggerChildren>
  )
}
