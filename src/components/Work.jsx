import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import useReveal from '../hooks/useReveal'
import './Work.css'

const PROJECTS = [
  {
    name: 'Epic Mouse App Landing Page',
    category: 'Web Design',
    year: 'Aug. 2026',
    tone: 'linear-gradient(135deg, #3a3226, #16150f)',
    image: 'photos/EpicMouse.app.png',
    url: 'https://www.epicmouse.app'
  },
  {
    name: 'Epic Mouse App',
    category: 'Apple IOS App',
    year: 'Coming Sept. 2026',
    tone: 'linear-gradient(135deg, #2b2a3a, #14130f)',
    image: "photos/EpicMouseApp.png",
    url: 'https://www.epicmouse.app'

  },
  {
    name: 'Virtual Desktop Portfolio',
    category: 'Portfolio Site',
    year: 'Aug. 2026',
    tone: 'linear-gradient(135deg, #2f3a2c, #14130f)',
    image:"photos/My-Virtual-Desktop.png",
    url: 'https://christian-schneider-davis-port.vercel.app/'
  },
  {
    name: 'My Art Portfolio',
    category: 'Porfolio Site',
    year: 'Aug. 2026',
    tone: 'linear-gradient(135deg, #3a3226, #16150f)',
    image: 'photos/Christian-SD-Art-Port.png',
    url: 'https://christian-schneider-davis.github.io/art-portfolio/'
  },
  {
    name: 'Vinz Barber Shop',
    category: 'E-Commerce',
    year: 'Aug. 2026',
    tone: 'linear-gradient(135deg, #3a2b2b, #14130f)',
    image:"photos/Vinz-Barber-Shop.png",
    // url: '' - Don't forget to add url at a later date
  },
  {
    name: 'PINistry Studio Vintage',
    category: 'E-Commerce',
    year: 'Feb. 2024',
    tone: 'linear-gradient(135deg, #2a333a, #14130f)',
    image:"photos/PINistry-Studio.png",
    // url:'' Don't frget to add url at a later date
  },
]

export default function Work() {
  const revealRef = useReveal()
  const containerRef = useRef(null)
  const previewRef = useRef(null)
  const quickX = useRef(null)
  const quickY = useRef(null)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    quickX.current = gsap.quickTo(previewRef.current, 'x', {
      duration: 0.55,
      ease: 'power3.out',
    })
    quickY.current = gsap.quickTo(previewRef.current, 'y', {
      duration: 0.55,
      ease: 'power3.out',
    })
  }, [])

  const handleMouseMove = (event) => {
    const bounds = containerRef.current.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    quickX.current?.(x)
    quickY.current?.(y)
  }

  return (
    <section id="work" className="work">
      <div className="work__head reveal" ref={revealRef}>
        <p className="eyebrow">Selected Work</p>
        <span className="work__count">
          {String(PROJECTS.length).padStart(2, '0')} projects
        </span>
      </div>

      <div
        className="work__list"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <div className="hairline" />
        {PROJECTS.map((project, index) => (
          <a
            className="work__row"
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
             onMouseEnter={() => setActiveIndex(index)}
          >
            <span className="work__row-index">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="work__row-name">{project.name}</span>
            <span className="work__row-category">{project.category}</span>
            <span className="work__row-year">{project.year}</span>
            <span className="work__row-arrow" aria-hidden="true">
              &#8599;
            </span>
            <div className="hairline" />
          </a>
        ))}

        <div
          className="work__preview"
            ref={previewRef}
            style={{
            backgroundImage:
            activeIndex !== null
             ? `linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${PROJECTS[activeIndex].image})`
            : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: activeIndex !== null ? 1 : 1,
             }}
             aria-hidden="true"
        />
      </div>
    </section>
  )
}
