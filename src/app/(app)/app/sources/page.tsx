import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { Layers } from "lucide-react"
import { SourcesGrid } from "@/components/sources/sources-grid"

export const metadata = { title: "Kaynaklar" }

export default async function SourcesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: sources } = await supabase.from("sources").select("*").eq("user_id", user.id).order("name")

  return (
    <StaggerChildren>
      <StaggerItem>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-[12px] bg-indigo-500/15 flex items-center justify-center">
            <Layers className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Kaynaklar</h1>
            <p className="text-sm text-white/40">Gelir ve gider kaynaklarını yönet</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-6 p-4 rounded-[16px] border border-indigo-500/15 bg-indigo-500/[0.06]">
          <div className="flex gap-3">
            <div className="text-xl flex-shrink-0 mt-0.5">💡</div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white/80">Kaynak nedir?</p>
              <p className="text-sm text-white/45 leading-relaxed">
                Kaynaklar, gelir ve giderlerini gruplamak için kullandığın etiketlerdir — örneğin <span className="text-white/65 font-medium">Maaş</span>, <span className="text-white/65 font-medium">Kira</span> veya <span className="text-white/65 font-medium">Market</span>. İşlem eklerken bir kaynak seçersen hem listelerde hem analizlerde o işlem o kaynağa bağlı görünür, böylece paranın nereye gittiğini kategoriye göre takip edebilirsin.
              </p>
            </div>
          </div>
        </div>
      </StaggerItem>
      <StaggerItem>
        <SourcesGrid sources={sources || []} />
      </StaggerItem>
    </StaggerChildren>
  )
}
