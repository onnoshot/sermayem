"use client"

import { Crown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PremiumGateProps {
  children: React.ReactNode
  feature?: string
  className?: string
  compact?: boolean
}

export function PremiumGate({ children, feature, className, compact = false }: PremiumGateProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none select-none opacity-40 blur-[2px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          "rounded-[16px] border border-yellow-500/30 bg-black/80 backdrop-blur-sm flex flex-col items-center text-center",
          compact ? "px-4 py-3 gap-1.5" : "px-6 py-5 gap-3"
        )}>
          <div className={cn(
            "rounded-[10px] bg-yellow-500/15 flex items-center justify-center",
            compact ? "h-8 w-8" : "h-10 w-10"
          )}>
            <Crown className={cn(compact ? "h-4 w-4" : "h-5 w-5", "text-yellow-400")} />
          </div>
          <div>
            <p className={cn("font-semibold text-white", compact ? "text-xs" : "text-sm")}>
              {feature ?? "Pro özellik"}
            </p>
            {!compact && (
              <p className="text-xs text-white/50 mt-0.5">
                Bu özellik Pro üyelere özeldir
              </p>
            )}
          </div>
          <Link
            href="/app/premium"
            className={cn(
              "rounded-[8px] bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition-colors",
              compact ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-xs"
            )}
          >
            Pro'ya Geç
          </Link>
        </div>
      </div>
    </div>
  )
}

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[5px] bg-yellow-500/15 border border-yellow-500/25 text-[10px] font-semibold text-yellow-400",
      className
    )}>
      <Crown className="h-2.5 w-2.5" />
      PRO
    </span>
  )
}
