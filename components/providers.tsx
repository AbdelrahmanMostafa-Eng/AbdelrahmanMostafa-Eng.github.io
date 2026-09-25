"use client"

import { ThemeProvider } from "next-themes"
import { MotionConfig } from "motion/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <div className="gradient-backdrop" aria-hidden="true">
        <video
          className="ambient-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/media/ambient-bg.mp4" type="video/mp4" />
        </video>
      </div>
        {children}
      </MotionConfig>
    </ThemeProvider>
  )
}
