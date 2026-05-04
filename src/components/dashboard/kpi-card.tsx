"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { TrendingUp, TrendingDown, Clock, Wallet, Rocket } from "lucide-react"
import { AnimatedNumber } from "@/components/motion/animated-number"
import type { Currency } from "@/types/database"

const ICONS = { TrendingUp, TrendingDown, Clock, Wallet, Rocket } as const
type IconName = keyof typeof ICONS

interface KpiCardProps {
  label: string
  value: number
  currency: Currency
  icon: IconName
  gradient: string
  glow: string
  href: string
  index: number
  showSign?: boolean
}

export function KpiCard({ label, value, currency, icon, gradient, glow, href, index, showSign }: KpiCardProps) {
  const Icon = ICONS[icon]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 + index * 0.07 }}
    >
      <Link href={href} className="block group">
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative rounded-[20px] p-5 overflow-hidden border border-white/[0.08] cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {/* Hover glow */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[20px]"
            style={{ background: `radial-gradient(ellipse at center, ${glow}, transparent 70%)` }}
          />

          {/* Top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Icon */}
          <div
            className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}
            style={{ boxShadow: `0 4px 16px ${glow}` }}
          >
            <Icon className="h-6 w-6 text-white" strokeWidth={2} />
          </div>

          {/* Value */}
          <p className="text-[22px] font-black text-white tabular-nums font-mono leading-none">
            {showSign && value > 0 && <span className="text-yellow-400">+</span>}
            {showSign && value < 0 && <span className="text-red-400">-</span>}
            <AnimatedNumber
              value={Math.abs(value)}
              format={(v) => {
                if (currency === "TRY") {
                  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M TL`
                  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K TL`
                  return `${new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)} TL`
                }
                const sym = { USD: "$", EUR: "€", GBP: "£" }[currency as "USD" | "EUR" | "GBP"] ?? ""
                if (v >= 1_000_000) return `${sym}${(v / 1_000_000).toFixed(1)}M`
                if (v >= 1_000) return `${sym}${(v / 1_000).toFixed(1)}K`
                return `${sym}${new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)}`
              }}
              duration={1.2}
            />
          </p>

          {/* Label */}
          <p className="text-xs text-white/40 mt-2 font-medium">{label}</p>
        </motion.div>
      </Link>
    </motion.div>
  )
}
