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

export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, interactive = false, children, style, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[20px]",
          interactive && "cursor-pointer transition-colors duration-200",
          className
        )}
        style={{
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.07)",
          ...style,
        }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
GlassSurface.displayName = "GlassSurface"
