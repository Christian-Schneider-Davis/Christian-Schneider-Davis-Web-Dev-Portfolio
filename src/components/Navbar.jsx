import { useEffect, useState } from 'react'
import './Navbar.css'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Expertise' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLinkClick = () => setOpen(false)

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="wrap nav__inner">
        <a href="#top" className="nav__logo">
          Christian Schneider-Davis<span className="nav__logo-mark">·</span>
        </a>

        <nav className={`nav__links ${open ? 'nav__links--open' : ''}`}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={handleLinkClick}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="nav__links-cta" onClick={handleLinkClick}>
            Let&rsquo;s Talk
          </a>
        </nav>

        <div className="nav__meta">
          <span className="pill">
            <span className="dot" aria-hidden="true" />
            Available for work
          </span>
          <a href="#contact" className="btn btn--primary nav__cta">
            Let&rsquo;s Talk
          </a>
        </div>

        <button
          className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
