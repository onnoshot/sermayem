import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AmbientBackground } from "@/components/ambient-background"
import { Sidebar } from "@/components/shared/sidebar"
import { AppShell } from "@/components/shared/app-shell"
import { TutorialModal } from "@/components/tutorial-modal"
import { ProUpgradeModal } from "@/components/premium/pro-upgrade-modal"
import { getUserPlan, isProPlan } from "@/lib/premium"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profile }, plan] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    getUserPlan(),
  ])

  if (profile && !profile.onboarded_at) redirect("/onboarding")

  const pro = isProPlan(plan)

  return (
    <div className="h-screen flex overflow-hidden">
      <AmbientBackground />
      <Sidebar profile={profile} isPro={pro} />
      <AppShell>{children}</AppShell>
      <TutorialModal />
      {!pro && <ProUpgradeModal />}
    </div>
  )
}
