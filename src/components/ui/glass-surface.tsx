"use client"
import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"
import { forwardRef } from "react"

interface GlassSurfaceProps extends HTMLMotionProps<"div"> {
  intensity?: "subtle" | "regular" | "strong"
  interactive?: boolean
  glow?: "none" | "gold" | "income" | "expense"
  children?: React.ReactNode
}

const glowMap = {
  none: "",
  gold: "shadow-[0_0_48px_rgba(234,179,8,0.15)]",
  income: "shadow-[0_0_48px_rgba(34,197,94,0.15)]",
  expense: "shadow-[0_0_48px_rgba(239,68,68,0.15)]",
}

export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, intensity = "regular", interactive = false, glow = "none", children, style, ...props }, ref) => {
    const blurMap = {
      subtle: "backdrop-blur-xl",
      regular: "backdrop-blur-2xl",
      strong: "backdrop-blur-3xl",
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[28px]",
          "backdrop-saturate-[1.8]",
          blurMap[intensity],
          glowMap[glow],
          interactive && "cursor-pointer transition-all duration-200",
          className
        )}
        style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 var(--c-specular)",
          transition: "background 0.3s ease, border-color 0.3s ease",
          ...style,
        }}
        {...props}
      >
        {/* Top specular highlight — the Liquid Glass signature */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          aria-hidden
        />
        {/* Radial inner glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(ellipse at top center, rgba(255,255,255,0.07), transparent 55%)" }}
          aria-hidden
        />
        {children}
      </motion.div>
    )
  }
)
GlassSurface.displayName = "GlassSurface"
