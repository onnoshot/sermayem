"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useRef } from "react"

const MOCK_TXS = [
  { emoji: "💼", name: "Maaş", amount: "+45.000", pos: true },
  { emoji: "🏠", name: "Kira", amount: "-12.000", pos: false },
  { emoji: "🛒", name: "Market", amount: "-2.340", pos: false },
  { emoji: "⚡", name: "Elektrik", amount: "-850", pos: false },
]

const FEATURES = [
  {
    icon: "📊",
    title: "Anlık Gelir-Gider Takibi",
    desc: "Her işlemini anında kaydet. Kategori ve kaynak bazında nereye ne harcadığını gerçek zamanlı gör.",
    bg: "rgba(34,197,94,0.055)",
    border: "rgba(34,197,94,0.14)",
    glow: "rgba(34,197,94,0.08)",
  },
  {
    icon: "📅",
    title: "Bekleyen Ödemeler Takvimi",
    desc: "Kira, fatura, taksit — tüm bekleyen ödemelerini takvimde takip et. Vadeyi asla kaçırma.",
    bg: "rgba(168,85,247,0.055)",
    border: "rgba(168,85,247,0.14)",
    glow: "rgba(168,85,247,0.08)",
  },
  {
    icon: "🎯",
    title: "Hedef ve İlerleme Takibi",
    desc: "Aylık gelir ve tasarruf hedefleri koy. Görsel ilerleme çubuğuyla motivasyonunu canlı tut.",
    bg: "rgba(59,130,246,0.055)",
    border: "rgba(59,130,246,0.14)",
    glow: "rgba(59,130,246,0.08)",
  },
  {
    icon: "📈",
    title: "Akıllı Analiz ve Raporlar",
    desc: "Kaynak bazlı pasta grafikler, aylık trendler ve harcama kırılımlarıyla finansal resmin tamamını gör.",
    bg: "rgba(249,115,22,0.055)",
    border: "rgba(249,115,22,0.14)",
    glow: "rgba(249,115,22,0.08)",
  },
]

const SECURITY = [
  { icon: "🔒", title: "256-bit AES Şifreleme", desc: "Tüm verileriniz uçtan uca şifrelenerek saklanır." },
  { icon: "🚫", title: "Sıfır Veri Paylaşımı", desc: "Verileriniz hiçbir üçüncü tarafla kesinlikle paylaşılmaz." },
  { icon: "🛡️", title: "Supabase Altyapısı", desc: "Dünya standartlarında güvenlik ve yedekleme altyapısı." },
  { icon: "🇹🇷", title: "Türkiye'de Geliştiriliyor", desc: "Türk kullanıcılar için Türk geliştiriciler tarafından yapılıyor." },
]

const CHART_BARS = [28, 44, 32, 58, 42, 68, 52, 78, 60, 88, 72, 100]

function ProductMockup() {
  return (
    <div className="relative w-full" style={{ height: "clamp(380px, 50vw, 540px)", maxHeight: "540px" }}>

      {/* Main balance card */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0"
        style={{ right: "clamp(32px, 8%, 48px)" }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="p-5 sm:p-6 rounded-[22px]"
          style={{
            background: "linear-gradient(145deg, rgba(18,18,30,0.99), rgba(10,10,20,0.99))",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.18em] mb-1.5">Net Bakiye</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[1.9rem] sm:text-[2.2rem] font-black text-white leading-none">142.850</span>
                <span className="text-base font-semibold text-white/28">TL</span>
              </div>
            </div>
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-[12px] flex items-center justify-center text-lg"
              style={{ background: "rgba(229,0,1,0.12)", border: "1px solid rgba(229,0,1,0.2)" }}>
              💰
            </div>
          </div>

          <div className="space-y-2.5 mb-4">
            {[
              { label: "Gelir", value: "+89.2K TL", color: "#4ADE80", ratio: 66 },
              { label: "Gider", value: "-46.3K TL", color: "#F87171", ratio: 34 },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: bar.color }} />
                    <span className="text-[11px] text-white/35">{bar.label}</span>
                  </div>
                  <span className="text-[11px] font-semibold tabular-nums" style={{ color: bar.color }}>{bar.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: bar.label === "Gelir" ? "linear-gradient(90deg,#22C55E,#4ADE80)" : "linear-gradient(90deg,#EF4444,#F87171)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.ratio}%` }}
                    transition={{ delay: 0.9, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Chart bars */}
          <div className="flex items-end gap-[3px] h-8">
            {CHART_BARS.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-[3px]"
                style={{ transformOrigin: "bottom", height: `${h}%`, background: i >= 10 ? "#E50001" : "rgba(229,0,1,0.18)" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.0 + i * 0.04, duration: 0.5, ease: "easeOut" }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Transactions card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20"
        style={{ bottom: "clamp(16px, 4%, 24px)", right: 0, width: "clamp(155px, 42%, 200px)" }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="p-3 sm:p-3.5 rounded-[16px]"
          style={{
            background: "rgba(8,8,16,0.99)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <p className="text-[9px] sm:text-[10px] text-white/25 mb-2 uppercase tracking-wider">Son İşlemler</p>
          <div className="space-y-1.5 sm:space-y-2">
            {MOCK_TXS.slice(0, 3).map((t) => (
              <div key={t.name} className="flex items-center gap-1.5">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-[6px] bg-white/[0.05] flex items-center justify-center text-[10px] flex-shrink-0">{t.emoji}</div>
                <span className="text-[9px] sm:text-[10px] text-white/50 flex-1 truncate">{t.name}</span>
                <span className="text-[9px] sm:text-[10px] font-semibold tabular-nums" style={{ color: t.pos ? "#4ADE80" : "#F87171" }}>{t.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Pending badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 280, damping: 22 }}
        className="absolute z-30"
        style={{ top: "-10px", right: "clamp(36px, 12%, 60px)" }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="px-2.5 py-1.5 rounded-[9px] flex items-center gap-2"
          style={{
            background: "rgba(10,10,18,0.95)",
            border: "1px solid rgba(168,85,247,0.25)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-medium text-purple-300/75 whitespace-nowrap">3 bekleyen ödeme</span>
        </motion.div>
      </motion.div>

      {/* Goal progress badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-30"
        style={{ bottom: 0, left: 0 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="px-2.5 py-2 rounded-[12px] flex items-center gap-2"
          style={{
            background: "rgba(8,8,16,0.97)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="h-6 w-6 rounded-[7px] bg-green-500/15 flex items-center justify-center text-xs flex-shrink-0">📈</div>
          <div>
            <p className="text-[9px] text-white/25 leading-none mb-0.5">Aylık hedef</p>
            <p className="text-[11px] sm:text-[12px] font-bold text-green-400 whitespace-nowrap">72% tamamlandı</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -40])

  return (
    <main className="min-h-screen bg-[#08080C] text-white overflow-x-hidden">

      {/* ─── Animated background ─── */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-[25%] -left-[20%] h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(229,0,1,0.08), transparent 65%)" }}
          animate={{ x: [0, 70, 0], y: [0, 45, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-[20%] -right-[15%] h-[650px] w-[650px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(185,28,28,0.07), transparent 65%)" }}
          animate={{ x: [0, -55, 0], y: [0, -38, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* ─── Sticky header ─── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(8,8,12,0.88)", backdropFilter: "blur(28px)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sermayem.svg" alt="Sermayem" className="h-[20px] sm:h-[22px] object-contain" />

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/45">
            <a href="#ozellikler" className="hover:text-white/75 transition-colors">Özellikler</a>
            <a href="#guvenlik" className="hover:text-white/75 transition-colors">Güvenlik</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/auth/login"
              className="hidden sm:flex text-sm text-white/45 hover:text-white/75 transition-colors px-3 py-2">
              Giriş Yap
            </Link>
            <Link href="/auth/signup"
              className="flex items-center gap-1.5 text-[13px] sm:text-sm font-bold text-white px-3.5 sm:px-4 py-2 rounded-[11px] transition-all active:scale-[0.96]"
              style={{ background: "linear-gradient(135deg,#E50001,#B91C1C)", boxShadow: "0 0 20px rgba(229,0,1,0.28)" }}>
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 lg:pt-20 pb-10 lg:pb-16">
        <motion.div style={{ opacity: heroOpacity, y: heroY }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

            {/* Left — text */}
            <div>
              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/[0.07] mb-5"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400/85 font-medium">256-bit şifreleme ile korunuyor</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.17, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="text-[2.2rem] sm:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] font-black leading-[1.06] tracking-tight mb-4"
              >
                Paranın nereye gittiğini{" "}
                <span style={{ background: "linear-gradient(135deg,#E50001,#FF4040)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  artık biliyorsun.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.27, duration: 0.6 }}
                className="text-[15px] sm:text-[16px] text-white/42 leading-relaxed mb-7 max-w-[480px]"
              >
                Gelir, gider ve birikimini tek panelde yönet. Sermaye oluştur, hedeflerine ulaş.
                Tamamen ücretsiz, sınırsız kullanım.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <Link href="/auth/signup"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-[14px] font-bold text-white text-[15px] transition-all active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg,#E50001,#CC0001)",
                    boxShadow: "0 0 36px rgba(229,0,1,0.38), 0 4px 20px rgba(0,0,0,0.5)",
                  }}>
                  Ücretsiz Hesap Oluştur <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/auth/login"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-[14px] font-semibold text-white/65 text-[15px] border border-white/[0.09] bg-white/[0.04] hover:bg-white/[0.07] hover:text-white/85 transition-all">
                  Giriş Yap
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.48 }}
                className="flex items-center gap-3 sm:gap-5 flex-wrap"
              >
                {[
                  { icon: "🔒", text: "Güvenli" },
                  { icon: "💳", text: "Kart gerekmez" },
                  { icon: "∞", text: "Sınırsız işlem" },
                  { icon: "0₺", text: "Ücretsiz" },
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/30">
                    <span className="text-sm">{t.icon}</span>
                    <span>{t.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Product mockup desktop */}
            <div className="hidden lg:block">
              <ProductMockup />
            </div>
          </div>

          {/* Mobile mockup */}
          <div className="lg:hidden mt-10 px-2">
            <ProductMockup />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex justify-center mt-10 sm:mt-14"
        >
          <motion.a
            href="#ozellikler"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/18 hover:text-white/40 transition-colors"
          >
            <span className="text-[10px] uppercase tracking-widest">Keşfet</span>
            <ChevronDown className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="ozellikler" className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs text-[#E50001] font-bold uppercase tracking-[0.22em] mb-3">Özellikler</p>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.8rem] font-black text-white tracking-tight mb-4">
            Her şey tek bir yerde
          </h2>
          <p className="text-white/38 text-[15px] max-w-[420px] mx-auto leading-relaxed">
            Finansal sağlığını takip etmek için ihtiyacın olan her araç, tek çatı altında.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="relative p-5 sm:p-7 rounded-[22px] overflow-hidden"
              style={{
                background: f.bg,
                border: `1px solid ${f.border}`,
                boxShadow: `0 0 40px ${f.glow}`,
              }}
            >
              <div className="text-3xl mb-3.5">{f.icon}</div>
              <h3 className="text-[16px] sm:text-[17px] font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/48 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SECURITY ─── */}
      <section id="guvenlik" className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-10 lg:p-14"
          style={{
            background: "linear-gradient(145deg, rgba(18,18,30,0.98), rgba(10,10,20,0.99))",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(229,0,1,0.07), transparent 70%)" }} />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(34,197,94,0.05), transparent 70%)" }} />

          <div className="relative">
            <div className="flex items-center gap-3 mb-7">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-[12px] bg-green-500/15 border border-green-500/20 flex items-center justify-center text-xl flex-shrink-0">🔒</div>
              <div>
                <p className="text-xs text-green-400/65 uppercase tracking-[0.18em] font-medium mb-0.5">Güvenlik</p>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Verileriniz güvende</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECURITY.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="flex items-start gap-3 p-4 sm:p-5 rounded-[16px]"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{s.icon}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-white/85 mb-0.5">{s.title}</p>
                    <p className="text-xs text-white/42 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-center rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 lg:p-16 overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(229,0,1,0.08), rgba(185,28,28,0.04), transparent)",
            border: "1px solid rgba(229,0,1,0.14)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(229,0,1,0.06), transparent 70%)" }} />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-[3rem] font-black text-white tracking-tight mb-4">
              Finansal özgürlüğe{" "}
              <span style={{ background: "linear-gradient(135deg,#E50001,#FF4040)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                bir adım kal.
              </span>
            </h2>
            <p className="text-white/38 text-[15px] mb-7 max-w-[340px] mx-auto leading-relaxed">
              Hesap oluşturmak ücretsiz. Kredi kartı gerekmez. Hemen başla.
            </p>
            <Link href="/auth/signup"
              className="inline-flex items-center gap-2 px-7 sm:px-10 py-3.5 sm:py-4 rounded-[15px] font-bold text-white text-[15px] sm:text-[16px] transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg,#E50001,#CC0001)",
                boxShadow: "0 0 56px rgba(229,0,1,0.45), 0 8px 32px rgba(0,0,0,0.5)",
              }}>
              Hemen Başla
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-[11px] text-white/22 mt-4">Sınırsız işlem kayıt. Tamamen ücretsiz. Her zaman.</p>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.05] py-7 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sermayem.svg" alt="Sermayem" className="h-5 object-contain" />
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-white/28 flex-wrap justify-center">
            <a href="#ozellikler" className="hover:text-white/55 transition-colors">Özellikler</a>
            <a href="#guvenlik" className="hover:text-white/55 transition-colors">Güvenlik</a>
            <Link href="/auth/login" className="hover:text-white/55 transition-colors">Giriş Yap</Link>
            <Link href="/auth/signup" className="hover:text-white/55 transition-colors">Kayıt Ol</Link>
          </div>
          <p className="text-[11px] text-white/18">2026 Sermayem. Tüm hakları saklıdır.</p>
        </div>
      </footer>

    </main>
  )
}
