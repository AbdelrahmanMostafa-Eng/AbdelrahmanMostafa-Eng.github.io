export type ContributionDay = {
  date: string
  contributionCount: number
}

export type ContributionWeek = {
  contributionDays: ContributionDay[]
}

export type ContributionsSnapshot = {
  totalContributions: number
  weeks: ContributionWeek[]
  generatedAt: string
}

// Placeholder-for-preview-only: replaced by the daily GitHub Actions snapshot.
const previewDays = Array.from({ length: 364 }, (_, index) => {
  const wave = Math.sin(index * 0.31) + Math.sin(index * 0.077) * 0.7
  const spike = index % 47 === 0 || index % 83 === 0 ? 18 + (index % 9) : 0
  const contributionCount = Math.max(0, Math.round(wave * 2.2 + 3 + spike))
  const date = new Date(Date.UTC(2026, 0, 1 + index)).toISOString().slice(0, 10)
  return { date, contributionCount }
})

export const contributionsSnapshot: ContributionsSnapshot = {
  totalContributions: previewDays.reduce((total, day) => total + day.contributionCount, 0),
  generatedAt: "preview-placeholder",
  weeks: Array.from({ length: 52 }, (_, week) => ({ contributionDays: previewDays.slice(week * 7, week * 7 + 7) })),
}

export function isContributionSnapshotStale(snapshot: ContributionsSnapshot) {
  if (snapshot.generatedAt === "preview-placeholder" || snapshot.generatedAt === "not-yet-synced") return true
  return Date.now() - new Date(snapshot.generatedAt).getTime() > 48 * 60 * 60 * 1000
}
