"use client"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50001]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#E50001] text-white hover:bg-[#CC0001] rounded-[12px] shadow-[0_0_24px_rgba(229,0,1,0.3)] hover:shadow-[0_0_36px_rgba(229,0,1,0.45)]",
        ghost:
          "bg-white/[0.06] text-white/80 hover:bg-white/[0.1] hover:text-white border border-white/[0.08] rounded-[12px]",
        outline:
          "border border-white/[0.12] text-white/70 hover:bg-white/[0.05] hover:border-white/[0.2] hover:text-white rounded-[12px]",
        danger:
          "bg-red-500/[0.1] text-red-400 border border-red-500/[0.2] hover:bg-red-500/[0.2] hover:border-red-500/[0.4] rounded-[12px]",
        income:
          "bg-green-500/[0.12] text-green-400 border border-green-500/[0.2] hover:bg-green-500/[0.2] rounded-[12px]",
        link: "text-[#E50001] hover:text-red-400 underline-offset-4 hover:underline p-0 h-auto rounded-none",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        xl: "h-14 px-8 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
        "icon-lg": "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
)
Button.displayName = "Button"
