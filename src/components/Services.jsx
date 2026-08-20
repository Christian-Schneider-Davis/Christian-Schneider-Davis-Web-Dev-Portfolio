import { useState } from 'react'
import useReveal from '../hooks/useReveal'
import './Services.css'

const SERVICES = [
  {
    title: 'Web Design',
    description:
      'Marketing sites and product pages designed to load fast, read clearly, and hold a brand together across every breakpoint.',
    tools: ['Figma', 'Webflow', 'React'],
  },
  {
    title: 'UX / UI',
    description:
      'Interface systems and flows for web and product, grounded in research and built to be handed straight to engineering.',
    tools: ['Figma', 'Prototyping', 'Design systems'],
  },
  {
    title: 'Front-End Development',
    description:
      'Pixel-accurate builds with considered motion — components that feel as good to use as they look in the file.',
    tools: ['React', 'GSAP', 'Vite'],
  },
  {
    title: 'Brand Identity',
    description:
      'Naming-adjacent visual systems: type, colour and voice worked out together so a brand reads the same everywhere.',
    tools: ['Type systems', 'Art direction'],
  },
]

export default function Services() {
  const [openIndex, setOpenIndex] = useState(0)
  const revealRef = useReveal()

  return (
    <section id="services" className="services">
      <div>
        <div className="services__head reveal" ref={revealRef}>
          <p className="eyebrow">Expertise</p>
          <h2 className="section-heading">Where I add the most value.</h2>
        </div>

        <ul className="services__list">
          {SERVICES.map((service, index) => {
            const isOpen = openIndex === index
            return (
              <li key={service.title} className="services__item">
                <button
                  className="services__row"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="services__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="services__title">{service.title}</span>
                  <span className={`services__toggle ${isOpen ? 'services__toggle--open' : ''}`}>
                    +
                  </span>
                </button>

                <div
                  className="services__panel"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="services__panel-inner">
                    <p>{service.description}</p>
                    <ul className="services__tools">
                      {service.tools.map((tool) => (
                        <li key={tool}>{tool}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
