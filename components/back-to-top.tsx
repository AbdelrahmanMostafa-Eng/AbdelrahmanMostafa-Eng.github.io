"use client"

import { useState } from "react"
import { AnimatePresence, motion, useScroll, useMotionValueEvent, useSpring } from "motion/react"
import { LuArrowUp } from "react-icons/lu"
import { Magnetic } from "./ui/magnetic"

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useMotionValueEvent(scrollY, "change", (y) => {
    // Appears once the hero has scrolled past.
    setVisible(y > window.innerHeight * 0.9)
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="btt"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-5 z-40 md:left-8"
        >
          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-300 hover:scale-110 hover:border-accent hover:shadow-[0_0_0_1px_var(--accent),0_0_28px_-4px_var(--accent-glow)]"
            >
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
                <motion.circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ pathLength: progress }}
                  strokeDasharray="1 1"
                />
              </svg>
              <LuArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
