"use client"
import { motion } from "framer-motion"

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#08080C]" />
      {/* Gold top-left orb */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[700px] w-[700px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(234,179,8,0.18), transparent 70%)" }}
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Copper bottom-right orb */}
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[550px] w-[550px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, rgba(217,119,6,0.2), transparent 70%)" }}
        animate={{ x: [0, -70, 0], y: [0, -50, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Subtle blue center orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.3), transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  )
}
