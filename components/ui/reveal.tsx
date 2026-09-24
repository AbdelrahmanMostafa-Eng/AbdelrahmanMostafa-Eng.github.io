"use client"

import { motion, type Variants } from "motion/react"
import type { ReactNode } from "react"

type Direction = "up" | "left" | "right" | "scale" | "clip"

const variants: Record<Direction, Variants> = {
  up: {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1 },
  },
  clip: {
    hidden: { clipPath: "inset(0 0 100% 0)", y: 12 },
    show: { clipPath: "inset(0 0 0% 0)", y: 0 },
  },
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className,
  as: Tag = "div",
  once = true,
}: {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  as?: "div" | "section" | "li" | "span" | "p" | "h2" | "h3"
  once?: boolean
}) {
  const M = motion[Tag] as typeof motion.div
  return (
    <M
      className={className}
      variants={variants[direction]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  )
}

/** Staggers the reveal of direct children. */
export function Stagger({
  children,
  className,
  step = 0.08,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  step?: number
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: step, delayChildren: delay }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode
  className?: string
  direction?: Direction
}) {
  return (
    <motion.div
      className={className}
      variants={variants[direction]}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
