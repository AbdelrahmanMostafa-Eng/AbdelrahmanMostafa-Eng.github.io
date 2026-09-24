"use client"

import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react"

const base = "relative isolate inline-flex overflow-hidden"

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  as?: "a"
}

export function CursorCircleLink({ className = "", children, onPointerMove, onPointerLeave, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)

  return (
    <a
      ref={ref}
      {...props}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`)
        event.currentTarget.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--cursor-x", "50%")
        event.currentTarget.style.setProperty("--cursor-y", "50%")
        onPointerLeave?.(event)
      }}
      className={`${base} cursor-circle-button ${className}`}
    >
      <span aria-hidden="true" className="cursor-circle-button__halo" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function CursorCircleButton({ className = "", children, onPointerMove, onPointerLeave, ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <button
      ref={ref}
      {...props}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`)
        event.currentTarget.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--cursor-x", "50%")
        event.currentTarget.style.setProperty("--cursor-y", "50%")
        onPointerLeave?.(event)
      }}
      className={`${base} cursor-circle-button ${className}`}
    >
      <span aria-hidden="true" className="cursor-circle-button__halo" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  )
}
