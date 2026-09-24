"use client"

import { motion } from "motion/react"
import {
  SiPython,
  SiCplusplus,
  SiJavascript,
  SiTypescript,
  SiRust,
  SiGit,
  SiGithub,
  SiNextdotjs,
  SiVercel,
  SiClaude,
} from "react-icons/si"
import { VscVscode } from "react-icons/vsc"
import type { IconType } from "react-icons"
import { skills } from "@/lib/site"
import { SectionHeading } from "../ui/section-heading"
import { Reveal, Stagger, StaggerItem } from "../ui/reveal"

const iconFor: Record<string, IconType> = {
  Python: SiPython,
  "C++": SiCplusplus,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Rust: SiRust,
  Git: SiGit,
  GitHub: SiGithub,
  "VS Code": VscVscode,
  Claude: SiClaude,
  "Next.js": SiNextdotjs,
  Vercel: SiVercel,
}

const ticker = [...skills.languages, ...skills.tools]

export function Skills() {
  return (
    <section id="skills" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Skills"
              title="A toolkit built around simulation and data."
              description="Languages I write daily, the tools I ship with, and the engineering domains I keep coming back to."
            />
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <h3 className="eyebrow">Languages</h3>
            </Reveal>
            <Stagger className="mt-4 flex flex-wrap gap-x-8 gap-y-3" step={0.06}>
              {skills.languages.map((l) => {
                const Icon = iconFor[l]
                return (
                  <StaggerItem key={l}>
                    <span className="group inline-flex items-center gap-3">
                      {Icon && (
                        <Icon className="h-6 w-6 text-muted transition-colors duration-300 group-hover:text-accent-ink" />
                      )}
                      <span className="font-display text-3xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent-ink md:text-4xl">
                        {l}
                      </span>
                    </span>
                  </StaggerItem>
                )
              })}
            </Stagger>

            <Reveal className="mt-12" delay={0.1}>
              <h3 className="eyebrow">Tools</h3>
            </Reveal>
            <Stagger className="mt-4 flex flex-wrap gap-2" step={0.05}>
              {skills.tools.map((t) => {
                const Icon = iconFor[t]
                return (
                  <StaggerItem key={t}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm transition-colors duration-300 hover:border-accent hover:bg-accent-soft">
                      {Icon && <Icon className="h-4 w-4" />}
                      {t}
                    </span>
                  </StaggerItem>
                )
              })}
            </Stagger>

            <Reveal className="mt-12" delay={0.1}>
              <h3 className="eyebrow">Domains</h3>
            </Reveal>
            <Stagger className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2" step={0.05}>
              {skills.domains.map((d, i) => (
                <StaggerItem key={d}>
                  <div className="group flex items-center justify-between bg-background px-5 py-4 transition-colors duration-300 hover:bg-accent-soft">
                    <span className="text-sm font-medium">{d}</span>
                    <span className="text-[11px] text-muted-2 tabular-nums transition-colors group-hover:text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>

      <div className="relative mt-20 overflow-hidden border-y border-border py-5" aria-hidden="true">
        <div className="marquee-track flex w-max gap-12 px-6">
          {[...ticker, ...ticker].map((item, i) => {
            const Icon = iconFor[item]
            return (
              <motion.span
                key={`${item}-${i}`}
                className="inline-flex items-center gap-3 text-sm font-medium text-muted"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item}
                <span className="ml-9 h-1 w-1 rounded-full bg-accent" />
              </motion.span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
