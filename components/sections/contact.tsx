"use client"

import { useState, type FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { LuArrowUpRight, LuCheck, LuCopy, LuSend, LuLoader } from "react-icons/lu"
import { clsx } from "clsx"
import { site } from "@/lib/site"
import { useGitHubSocials } from "@/lib/github"
import { SectionHeading } from "../ui/section-heading"
import { Reveal } from "../ui/reveal"
import { BrandIcon, brandFor } from "../ui/brand-icon"

type Status = "idle" | "sending" | "sent" | "error" | "copied"

export function Contact() {
  const { data: socials } = useGitHubSocials()
  const [status, setStatus] = useState<Status>("idle")
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const links = [
    { provider: "github", url: site.githubUrl, label: "GitHub", handle: "@AbdelrahmanMostafa-Eng" },
    ...(socials ?? []).map((s) => ({
      provider: s.provider,
      url: s.url,
      label: brandFor(s.provider).label,
      handle: handleFrom(s.url),
    })),
    ...(site.email ? [{ provider: "email", url: `mailto:${site.email}`, label: "Email", handle: site.email }] : []),
  ]

  const canDeliver = Boolean(site.formspreeId) || Boolean(site.email)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (site.formspreeId) {
      setStatus("sending")
      try {
        const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        setStatus(res.ok ? "sent" : "error")
        if (res.ok) setForm({ name: "", email: "", message: "" })
      } catch {
        setStatus("error")
      }
      return
    }
    if (site.email) {
      const subject = encodeURIComponent(`Portfolio message from ${form.name || "a visitor"}`)
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
      setStatus("sent")
      return
    }
    try {
      await navigator.clipboard.writeText(`${form.message}\n\n— ${form.name} (${form.email})`)
      setStatus("copied")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contact"
              title="Let's build something that moves."
              description="Internships, FSAE collaborations, open-source ideas or just a question about the pathway. I read everything."
            />

            <ul className="mt-10 flex flex-col divide-y divide-border border-y border-border">
              {links.map((l, i) => (
                <Reveal key={l.url} as="li" delay={0.1 + i * 0.06} duration={0.6}>
                  <a
                    href={l.url}
                    target={l.provider === "email" ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between py-4 transition-colors"
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition-colors duration-300 group-hover:border-accent group-hover:bg-accent-soft">
                        <BrandIcon provider={l.provider} className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">{l.label}</span>
                        <span className="text-xs text-muted">{l.handle}</span>
                      </span>
                    </span>
                    <LuArrowUpRight className="h-4 w-4 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink" />
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal direction="right" delay={0.15} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-border bg-surface p-6 md:p-8"
              aria-describedby="contact-help"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Name" id="name">
                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Email" id="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Message" id="message" className="md:col-span-2">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={clsx(inputCls, "resize-y")}
                    placeholder="What are you working on?"
                  />
                </Field>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p id="contact-help" className="text-xs text-muted">
                  {canDeliver
                    ? "Delivered straight to my inbox. I reply within a couple of days."
                    : "Your email app will open with the message addressed to me."}
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_var(--accent),0_16px_42px_-10px_var(--accent-glow)] active:translate-y-0 disabled:opacity-70"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={status}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-2"
                      >
                        {status === "sending" && (
                          <>
                            <LuLoader className="h-4 w-4 animate-spin" /> Sending
                          </>
                        )}
                        {status === "sent" && (
                          <>
                            <LuCheck className="h-4 w-4" /> Sent
                          </>
                        )}
                        {status === "copied" && (
                          <>
                            <LuCopy className="h-4 w-4" /> Copied to clipboard
                          </>
                        )}
                        {status === "error" && <>Something went wrong, try again</>}
                        {status === "idle" && (
                          <>
                            Send message <LuSend className="h-4 w-4" />
                          </>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-2 transition-[border-color,box-shadow] duration-300 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] focus:outline-none"

function Field({
  label,
  id,
  children,
  className,
}: {
  label: string
  id: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      {children}
    </div>
  )
}

function handleFrom(url: string) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split("/").filter(Boolean)
    const last = parts[parts.length - 1] ?? u.hostname
    return `@${last}`
  } catch {
    return url
  }
}
