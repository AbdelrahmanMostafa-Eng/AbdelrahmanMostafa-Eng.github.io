"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react"
import { LuMenu, LuX } from "react-icons/lu"
import { clsx } from "clsx"
import { AvatarBadge } from "./avatar-badge"
import { ThemeToggle } from "./theme-toggle"
import { BrandIcon } from "./ui/brand-icon"
import { Magnetic } from "./ui/magnetic"
import { nav, site } from "@/lib/site"

const sectionIds = nav.map((n) => n.href.slice(1))

function useActiveSection() {
  const [active, setActive] = useState<string>("")
  useEffect(() => {
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return active
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const active = useActiveSection()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24))

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-border bg-[var(--header-bg)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#top" className="group flex items-center gap-3" aria-label="Back to the top">
            <span className="relative">
              <AvatarBadge size={40} className="group-hover:accent-glow-shadow" />
              <span
                className="pulse-dot absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background"
                aria-hidden="true"
              />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-[15px] font-semibold tracking-tight">{site.name}</span>
              <span className="text-[11px] text-muted">{site.role}</span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
            <ul className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
              {nav.map((item) => {
                const id = item.href.slice(1)
                const isActive = active === id
                const isHover = hovered === id
                return (
                  <li key={item.href} className="relative">
                    <a
                      href={item.href}
                      onMouseEnter={() => setHovered(id)}
                      className={clsx(
                        "relative z-10 block rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300",
                        isActive || isHover ? "text-foreground" : "text-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </a>
                    {(isHover || (hovered === null && isActive)) && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-surface-2"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Magnetic strength={0.25}>
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <BrandIcon provider="github" className="h-[17px] w-[17px]" />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href={site.linkedinUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <BrandIcon provider="linkedin" className="h-[17px] w-[17px]" />
              </a>
            </Magnetic>
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground md:hidden"
            >
              <LuMenu className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <AvatarBadge size={36} />
                <span className="font-display font-semibold">{site.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-6">
              <ul className="flex flex-col gap-2">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="font-display flex items-baseline gap-4 py-3 text-4xl font-medium tracking-tight"
                    >
                      <span className="text-sm text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-4 px-6 pb-10 text-sm text-muted">
              <a href={site.githubUrl} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2">
                <BrandIcon provider="github" className="h-4 w-4" /> GitHub
              </a>
              <a href={site.linkedinUrl} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2">
                <BrandIcon provider="linkedin" className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
