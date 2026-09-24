"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "motion/react"
import { LuCheck } from "react-icons/lu"
import { goals, pathway } from "@/lib/site"
import { SectionHeading } from "../ui/section-heading"
import { Reveal } from "../ui/reveal"

export function Pathway() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 })
  const done = goals.filter((g) => g.done).length

  return (
    <section id="pathway" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Pathway"
          title="Where this is going."
          description="A deliberately long-term plan: Saudi Arabia to Aalto, Aalto to the Netherlands, then ASML. The dates are real deadlines I'm working toward."
        />

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <ol ref={ref} className="relative lg:col-span-7">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: progress }}
              className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-accent shadow-[0_0_12px_var(--accent-glow)]"
            />
            {pathway.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative grid grid-cols-[16px_1fr] gap-x-6 pb-12 last:pb-0 md:grid-cols-[16px_10rem_1fr]"
              >
                <span className="relative mt-1.5 flex h-4 w-4 items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-background ring-2 ring-accent transition-all duration-500 group-hover:h-3 group-hover:w-3 group-hover:bg-accent" />
                </span>
                <p className="text-xs font-medium tracking-wide text-accent-ink tabular-nums md:pt-1.5">{step.when}</p>
                <div className="col-start-2 mt-2 md:col-start-3 md:mt-0">
                  <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{step.title}</h3>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted text-pretty md:text-base">{step.body}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {step.tags.map((t) => (
                      <li key={t} className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="sr-only">Step {i + 1} of {pathway.length}</span>
              </motion.li>
            ))}
          </ol>

          <div className="lg:col-span-5">
            <Reveal direction="right" delay={0.15} className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-border bg-surface p-6 md:p-7">
                <div className="flex items-baseline justify-between">
                  <h3 className="eyebrow">Goals 2026 – 2027</h3>
                  <span className="text-xs text-muted tabular-nums">
                    {done}/{goals.length} done
                  </span>
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(done / goals.length) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
                <ul className="mt-6 flex flex-col gap-3">
                  {goals.map((g, i) => (
                    <motion.li
                      key={g.text}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span
                        className={
                          g.done
                            ? "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent"
                            : "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-border-strong"
                        }
                        aria-hidden="true"
                      >
                        {g.done && <LuCheck className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span className={g.done ? "text-muted line-through decoration-border" : "text-foreground"}>
                        {g.text}
                        <span className="sr-only">{g.done ? " (done)" : " (in progress)"}</span>
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
