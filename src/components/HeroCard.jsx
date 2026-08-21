import useReveal from '../hooks/useReveal'
import './HeroCard.css'

const SOCIALS = [
  { label: 'Email', href: 'mailto:schneiderdavis@aol.com' },
  { label: 'Github', href: 'https://github.com/Christian-Schneider-Davis'},
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/christian-schneider-davis/' },
  { label: 'Instagram', href: 'https://www.instagram.com/christianscottie' }

]

export default function HeroCard() {
  const revealRef = useReveal()

  return (
    <div className="hero-card reveal" ref={revealRef}>
      <div className="hero-card__photo">
        <img src="/photos/christian-schneider-davis.jpg" alt="Christian Schneider-Davis" />
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
}
