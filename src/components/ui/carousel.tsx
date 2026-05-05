"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type CarouselApi = {
  canScrollPrev: () => boolean
  canScrollNext: () => boolean
  scrollPrev: () => void
  scrollNext: () => void
  on: (event: string, callback: () => void) => void
  off: (event: string, callback: () => void) => void
}

type CarouselContextValue = {
  scrollRef: React.RefObject<HTMLDivElement | null>
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

interface CarouselProps {
  children: React.ReactNode
  className?: string
  setApi?: (api: CarouselApi) => void
  opts?: Record<string, unknown>
}

function Carousel({ children, className, setApi }: CarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const listenersRef = React.useRef(new Map<string, Set<() => void>>())

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const emit = (event: string) =>
      listenersRef.current.get(event)?.forEach((cb) => cb())

    const api: CarouselApi = {
      canScrollPrev: () => el.scrollLeft > 1,
      canScrollNext: () => el.scrollLeft < el.scrollWidth - el.clientWidth - 1,
      scrollPrev: () => {
        el.scrollBy({ left: -Math.max(el.clientWidth * 0.65, 300), behavior: "smooth" })
        setTimeout(() => emit("select"), 350)
      },
      scrollNext: () => {
        el.scrollBy({ left: Math.max(el.clientWidth * 0.65, 300), behavior: "smooth" })
        setTimeout(() => emit("select"), 350)
      },
      on: (event, cb) => {
        if (!listenersRef.current.has(event)) listenersRef.current.set(event, new Set())
        listenersRef.current.get(event)!.add(cb)
      },
      off: (event, cb) => {
        listenersRef.current.get(event)?.delete(cb)
      },
    }

    setApi?.(api)
  }, [setApi])

  return (
    <CarouselContext.Provider value={{ scrollRef }}>
      <div className={cn("relative", className)}>{children}</div>
    </CarouselContext.Provider>
  )
}

interface CarouselContentProps {
  children: React.ReactNode
  className?: string
}

function CarouselContent({ children, className }: CarouselContentProps) {
  const ctx = React.useContext(CarouselContext)
  return (
    <div
      ref={ctx?.scrollRef}
      className={cn("flex overflow-x-auto", className)}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

interface CarouselItemProps {
  children: React.ReactNode
  className?: string
}

function CarouselItem({ children, className }: CarouselItemProps) {
  return <div className={cn("shrink-0", className)}>{children}</div>
}

export { Carousel, CarouselContent, CarouselItem }
