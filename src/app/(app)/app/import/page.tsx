import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"
import { CsvImporter } from "@/components/transactions/csv-importer"
import type { Source, Currency } from "@/types/database"
import { Upload } from "lucide-react"

export const metadata = { title: "CSV İçe Aktar" }

export default async function ImportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profileData }, { data: srcData }] = await Promise.all([
    supabase.from("profiles").select("currency").eq("id", user.id).single(),
    supabase.from("sources").select("*").eq("user_id", user.id).eq("archived", false),
  ])

  const currency = ((profileData?.currency) || "TRY") as Currency
  const sources = (srcData || []) as Source[]

  return (
    <StaggerChildren className="space-y-6">
      <StaggerItem>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[12px] bg-purple-500/15 flex items-center justify-center">
            <Upload className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">CSV İçe Aktar</h1>
            <p className="text-sm text-white/40">Banka ekstrenizi yükleyerek işlemlerinizi aktarın</p>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <CsvImporter sources={sources} currency={currency} />
      </StaggerItem>
    </StaggerChildren>
  )
}
