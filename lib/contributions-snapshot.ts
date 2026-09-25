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

// Updated by .github/workflows/contributions.yml. The initial empty state keeps
// the visual stable until the first repository workflow run completes.
export const contributionsSnapshot: ContributionsSnapshot = {
  totalContributions: 0,
  generatedAt: "not-yet-synced",
  weeks: Array.from({ length: 52 }, (_, week) => ({
    contributionDays: Array.from({ length: 7 }, (_, day) => ({
      date: `2026-W${String(week + 1).padStart(2, "0")}-${day + 1}`,
      contributionCount: 0,
    })),
  })),
}

export function isContributionSnapshotStale(snapshot: ContributionsSnapshot) {
  return snapshot.generatedAt === "not-yet-synced"
}
