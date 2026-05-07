"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  LayoutDashboard, TrendingUp, TrendingDown, BrainCircuit,
  FileText, BarChart3, Wallet, Target, Scan,
  ArrowRight, ChevronRight, CheckCircle2, Clock, Zap,
} from "lucide-react"

/* ─── Dashboard Mock ─── */
function DashboardMock() {
  return (
    <div className="rounded-[16px] overflow-hidden" style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.05]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9px] text-white/25 uppercase tracking-widest">Net Bakiye</p>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse" />
            <span className="text-[8px] text-white/20">Canlı</span>
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 mb-3">
          <motion.span
            className="text-3xl font-black text-white tabular-nums"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >142.850</motion.span>
          <span className="text-sm text-white/20">₺</span>
        </div>
        <div className="flex gap-3">
          {[
            { label: "Gelir", value: "+89.2K", pos: true },
            { label: "Gider", value: "-46.3K", pos: false },
            { label: "Net", value: "+42.9K", pos: true },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="flex-1 p-2 rounded-[8px] text-center"
              style={{ background: "rgba(255,255,255,0.03)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <p className="text-[7px] text-white/20 mb-0.5">{s.label}</p>
              <p
                className="text-[11px] font-bold tabular-nums"
                style={{ color: s.pos ? "rgba(74,222,128,0.75)" : "rgba(248,113,113,0.65)" }}
              >{s.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-1.5">
        <p className="text-[8px] text-white/20 uppercase tracking-wider mb-2">Son İşlemler</p>
        {[
          { name: "Maaş", cat: "Gelir", amt: "+45.000 ₺", pos: true, delay: 0.4 },
          { name: "Kira", cat: "Gider", amt: "-12.000 ₺", pos: false, delay: 0.5 },
          { name: "Migros", cat: "Market", amt: "-2.340 ₺", pos: false, delay: 0.6 },
          { name: "Fatura", cat: "Bekliyor", amt: "-850 ₺", pos: false, delay: 0.7 },
        ].map(({ name, cat, amt, pos, delay }) => (
          <motion.div
            key={name}
            className="flex items-center gap-2.5 py-1"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
          >
            <div
              className="h-7 w-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              {pos
                ? <TrendingUp className="h-3.5 w-3.5 text-white/35" strokeWidth={2} />
                : <TrendingDown className="h-3.5 w-3.5 text-white/20" strokeWidth={2} />
              }
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-white/70 font-medium">{name}</p>
              <p className="text-[9px] text-white/25">{cat}</p>
            </div>
            <p
              className="text-[11px] font-bold tabular-nums"
              style={{ color: pos ? "rgba(74,222,128,0.75)" : "rgba(255,255,255,0.32)" }}
            >{amt}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── AI Coach Mock ─── */
function AiCoachMock() {
  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.05] flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-[10px] flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <BrainCircuit className="h-5 w-5 text-white/50" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">AI Finansal Koç</p>
          <p className="text-[9px] text-white/30">Son 3 ay analiz edildi</p>
        </div>
        <div className="ml-auto">
          <motion.div
            className="relative h-11 w-11 flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
              <circle cx="22" cy="22" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <motion.circle
                cx="22" cy="22" r="16" fill="none"
                stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round"
                initial={{ strokeDasharray: "0 100.5" }}
                animate={{ strokeDasharray: "72.4 100.5" }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white/55">72</span>
          </motion.div>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {[
          { type: "good", text: "Yatırım gelirin %18 arttı, harika ilerleme!" },
          { type: "warn", text: "Eğlence harcamaların bütçeni %23 aşıyor." },
          { type: "tip", text: "Market alışverişi için aylık 3.500 bütçe önerilir." },
        ].map(({ type, text }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.12 }}
            className="flex items-start gap-2.5 p-2.5 rounded-[10px]"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)" }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full mt-[5px] flex-shrink-0"
              style={{
                background: type === "good"
                  ? "rgba(74,222,128,0.65)"
                  : "rgba(255,255,255,0.22)",
              }}
            />
            <p className="text-[10px] leading-relaxed text-white/45">{text}</p>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="pt-1"
        >
          <p className="text-[9px] text-white/20 mb-1.5">Aylık Tasarruf Potansiyeli</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "rgba(255,255,255,0.28)" }}
                initial={{ width: 0 }}
                animate={{ width: "64%" }}
                transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="text-[10px] font-bold text-white/45">+4.200 ₺</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Receipt Scan Mock ─── */
function ReceiptMock() {
  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.05]">
        <p className="text-[9px] text-white/25 uppercase tracking-wider mb-3">Fiş Tarama</p>
        <div
          className="relative h-28 rounded-[10px] overflow-hidden flex items-center justify-center mb-3"
          style={{ background: "rgba(229,0,1,0.04)", border: "1px dashed rgba(229,0,1,0.2)" }}
        >
          <div className="space-y-1 opacity-40 px-3">
            {["MIGROS MARKETLERİ", "━━━━━━━━━━━━━━━", "Süt 2L       × 2    64,98", "Ekmek              18,50", "━━━━━━━━━━━━━━━", "TOPLAM        83,48 TL"].map((line, i) => (
              <p key={i} className="text-[7px] font-mono text-white/60 text-center">{line}</p>
            ))}
          </div>
          <motion.div
            className="absolute left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, rgba(229,0,1,0.8), transparent)" }}
            animate={{ top: ["10%", "90%", "10%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
      <div className="p-4">
        <p className="text-[9px] text-white/20 mb-2">Okunan Veriler</p>
        <div className="space-y-1.5">
          {[
            { label: "İşletme", value: "Migros" },
            { label: "Tutar", value: "83,48 ₺" },
            { label: "Tarih", value: "07.05.2026" },
            { label: "Kategori", value: "Market" },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              className="flex items-center justify-between py-1 border-b border-white/[0.04]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.15 }}
            >
              <span className="text-[10px] text-white/35">{label}</span>
              <span className="text-[11px] font-semibold text-white/70">{value}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-3 flex items-center gap-2 p-2 rounded-[8px]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Scan className="h-3 w-3 text-white/35 flex-shrink-0" />
          <p className="text-[10px] text-white/38">İşlem otomatik dolduruldu</p>
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Budget Mock ─── */
function BudgetMock() {
  const cats = [
    { name: "Market", spent: 3200, limit: 4000, over: false },
    { name: "Ulaşım", spent: 1800, limit: 2000, over: false },
    { name: "Eğlence", spent: 2400, limit: 2000, over: true },
    { name: "Fatura", spent: 1200, limit: 1500, over: false },
  ]
  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.05] flex items-center gap-2">
        <Wallet className="h-4 w-4 text-white/35" />
        <p className="text-sm font-bold text-white">Mayıs Bütçesi</p>
        <span className="ml-auto text-[10px] text-white/25">2026</span>
      </div>
      <div className="p-4 space-y-3">
        {cats.map(({ name, spent, limit, over }, i) => {
          const pct = Math.min((spent / limit) * 100, 100)
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-white/60 font-medium">{name}</span>
                <span
                  className="text-[10px] font-semibold tabular-nums"
                  style={{ color: over ? "rgba(248,113,113,0.65)" : "rgba(255,255,255,0.32)" }}
                >
                  {spent.toLocaleString("tr-TR")} / {limit.toLocaleString("tr-TR")} ₺
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: over ? "rgba(248,113,113,0.45)" : "rgba(255,255,255,0.22)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Goals Mock ─── */
function GoalsMock() {
  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.05] flex items-center gap-2">
        <Target className="h-4 w-4 text-white/35" />
        <p className="text-sm font-bold text-white">Hedeflerim</p>
      </div>
      <div className="p-4 space-y-3">
        {[
          { name: "Araba", amount: "320.000", saved: "192.000", pct: 60, icon: "car" },
          { name: "Tatil", amount: "50.000", saved: "38.500", pct: 77, icon: "plane" },
          { name: "Acil Fon", amount: "100.000", saved: "54.000", pct: 54, icon: "bank" },
        ].map(({ name, amount, saved, pct, icon }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.12 }}
            className="flex items-center gap-3"
          >
            <div className="relative h-10 w-10 flex-shrink-0">
              <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
                <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle
                  cx="20" cy="20" r="14" fill="none"
                  stroke="rgba(255,255,255,0.32)" strokeWidth="3" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 88" }}
                  animate={{ strokeDasharray: `${(pct / 100) * 88} 88` }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center">
                {icon === "car" && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-white/35" fill="currentColor">
                    <path d="M9.5 5.5l-.9-2.7A1 1 0 007.65 2H4.35a1 1 0 00-.95.8L2.5 5.5H1v1l.5.5v1.5h1V8h7v.5h1V7l.5-.5V5.5H9.5zm-7 0l.75-2.25A.5.5 0 013.7 3h4.6a.5.5 0 01.45.25L9.5 5.5H2.5zm.75 1.5a.5.5 0 110-1 .5.5 0 010 1zm5.5 0a.5.5 0 110-1 .5.5 0 010 1z"/>
                  </svg>
                )}
                {icon === "plane" && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-white/35" fill="currentColor">
                    <path d="M11 5L7 3V1a1 1 0 00-2 0v2L1 5v1.5l4-1v2l-1.5 1V9.5L6 9l2.5.5V8.5L7 7.5v-2l4 1V5z"/>
                  </svg>
                )}
                {icon === "bank" && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-white/35" fill="currentColor">
                    <path d="M6 1L1 3.5V4.5h10V3.5L6 1zM2 5.5v3H3V5.5H2zm2.5 0v3H5.5V5.5H4.5zm2.5 0v3H8V5.5H7zm2.5 0v3H10.5V5.5H9.5zM1 9.5v1h10v-1H1z"/>
                  </svg>
                )}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-white/75">{name}</p>
                <p className="text-[10px] font-bold text-white/38">{pct}%</p>
              </div>
              <p className="text-[9px] text-white/30">{saved} / {amount} ₺</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Analytics Mock ─── */
function AnalyticsMock() {
  const months = ["O", "Ş", "M", "N", "M", "H"]
  const inc = [45, 48, 52, 47, 56, 61]
  const exp = [38, 41, 35, 43, 39, 42]
  const maxVal = 65
  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.05] flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-white/35" />
        <p className="text-sm font-bold text-white">Gelişmiş Analiz</p>
        <span className="ml-auto text-[9px] text-white/20">2026</span>
      </div>
      <div className="p-4">
        <div className="flex items-end gap-1.5 h-20 mb-3">
          {months.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex flex-col items-center gap-[2px]">
                <motion.div
                  className="w-full rounded-t-[3px]"
                  style={{ background: "rgba(255,255,255,0.28)" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(inc[i] / maxVal) * 72}px` }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                />
                <motion.div
                  className="w-full rounded-t-[3px]"
                  style={{ background: "rgba(255,255,255,0.10)" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(exp[i] / maxVal) * 72}px` }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-[7px] text-white/20">{m}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "En yüksek gelir", value: "Haz" },
            { label: "En yüksek gider", value: "Nis" },
            { label: "Trend", value: "+%8" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="text-center p-2 rounded-[8px]"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <p className="text-[7px] text-white/20 mb-0.5">{label}</p>
              <p className="text-[11px] font-bold text-white/45">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── PDF Mock ─── */
function PdfMock() {
  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.05] flex items-center gap-2">
        <FileText className="h-4 w-4 text-white/35" />
        <p className="text-sm font-bold text-white">PDF Raporlar</p>
      </div>
      <div className="p-4 space-y-2">
        {["Nisan 2026", "Mart 2026", "Şubat 2026", "Ocak 2026"].map((month, i) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-center justify-between px-3 py-2.5 rounded-[10px]"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-5 rounded-[4px] flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <FileText className="h-2.5 w-2.5 text-white/28" />
              </div>
              <span className="text-[11px] text-white/55">{month}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 text-[9px] text-white/35 font-medium px-2 py-1 rounded-[6px]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <ArrowRight className="h-2.5 w-2.5" />
              İndir
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Tab definitions ─── */
const DEMO_TABS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    title: "Her şey tek bakışta",
    desc: "Net bakiye, son işlemler, gelir/gider trendi: finansal durumunu anlık olarak takip et.",
    mock: DashboardMock,
    badge: null,
  },
  {
    id: "scan",
    label: "Fiş Tarama",
    icon: Scan,
    title: "Fişi çek, işlem hazır",
    desc: "Fotoğraf çek veya galeriden seç. AI saniyeler içinde tutarı, tarihi ve kategoriyi otomatik tanır.",
    mock: ReceiptMock,
    badge: null,
  },
  {
    id: "budget",
    label: "Bütçe",
    icon: Wallet,
    title: "Kategoriye göre bütçele",
    desc: "Market, ulaşım, eğlence gibi kategorilere aylık limit koy. Aşımları anında gör.",
    mock: BudgetMock,
    badge: null,
  },
  {
    id: "goals",
    label: "Hedefler",
    icon: Target,
    title: "Hayallerine bir adım yaklaş",
    desc: "Araba, ev, tatil: hedef koy, katkı ekle ve görsel ilerleme çubuğuyla motivasyonunu canlı tut.",
    mock: GoalsMock,
    badge: null,
  },
  {
    id: "ai",
    label: "AI Koç",
    icon: BrainCircuit,
    title: "Sana özel finansal koçluk",
    desc: "Son 3 ayın verilerini analiz ederek kişisel tasarruf önerileri, harcama uyarıları ve akıllı tavsiyeler sunar.",
    mock: AiCoachMock,
    badge: "PRO",
  },
  {
    id: "analytics",
    label: "Analiz",
    icon: BarChart3,
    title: "Derinlemesine analiz",
    desc: "Yıllık trendler, kategori bazlı kırılım, aylık karşılaştırma: verilerinin tüm hikayesini gör.",
    mock: AnalyticsMock,
    badge: "PRO",
  },
  {
    id: "pdf",
    label: "PDF Rapor",
    icon: FileText,
    title: "Muhasebe raporu indir",
    desc: "Her ay için tek tıkla PDF muhasebe raporu oluştur. Muhasebecine gönder, arşivle, paylaş.",
    mock: PdfMock,
    badge: "PRO",
  },
]

export function DemoSection() {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const ActiveMock = DEMO_TABS[active].mock

  return (
    <section id="demo" ref={ref} className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-[11px] text-[#E50001] font-bold uppercase tracking-[0.22em] mb-3">Canlı Demo</p>
        <h2 className="text-2xl sm:text-[2.2rem] font-black text-white tracking-tight mb-3">Uygulamayı keşfet</h2>
        <p className="text-white/32 text-sm max-w-[380px] mx-auto leading-relaxed">
          Her özelliği aşağıdan inceleyebilirsin. Gerçek verilerle nasıl çalıştığını şimdi gör.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="rounded-[20px] sm:rounded-[24px] overflow-hidden"
        style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Tab bar */}
        <div
          className="flex overflow-x-auto scrollbar-hide border-b border-white/[0.06]"
          style={{ background: "rgba(255,255,255,0.012)" }}
        >
          {DEMO_TABS.map(({ id, label, icon: Icon, badge }, i) => (
            <button
              key={id}
              onClick={() => setActive(i)}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 relative border-b-2"
              style={{
                color: active === i ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.28)",
                borderBottomColor: active === i ? "#E50001" : "transparent",
                background: "transparent",
              }}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              {label}
              {badge && (
                <span
                  className="text-[7px] font-black px-1 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.28)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: text */}
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  {(() => {
                    const { icon: Icon, badge } = DEMO_TABS[active]
                    return (
                      <>
                        <div
                          className="h-10 w-10 rounded-[12px] flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          <Icon className="h-5 w-5 text-white/55" />
                        </div>
                        {badge && (
                          <span
                            className="text-[10px] font-black px-2.5 py-1 rounded-full"
                            style={{
                              background: "rgba(229,0,1,0.1)",
                              color: "#E50001",
                              border: "1px solid rgba(229,0,1,0.18)",
                            }}
                          >
                            PRO
                          </span>
                        )}
                      </>
                    )
                  })()}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-3">{DEMO_TABS[active].title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">{DEMO_TABS[active].desc}</p>
                <div className="flex items-center gap-4">
                  <a
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold text-white transition-all active:scale-[0.97]"
                    style={{ background: "#E50001" }}
                  >
                    Ücretsiz Dene
                    <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/20">
                    <Zap className="h-3 w-3" />
                    Anında kurulum
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: mock */}
          <div className="p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-white/[0.05] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="w-full"
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.28 }}
              >
                <ActiveMock />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
