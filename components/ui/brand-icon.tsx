import { SiGithub, SiInstagram, SiX } from "react-icons/si"
import { FaLinkedinIn } from "react-icons/fa6"
import { LuMail, LuGlobe } from "react-icons/lu"
import type { IconType } from "react-icons"

const icons: Record<string, { Icon: IconType; label: string }> = {
  github: { Icon: SiGithub, label: "GitHub" },
  linkedin: { Icon: FaLinkedinIn, label: "LinkedIn" },
  instagram: { Icon: SiInstagram, label: "Instagram" },
  twitter: { Icon: SiX, label: "X" },
  x: { Icon: SiX, label: "X" },
  email: { Icon: LuMail, label: "Email" },
  generic: { Icon: LuGlobe, label: "Website" },
}

export function brandFor(provider: string) {
  return icons[provider.toLowerCase()] ?? icons.generic
}

export function BrandIcon({ provider, className }: { provider: string; className?: string }) {
  const { Icon, label } = brandFor(provider)
  return <Icon className={className} aria-label={label} />
}
