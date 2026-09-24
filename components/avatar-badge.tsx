"use client"

import { useEffect, useRef, useState } from "react"
import { useGitHubProfile } from "@/lib/github"
import { site } from "@/lib/site"
import { clsx } from "clsx"

const FALLBACK = "/images/profile.png"

/**
 * Circular badge with "AM" initials as the base layer and the profile photo
 * layered on top of it. The photo comes from GitHub (auto-updates when the
 * account avatar changes) and falls back to the bundled photo if that fails.
 */
export function AvatarBadge({ size = 40, className }: { size?: number; className?: string }) {
  const { data } = useGitHubProfile()
  const imgRef = useRef<HTMLImageElement>(null)
  const [src, setSrc] = useState<string | null>(data?.avatar_url ?? FALLBACK)
  const [loaded, setLoaded] = useState(false)

  // The server-rendered <img> can finish loading before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) setLoaded(true)
  }, [src])

  useEffect(() => {
    if (data?.avatar_url && data.avatar_url !== src && src !== FALLBACK) return
    if (data?.avatar_url && src === FALLBACK) setSrc(data.avatar_url)
  }, [data?.avatar_url, src])

  return (
    <span
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2 ring-1 ring-border-strong transition-shadow duration-500",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden="true"
        className="font-display absolute inset-0 flex items-center justify-center font-semibold text-accent-ink"
        style={{ fontSize: size * 0.36, letterSpacing: "-0.03em" }}
      >
        {site.initials}
      </span>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={`${site.name} profile photo`}
          width={size}
          height={size}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            if (src !== FALLBACK) setSrc(FALLBACK)
            else setSrc(null)
          }}
          className={clsx(
            "relative h-full w-full object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  )
}
