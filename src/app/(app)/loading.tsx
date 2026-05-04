export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-[72px] rounded-[22px] bg-white/[0.04]" />
      <div className="h-[200px] rounded-[28px] bg-white/[0.04]" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[120px] rounded-[20px] bg-white/[0.04]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[260px] rounded-[20px] bg-white/[0.04]" />
        <div className="h-[260px] rounded-[20px] bg-white/[0.04]" />
      </div>
    </div>
  )
}
