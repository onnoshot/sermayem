"use client"
import { useEffect, useState } from "react"
import { useUIStore } from "@/lib/stores/ui-store"
import { motion, AnimatePresence } from "framer-motion"
import { TransactionModal } from "@/components/transactions/transaction-modal"
import { MobileTopBar } from "@/components/shared/mobile-top-bar"
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[39] bg-black/60"
            style={{ backdropFilter: "blur(2px)" }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.main
        animate={{ marginLeft: isMobile ? 0 : (sidebarOpen ? 256 : 76) }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="flex-1 overflow-y-auto min-h-screen"
      >
        {isMobile && <MobileTopBar />}
        <div className={`max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 ${isMobile ? "pt-[76px] pb-28" : ""}`}>
          {children}
        </div>
        <TransactionModal />
        {isMobile && <MobileBottomNav />}
      </motion.main>
    </>
  )
}
