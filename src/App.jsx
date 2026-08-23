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
              Explore my work.
            </h2>
            <p className="latest-projects__intro">
              Here is a small interactive project I created from scratch. All the sections above are rebuilt as a
              tiny virtual desktop. Open a window, drag it around, play some
              music. Hang for a bit.
            </p>

            <div className="latest-projects__frame">
              <LatestProjects />
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  )
}
