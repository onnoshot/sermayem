"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

const features = [
  { icon: "💰", title: "Gelir & Gider", desc: "Tüm hareketler tek ekranda" },
  { icon: "⏰", title: "Bekleyenler", desc: "Vadeyi asla kaçırma" },
  { icon: "📊", title: "Analiz", desc: "Para nereye gidiyor?" },
]

const stats = [
  { value: "₺0", label: "aylık ücret" },
  { value: "100%", label: "gizlilik" },
  { value: "∞", label: "işlem" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08080C] flex overflow-hidden relative">

      {/* Animated background orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[#08080C]" />
        <motion.div
          className="absolute -top-[25%] -left-[20%] h-[800px] w-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(234,179,8,0.10), transparent 65%)" }}
          animate={{ x: [0, 70, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-[25%] -right-[20%] h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(217,119,6,0.12), transparent 65%)" }}
          animate={{ x: [0, -60, 0], y: [0, -50, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] left-[30%] h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.05), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
      </div>

      {/* ── DESKTOP LEFT PANEL ── */}
      <motion.div
        className="hidden lg:flex w-[500px] xl:w-[560px] flex-shrink-0 flex-col justify-between p-14 border-r border-white/[0.05] relative"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="h-10 w-10 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-white/[0.06] overflow-hidden"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.2 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="S" className="h-7 w-7 object-contain" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.4 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sermayem.svg" alt="Sermayem" className="h-5 object-contain" />
          </motion.div>
        </div>

        <div className="space-y-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="text-[2.8rem] xl:text-5xl font-black text-white leading-[1.12] tracking-tight">
              Sermayeni{" "}
              <span style={{ background: "linear-gradient(135deg, #EAB308, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>akıllıca</span>{" "}
              yönet.
            </h1>
            <p className="text-[15px] text-white/45 mt-5 leading-relaxed">
              Gelir, gider ve bekleyen ödemelerin tek bir panelde. Finansal özgürlüğe giden yolda rehberin.
            </p>
          </motion.div>

          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div key={f.title} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]"
                initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center text-lg flex-shrink-0">{f.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="grid grid-cols-3 gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.92, duration: 0.5 }}>
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-2xl font-black text-yellow-400 leading-none">{s.value}</p>
                <p className="text-[11px] text-white/30 mt-1.5 text-center">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.p className="text-xs text-white/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          © 2026 Sermayem. Tüm hakları saklıdır.
        </motion.p>
      </motion.div>

      {/* ── MOBILE + RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col lg:items-center lg:justify-center lg:p-12 relative">

        {/* ── MOBILE HERO (lg:hidden) ── */}
        <div className="lg:hidden flex flex-col px-5 pt-10 pb-2">

          {/* Logo row */}
          <motion.div className="flex items-center gap-2.5 mb-8"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="h-9 w-9 rounded-[11px] flex items-center justify-center bg-white/[0.06] overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.svg" alt="S" className="h-6 w-6 object-contain" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sermayem.svg" alt="Sermayem" className="h-5 object-contain" />
            </motion.div>
          </motion.div>

          {/* Headline */}
          <motion.div className="mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[2rem] font-black text-white leading-[1.1] tracking-tight">
              Sermayeni{" "}
              <span style={{ background: "linear-gradient(135deg, #EAB308, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                akıllıca
              </span>{" "}
              yönet.
            </h1>
            <p className="text-sm text-white/40 mt-2 leading-relaxed">
              Gelir, gider, bekleyenler — tek panelde, her an cebinde.
            </p>
          </motion.div>

          {/* Feature cards — horizontal */}
          <div className="flex gap-2.5 mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="flex-shrink-0 w-[120px] p-3 rounded-[16px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm"
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.28 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-[11px] font-semibold text-white/80 leading-tight">{f.title}</p>
                <p className="text-[10px] text-white/35 mt-0.5 leading-tight">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <motion.div className="grid grid-cols-3 gap-2 mb-7"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-3 rounded-[14px] bg-white/[0.04] border border-white/[0.07]">
                <p className="text-xl font-black text-yellow-400 leading-none">{s.value}</p>
                <p className="text-[10px] text-white/30 mt-1 text-center">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── FORM ── */}
        <motion.div
          className="w-full lg:max-w-[400px] px-5 pb-10 lg:px-0 lg:pb-0"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>

        <p className="text-[11px] text-white/15 mt-6 mb-4 text-center lg:hidden">© 2026 Sermayem</p>
      </div>
    </div>
  )
}
