"use client"

import { motion } from "motion/react"
import { LuQuote } from "react-icons/lu"
import { useGitHubProfile } from "@/lib/github"
import { achievements, site, stats } from "@/lib/site"
import { Reveal, Stagger, StaggerItem } from "../ui/reveal"
import { SectionHeading } from "../ui/section-heading"
import { BrandIcon } from "../ui/brand-icon"

export function About() {
  const { data: profile } = useGitHubProfile()
  const bio = profile?.bio?.trim() || "Js don't be average."
  const since = profile?.created_at ? new Date(profile.created_at).getFullYear() : 2026

  return (
    <section id="about" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow="About" title="An engineer in training, with a paddock mindset." />

              <Reveal direction="left" delay={0.2} className="mt-10">
                <figure className="relative rounded-2xl border border-border bg-surface p-6 md:p-7">
                  <LuQuote className="absolute -top-3 left-6 h-6 w-6 rounded-md bg-background p-1 text-accent" />
                  <blockquote className="font-display text-2xl leading-snug font-medium tracking-tight md:text-3xl">
                    {bio}
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-2 text-xs text-muted">
                    <BrandIcon provider="github" className="h-3.5 w-3.5" />
                    GitHub bio, pulled live from{" "}
                    <a href={site.githubUrl} target="_blank" rel="noreferrer noopener" className="underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent">
                      @{profile?.login ?? "AbdelrahmanMostafa-Eng"}
                    </a>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal className="text-lg leading-relaxed text-muted md:text-xl" delay={0.1}>
              <p className="text-pretty">
                I&apos;m <span className="text-foreground">{site.fullName}</span>, a Grade 12 student in{" "}
                {profile?.location ?? site.location}, studying in a {site.school}. I write software that
                simulates, analyzes and optimizes systems, most of it inspired by Formula SAE: vehicle
                dynamics calculators, telemetry simulators and race-strategy tooling in Python.
              </p>
              <p className="mt-6 text-pretty">
                Lately that has widened into TypeScript and Next.js work (a live website for a biology
                academy), a Rust toolchain experiment, and a local-first memory store for AI agents. The
                long-term plan is a Computer Engineering degree at Aalto University, a master&apos;s in the
                Netherlands, and eventually engineering work at ASML.
              </p>
              <p className="mt-6 text-pretty">
                Shipping publicly since {since}. Everything on this page, including the project list and
                bio, is read from my GitHub account when you load it.
              </p>
            </Reveal>

            <Stagger className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4" step={0.07}>
              {stats.map((s) => (
                <StaggerItem key={s.label} className="group relative flex flex-col gap-1 bg-background p-5 transition-colors duration-300 hover:bg-accent-soft">
                  <span className="eyebrow">{s.label}</span>
                  <span className="font-display text-3xl font-semibold tabular-nums tracking-tight text-accent-ink md:text-4xl">
                    {s.value}
                  </span>
                  <span className="text-xs leading-snug text-muted">{s.detail}</span>
                </StaggerItem>
              ))}
            </Stagger>

            <div className="mt-14">
              <Reveal>
                <h3 className="eyebrow">Achievements &amp; involvement</h3>
              </Reveal>
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {achievements.map((a, i) => (
                  <motion.li
                    key={a.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 py-4 md:grid-cols-[6rem_1fr_auto]"
                  >
                    <span className="text-xs text-muted tabular-nums">{a.year}</span>
                    <div>
                      <p className="font-medium transition-colors duration-300 group-hover:text-accent-ink">{a.title}</p>
                      <p className="mt-0.5 text-sm text-muted">{a.detail}</p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="hidden h-px w-8 bg-border transition-all duration-500 group-hover:w-14 group-hover:bg-accent md:block"
                    />
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
