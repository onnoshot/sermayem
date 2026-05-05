import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "border-transparent bg-[--c-accent] text-white",
        variant === "secondary" && "border-transparent bg-[--c-surface-2] text-[--c-text]",
        variant === "destructive" && "border-transparent bg-red-600 text-white",
        variant === "outline" && "text-[--c-text]",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
