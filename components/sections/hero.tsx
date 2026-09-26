"use client"

import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { LuArrowDown, LuArrowUpRight, LuMapPin } from "react-icons/lu"
import { site } from "@/lib/site"
import { useGitHubProfile, useGitHubRepos, relativeTime } from "@/lib/github"
import { CursorCircleLink } from "../ui/cursor-circle-button"
import { BrandIcon } from "../ui/brand-icon"
import { ContributionSkyline } from "./contributions"

const ease = [0.16, 1, 0.3, 1] as const

function useLocalTime() {
  const [time, setTime] = useState<string>("")
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: site.timezone,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  return time
}

function Word({ children, i }: { children: string; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.55 + i * 0.09, ease }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const { data: profile } = useGitHubProfile()
  const { data: repos } = useGitHubRepos()
  const time = useLocalTime()
  const lastPush = repos?.[0]?.pushed_at
  const [firstName, lastName] = site.name.split(" ")

  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="grid-texture absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-12 md:px-8 lg:grid-cols-12 lg:gap-6 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Open to internships &amp; collaborations
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LuMapPin className="h-3.5 w-3.5" />
              {profile?.location ?? site.location}
              {time && <span className="tabular-nums text-muted-2">· {time} local</span>}
            </span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[0.94] font-semibold tracking-[-0.035em]">
            <Word i={0}>{firstName}</Word>{" "}
            <span className="text-muted-2">
              <Word i={1}>{lastName}</Word>
            </span>
            <br />
            <span className="mt-3 block text-[0.52em] leading-[1.05] font-medium tracking-[-0.02em] text-accent-ink">
              <Word i={2}>{site.role.split(" ")[0]}</Word>{" "}
              <Word i={3}>{site.role.split(" ").slice(1).join(" ")}</Word>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease }}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted md:text-lg text-pretty"
          >
            <span className="text-foreground">{site.headline}</span> {site.positioning}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <CursorCircleLink
              href="#projects"
              className="group h-12 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent [--button-fill:var(--accent)] [--button-halo:#050805] [--button-halo-text:#fff]"
            >
              See the projects
              <LuArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </CursorCircleLink>
            <CursorCircleLink
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group h-12 rounded-full border border-border-strong bg-surface px-6 text-sm font-medium [--button-fill:var(--surface)] [--button-halo:var(--accent)] [--button-halo-text:#031006]"
            >
              <BrandIcon provider="github" className="h-4 w-4" />
              GitHub
              <LuArrowUpRight className="h-4 w-4 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </CursorCircleLink>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-border border-y border-border"
          >
            <Stat label="Public repos" value={profile?.public_repos ?? 0} />
            <Stat label="Followers" value={profile?.followers ?? 0} />
            <Stat label="Last push" value={lastPush ? relativeTime(lastPush) : "—"} />
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease }}
          className="relative mx-auto aspect-square w-full max-w-[420px] lg:col-span-5 lg:max-w-none"
        >
          <CornerTicks />
          <div className="absolute inset-0">
            <ContributionSkyline compact />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4 first:pl-0 last:pr-0">
      <dt className="eyebrow">{label}</dt>
      <dd className="font-display text-xl font-medium tabular-nums md:text-2xl">{value}</dd>
    </div>
  )
}

function CornerTicks() {
  const cls = "absolute h-4 w-4 border-accent/60"
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
      <span className={`${cls} top-0 left-0 border-t border-l`} />
      <span className={`${cls} top-0 right-0 border-t border-r`} />
      <span className={`${cls} bottom-0 left-0 border-b border-l`} />
      <span className={`${cls} right-0 bottom-0 border-r border-b`} />
    </div>
  )
}
