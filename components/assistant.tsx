"use client"

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { LuMessageSquare, LuX, LuSend, LuArrowUpRight } from "react-icons/lu"
import { clsx } from "clsx"
import { answer, suggestions, type Answer } from "@/lib/assistant"
import { useGitHubProfile, useGitHubRepos, toProjects } from "@/lib/github"
import { site } from "@/lib/site"
import { AvatarBadge } from "./avatar-badge"

type Message = { id: number; role: "user" | "assistant"; text: string; links?: Answer["links"] }

const intro: Message = {
  id: 0,
  role: "assistant",
  text: `Hi, I'm ${site.name.split(" ")[0]}'s site assistant. I can tell you about his work, results, plans, or how to reach him.`,
}

export function Assistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([intro])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [seen, setSeen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: profile } = useGitHubProfile()
  const { data: repos } = useGitHubRepos()
  const projects = useMemo(() => toProjects(repos), [repos])

  useEffect(() => {
    if (open) {
      setSeen(true)
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function ask(q: string) {
    const text = q.trim()
    if (!text) return
    setMessages((m) => [...m, { id: Date.now(), role: "user", text }])
    setInput("")
    setTyping(true)
    const a = answer(text, { profile, projects })
    // Small delay so the reply reads as a response rather than an instant echo.
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: a.text, links: a.links }])
    }, 450 + Math.min(text.length * 8, 500))
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) ask(input)
  }

  return (
    <>
      <div className="fixed right-5 bottom-6 z-40 md:right-8">
        <AnimatePresence>
          {!open && (
            <motion.button
              key="fab"
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open assistant"
              initial={{ opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 12 }}
              transition={{ duration: 0.4, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex h-12 items-center gap-2 rounded-full border border-border bg-background/80 pr-4 pl-1.5 text-sm font-medium backdrop-blur-xl transition-[box-shadow,border-color] duration-300 hover:border-accent hover:shadow-[0_0_0_1px_var(--accent),0_0_28px_-4px_var(--accent-glow)]"
            >
              <AvatarBadge size={36} />
              <span className="hidden sm:inline">Ask about me</span>
              <LuMessageSquare className="h-4 w-4 sm:hidden" />
              {!seen && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background" aria-hidden="true" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label="Site assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 bottom-3 z-50 flex max-h-[min(640px,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px] md:right-8"
          >
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <AvatarBadge size={34} />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">Site assistant</span>
                  <span className="flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    Answers instantly, runs in your browser
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <LuX className="h-4 w-4" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
              <ul className="flex flex-col gap-3">
                {messages.map((m) => (
                  <motion.li
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={clsx("flex", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={clsx(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "rounded-br-md bg-accent text-on-accent"
                          : "rounded-bl-md border border-border bg-surface text-foreground",
                      )}
                    >
                      <p className="text-pretty">{m.text}</p>
                      {m.links && m.links.length > 0 && (
                        <ul className="mt-2.5 flex flex-wrap gap-1.5">
                          {m.links.map((l) => (
                            <li key={l.href}>
                              <a
                                href={l.href}
                                target={l.href.startsWith("#") ? undefined : "_blank"}
                                rel="noreferrer noopener"
                                onClick={() => l.href.startsWith("#") && setOpen(false)}
                                className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:border-accent hover:bg-accent-soft"
                              >
                                {l.label}
                                <LuArrowUpRight className="h-3 w-3" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.li>
                ))}
                {typing && (
                  <li className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-surface px-3.5 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-muted"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="border-t border-border px-4 pt-3 pb-4">
              <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:bg-accent-soft hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask something…"
                  aria-label="Your question"
                  className="h-10 flex-1 rounded-full border border-border bg-surface px-4 text-sm placeholder:text-muted-2 transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => ask(input)}
                  disabled={!input.trim()}
                  aria-label="Send"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-[opacity,box-shadow] hover:shadow-[0_8px_24px_-8px_var(--accent-glow)] disabled:opacity-40"
                >
                  <LuSend className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}
