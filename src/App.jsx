import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import HeroCard from './components/HeroCard.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Work from './components/Work.jsx'
import Awards from './components/Awards.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Grain from './components/Grain.jsx'
import LatestProjects from './latest-projects/App.jsx'
import './App.css'

export default function App() {
  return (
    <>
      <Grain />
      <Navbar />
      <main>
        {/* HeroCard stays pinned (desktop) alongside Hero/About/Services/Work.
            It naturally stops sticking once this wrapper ends, right where
            the untouched "latest-projects" section begins. */}
        <div className="wrap pinned-layout">
          <HeroCard />

          <div className="pinned-layout__content">
            <Hero />
            <About />
            <Services />
            <Work />
          </div>
        </div>

        <section className="latest-projects" aria-labelledby="latest-projects-heading">
          <div className="wrap latest-projects__inner">
            <p className="eyebrow">Try It Yourself</p>
            <h2 id="latest-projects-heading" className="section-heading">
              Or explore my work as a desktop.
            </h2>
            <p className="latest-projects__intro">
              A small interactive detour &mdash; the section above, rebuilt as a
              tiny Windows desktop. Open a window, drag it around, play some
              music.
            </p>

            <div className="latest-projects__frame">
              <LatestProjects />
            </div>
          </div>
        </section>

        <Awards />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
