"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { LuSun, LuMoon } from "react-icons/lu"
import { AnimatePresence, motion } from "motion/react"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted ? resolvedTheme !== "light" : true

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        className ??
        "group relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 60, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          {dark ? <LuMoon className="h-4 w-4" /> : <LuSun className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
