"use client"
import { motion } from "framer-motion"

const MOBILE_CHIPS = [
  { icon: "🔒", label: "256-bit güvenlik" },
  { icon: "📊", label: "Anlık takip" },
  { icon: "💡", label: "Tamamen ücretsiz" },
  { icon: "🎯", label: "Net görünüm" },
]

const DESKTOP_STATS = [
  { value: "0 TL", label: "aylık ücret" },
  { value: "🔒", label: "256-bit şifreleme" },
  { value: "∞", label: "sınırsız işlem" },
]

const MOCK_TXS = [
  { emoji: "💼", name: "Maaş", amount: "+45.000", pos: true },
  { emoji: "🏠", name: "Kira", amount: "-12.000", pos: false },
  { emoji: "🛒", name: "Market", amount: "-2.340", pos: false },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-h-dvh bg-[#08080C] relative">

      {/* Background orbs — clipped inside this container */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-[30%] -left-[20%] h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(229,0,1,0.07), transparent 65%)" }}
          animate={{ x: [0, 50, 0], y: [0, 35, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(185,28,28,0.08), transparent 65%)" }}
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
      </div>

      {/* Layout — column on mobile, row on desktop */}
      <div className="flex min-h-screen min-h-dvh flex-col lg:flex-row">

        {/* ─── DESKTOP LEFT PANEL (lg+) ─── */}
        <motion.div
          className="hidden lg:flex w-[500px] xl:w-[560px] flex-shrink-0 flex-col justify-between p-12 xl:p-14 border-r border-white/[0.05] sticky top-0 h-screen"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sermayem.svg" alt="Sermayem" className="h-7 object-contain" />
          </motion.div>

          <div className="space-y-9">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-[2.6rem] xl:text-[3rem] font-black text-white leading-[1.07] tracking-tight">
                Paranın nereye gittiğini{" "}
                <span style={{ background: "linear-gradient(135deg, #E50001, #FF3333)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  artık biliyorsun.
                </span>
              </h1>
              <p className="text-[14px] text-white/40 mt-4 leading-relaxed">
                Gelir, gider ve birikimini tek panelde yönet.<br />
                Sermaye oluştur. Finansal özgürlüğüne ulaş.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/20 bg-green-500/[0.07]">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400/80 font-medium">256-bit AES şifreleme ile korunuyor</span>
              </div>
            </motion.div>

            {/* Product mockup */}
            <motion.div
              className="relative h-[280px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="absolute top-0 left-0 right-10 p-5 rounded-[20px] border border-white/[0.08] z-10"
                style={{
                  background: "linear-gradient(135deg, rgba(20,20,28,0.97), rgba(12,12,18,0.99))",
                  backdropFilter: "blur(40px)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-1.5">Toplam Bakiye</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[1.9rem] font-black text-white leading-none">142.850</span>
                      <span className="text-sm font-semibold text-white/35">TL</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-[12px] flex items-center justify-center text-xl"
                    style={{ background: "rgba(229,0,1,0.12)", border: "1px solid rgba(229,0,1,0.22)" }}>
                    💰
                  </div>
                </div>
                <div className="flex gap-5 mb-4">
                  {[
                    { label: "Gelir", value: "+89.2K TL", color: "#4ADE80" },
                    { label: "Gider", value: "-46.3K TL", color: "#F87171" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-[11px] text-white/35">{item.label}</span>
                      <span className="text-[11px] font-semibold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-end gap-[3px] h-8">
                  {[35, 55, 42, 72, 50, 83, 62, 90, 68, 100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-[3px]"
                      style={{ height: `${h}%`, background: i >= 8 ? "#E50001" : "rgba(229,0,1,0.2)" }} />
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-0 right-0 w-[200px] p-3.5 rounded-[16px] border border-white/[0.07] z-20"
                style={{
                  background: "rgba(10,10,16,0.97)",
                  backdropFilter: "blur(40px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <p className="text-[10px] text-white/25 mb-2 uppercase tracking-wider">Son İşlemler</p>
                <div className="space-y-2">
                  {MOCK_TXS.map((t) => (
                    <div key={t.name} className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-[8px] bg-white/[0.05] flex items-center justify-center text-xs flex-shrink-0">{t.emoji}</div>
                      <span className="text-[11px] text-white/50 flex-1 truncate">{t.name}</span>
                      <span className="text-[11px] font-semibold tabular-nums" style={{ color: t.pos ? "#4ADE80" : "#F87171" }}>{t.amount}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-3 right-12 px-2.5 py-1.5 rounded-[9px] border border-purple-500/25 flex items-center gap-2 z-30"
                style={{ background: "rgba(10,10,15,0.92)", backdropFilter: "blur(20px)" }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[11px] font-medium text-purple-300/70">3 bekleyen ödeme</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
            >
              {DESKTOP_STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-xl font-black leading-none" style={{ color: "#E50001" }}>{s.value}</p>
                  <p className="text-[11px] text-white/30 mt-1.5 text-center">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-xs text-white/20">2026 Sermayem. Tüm hakları saklıdır.</p>
        </motion.div>

        {/* ─── MOBILE HEADER (below lg) ─── */}
        <div className="lg:hidden w-full px-5 pt-10 pb-4">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sermayem.svg" alt="Sermayem" className="h-6 object-contain" />
          </motion.div>

          {/* Feature chips — horizontal scroll */}
          <div className="w-full overflow-x-auto pb-1" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            <div className="flex gap-2 w-max">
              {MOBILE_CHIPS.map((f, i) => (
                <motion.span
                  key={f.label}
                  initial={{ opacity: 0, y: 10, scale: 0.93 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.04 + i * 0.07, type: "spring", stiffness: 300, damping: 22 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-white/[0.10] bg-white/[0.05] text-white/60 whitespace-nowrap"
                >
                  <span>{f.icon}</span>
                  {f.label}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Headline */}
          <motion.div
            className="mt-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[1.75rem] font-black text-white leading-[1.1] tracking-tight">
              Paranın nereye gittiğini{" "}
              <span style={{ background: "linear-gradient(135deg, #E50001, #FF3333)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                artık biliyorsun.
              </span>
            </h1>
            <p className="text-sm text-white/40 mt-2.5 leading-relaxed">
              Gelir, gider ve birikimini tek panelde yönet.
            </p>
          </motion.div>

          {/* Mini stats */}
          <motion.div
            className="grid grid-cols-3 gap-2 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4 }}
          >
            {[
              { v: "0 TL", l: "aylık ücret" },
              { v: "🔒", l: "şifreleme" },
              { v: "∞", l: "sınırsız" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col items-center py-2.5 rounded-[13px] bg-white/[0.04] border border-white/[0.07]">
                <p className="text-sm font-black leading-none" style={{ color: "#E50001" }}>{s.v}</p>
                <p className="text-[10px] text-white/30 mt-1 text-center leading-tight">{s.l}</p>
              </div>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-3 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.36 }}
          >
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[11px] text-white/25 font-medium">Hemen başla</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </motion.div>
        </div>

        {/* ─── FORM PANEL ─── */}
        <div className="flex-1 flex flex-col justify-start lg:justify-center lg:items-center lg:p-12 pb-8">
          <motion.div
            className="w-full lg:max-w-[400px] px-4 lg:px-0"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>

          <p className="text-[11px] text-white/15 mt-5 text-center lg:hidden pb-2">
            2026 Sermayem
          </p>
        </div>

      </div>
    </div>
  )
}
