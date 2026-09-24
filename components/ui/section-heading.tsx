import { Reveal } from "./reveal"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal direction="up" duration={0.6}>
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-6 bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal direction="clip" delay={0.05}>
        <h2 className="font-display mt-4 text-3xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal direction="up" delay={0.15} duration={0.7}>
          <p className="mt-5 text-base leading-relaxed text-muted text-pretty md:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  )
}
