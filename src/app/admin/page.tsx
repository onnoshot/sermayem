import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { formatCurrencyCompact } from "@/lib/format"
import { Users, TrendingUp, Calendar, Activity } from "lucide-react"
import { AvatarIcon } from "@/components/ui/avatar-icon"

export const metadata = { title: "Admin" }

const ADMIN_EMAIL = "onurxvala@gmail.com"

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className="p-5 rounded-[18px] border border-white/[0.07] bg-white/[0.03]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
        <div className="h-8 w-8 rounded-[10px] flex items-center justify-center" style={{ background: color + "20" }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      {sub && <p className="text-xs text-white/35 mt-1">{sub}</p>}
    </div>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (authUser?.email !== ADMIN_EMAIL) redirect("/app")

  const admin = createAdminClient()

  const [
    { data: { users: authUsers } },
    { data: profiles },
    { data: transactions },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from("profiles").select("*").order("created_at", { ascending: false }),
    admin.from("transactions").select("user_id, amount, type, status, created_at"),
  ])

  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const totalUsers = authUsers?.length || 0
  const usersThisMonth = authUsers?.filter(u => new Date(u.created_at) >= thisMonth).length || 0
  const usersLastMonth = authUsers?.filter(u => {
    const d = new Date(u.created_at)
    return d >= lastMonth && d < thisMonth
  }).length || 0

  const activeUserIds = new Set(transactions?.map(t => t.user_id))
  const activeUsers = activeUserIds.size

  const totalVolume = transactions?.reduce((a, t) => a + Number(t.amount), 0) || 0

  const userMap = new Map<string, {
    email: string
    created_at: string
    txCount: number
    totalVolume: number
    profile?: typeof profiles extends (infer T)[] | null ? T : never
  }>()

  authUsers?.forEach(u => {
    userMap.set(u.id, {
      email: u.email || "",
      created_at: u.created_at,
      txCount: 0,
      totalVolume: 0,
    })
  })

  transactions?.forEach(t => {
    const entry = userMap.get(t.user_id)
    if (entry) {
      entry.txCount++
      entry.totalVolume += Number(t.amount)
    }
  })

  profiles?.forEach(p => {
    const entry = userMap.get(p.id)
    if (entry) {
      (entry as typeof entry & { profile: typeof p }).profile = p
    }
  })

  const userList = Array.from(userMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })
  }

  const genderLabels: Record<string, string> = {
    erkek: "Erkek",
    kadin: "Kadın",
    belirtmek_istemiyorum: "Belirtmedi",
  }

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-[12px] bg-[#E50001]/15 flex items-center justify-center">
            <Activity className="h-5 w-5 text-[#E50001]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-sm text-white/40">Sermayem kullanıcı verileri</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard icon={Users} label="Toplam Kullanıcı" value={totalUsers} sub={`+${usersLastMonth} geçen ay`} color="#E50001" />
          <StatCard icon={Calendar} label="Bu Ay Kayıt" value={usersThisMonth} sub="yeni kullanıcı" color="#8B5CF6" />
          <StatCard icon={Activity} label="Aktif Kullanıcı" value={activeUsers} sub="işlem yaptı" color="#22C55E" />
          <StatCard icon={TrendingUp} label="Toplam Hacim" value={formatCurrencyCompact(totalVolume, "TRY")} sub="tüm işlemler" color="#3B82F6" />
        </div>

        {/* User table */}
        <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white/80">Kullanıcılar ({totalUsers})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {["Kullanıcı", "E-posta", "Yaş", "Cinsiyet", "Şehir", "Para Birimi", "İşlem", "Hacim", "Kayıt Tarihi"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] text-white/30 font-medium uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userList.map((u, i) => {
                  const p = (u as typeof u & { profile?: typeof profiles extends (infer T)[] | null ? T : never }).profile
                  return (
                    <tr key={u.email} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <AvatarIcon id={p?.avatar_emoji} size="sm" />
                          <span className="text-sm text-white/80 font-medium truncate max-w-[120px]">
                            {p?.full_name || "İsimsiz"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-white/50">{u.email}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{p?.age || "-"}</td>
                      <td className="px-4 py-3 text-xs text-white/50">{p?.gender ? genderLabels[p.gender] : "-"}</td>
                      <td className="px-4 py-3 text-xs text-white/50">{p?.city || "-"}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60">
                          {p?.currency || "TRY"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/70 tabular-nums">{u.txCount}</td>
                      <td className="px-4 py-3 text-sm tabular-nums text-white/70">
                        {u.totalVolume > 0 ? formatCurrencyCompact(u.totalVolume, (p?.currency as "TRY") || "TRY") : "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">{fmtDate(u.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {userList.length === 0 && (
              <div className="py-16 text-center text-white/25 text-sm">Henüz kullanıcı yok</div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-white/15 mt-6">Sadece admin görebilir</p>
      </div>
    </div>
  )
}
