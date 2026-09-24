export const GITHUB_USER = "AbdelrahmanMostafa-Eng"

export const site = {
  name: "Abdelrahman Mostafa",
  fullName: "Abdelrahman Mostafa Abouelkhair",
  initials: "AM",
  role: "Aspiring Computer Engineer",
  headline: "Software that simulates, analyzes and optimizes real systems.",
  positioning:
    "Grade 12 student in Saudi Arabia building simulation tools, telemetry pipelines and web apps on the way to a Computer Engineering degree at Aalto University.",
  location: "Saudi Arabia",
  timezone: "Asia/Riyadh",
  url: "https://abdelrahmanmostafa-eng.github.io",
  githubUrl: `https://github.com/${GITHUB_USER}`,
  linkedinUrl: "https://www.linkedin.com/in/abdelrahmanmostafa-eng",
  instagramUrl: "https://www.instagram.com/abdelrahman_abouelkhair/",
  xUrl: "https://x.com/AbdElRahmanm988",
  /** Optional. Leave empty to hide the email icon everywhere. */
  email: "",
  /** Optional. Leave empty to hide resume links everywhere. */
  resumeUrl: "",
  /** Contact form: set NEXT_PUBLIC_FORMSPREE_ID (or the FORMSPREE_ID repo secret) to enable direct delivery. */
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "",
  school: "Cognia-accredited American curriculum school",
  gradYear: 2027,
}

export const nav = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Pathway", href: "#pathway" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
]

export const stats = [
  { label: "GPA", value: "4.0", detail: "Grade 12, American Diploma" },
  { label: "SAT", value: "1530", detail: "790 Math · 740 EBRW (superscore)" },
  { label: "AIST Math 1", value: "36", detail: "ACT subject test, perfect score" },
  { label: "AIST Biology", value: "34", detail: "ACT subject test" },
]

export const achievements = [
  {
    title: "NASA Space Apps Challenge 2026",
    detail: "Selected participant in the world's largest global hackathon.",
    year: "2026",
  },
  {
    title: "SAT 1530 superscore",
    detail: "790 Math, 740 Evidence-Based Reading and Writing.",
    year: "2026",
  },
  {
    title: "Perfect 36 on AIST Math 1",
    detail: "Plus a 34 on the Biology subject test.",
    year: "2026",
  },
  {
    title: "4.0 GPA, every semester",
    detail: "Grade 12 in a Cognia-accredited American Diploma program.",
    year: "2024–26",
  },
  {
    title: "Egyptian equivalency secured",
    detail: "Keeps The American University in Cairo open as a parallel path.",
    year: "2026",
  },
  {
    title: "Schoolhouse.world tutor",
    detail: "Working toward 150–200+ certified volunteer hours.",
    year: "Ongoing",
  },
]

export const pathway = [
  {
    when: "Now — 2026",
    title: "Grade 12 in Saudi Arabia",
    body: "American Diploma, 4.0 GPA. Building FSAE simulators, a local-first AI memory store, and full-stack web apps while tutoring on Schoolhouse.world.",
    tags: ["4.0 GPA", "SAT 1530", "NASA Space Apps"],
  },
  {
    when: "Jan 7 – Jan 22, 2027",
    title: "Apply to Aalto University",
    body: "B.Sc. (Technology) in Computer Engineering. Interests: embedded systems, artificial intelligence, systems design and motorsport applications. Targeting the Excellence Scholarship.",
    tags: ["Aalto", "Computer Engineering", "Scholarship"],
  },
  {
    when: "2027 — 2030",
    title: "Bachelor's, hands-on",
    body: "Research, internships and competitive programming during the degree, aiming for engineering roles at top technology companies.",
    tags: ["Research", "Internships", "Competitive programming"],
  },
  {
    when: "After graduation",
    title: "Master's in the Netherlands",
    body: "Computer Engineering, AI or Embedded Systems, then a software or systems engineering role at ASML, staying close to motorsport and simulation.",
    tags: ["Netherlands", "ASML", "Embedded"],
  },
]

export const skills = {
  languages: ["Python", "C++", "JavaScript", "TypeScript", "Rust"],
  tools: ["Git", "GitHub", "VS Code", "Claude", "Next.js", "Vercel"],
  domains: [
    "Vehicle dynamics",
    "Telemetry & data analysis",
    "Simulation",
    "Embedded systems",
    "Web development",
    "AI / ML fundamentals",
    "Systems design",
    "Cybersecurity",
  ],
}

export const goals = [
  { text: "Maintain a 4.0 GPA", done: true },
  { text: "Score 1500+ on the SAT", done: true },
  { text: "Complete ACT Biology (34)", done: true },
  { text: "Participate in NASA Space Apps Challenge 2026", done: true },
  { text: "Reach 150–200+ volunteer hours on Schoolhouse", done: false },
  { text: "Build and launch the home services app", done: false },
  { text: "Take IELTS / TOEFL", done: false },
  { text: "Submit the Aalto application by Jan 7, 2027", done: false },
  { text: "Secure a 100% tuition scholarship", done: false },
]

/** Curated tags for repos whose GitHub metadata is thin. Live data always wins. */
export const repoMeta: Record<
  string,
  { tags?: string[]; description?: string; priority?: number }
> = {
  "fsae-telemetry-simulator": {
    tags: ["Python", "Simulation", "Data viz", "Motorsport"],
    priority: 10,
  },
  "vehicle-dynamics-calculator": {
    tags: ["Python", "Physics", "Vehicle dynamics"],
    priority: 9,
  },
  "agent-vault": {
    tags: ["Python", "AI agents", "Local-first", "Security"],
    priority: 8,
  },
  bioacademy: { tags: ["TypeScript", "Next.js", "Vercel", "Client work"], priority: 7 },
  "GoogleDrive-Downloader": { tags: ["Python", "CLI", "Networking"], priority: 6 },
  bioenv: {
    tags: ["Rust", "Tooling"],
    description: "Rust tooling written alongside the BioAcademy project.",
    priority: 5,
  },
  chatbot: {
    tags: ["TypeScript", "AI"],
    description: "A TypeScript chatbot experiment built while exploring conversational interfaces.",
    priority: 4,
  },
  torqon: {
    tags: ["In development", "Motorsport"],
    description: "Currently in development. A motorsport-focused build tracked on my 2026–27 roadmap.",
    priority: 4,
  },
  "vscode-python-environments": { tags: ["VS Code", "Fork", "Localization"], priority: 3 },
  "portfolio-roadmap": { tags: ["Planning", "Markdown"], priority: 2 },
  "AbdelrahmanMostafa-Eng.github.io": {
    tags: ["Next.js", "React Three Fiber", "Tailwind"],
    description: "This website. Static Next.js export deployed to GitHub Pages, pulling live data from the GitHub API.",
    priority: 1,
  },
}

/** Repos hidden from the projects grid (profile README repo has no code). */
export const hiddenRepos = new Set(["AbdelrahmanMostafa-Eng"])
