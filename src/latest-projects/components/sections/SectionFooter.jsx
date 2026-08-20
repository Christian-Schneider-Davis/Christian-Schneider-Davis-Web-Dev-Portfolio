import { useWindowManager } from '../../context/WindowManagerContext.jsx'
import { SOCIAL_LINKS } from '../../data/apps.js'
import { Icon } from '../common/Icon.jsx'
import './sections.css'

export function SectionFooter() {
  const { openApp } = useWindowManager()
  const year = new Date().getFullYear()

  return (
    <footer className="section-footer">
      <div className="section-footer__row">
        <div className="section-footer__cta">
          <p className="section-footer__cta-label">Have a project in mind?</p>
          <button type="button" className="section-footer__cta-link" onClick={() => openApp('contact')}>
            Let&rsquo;s talk <Icon name="chevronRight" size={16} />
          </button>
        </div>

        <nav className="section-footer__nav" aria-label="Section navigation">
          <button type="button" onClick={() => openApp('about')}>About</button>
          <button type="button" onClick={() => openApp('works')}>Recent Works</button>
          <button type="button" onClick={() => openApp('contact')}>Contact</button>
        </nav>

        <div className="section-footer__social">
          {SOCIAL_LINKS.map((s) => (
            <a key={s.id} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
              <Icon name={s.icon} size={16} />
            </a>
          ))}
        </div>
      </div>

      <div className="section-footer__legal">
        <span>&copy; {year} Christian Schneider-Davis. All rights reserved.</span>
        <span>Built as a desktop, rendered as a portfolio.</span>
      </div>
    </footer>
  )
}
