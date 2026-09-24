"use client"

import { ThemeProvider } from "next-themes"
import { MotionConfig } from "motion/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <div className="gradient-backdrop" aria-hidden="true" />
        {children}
      </MotionConfig>
    </ThemeProvider>
  )
}
