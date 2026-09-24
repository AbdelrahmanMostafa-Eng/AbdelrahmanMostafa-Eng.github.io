import type { GitHubProfile, GitHubRepo, GitHubSocial } from "./github"

// Snapshot of the GitHub account taken at build time. It is only the first
// paint: SWR replaces it with live API data as soon as the page loads.
export const profileSnapshot: GitHubProfile = {
  "login": "AbdelrahmanMostafa-Eng",
  "name": "Abdelrahman Mostafa",
  "avatar_url": "https://avatars.githubusercontent.com/u/252904306?v=4",
  "html_url": "https://github.com/AbdelrahmanMostafa-Eng",
  "bio": "Js don't be average.",
  "location": "Saudi Arabia",
  "blog": "abdelrahmanmostafa-eng.github.io",
  "twitter_username": "AbdElRahmanm988",
  "public_repos": 12,
  "followers": 5,
  "following": 19,
  "created_at": "2026-01-04T15:43:30Z"
}

export const reposSnapshot: GitHubRepo[] = [
  {
    "id": 1385173823,
    "name": "AbdelrahmanMostafa-Eng.github.io",
    "full_name": "AbdelrahmanMostafa-Eng/AbdelrahmanMostafa-Eng.github.io",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/AbdelrahmanMostafa-Eng.github.io",
    "description": "Portfolio Website",
    "homepage": null,
    "language": null,
    "stargazers_count": 0,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-09-24T09:34:57Z",
    "updated_at": "2026-09-24T09:35:01Z"
  },
  {
    "id": 1342717169,
    "name": "bioacademy",
    "full_name": "AbdelrahmanMostafa-Eng/bioacademy",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/bioacademy",
    "description": "Dr. Mina's Website",
    "homepage": "https://bioacademy-tau.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-09-17T18:18:19Z",
    "updated_at": "2026-09-17T18:18:24Z"
  },
  {
    "id": 1367247489,
    "name": "vscode-python-environments",
    "full_name": "AbdelrahmanMostafa-Eng/vscode-python-environments",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/vscode-python-environments",
    "description": "VS Code Python Environments extension - Fork with localization fix",
    "homepage": null,
    "language": null,
    "stargazers_count": 0,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-09-12T11:45:53Z",
    "updated_at": "2026-09-12T11:45:53Z"
  },
  {
    "id": 1133562614,
    "name": "AbdelrahmanMostafa-Eng",
    "full_name": "AbdelrahmanMostafa-Eng/AbdelrahmanMostafa-Eng",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/AbdelrahmanMostafa-Eng",
    "description": null,
    "homepage": null,
    "language": null,
    "stargazers_count": 0,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-09-12T11:22:02Z",
    "updated_at": "2026-09-12T11:22:05Z"
  },
  {
    "id": 1340914372,
    "name": "agent-vault",
    "full_name": "AbdelrahmanMostafa-Eng/agent-vault",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/agent-vault",
    "description": "Secure, local-first memory and context storage for AI agents.",
    "homepage": null,
    "language": "Python",
    "stargazers_count": 1,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-09-09T13:56:33Z",
    "updated_at": "2026-09-09T13:59:50Z"
  },
  {
    "id": 1309130951,
    "name": "bioenv",
    "full_name": "AbdelrahmanMostafa-Eng/bioenv",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/bioenv",
    "description": null,
    "homepage": null,
    "language": "Rust",
    "stargazers_count": 1,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-07-29T12:45:24Z",
    "updated_at": "2026-08-25T20:23:00Z"
  },
  {
    "id": 1340953812,
    "name": "chatbot",
    "full_name": "AbdelrahmanMostafa-Eng/chatbot",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/chatbot",
    "description": null,
    "homepage": null,
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-08-20T17:10:09Z",
    "updated_at": "2026-08-20T17:12:38Z"
  },
  {
    "id": 1324137480,
    "name": "torqon",
    "full_name": "AbdelrahmanMostafa-Eng/torqon",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/torqon",
    "description": null,
    "homepage": null,
    "language": null,
    "stargazers_count": 0,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-08-05T14:22:28Z",
    "updated_at": "2026-08-05T14:22:28Z"
  },
  {
    "id": 1133615322,
    "name": "portfolio-roadmap",
    "full_name": "AbdelrahmanMostafa-Eng/portfolio-roadmap",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/portfolio-roadmap",
    "description": "Portfolio roadmap documenting goals, skills, and projects (2026–2027).",
    "homepage": null,
    "language": null,
    "stargazers_count": 0,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-07-21T17:00:04Z",
    "updated_at": "2026-07-21T17:00:47Z"
  },
  {
    "id": 1297424028,
    "name": "GoogleDrive-Downloader",
    "full_name": "AbdelrahmanMostafa-Eng/GoogleDrive-Downloader",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/GoogleDrive-Downloader",
    "description": "A professional, high-performance Google Drive video downloader.",
    "homepage": "",
    "language": "Python",
    "stargazers_count": 1,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-07-11T12:37:07Z",
    "updated_at": "2026-07-11T12:47:29Z"
  },
  {
    "id": 1154710942,
    "name": "fsae-telemetry-simulator",
    "full_name": "AbdelrahmanMostafa-Eng/fsae-telemetry-simulator",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/fsae-telemetry-simulator",
    "description": "A modular Python project for simulating, analyzing, and visualizing Formula SAE telemetry data — including lap times, fuel usage, tire wear, speed traces, and race strategy metrics.",
    "homepage": null,
    "language": "Python",
    "stargazers_count": 2,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-02-25T12:54:57Z",
    "updated_at": "2026-06-10T14:43:07Z"
  },
  {
    "id": 1134186019,
    "name": "vehicle-dynamics-calculator",
    "full_name": "AbdelrahmanMostafa-Eng/vehicle-dynamics-calculator",
    "html_url": "https://github.com/AbdelrahmanMostafa-Eng/vehicle-dynamics-calculator",
    "description": "Python project to calculate basic vehicle dynamics metrics (braking distance, weight transfer, lateral acceleration, tire load sensitivity).",
    "homepage": null,
    "language": "Python",
    "stargazers_count": 2,
    "forks_count": 0,
    "topics": [],
    "fork": false,
    "archived": false,
    "pushed_at": "2026-02-11T18:37:19Z",
    "updated_at": "2026-03-26T19:13:21Z"
  }
]

export const socialsSnapshot: GitHubSocial[] = [
  {
    "provider": "linkedin",
    "url": "https://www.linkedin.com/in/abdelrahmanmostafa-eng"
  },
  {
    "provider": "instagram",
    "url": "https://www.instagram.com/abdelrahman_abouelkhair/"
  },
  {
    "provider": "twitter",
    "url": "https://x.com/AbdElRahmanm988"
  }
]
