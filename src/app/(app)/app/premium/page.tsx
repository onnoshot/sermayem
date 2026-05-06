import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserPlan, isProPlan } from "@/lib/premium"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { PremiumContent } from "@/components/premium/premium-content"
import { Crown } from "lucide-react"

export const metadata = { title: "Pro Üyelik" }

export default async function PremiumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const plan = await getUserPlan()
  const pro = isProPlan(plan)

  return (
    <StaggerChildren className="space-y-6">
      <StaggerItem>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[12px] bg-yellow-500/15 flex items-center justify-center">
            <Crown className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pro Üyelik</h1>
            <p className="text-sm text-white/40">Finansal yönetimini bir üst seviyeye taşı</p>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <PremiumContent isPro={pro} plan={plan} />
      </StaggerItem>
    </StaggerChildren>
  )
}
