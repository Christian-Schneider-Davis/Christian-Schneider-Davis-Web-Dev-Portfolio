import { useRef } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import HeroCard from './components/HeroCard.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import ProjectGallery from './components/ProjectGallery.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Grain from './components/Grain.jsx'
import './App.css'

export default function App() {
  const heroCardRef = useRef(null)

  return (
    <>
      <Grain />
      <Navbar />
      <main>
        <div className="wrap pinned-layout">
          <HeroCard ref={heroCardRef} />

          <div className="pinned-layout__content">
            <Hero />
            <About />
            <Services />
            <ProjectGallery heroCardRef={heroCardRef} />
          </div>
        </div>

        <section className="latest-projects" aria-labelledby="latest-projects-heading">
          <div className="wrap latest-projects__inner">
            <p className="eyebrow">Try It Yourself</p>
            <h2 id="latest-projects-heading" className="section-heading">
              Try it with your hands.
            </h2>
            <p className="latest-projects__intro">
              A gesture-driven experience I designed and built from scratch with React and in-browser
              machine learning. Turn on your camera, open a hand to bloom a flower, and swipe through
              the pages. It all runs on your device; nothing is recorded.
            </p>

            <ol className="latest-projects__steps" aria-label="How to try it">
              <li><span>1</span> Click <strong>Turn on camera</strong></li>
              <li><span>2</span> Open a hand to bloom a flower</li>
              <li><span>3</span> Swipe a hand to change pages</li>
            </ol>

            <div className="latest-projects__frame">
              <iframe
                className="latest-projects__demo"
                src="/gesture-demo/?embed=1"
                title="Interactive gesture demo: open a hand to bloom a flower, swipe to change pages"
                allow="camera; fullscreen"
                loading="lazy"
              />
            </div>
            <p className="latest-projects__note">
              Best on a laptop or desktop with a webcam. No camera? Press and hold a flower instead.{' '}
              <a href="/gesture-demo/" target="_blank" rel="noopener">
                Open full screen ↗
              </a>
            </p>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  )
}
