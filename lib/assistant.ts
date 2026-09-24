import { achievements, goals, pathway, site, skills } from "./site"
import type { GitHubProfile, Project } from "./github"
import { relativeTime } from "./github"

export type Answer = {
  text: string
  links?: { label: string; href: string }[]
}

type Intent = {
  id: string
  patterns: RegExp[]
  answer: (ctx: Context) => Answer
}

export type Context = {
  profile?: GitHubProfile
  projects: Project[]
}

const intents: Intent[] = [
  {
    id: "greeting",
    patterns: [/^(hi|hello|hey|salam|yo|good (morning|evening|afternoon))\b/i],
    answer: () => ({
      text: `Hey! I'm the assistant on ${site.name}'s site. Ask me who he is, what he builds, how to reach him, or what he's working toward.`,
    }),
  },
  {
    id: "who",
    patterns: [/who (are|is)/i, /about (you|him|abdelrahman)/i, /tell me about/i, /introduce/i, /\bbio\b/i],
    answer: ({ profile }) => ({
      text: `${site.fullName} is a Grade 11 student in ${profile?.location ?? site.location} and an ${site.role.toLowerCase()}. He builds software that simulates, analyzes and optimizes systems, a lot of it inspired by Formula SAE. His GitHub bio right now: "${profile?.bio ?? "Js don't be average."}"`,
      links: [{ label: "About section", href: "#about" }],
    }),
  },
  {
    id: "latest",
    patterns: [/latest|recent|newest|last (push|commit|update)/i],
    answer: ({ projects }) => {
      const latest = [...projects].sort(
        (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
      )[0]
      if (!latest) return { text: "I could not load the repositories just now. GitHub is the source of truth.", links: [{ label: "GitHub", href: site.githubUrl }] }
      return {
        text: `The most recently updated repo is ${latest.name}, pushed ${relativeTime(latest.pushed_at)}. ${latest.summary}`,
        links: [{ label: `Open ${latest.name}`, href: latest.html_url }],
      }
    },
  },
  {
    id: "location",
    patterns: [/where.*(live|based|from|located)|location|country|saudi/i],
    answer: ({ profile }) => ({
      text: `${profile?.location ?? site.location}. Time zone ${site.timezone}.`,
    }),
  },
  {
    id: "do",
    patterns: [/what (do|does) (you|he) (do|build|make|work)/i, /what.*(working on|build)/i, /projects?/i, /portfolio/i, /repos?/i],
    answer: ({ projects, profile }) => {
      const top = projects.slice(0, 3)
      const names = top.map((p) => p.name).join(", ")
      return {
        text: `He has ${profile?.public_repos ?? projects.length} public repositories. The most notable right now: ${names}. Highlights include an FSAE telemetry simulator, a vehicle dynamics calculator, and a local-first memory store for AI agents.`,
        links: [
          { label: "Projects", href: "#projects" },
          ...top.slice(0, 2).map((p) => ({ label: p.name, href: p.html_url })),
        ],
      }
    },
  },
  {
    id: "contact",
    patterns: [/contact|reach|email|message|hire|intern|collab|get in touch|talk/i],
    answer: () => ({
      text: `The fastest routes are LinkedIn and the contact form on this page. He's open to internships, FSAE collaborations and open-source ideas.${site.email ? ` You can also email ${site.email}.` : ""}`,
      links: [
        { label: "Contact form", href: "#contact" },
        { label: "LinkedIn", href: site.linkedinUrl },
        ...(site.email ? [{ label: "Email", href: `mailto:${site.email}` }] : []),
      ],
    }),
  },
  {
    id: "resume",
    patterns: [/resume|cv|curriculum/i],
    answer: () =>
      site.resumeUrl
        ? { text: "Here is the latest resume.", links: [{ label: "Open resume", href: site.resumeUrl }] }
        : {
            text: "A downloadable resume isn't published yet. LinkedIn has the current experience and education, and the Pathway section on this page covers the plan.",
            links: [
              { label: "LinkedIn", href: site.linkedinUrl },
              { label: "Pathway", href: "#pathway" },
            ],
          },
  },
  {
    id: "skills",
    patterns: [/skills?|stack|languages?|tech|tools?|python|typescript|rust|c\+\+/i],
    answer: () => ({
      text: `Languages: ${skills.languages.join(", ")}. Tools: ${skills.tools.join(", ")}. Domains: ${skills.domains.slice(0, 5).join(", ")} and more.`,
      links: [{ label: "Skills", href: "#skills" }],
    }),
  },
  {
    id: "education",
    patterns: [/school|grade|student|gpa|sat|act|aist|scores?|academic|study|studies/i],
    answer: () => ({
      text: `Grade 11 in a ${site.school}, 4.0 GPA. SAT 1530 (790 Math, 740 EBRW, superscore). AIST Math 1: 36, Biology: 34. Selected participant in the NASA Space Apps Challenge 2026.`,
      links: [{ label: "Achievements", href: "#about" }],
    }),
  },
  {
    id: "plan",
    patterns: [/plan|future|goal|aalto|university|master|netherlands|asml|pathway|roadmap|where/i],
    answer: () => {
      const done = goals.filter((g) => g.done).length
      return {
        text: `${pathway[1].title} (${pathway[1].when}) for Computer Engineering, then a master's in the Netherlands and engineering work at ASML. Of the ${goals.length} goals for 2026–27, ${done} are already done.`,
        links: [
          { label: "Pathway", href: "#pathway" },
          { label: "Roadmap repo", href: `${site.githubUrl}/portfolio-roadmap` },
        ],
      }
    },
  },
  {
    id: "achievements",
    patterns: [/achiev|award|nasa|hackathon|volunteer|schoolhouse/i],
    answer: () => ({
      text: achievements
        .slice(0, 4)
        .map((a) => a.title)
        .join(" · "),
      links: [{ label: "All achievements", href: "#about" }],
    }),
  },
  {
    id: "site",
    patterns: [/this (site|website|page)|how.*(built|made)|3d|three|webgl|source/i],
    answer: () => ({
      text: "Next.js static export on GitHub Pages, Tailwind, Motion, and a React Three Fiber particle object that reacts to your cursor. Profile, bio and project data are fetched from the GitHub API on load.",
      links: [{ label: "Source", href: `${site.githubUrl}/AbdelrahmanMostafa-Eng.github.io` }],
    }),
  },
  {
    id: "thanks",
    patterns: [/thank|thx|cheers/i],
    answer: () => ({ text: "Anytime. If you want to get in touch, the contact form is one scroll away.", links: [{ label: "Contact", href: "#contact" }] }),
  },
]

export const suggestions = [
  "Who is Abdelrahman?",
  "What does he build?",
  "What's the latest project?",
  "How can I reach him?",
  "What's the plan after school?",
]

export function answer(question: string, ctx: Context): Answer {
  const q = question.trim()
  for (const intent of intents) {
    if (intent.patterns.some((p) => p.test(q))) return intent.answer(ctx)
  }
  return {
    text: "I can answer questions about who Abdelrahman is, his projects, skills, academic results, the pathway to Aalto, and how to contact him. Try one of the suggestions below.",
    links: [
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
  }
}
