"use client"

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-[#09090E]" />
      {/* Very subtle static top gradient */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[320px] w-[640px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse, rgba(234,179,8,1), transparent 70%)" }}
      />
    </div>
  )
}
