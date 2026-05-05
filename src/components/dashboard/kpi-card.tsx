"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { TrendingUp, TrendingDown, Clock, Wallet, Rocket } from "lucide-react"
import { AnimatedNumber } from "@/components/motion/animated-number"
import type { Currency } from "@/types/database"

const ICONS = { TrendingUp, TrendingDown, Clock, Wallet, Rocket } as const
type IconName = keyof typeof ICONS

const ICON_COLORS: Record<string, string> = {
  "from-green": "text-green-400",
  "from-red": "text-red-400",
  "from-purple": "text-purple-400",
  "from-orange": "text-orange-400",
  "from-yellow": "text-yellow-400",
}

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

export function KpiCard({ label, value, currency, icon, gradient, href, index, showSign }: KpiCardProps) {
  const Icon = ICONS[icon]
  const colorKey = Object.keys(ICON_COLORS).find((k) => gradient.startsWith(k)) ?? "from-yellow"
  const iconColor = ICON_COLORS[colorKey]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.08 + index * 0.06 }}
    >
      <Link href={href} className="block group">
        <motion.div
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="relative rounded-[16px] p-4 border border-white/[0.07] cursor-pointer active:border-white/[0.12] transition-colors"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {/* Icon */}
          <Icon className={`h-4 w-4 mb-3 ${iconColor} opacity-70`} strokeWidth={1.5} />

          {/* Value */}
          <p className="text-[19px] font-black text-white tabular-nums font-mono leading-none">
            {showSign && value > 0 && <span className="text-yellow-400">+</span>}
            {showSign && value < 0 && <span className="text-red-400">-</span>}
            <AnimatedNumber
              value={Math.abs(value)}
              format={(v) => {
                if (currency === "TRY") {
                  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
                  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
                  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)
                }
                const sym = { USD: "$", EUR: "€", GBP: "£" }[currency as "USD" | "EUR" | "GBP"] ?? ""
                if (v >= 1_000_000) return `${sym}${(v / 1_000_000).toFixed(1)}M`
                if (v >= 1_000) return `${sym}${(v / 1_000).toFixed(1)}K`
                return `${sym}${new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)}`
              }}
              duration={1.1}
            />
          </p>

          {/* Label */}
          <p className="text-[11px] text-white/30 mt-1.5 font-medium leading-tight">{label}</p>
        </motion.div>
      </Link>
    </motion.div>
  )
}
