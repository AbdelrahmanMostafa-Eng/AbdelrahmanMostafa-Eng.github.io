"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { site } from "@/lib/site"

const KEY = "am:intro-seen"

/**
 * One considered page-load intro. Plays once per browser session, then the
 * site loads instantly on subsequent navigations.
 */
export function Intro() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let seen = false
    try {
      seen = window.sessionStorage.getItem(KEY) === "1"
    } catch {
      seen = false
    }
    if (reduce || seen) return
    setShow(true)
    document.documentElement.style.overflow = "hidden"
    const t = setTimeout(() => {
      setShow(false)
      document.documentElement.style.overflow = ""
      try {
        window.sessionStorage.setItem(KEY, "1")
      } catch {
        // ignore
      }
    }, 1500)
    return () => {
      clearTimeout(t)
      document.documentElement.style.overflow = ""
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl font-semibold tracking-tight text-accent-ink md:text-6xl"
            >
              {site.initials}
            </motion.span>
            <span className="relative h-px w-40 overflow-hidden bg-border">
              <motion.span
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
                className="absolute inset-0 bg-accent"
              />
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="eyebrow"
            >
              {site.role}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
