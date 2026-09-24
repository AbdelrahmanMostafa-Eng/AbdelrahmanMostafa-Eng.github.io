"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { LuArrowUpRight, LuGitFork, LuStar, LuRefreshCw } from "react-icons/lu"
import { clsx } from "clsx"
import { useGitHubRepos, toProjects, relativeTime, type Project } from "@/lib/github"
import { site } from "@/lib/site"
import { SectionHeading } from "../ui/section-heading"
import { Reveal } from "../ui/reveal"
import { TiltCard } from "../ui/tilt-card"
import { BrandIcon } from "../ui/brand-icon"

const ease = [0.16, 1, 0.3, 1] as const

export function Projects() {
  const { data, isValidating, error } = useGitHubRepos()
  const projects = useMemo(() => toProjects(data), [data])
  const [filter, setFilter] = useState<string>("All")

  const languages = useMemo(() => {
    const counts = new Map<string, number>()
    projects.forEach((p) => p.language && counts.set(p.language, (counts.get(p.language) ?? 0) + 1))
    return ["All", ...Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([l]) => l)]
  }, [projects])

  const visible = filter === "All" ? projects : projects.filter((p) => p.language === filter)

  return (
    <section id="projects" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Projects"
            title="Public work, straight from the repositories."
            description="This list is generated from my GitHub account every time the page loads. Push a new repo, and it shows up here."
          />
          <Reveal direction="right" delay={0.2} className="flex items-center gap-3 text-xs text-muted">
            <span className={clsx("inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5", isValidating && "text-accent-ink")}>
              <LuRefreshCw className={clsx("h-3 w-3", isValidating && "animate-spin")} />
              {error ? "Showing cached data" : isValidating ? "Syncing with GitHub" : "Synced with GitHub"}
            </span>
            <span className="tabular-nums">{projects.length} repositories</span>
          </Reveal>
        </div>

        <Reveal className="mt-10 flex flex-wrap gap-2" delay={0.1}>
          {languages.map((lang) => {
            const active = filter === lang
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setFilter(lang)}
                aria-pressed={active}
                className={clsx(
                  "relative rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300",
                  active
                    ? "border-accent bg-accent text-on-accent"
                    : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {lang}
              </button>
            )
          })}
        </Reveal>

        <motion.ul layout className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.li
                layout
                key={p.id}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.05, ease }}
                className={clsx(i === 0 && filter === "All" && "md:col-span-2")}
              >
                <ProjectCard project={p} featured={i === 0 && filter === "All"} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <Reveal className="mt-10 flex justify-center" delay={0.1}>
          <a
            href={`${site.githubUrl}?tab=repositories`}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-accent hover:bg-accent-soft"
          >
            <BrandIcon provider="github" className="h-4 w-4" />
            All repositories on GitHub
            <LuArrowUpRight className="h-4 w-4 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function ProjectCard({ project: p, featured }: { project: Project; featured: boolean }) {
  const live = p.homepage?.trim()
  return (
    <TiltCard className="rounded-2xl">
      <article
        className={clsx(
          "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-500 group-hover:border-accent/50 group-hover:shadow-[0_24px_60px_-30px_var(--accent-glow)]",
          featured && "md:p-8",
        )}
      >
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className={clsx("font-display font-semibold tracking-tight text-balance", featured ? "text-2xl md:text-3xl" : "text-xl")}>
              {p.name}
            </h3>
            <div className="flex shrink-0 items-center gap-3 text-xs text-muted tabular-nums">
              {p.stargazers_count > 0 && (
                <span className="inline-flex items-center gap-1">
                  <LuStar className="h-3.5 w-3.5" /> {p.stargazers_count}
                </span>
              )}
              {p.forks_count > 0 && (
                <span className="inline-flex items-center gap-1">
                  <LuGitFork className="h-3.5 w-3.5" /> {p.forks_count}
                </span>
              )}
            </div>
          </div>
          <p className={clsx("mt-3 leading-relaxed text-muted text-pretty", featured ? "max-w-xl text-base" : "text-sm")}>
            {p.summary}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {p.tags.map((t) => (
              <li key={t} className="rounded-md border border-border bg-background/60 px-2 py-0.5 text-[11px] font-medium text-muted">
                {t}
              </li>
            ))}
          </ul>
          <span className="text-[11px] text-muted-2 tabular-nums">Updated {relativeTime(p.pushed_at)}</span>
        </div>

        {/* Links slide up on hover; on touch devices they are always visible. */}
        <div className="mt-4 flex gap-2 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <a
            href={p.html_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border-strong bg-background px-3.5 text-xs font-medium transition-colors hover:border-accent hover:bg-accent-soft"
          >
            <BrandIcon provider="github" className="h-3.5 w-3.5" />
            Repository
          </a>
          {live && (
            <a
              href={live.startsWith("http") ? live : `https://${live}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-3.5 text-xs font-semibold text-on-accent transition-shadow hover:shadow-[0_8px_24px_-8px_var(--accent-glow)]"
            >
              Live site
              <LuArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </article>
    </TiltCard>
  )
}
