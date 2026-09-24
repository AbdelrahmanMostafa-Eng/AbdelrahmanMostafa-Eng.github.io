"use client"

import { LuArrowUpRight } from "react-icons/lu"
import { nav, site } from "@/lib/site"
import { useGitHubProfile, useGitHubSocials } from "@/lib/github"
import { AvatarBadge } from "./avatar-badge"
import { BrandIcon, brandFor } from "./ui/brand-icon"
import { Magnetic } from "./ui/magnetic"

export function Footer() {
  const { data: profile } = useGitHubProfile()
  const { data: socials } = useGitHubSocials()
  const year = new Date().getFullYear()

  const social = [
    { provider: "github", url: site.githubUrl, label: "GitHub" },
    ...(socials ?? []).map((s) => ({ provider: s.provider, url: s.url, label: brandFor(s.provider).label })),
    ...(site.email ? [{ provider: "email", url: `mailto:${site.email}`, label: "Email" }] : []),
  ]

  const repoUrl = `${site.githubUrl}/${site.githubUrl.split("/").pop()}.github.io`

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-28 md:px-8 md:pb-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#top" className="inline-flex items-center gap-3">
              <AvatarBadge size={44} />
              <span className="flex flex-col leading-tight">
                <span className="font-display font-semibold">{profile?.name ?? site.name}</span>
                <span className="text-xs text-muted">{site.role}</span>
              </span>
            </a>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted text-pretty">
              {site.headline} Based in {profile?.location ?? site.location}, heading for Aalto University in
              2027.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {social.map((s) => (
                <Magnetic key={s.url} strength={0.3}>
                  <a
                    href={s.url}
                    target={s.provider === "email" ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors duration-300 hover:border-accent hover:bg-accent-soft hover:text-foreground"
                  >
                    <BrandIcon provider={s.provider} className="h-4 w-4" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow">Navigate</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="eyebrow">Elsewhere</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <FooterLink href={`${site.githubUrl}?tab=repositories`}>Repositories</FooterLink>
              <FooterLink href={`${site.githubUrl}/portfolio-roadmap`}>Portfolio roadmap (2026–27)</FooterLink>
              <FooterLink href="https://schoolhouse.world">Schoolhouse.world tutoring</FooterLink>
              <FooterLink href="https://www.spaceappschallenge.org">NASA Space Apps Challenge</FooterLink>
              <FooterLink href="https://www.aalto.fi/en/study-options/bachelors-programme-in-science-and-technology-computer-engineering">
                Aalto Computer Engineering
              </FooterLink>
              {site.resumeUrl && <FooterLink href={site.resumeUrl}>Resume</FooterLink>}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.fullName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Next.js · React Three Fiber · Tailwind · deployed on GitHub Pages</span>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent"
            >
              Source <LuArrowUpRight className="h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        {children}
        <LuArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
      </a>
    </li>
  )
}
