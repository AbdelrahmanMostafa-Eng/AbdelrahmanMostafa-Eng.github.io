"use client"

import { Canvas } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { ParticleObject } from "./particle-object"

type Capability = "full" | "lite" | "static"

function useCapability(): Capability | null {
  const [cap, setCap] = useState<Capability | null>(null)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const small = window.innerWidth < 768
    const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }
    const lowMem = (nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) <= 4
    if (reduce) setCap("static")
    else if (small || coarse || lowMem) setCap("lite")
    else setCap("full")
  }, [])
  return cap
}

export function HeroScene() {
  const cap = useCapability()
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== "light"
  const accent = dark ? "#00ff43" : "#00ce37"
  const dim = dark ? "#0f3a1c" : "#9fd9ae"

  if (!cap) {
    return <div className="h-full w-full" aria-hidden="true" />
  }

  const count = cap === "full" ? 16000 : cap === "lite" ? 6000 : 3500
  const interactive = cap === "full"

  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, cap === "full" ? 1.75 : 1.25]}
      camera={{ position: [0, 0, 5.6], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={cap === "static" ? "demand" : "always"}
      eventSource={undefined}
      aria-hidden="true"
    >
      <ambientLight intensity={dark ? 0.35 : 0.9} />
      <directionalLight position={[3, 4, 5]} intensity={dark ? 3.2 : 2.4} color="#ffffff" />
      <pointLight position={[-4, -2, -3]} intensity={dark ? 18 : 9} color={accent} distance={14} decay={2} />
      <pointLight position={[2, -3, 2]} intensity={dark ? 6 : 3} color={dark ? "#7fffa4" : "#ffffff"} distance={12} decay={2} />
      <ParticleObject accent={accent} dim={dim} dark={dark} count={count} interactive={interactive} />
    </Canvas>
  )
}
