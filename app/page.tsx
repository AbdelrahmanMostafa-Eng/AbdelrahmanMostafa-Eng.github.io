import { Header } from "@/components/header"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Projects } from "@/components/sections/projects"
import { Pathway } from "@/components/sections/pathway"
import { Skills } from "@/components/sections/skills"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Assistant } from "@/components/assistant"
import { Intro } from "@/components/intro"

export default function HomePage() {
  return (
    <>
      <Intro />
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Pathway />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <Assistant />
    </>
  )
}
