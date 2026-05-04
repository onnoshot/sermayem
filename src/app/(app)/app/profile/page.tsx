import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { User } from "lucide-react"
import { ProfileForm } from "@/components/profile/profile-form"

export const metadata = { title: "Profil" }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <StaggerChildren>
      <StaggerItem>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-[12px] bg-slate-500/15 flex items-center justify-center">
            <User className="h-5 w-5 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Profil</h1>
        </div>
      </StaggerItem>
      <StaggerItem>
        <ProfileForm profile={profile} userEmail={user.email || ""} />
      </StaggerItem>
    </StaggerChildren>
  )
}
