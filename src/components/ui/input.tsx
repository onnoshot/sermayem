import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-white/50 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-[12px] px-4 py-3 text-sm",
            "bg-white/[0.05] border border-white/[0.08]",
            "text-white/90 placeholder:text-white/25",
            "focus:outline-none focus:border-[#E50001]/50 focus:bg-white/[0.07]",
            "transition-all duration-150",
            error && "border-red-500/50 focus:border-red-500/70",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-white/35">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"
