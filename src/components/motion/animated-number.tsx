"use client"
import { useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedNumberProps {
  value: number
  format?: (v: number) => string
  className?: string
  duration?: number
}

export function AnimatedNumber({ value, format = (v) => v.toFixed(2), className, duration = 1.2 }: AnimatedNumberProps) {
  const prefersReducedMotion = useReducedMotion()
  const motionVal = useMotionValue(0)
  const display = useTransform(motionVal, (v) => format(v))
  const prevValue = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion) {
      motionVal.set(value)
      prevValue.current = value
      return
    }
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    })
    prevValue.current = value
    return controls.stop
  }, [value, motionVal, duration, prefersReducedMotion])

  return (
    <motion.span className={cn("tabular-nums", className)} style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}
    </motion.span>
  )
}
