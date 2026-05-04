"use client"
import { useTheme } from "@/components/providers/theme-provider"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isLight = theme === "light"

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-[10px] bg-white/[0.05] flex items-center justify-center flex-shrink-0">
          {isLight ? <Sun className="h-4.5 w-4.5 text-yellow-400" /> : <Moon className="h-4.5 w-4.5 text-white/50" />}
        </div>
        <div>
          <p className="text-sm text-white font-medium">Tema</p>
          <p className="text-xs text-white/40">{isLight ? "Açık mod" : "Koyu mod"}</p>
        </div>
      </div>

      <button
        onClick={() => setTheme(isLight ? "dark" : "light")}
        className="relative h-7 w-13 rounded-full transition-colors duration-300 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50001]/50"
        style={{ background: isLight ? "#E50001" : "rgba(255,255,255,0.12)", width: "52px" }}
        role="switch"
        aria-checked={isLight}
      >
        <motion.div
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md"
          animate={{ left: isLight ? "calc(100% - 26px)" : "2px" }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        />
      </button>
    </div>
  )
}
