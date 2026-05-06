"use client"

import {
  Target, Flame, Zap, Gem, Rocket, Crown,
  Shield, Star, Waves, BarChart3, Leaf, Globe,
  Car, Home, Plane, Smartphone, GraduationCap,
  Heart, Gift, Landmark, Briefcase, Palette,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Avatar icon definitions ───────────────────────────────────────────────

export interface IconOption {
  id: string
  label: string
  icon: LucideIcon
  gradient: [string, string]
  glow: string
}

export const AVATAR_OPTIONS: IconOption[] = [
  { id: "target",  label: "Hedef",    icon: Target,   gradient: ["#FF4444","#CC0000"], glow: "#E5000140" },
  { id: "flame",   label: "Alev",     icon: Flame,    gradient: ["#FB923C","#EA580C"], glow: "#F9731640" },
  { id: "bolt",    label: "Şimşek",   icon: Zap,      gradient: ["#FBBF24","#D97706"], glow: "#EAB30840" },
  { id: "gem",     label: "Elmas",    icon: Gem,      gradient: ["#60A5FA","#2563EB"], glow: "#3B82F640" },
  { id: "rocket",  label: "Roket",    icon: Rocket,   gradient: ["#A78BFA","#7C3AED"], glow: "#8B5CF640" },
  { id: "crown",   label: "Taç",      icon: Crown,    gradient: ["#FCD34D","#F59E0B"], glow: "#F59E0B40" },
  { id: "shield",  label: "Kalkan",   icon: Shield,   gradient: ["#34D399","#059669"], glow: "#10B98140" },
  { id: "star",    label: "Yıldız",   icon: Star,     gradient: ["#F472B6","#DB2777"], glow: "#EC489940" },
  { id: "waves",   label: "Dalga",    icon: Waves,    gradient: ["#22D3EE","#0891B2"], glow: "#06B6D440" },
  { id: "chart",   label: "Grafik",   icon: BarChart3, gradient: ["#818CF8","#4F46E5"], glow: "#6366F140" },
  { id: "leaf",    label: "Yaprak",   icon: Leaf,     gradient: ["#4ADE80","#16A34A"], glow: "#22C55E40" },
  { id: "globe",   label: "Dünya",    icon: Globe,    gradient: ["#C084FC","#9333EA"], glow: "#A855F740" },
]

// Goal-specific icons (expanded set)
export const GOAL_ICONS: IconOption[] = [
  { id: "target",     label: "Hedef",     icon: Target,        gradient: ["#FF4444","#CC0000"], glow: "#E5000140" },
  { id: "car",        label: "Araba",     icon: Car,           gradient: ["#60A5FA","#2563EB"], glow: "#3B82F640" },
  { id: "home",       label: "Ev",        icon: Home,          gradient: ["#34D399","#059669"], glow: "#10B98140" },
  { id: "plane",      label: "Tatil",     icon: Plane,         gradient: ["#A78BFA","#7C3AED"], glow: "#8B5CF640" },
  { id: "gem",        label: "Mücevher",  icon: Gem,           gradient: ["#F472B6","#DB2777"], glow: "#EC489940" },
  { id: "phone",      label: "Telefon",   icon: Smartphone,    gradient: ["#FBBF24","#D97706"], glow: "#EAB30840" },
  { id: "education",  label: "Eğitim",    icon: GraduationCap, gradient: ["#22D3EE","#0891B2"], glow: "#06B6D440" },
  { id: "heart",      label: "Sağlık",    icon: Heart,         gradient: ["#FB923C","#EA580C"], glow: "#F9731640" },
  { id: "gift",       label: "Hediye",    icon: Gift,          gradient: ["#C084FC","#9333EA"], glow: "#A855F740" },
  { id: "bank",       label: "Birikim",   icon: Landmark,      gradient: ["#818CF8","#4F46E5"], glow: "#6366F140" },
  { id: "briefcase",  label: "İş",        icon: Briefcase,     gradient: ["#4ADE80","#16A34A"], glow: "#22C55E40" },
  { id: "art",        label: "Sanat",     icon: Palette,       gradient: ["#FCD34D","#F59E0B"], glow: "#F59E0B40" },
  { id: "star",       label: "Yıldız",    icon: Star,          gradient: ["#F472B6","#DB2777"], glow: "#EC489940" },
  { id: "rocket",     label: "Girişim",   icon: Rocket,        gradient: ["#A78BFA","#7C3AED"], glow: "#8B5CF640" },
  { id: "globe",      label: "Dünya",     icon: Globe,         gradient: ["#22D3EE","#0891B2"], glow: "#06B6D440" },
  { id: "crown",      label: "Lüks",      icon: Crown,         gradient: ["#FCD34D","#F59E0B"], glow: "#F59E0B40" },
]

// Backward-compatible emoji → icon ID mapping
const EMOJI_TO_ID: Record<string, string> = {
  "🎯": "target", "📸": "chart",  "🦁": "shield",  "🔥": "flame",
  "⚡": "bolt",   "🌊": "waves",  "💎": "gem",     "🚀": "rocket",
  "🎬": "star",   "🏆": "crown",  "🦊": "leaf",    "✨": "globe",
  "👋": "target", "👤": "target", "🏠": "home",    "✈️": "plane",
  "💍": "gem",    "📱": "phone",  "💻": "chart",   "🎓": "education",
  "🏖️": "plane", "🏋️": "heart", "🎁": "gift",    "💰": "bank",
  "🏦": "bank",   "📦": "briefcase", "🌍": "globe", "🎨": "art",
  "🚗": "car",
}

export function resolveIconId(
  idOrEmoji: string | null | undefined,
  pool: IconOption[] = AVATAR_OPTIONS,
): string {
  if (!idOrEmoji) return pool[0].id
  if (pool.some(o => o.id === idOrEmoji)) return idOrEmoji
  return EMOJI_TO_ID[idOrEmoji] ?? pool[0].id
}

export function findIcon(
  id: string,
  pool: IconOption[] = AVATAR_OPTIONS,
): IconOption {
  return pool.find(o => o.id === id) ?? pool[0]
}

// ─── Display component ─────────────────────────────────────────────────────

const SIZES = {
  xs:  { box: "h-6 w-6",   icon: "h-3 w-3",     radius: "rounded-[7px]"  },
  sm:  { box: "h-8 w-8",   icon: "h-4 w-4",     radius: "rounded-[9px]"  },
  md:  { box: "h-10 w-10", icon: "h-5 w-5",     radius: "rounded-[11px]" },
  lg:  { box: "h-12 w-12", icon: "h-6 w-6",     radius: "rounded-[13px]" },
  xl:  { box: "h-16 w-16", icon: "h-8 w-8",     radius: "rounded-[18px]" },
  "2xl": { box: "h-20 w-20", icon: "h-10 w-10", radius: "rounded-[22px]" },
}

interface AvatarIconProps {
  id?: string | null
  size?: keyof typeof SIZES
  pool?: IconOption[]
  className?: string
  glow?: boolean
}

export function AvatarIcon({
  id,
  size = "md",
  pool = AVATAR_OPTIONS,
  className,
  glow = false,
}: AvatarIconProps) {
  const resolvedId = resolveIconId(id, pool)
  const option = findIcon(resolvedId, pool)
  const { box, icon: iconSize, radius } = SIZES[size]
  const Icon = option.icon

  return (
    <div
      className={cn(box, radius, "flex items-center justify-center flex-shrink-0", className)}
      style={{
        background: `linear-gradient(135deg, ${option.gradient[0]}, ${option.gradient[1]})`,
        ...(glow ? { boxShadow: `0 4px 16px ${option.glow}` } : {}),
      }}
    >
      <Icon className={cn(iconSize, "text-white")} strokeWidth={2.2} />
    </div>
  )
}

// ─── Picker component ─────────────────────────────────────────────────────

interface IconPickerProps {
  value: string
  onChange: (id: string) => void
  pool?: IconOption[]
  columns?: number
}

export function IconPicker({ value, onChange, pool = AVATAR_OPTIONS, columns = 6 }: IconPickerProps) {
  const resolvedValue = resolveIconId(value, pool)

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {pool.map((opt) => {
        const Icon = opt.icon
        const active = resolvedValue === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            title={opt.label}
            onClick={() => onChange(opt.id)}
            className={cn(
              "h-11 w-full rounded-[12px] flex items-center justify-center transition-all duration-150",
              active ? "ring-2 ring-offset-1 ring-offset-transparent scale-105" : "hover:scale-105 opacity-60 hover:opacity-90"
            )}
            style={{
              background: `linear-gradient(135deg, ${opt.gradient[0]}, ${opt.gradient[1]})`,
              ...(active ? { ringColor: opt.gradient[0], boxShadow: `0 0 18px ${opt.glow}` } : {}),
            }}
          >
            <Icon className="h-5 w-5 text-white" strokeWidth={2.2} />
          </button>
        )
      })}
    </div>
  )
}
