"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem("cookie_consent", "accepted")
    setVisible(false)
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined")
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50"
        >
          <div
            className="rounded-[16px] p-4 shadow-xl"
            style={{ background: "rgba(18,18,26,0.97)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <p className="text-[11px] text-white/55 leading-relaxed mb-3">
              Zorunlu çerezler oturumunuzu yönetmek için kullanılır.{" "}
              <Link href="/cerez-politikasi" className="text-white/40 underline hover:text-white/60 transition-colors">
                Detaylar
              </Link>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={accept}
                className="flex-1 py-1.5 rounded-[8px] text-[11px] font-semibold text-white transition-all active:scale-[0.97]"
                style={{ background: "#E50001" }}
              >
                Kabul Et
              </button>
              <button
                onClick={decline}
                className="flex-1 py-1.5 rounded-[8px] text-[11px] font-semibold text-white/40 transition-all hover:text-white/60 active:scale-[0.97]"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Reddet
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
