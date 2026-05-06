import {
  Camera, Target, Laptop, Briefcase, TrendingUp, Home, ShoppingCart,
  Car, Utensils, Tv, Film, Gift, Wallet, CreditCard, Landmark,
  Package, Palette, Dumbbell, Plane, GraduationCap, HeartPulse, Wrench, Zap,
  RefreshCw, ShoppingBag, type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Custom SVG — Bee (no Lucide equivalent)
function BeeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="14.5" rx="4.5" ry="5.5" />
      <circle cx="12" cy="7" r="2.5" />
      <path d="M7.5 13h9M7.5 16h9" />
      <path d="M10 9.5 Q7.5 7.5 8 5 Q10 3 11.5 6.5" />
      <path d="M14 9.5 Q16.5 7.5 16 5 Q14 3 12.5 6.5" />
    </svg>
  )
}

type IconEntry = {
  emoji: string
  Icon: LucideIcon | ((props: { className?: string }) => React.ReactElement)
  label: string
}

export const ICON_OPTIONS: IconEntry[] = [
  { emoji: "📷", Icon: Camera, label: "Fotoğraf" },
  { emoji: "🐝", Icon: BeeIcon, label: "Arı" },
  { emoji: "🎯", Icon: Target, label: "Hedef" },
  { emoji: "💻", Icon: Laptop, label: "Laptop" },
  { emoji: "💼", Icon: Briefcase, label: "İş" },
  { emoji: "📈", Icon: TrendingUp, label: "Yatırım" },
  { emoji: "🏠", Icon: Home, label: "Ev" },
  { emoji: "🛒", Icon: ShoppingCart, label: "Market" },
  { emoji: "🚗", Icon: Car, label: "Araç" },
  { emoji: "🍽️", Icon: Utensils, label: "Yeme-İçme" },
  { emoji: "📺", Icon: Tv, label: "Abonelik" },
  { emoji: "🎬", Icon: Film, label: "Eğlence" },
  { emoji: "🎁", Icon: Gift, label: "Hediye" },
  { emoji: "💰", Icon: Wallet, label: "Para" },
  { emoji: "💳", Icon: CreditCard, label: "Kart" },
  { emoji: "🏦", Icon: Landmark, label: "Banka" },
  { emoji: "📦", Icon: Package, label: "Kargo" },
  { emoji: "🎨", Icon: Palette, label: "Sanat" },
  { emoji: "🏋️", Icon: Dumbbell, label: "Spor" },
  { emoji: "✈️", Icon: Plane, label: "Seyahat" },
  { emoji: "🎓", Icon: GraduationCap, label: "Eğitim" },
  { emoji: "🏥", Icon: HeartPulse, label: "Sağlık" },
  { emoji: "🔧", Icon: Wrench, label: "Tamir" },
  { emoji: "⚡", Icon: Zap, label: "Enerji" },
  { emoji: "🛍️", Icon: ShoppingBag, label: "Alışveriş" },
  { emoji: "🔄", Icon: RefreshCw, label: "Tekrar" },
]

const EMOJI_MAP: Record<string, IconEntry["Icon"]> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.emoji, o.Icon])
)

interface SourceIconProps {
  emoji: string
  className?: string
}

export function SourceIcon({ emoji, className }: SourceIconProps) {
  const Icon = EMOJI_MAP[emoji]
  if (Icon) return <Icon className={cn("h-6 w-6", className)} />

  // Fallback: render emoji character for user-created custom icons
  return <span className={cn("text-2xl leading-none", className)}>{emoji}</span>
}
