import Link from "next/link"
import { LuArrowLeft } from "react-icons/lu"
import { Header } from "@/components/header"
import { site } from "@/lib/site"

export const metadata = { title: "Page not found" }

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 pt-16 text-center">
        <div className="grid-texture absolute inset-0 -z-10" aria-hidden="true" />
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-6 bg-accent" aria-hidden="true" />
          Error 404
          <span className="h-px w-6 bg-accent" aria-hidden="true" />
        </p>
        <h1 className="font-display mt-6 text-[clamp(3rem,12vw,9rem)] leading-none font-semibold tracking-[-0.04em]">
          Off <span className="text-accent-ink">track</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted text-pretty md:text-lg">
          This page doesn&apos;t exist on {site.url.replace("https://", "")}. The site is a single page, so
          everything you&apos;re looking for is back at the start.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent transition-shadow duration-300 hover:shadow-[0_0_0_1px_var(--accent),0_12px_40px_-8px_var(--accent-glow)]"
        >
          <LuArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to the pit lane
        </Link>
      </main>
    </>
  )
}
