"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { useTheme } from "next-themes"
import { useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { contributionsSnapshot, isContributionSnapshotStale, type ContributionDay } from "@/lib/contributions-snapshot"
import { SectionHeading } from "../ui/section-heading"
import { Reveal } from "../ui/reveal"

const levels = ["#082611", "#0a5a25", "#0ba934", "#24e85a", "#00ff43"]

function useSkylineCapability() {
  const { viewport } = useThree()
  return typeof window !== "undefined" && viewport.width > 6 && window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function SkylineBars({ dark }: { dark: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  const [hovered, setHovered] = useState<ContributionDay | null>(null)
  const full = useSkylineCapability()
  const days = useMemo(() => contributionsSnapshot.weeks.flatMap((week) => week.contributionDays), [])
  const max = Math.max(1, ...days.map((day) => day.contributionCount))

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.14 + Math.sin(state.clock.elapsedTime * 0.12) * 0.035, 0.035)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -0.36 + pointer.y * 0.04, 0.035)
  })

  return (
    <group ref={group} position={[-3.75, -1.2, 0]} rotation={[-0.36, 0.16, 0]}>
      {days.map((day, index) => {
        const count = day.contributionCount
        const level = count === 0 ? 0 : Math.min(4, Math.ceil((count / max) * 4))
        const height = full ? 0.08 + Math.sqrt(count / max) * 0.95 : 0.1
        const x = (index % 52) * 0.15
        const y = Math.floor(index / 52) * 0.15
        return (
          <mesh
            key={`${day.date}-${index}`}
            position={[x, height / 2 + y, 0]}
            scale={hovered?.date === day.date ? [1.12, 1.2, 1.12] : [1, 1, 1]}
            onPointerOver={() => setHovered(day)}
            onPointerOut={() => setHovered(null)}
          >
            <boxGeometry args={[0.1, height, 0.1]} />
            <meshStandardMaterial color={levels[level]} emissive={levels[level]} emissiveIntensity={dark ? 0.28 + level * 0.16 : 0.1 + level * 0.08} roughness={0.62} metalness={0.18} />
          </mesh>
        )
      })}
      {hovered && (
        <Html position={[26 * 0.15, 1.35, 0.2]} center>
          <div className="whitespace-nowrap rounded-lg border border-border-strong bg-background/95 px-3 py-2 text-xs shadow-2xl backdrop-blur">
            <strong className="block text-foreground">{hovered.contributionCount} contributions</strong>
            <span className="text-muted">{hovered.date}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

function Skyline2D() {
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-hidden rounded-xl border border-border bg-surface p-3" aria-label="GitHub contribution calendar">
      {contributionsSnapshot.weeks.flatMap((week) => week.contributionDays).map((day, index) => {
        const level = day.contributionCount === 0 ? 0 : Math.min(4, Math.ceil(day.contributionCount / 5))
        return <span key={`${day.date}-${index}`} title={`${day.contributionCount} contributions on ${day.date}`} className="aspect-square min-w-1.5 rounded-[2px]" style={{ backgroundColor: levels[level], opacity: level === 0 ? 0.45 : 0.95 }} />
      })}
    </div>
  )
}

export function Contributions() {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== "light"
  const stale = isContributionSnapshotStale(contributionsSnapshot)

  return (
    <section id="activity" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="GitHub activity" title="A year of building, rendered in depth." description="My contribution calendar, turned into a small skyline. Every block is a day; every rise is a little more momentum." />
          <Reveal direction="right" className="flex items-center gap-3 text-xs text-muted">
            <span className="rounded-full border border-border bg-surface px-3 py-1.5">{stale ? "Snapshot ready to sync" : "Updated daily"}</span>
            <span className="tabular-nums">{contributionsSnapshot.totalContributions} contributions</span>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="mt-12">
          <div className="relative h-[300px] overflow-hidden rounded-2xl border border-border bg-surface/60 shadow-[inset_0_1px_0_var(--border)] md:h-[390px]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,var(--accent-soft),transparent_58%)]" />
            <Canvas camera={{ position: [0, 2.1, 8.5], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={dark ? 0.42 : 0.8} />
              <directionalLight position={[2, 4, 5]} intensity={dark ? 2.8 : 2.2} color="#ffffff" />
              <pointLight position={[-4, 1, 3]} intensity={dark ? 8 : 4} color={dark ? "#00ff43" : "#00ce37"} />
              <SkylineBars dark={dark} />
            </Canvas>
            <div className="pointer-events-none absolute inset-x-5 bottom-4 flex justify-between text-[10px] uppercase tracking-[0.18em] text-muted"><span>Less</span><span>More</span></div>
          </div>
          <div className="mt-4 md:hidden"><Skyline2D /></div>
        </Reveal>
      </div>
    </section>
  )
}
