import Grain from '../components/Grain.jsx'
import useReveal from '../hooks/useReveal'
import { SOCIALS, AMAZON_PICKS } from './links.js'
import './LinksPage.css'

function Arrow() {
  return (
    <svg className="links__arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Section({ eyebrow, title, children, delay = 0 }) {
  const ref = useReveal()
  return (
    <section className="links__section reveal" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <div className="links__section-head">
        <p className="eyebrow">{eyebrow}</p>
        {title && <h2 className="links__section-title">{title}</h2>}
      </div>
      {children}
    </section>
  )
}

export default function LinksPage() {
  const headRef = useReveal()
  const year = new Date().getFullYear()

  return (
    <>
      <Grain />
      <main className="links">
        <header className="links__profile reveal" ref={headRef}>
          <div className="links__avatar">
            <img src="/photos/christian-schneider-davis.jpg" alt="Christian Schneider-Davis" />
          </div>
          <h1 className="links__name">
            Christian <em>Schneider-Davis</em>
          </h1>
          <p className="links__bio">Web Dev &amp; UX/UI Design · Barcelona, Spain</p>
          <span className="pill">
            <span className="dot" aria-hidden="true" />
            Available for work
          </span>
        </header>

        <Section eyebrow="Socials" delay={80}>
          <ul className="links__list">
            {SOCIALS.map((s) => {
              const external = !s.href.startsWith('mailto:')
              return (
                <li key={s.label}>
                  <a
                    className="links__row"
                    href={s.href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <span className="links__row-label">{s.label}</span>
                    <span className="links__row-handle">{s.handle}</span>
                    <Arrow />
                  </a>
                </li>
              )
            })}
          </ul>
        </Section>

        {AMAZON_PICKS.length > 0 && (
          <Section eyebrow="Amazon Finds" title="Things I actually use." delay={160}>
            <ul className="links__picks">
              {AMAZON_PICKS.map((p) => (
                <li key={p.title}>
                  <a className="links__pick" href={p.href} target="_blank" rel="sponsored noopener noreferrer">
                    <div className="links__pick-media">
                      {p.image ? (
                        <img src={p.image} alt="" loading="lazy" />
                      ) : (
                        <span className="links__pick-initial" aria-hidden="true">
                          {p.title.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="links__pick-body">
                      {p.tag && <span className="links__pick-tag">{p.tag}</span>}
                      <span className="links__pick-title">{p.title}</span>
                      {p.note && <span className="links__pick-note">{p.note}</span>}
                    </div>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
            <p className="links__disclosure">
              As an Amazon Associate I earn from qualifying purchases. It costs you nothing extra.
            </p>
          </Section>
        )}

        <a href="/" className="btn btn--primary links__home">
          See my portfolio
        </a>

        <footer className="links__footer">&copy; {year} Christian Schneider-Davis</footer>
      </main>
    </>
  )
}
