"use client"

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react"
import { useRef, type ReactNode, type MouseEvent } from "react"
import { clsx } from "clsx"

/**
 * Perspective tilt that follows the cursor, plus a spotlight that tracks it.
 * Kept subtle (max ~6deg) so text stays readable during the hover.
 */
export function TiltCard({
  children,
  className,
  max = 6,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 200, damping: 22 })
  const sy = useSpring(py, { stiffness: 200, damping: 22 })
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const spotX = useTransform(sx, (v) => `${v * 100}%`)
  const spotY = useTransform(sy, (v) => `${v * 100}%`)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformPerspective: 1000 }}
      className={clsx("group relative h-full will-change-transform", className)}
    >
      <motion.span
        aria-hidden="true"
        style={{
          background: `radial-gradient(240px circle at var(--sx) var(--sy), var(--accent-soft), transparent 70%)`,
          ["--sx" as string]: spotX,
          ["--sy" as string]: spotY,
        }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {children}
    </motion.div>
  )
}
