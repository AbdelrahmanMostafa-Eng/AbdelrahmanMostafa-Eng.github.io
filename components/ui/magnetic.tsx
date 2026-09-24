"use client"

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react"
import { useRef, type ReactNode, type MouseEvent } from "react"

/**
 * Wraps any element and makes it lean toward the cursor while hovered.
 * Disabled for reduced-motion users and on coarse pointers.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className ?? "inline-block"}
    >
      {children}
    </motion.div>
  )
}
