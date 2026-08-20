import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import useReveal from '../hooks/useReveal'
import './Work.css'

const PROJECTS = [
  {
    name: 'Renaissance Hotel',
    category: 'Web Design',
    year: '2025',
    tone: 'linear-gradient(135deg, #3a3226, #16150f)',
  },
  {
    name: 'Alex Monroe Jewelry',
    category: 'E-commerce',
    year: '2025',
    tone: 'linear-gradient(135deg, #2b2a3a, #14130f)',
  },
  {
    name: 'Northbound Trekking Co.',
    category: 'Brand & Web',
    year: '2024',
    tone: 'linear-gradient(135deg, #2f3a2c, #14130f)',
  },
  {
    name: 'Press Play Productions',
    category: 'Portfolio Site',
    year: '2024',
    tone: 'linear-gradient(135deg, #3a2b2b, #14130f)',
  },
  {
    name: 'Summit AI Conference',
    category: 'Design Concept',
    year: '2023',
    tone: 'linear-gradient(135deg, #2a333a, #14130f)',
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
            href="#contact"
            className="work__row"
            key={project.name}
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
              activeIndex !== null ? PROJECTS[activeIndex].tone : 'none',
            opacity: activeIndex !== null ? 1 : 0,
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
