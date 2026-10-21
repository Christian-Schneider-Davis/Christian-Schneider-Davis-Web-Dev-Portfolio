import { useEffect, useState } from 'react'
import { getConsent, setConsent, OPEN_EVENT } from '../lib/consent'
import { COOKIE_GROUPS } from '../lib/cookieList'
import './CookieConsent.css'

export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    // Small delay so the banner slides in after the page has settled.
    const t = getConsent() ? null : setTimeout(() => setOpen(true), 900)
    // "Cookie settings" links re-open the banner with the list already expanded.
    const reopen = () => {
      setShowList(true)
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, reopen)
    return () => {
      clearTimeout(t)
      window.removeEventListener(OPEN_EVENT, reopen)
    }
  }, [])

  const choose = (value) => {
    setConsent(value)
    setOpen(false)
    setShowList(false)
  }

  const tab = open ? 0 : -1
  const current = getConsent()

  return (
    <aside
      className={`cookie ${open ? 'cookie--open' : ''} ${showList ? 'cookie--expanded' : ''}`}
      role="dialog"
      aria-live="polite"
      aria-labelledby="cookie-title"
      aria-hidden={!open}
    >
      <p className="eyebrow" id="cookie-title">Cookies</p>
      <p className="cookie__text">
        No tracking cookies here. This site only saves your choice on this notice, and loads fonts
        and images from a few trusted services.
      </p>

      <button
        type="button"
        className="cookie__toggle"
        aria-expanded={showList}
        aria-controls="cookie-list"
        onClick={() => setShowList((v) => !v)}
        tabIndex={tab}
      >
        {showList ? 'Hide details' : 'See what’s used'}
        <span className="cookie__chevron" aria-hidden="true" />
      </button>

      <div className="cookie__list" id="cookie-list" hidden={!showList}>
        {COOKIE_GROUPS.map((group) => (
          <section key={group.title} className="cookie__group">
            <h3 className="cookie__group-title">{group.title}</h3>
            {group.note && <p className="cookie__group-note">{group.note}</p>}
            {group.items.length > 0 && (
              <ul className="cookie__items">
                {group.items.map((item) => (
                  <li key={item.name} className="cookie__item">
                    <div className="cookie__item-head">
                      <span className="cookie__item-name">{item.name}</span>
                      <span className="cookie__item-type">{item.type}</span>
                    </div>
                    <p className="cookie__item-purpose">{item.purpose}</p>
                    <dl className="cookie__item-meta">
                      <div>
                        <dt>Provider</dt>
                        <dd>{item.provider}</dd>
                      </div>
                      {item.duration !== '—' && (
                        <div>
                          <dt>Kept</dt>
                          <dd>{item.duration}</dd>
                        </div>
                      )}
                    </dl>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
        {current && (
          <p className="cookie__current">
            Your current choice: <strong>{current === 'accepted' ? 'Accepted' : 'Declined'}</strong>
          </p>
        )}
      </div>

      <div className="cookie__actions">
        <button type="button" className="btn btn--ghost" onClick={() => choose('declined')} tabIndex={tab}>
          Decline
        </button>
        <button type="button" className="btn btn--primary" onClick={() => choose('accepted')} tabIndex={tab}>
          Accept
        </button>
      </div>
    </aside>
  )
}
