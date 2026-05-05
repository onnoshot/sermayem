"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  User, Sun, Settings, Bell, Star, Gift, Download, Mail,
  HelpCircle, ExternalLink, Users, LogOut, Smile, Moon,
  SmilePlus,
} from "lucide-react"

type StatusType = "online" | "offline" | "busy"

interface UserDropdownUser {
  name: string
  username: string
  avatar: string
  initials: string
  status: StatusType
}

interface UserDropdownProps {
  user?: UserDropdownUser
  onAction?: (action: string) => void
  onStatusChange?: (status: string) => void
  selectedStatus?: string
  promoDiscount?: string
}

const ICON_MAP: Record<string, React.ElementType> = {
  "smile": Smile,
  "moon": Moon,
  "user": User,
  "sun": Sun,
  "settings": Settings,
  "bell": Bell,
  "star": Star,
  "gift": Gift,
  "download": Download,
  "mail": Mail,
  "help": HelpCircle,
  "external": ExternalLink,
  "users": Users,
  "logout": LogOut,
  "smile-plus": SmilePlus,
}

type MenuItem = {
  icon: keyof typeof ICON_MAP
  label: string
  action: string
  iconClass?: string
  badge?: { text: string; className: string }
  rightIcon?: keyof typeof ICON_MAP
  showAvatar?: boolean
  value?: string
}

const MENU_ITEMS: Record<string, MenuItem[]> = {
  status: [
    { value: "focus", icon: "smile", label: "Odak modu", action: "focus" },
    { value: "offline", icon: "moon", label: "Çevrimdışı görün", action: "offline" },
  ],
  profile: [
    { icon: "user", label: "Profilim", action: "profile" },
    { icon: "sun", label: "Görünüm", action: "appearance" },
    { icon: "settings", label: "Ayarlar", action: "settings" },
    { icon: "bell", label: "Bildirimler", action: "notifications" },
  ],
  premium: [
    {
      icon: "star",
      label: "Pro'ya geç",
      action: "upgrade",
      iconClass: "text-amber-500",
      badge: { text: "%20 indirim", className: "bg-amber-600 text-white text-[11px]" },
    },
    { icon: "gift", label: "Davet et", action: "referrals" },
  ],
  support: [
    { icon: "download", label: "Uygulamayı indir", action: "download" },
    { icon: "mail", label: "Yenilikler", action: "whats-new", rightIcon: "external" },
    { icon: "help", label: "Yardım al", action: "help", rightIcon: "external" },
  ],
  account: [
    { icon: "users", label: "Hesap değiştir", action: "switch" },
    { icon: "logout", label: "Çıkış yap", action: "logout" },
  ],
}

const STATUS_COLORS: Record<StatusType, string> = {
  online: "text-green-400 bg-green-400/10 border-green-400/30",
  offline: "text-[var(--c-muted)] bg-[var(--c-dim)] border-[var(--c-border)]",
  busy: "text-red-400 bg-red-400/10 border-red-400/30",
}

const STATUS_LABELS: Record<StatusType, string> = {
  online: "Çevrimiçi",
  offline: "Çevrimdışı",
  busy: "Meşgul",
}

export function UserDropdown({
  user = {
    name: "Kullanıcı",
    username: "@kullanici",
    avatar: "",
    initials: "K",
    status: "online" as StatusType,
  },
  onAction = () => {},
  onStatusChange = () => {},
  selectedStatus = "online",
  promoDiscount = "%20 indirim",
}: UserDropdownProps) {
  const renderMenuItem = (item: MenuItem, index: number) => {
    const Icon = ICON_MAP[item.icon]
    const RightIcon = item.rightIcon ? ICON_MAP[item.rightIcon] : null
    return (
      <DropdownMenuItem
        key={index}
        className={cn(
          item.badge || item.rightIcon ? "justify-between" : "",
          "p-2 rounded-lg cursor-pointer text-[var(--c-text)]"
        )}
        onClick={() => onAction(item.action)}
      >
        <span className="flex items-center gap-2 font-medium">
          {Icon && <Icon className={cn("size-4", item.iconClass || "text-[var(--c-muted)]")} />}
          {item.label}
        </span>
        {item.badge && (
          <Badge className={item.badge.className}>
            {promoDiscount || item.badge.text}
          </Badge>
        )}
        {RightIcon && <RightIcon className="size-3.5 text-[var(--c-muted)]" />}
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer size-9 border border-[var(--c-border)] hover:border-[var(--c-border-h)] transition-colors">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-sm">{user.initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[300px] p-0" align="end">
        <section className="bg-[var(--c-surface)] rounded-xl p-1 m-1 border border-[var(--c-border)]">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="size-9 border border-[var(--c-border)]">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-sm">{user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--c-text)] truncate">{user.name}</p>
              <p className="text-xs text-[var(--c-muted)] truncate">{user.username}</p>
            </div>
            <Badge className={cn("border text-[11px] rounded-md capitalize", STATUS_COLORS[user.status])}>
              {STATUS_LABELS[user.status]}
            </Badge>
          </div>

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer p-2 rounded-lg text-[var(--c-text)]">
                <span className="flex items-center gap-2 font-medium text-[var(--c-muted)] text-sm">
                  <SmilePlus className="size-4" />
                  Durum güncelle
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-[var(--c-modal)] border-[var(--c-border)]">
                  <DropdownMenuRadioGroup value={selectedStatus} onValueChange={onStatusChange}>
                    {MENU_ITEMS.status.map((status, i) => {
                      const Icon = ICON_MAP[status.icon]
                      return (
                        <DropdownMenuRadioItem className="gap-2 text-[var(--c-text)]" key={i} value={status.value!}>
                          {Icon && <Icon className="size-4 text-[var(--c-muted)]" />}
                          {status.label}
                        </DropdownMenuRadioItem>
                      )
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>{MENU_ITEMS.profile.map(renderMenuItem)}</DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>{MENU_ITEMS.premium.map(renderMenuItem)}</DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>{MENU_ITEMS.support.map(renderMenuItem)}</DropdownMenuGroup>
        </section>

        <section className="p-1">
          <DropdownMenuGroup>{MENU_ITEMS.account.map(renderMenuItem)}</DropdownMenuGroup>
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
