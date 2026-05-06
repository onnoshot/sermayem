"use client"

import { useState, useEffect } from "react"
import { GlassSurface } from "@/components/ui/glass-surface"
import type { HealthScoreResult } from "@/lib/health-score"
import { Activity, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  result: HealthScoreResult
}

export function HealthScoreWidget({ result }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(r)
  }, [])

  const circumference = 2 * Math.PI * 36
  const strokeDash = mounted ? circumference - (result.score / 100) * circumference : circumference

  const breakdown = [
    { label: "Tasarruf", value: result.breakdown.savings, max: 35 },
    { label: "Gider Oranı", value: result.breakdown.expenseRatio, max: 35 },
    { label: "Bütçe", value: result.breakdown.budget, max: 20 },
    { label: "Aktivite", value: result.breakdown.activity, max: 10 },
  ]

  return (
    <GlassSurface className="p-5">
      <div className="flex items-center gap-4">
        {/* Circular score */}
        <div className="relative flex-shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88">
            {/* Track */}
            <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
            {/* Progress */}
            <circle
              cx="44" cy="44" r="36" fill="none"
              stroke={result.gradeColor}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              transform="rotate(-90 44 44)"
              style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums" style={{ color: result.gradeColor }}>
              {result.score}
            </span>
            <span className="text-[10px] font-bold text-white/30 -mt-0.5">/100</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3.5 w-3.5 text-white/30" />
            <span className="text-[11px] text-white/35 uppercase tracking-widest">Finansal Sağlık</span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-lg font-bold px-2 py-0.5 rounded-lg"
              style={{ color: result.gradeColor, background: `${result.gradeColor}18` }}
            >
              {result.grade}
            </span>
            <span className="text-base font-semibold text-white">{result.label}</span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{result.comment}</p>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all flex-shrink-0"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Breakdown */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2.5">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-white/50">{item.label}</span>
                <span className="text-xs font-medium text-white/70">{item.value} / {item.max}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: mounted ? `${(item.value / item.max) * 100}%` : "0%",
                    background: result.gradeColor,
                    opacity: 0.7,
                    transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassSurface>
  )
}
