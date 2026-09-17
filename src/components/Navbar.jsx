import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './Navbar.css'

gsap.registerPlugin(ScrollToPlugin)

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Expertise' },
  { href: '#work', label: 'Work' },
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

  // Smooth-scroll in-page anchor links with GSAP instead of native CSS
  // `scroll-behavior: smooth` — the native version fights GSAP's
  // ScrollTrigger-driven scroll animations elsewhere on the page (see
  // index.css for the full explanation), so every in-page jump goes
  // through GSAP's ScrollToPlugin instead.
  const handleAnchorClick = (event, href) => {
    const target = document.querySelector(href)
    if (!target) return
    event.preventDefault()
    setOpen(false)
    gsap.to(window, {
      duration: 1,
      ease: 'power2.inOut',
      scrollTo: { y: target, autoKill: true },
    })
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="wrap nav__inner">
        <a href="#top" className="nav__logo" onClick={(event) => handleAnchorClick(event, "#top")}>
          Christian Schneider-Davis<span className="nav__logo-mark">·</span>
        </a>

        <nav className={`nav__links ${open ? 'nav__links--open' : ''}`}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleAnchorClick(event, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="nav__links-cta"
            onClick={(event) => handleAnchorClick(event, '#contact')}
          >
            Let&rsquo;s Talk
          </a>
        </nav>

        <div className="nav__meta">
          <span className="pill">
            <span className="dot" aria-hidden="true" />
            Available for work
          </span>
          <a
            href="#contact"
            className="btn btn--primary nav__cta"
            onClick={(event) => handleAnchorClick(event, '#contact')}
          >
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
