import { forwardRef } from 'react'
import useReveal from '../hooks/useReveal'
import './HeroCard.css'

const SOCIALS = [
  { label: 'Email', href: 'mailto:schneiderdavis@aol.com' },
  { label: 'Github', href: 'https://github.com/Christian-Schneider-Davis'},
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/christian-schneider-davis/' },
  { label: 'Instagram', href: 'https://www.instagram.com/christianscottie' }

]

const HeroCard = forwardRef(function HeroCard(_props, ref) {
  const revealRef = useReveal()

  const setRefs = (el) => {
    revealRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  return (
    <div className="hero-card reveal" ref={setRefs}>
      <div className="hero-card__photo">
        <img src="photos/christian-schneider-davis.jpg" alt="Christian Schneider-Davis" />
        {/* Shown only while the card can be dragged (desktop, Selected Work). */}
        <span className="hero-card__drag-hint" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="12" height="12">
            <path
              d="M8 1.5v13M1.5 8h13M8 1.5 6 3.5M8 1.5l2 2M8 14.5l-2-2M8 14.5l2-2M1.5 8l2-2M1.5 8l2 2M14.5 8l-2-2M14.5 8l-2 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Drag me
        </span>
      </div>

      <dl className="hero-card__meta">
        <div>
          <dt>Specialization</dt>
          <dd>Web Dev &amp; UX/UI Design</dd>
        </div>
        <div>
          <dt>Based in</dt>
          <dd>Barcelona, Spain</dd>
        </div>
        <div>
          <dt>Practicing since</dt>
          <dd>2020</dd>
        </div>
      </dl>

      <ul className="hero-card__socials">
        {SOCIALS.map((social) => (
          <li key={social.label}>
            <a href={social.href}>{social.label}</a>
          </li>
        ))}
      </ul>

      <a href="#contact" className="btn btn--ghost hero-card__cta">
        Let&rsquo;s Work Together
      </a>
    </div>
  )
})

export default HeroCard
