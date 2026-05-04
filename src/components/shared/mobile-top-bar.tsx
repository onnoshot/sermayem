"use client"
import { motion } from "framer-motion"
import { Menu, Plus } from "lucide-react"
import { useUIStore } from "@/lib/stores/ui-store"

export function MobileTopBar() {
  const { toggleSidebar, openAddTransaction } = useUIStore()

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-30 h-[60px] flex items-center justify-between px-4 border-b border-white/[0.06]"
      style={{ background: "rgba(8,8,12,0.94)", backdropFilter: "blur(40px)" }}
    >
      <button
        onClick={toggleSidebar}
        className="h-10 w-10 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/[0.07] transition-all active:scale-95"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/favicon.svg" alt="S" className="h-6 w-6 object-contain" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sermayem.svg" alt="Sermayem" className="h-4 object-contain" />
      </div>

      <motion.button
        onClick={openAddTransaction}
        whileTap={{ scale: 0.92 }}
        className="h-9 w-9 rounded-xl flex items-center justify-center text-black shadow-[0_0_16px_rgba(234,179,8,0.3)]"
        style={{ background: "linear-gradient(135deg, #EAB308, #D97706)" }}
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  )
}
