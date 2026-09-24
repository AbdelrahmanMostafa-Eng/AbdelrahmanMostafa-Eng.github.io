"use client"

import useSWR from "swr"
import { GITHUB_USER, hiddenRepos, repoMeta } from "./site"
import { profileSnapshot, reposSnapshot, socialsSnapshot } from "./github-snapshot"

export type GitHubProfile = {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  location: string | null
  blog: string | null
  twitter_username: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export type GitHubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  fork: boolean
  archived: boolean
  pushed_at: string
  updated_at: string
}

export type GitHubSocial = { provider: string; url: string }

const API = "https://api.github.com"
const TTL_MS = 10 * 60 * 1000

type CacheEntry<T> = { t: number; d: T }

function readCache<T>(key: string): CacheEntry<T> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : null
  } catch {
    return null
  }
}

function writeCache<T>(key: string, d: T) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify({ t: Date.now(), d }))
  } catch {
    // Storage full or blocked; the request result is still returned to SWR.
  }
}

async function cachedFetch<T>(path: string): Promise<T> {
  const key = `gh:${path}`
  const cached = readCache<T>(key)
  if (cached && Date.now() - cached.t < TTL_MS) return cached.d

  const res = await fetch(`${API}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  })

  if (!res.ok) {
    // Rate-limited or offline: prefer stale data over an empty screen.
    if (cached) return cached.d
    throw new Error(`GitHub ${res.status}`)
  }

  const data = (await res.json()) as T
  writeCache(key, data)
  return data
}

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: TTL_MS,
  errorRetryCount: 1,
}

export function useGitHubProfile() {
  return useSWR<GitHubProfile>(`/users/${GITHUB_USER}`, cachedFetch, {
    ...swrOptions,
    fallbackData: profileSnapshot,
  })
}

export function useGitHubRepos() {
  return useSWR<GitHubRepo[]>(
    `/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
    cachedFetch,
    { ...swrOptions, fallbackData: reposSnapshot },
  )
}

export function useGitHubSocials() {
  return useSWR<GitHubSocial[]>(`/users/${GITHUB_USER}/social_accounts`, cachedFetch, {
    ...swrOptions,
    fallbackData: socialsSnapshot,
  })
}

export type Project = GitHubRepo & {
  tags: string[]
  summary: string
  priority: number
}

export function toProjects(repos: GitHubRepo[] | undefined): Project[] {
  if (!repos) return []
  return repos
    .filter((r) => !r.fork && !r.archived && !hiddenRepos.has(r.name))
    .map((r) => {
      const meta = repoMeta[r.name] ?? {}
      const liveTags = [r.language, ...(r.topics ?? [])].filter(Boolean) as string[]
      const tags = Array.from(new Set([...(meta.tags ?? []), ...liveTags])).slice(0, 4)
      const summary =
        r.description?.trim() ||
        meta.description ||
        `${r.language ?? "Code"} repository, last pushed ${formatDate(r.pushed_at)}.`
      return { ...r, tags, summary, priority: meta.priority ?? 0 }
    })
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count
      if (b.priority !== a.priority) return b.priority - a.priority
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    })
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days < 1) return "today"
  if (days === 1) return "yesterday"
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`
  const years = Math.floor(months / 12)
  return `${years} year${years > 1 ? "s" : ""} ago`
}
