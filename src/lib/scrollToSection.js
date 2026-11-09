import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const navOffset = () => document.querySelector('.nav')?.offsetHeight ?? 0

/**
 * Smooth-scroll to an in-page section with GSAP (native smooth scrolling
 * fights the ScrollTrigger animations — see index.css).
 *
 * A section can provide its own landing spot with
 * `data-scroll-anchor="#id"`. The Work gallery uses this so a jump lands
 * just past its scroll-driven entrance instead of right before it, where
 * nothing has faded in yet. If that marker isn't laid out (e.g. it's hidden
 * on mobile), the section itself is used.
 *
 * Returns true if it handled the scroll.
 */
export function scrollToSection(href) {
  const anchor = document.querySelector(`[data-scroll-anchor="${href}"]`)
  const target = anchor && anchor.offsetParent !== null ? anchor : document.querySelector(href)
  if (!target) return false

  const offsetY = href === '#top' ? 0 : navOffset()

  gsap.killTweensOf(window)
  gsap.to(window, {
    duration: 1,
    ease: 'power2.inOut',
    scrollTo: { y: target, offsetY, autoKill: false },
    onComplete: () => {
      const drift = target.getBoundingClientRect().top - offsetY
      const atBottom = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 1
      if (Math.abs(drift) > 2 && !atBottom) {
        gsap.to(window, {
          duration: 0.4,
          ease: 'power2.out',
          scrollTo: { y: target, offsetY, autoKill: false },
        })
      }
    },
  })
  return true
}

/** onClick handler for `<a href="#section">` links. */
export function handleSectionLink(event) {
  const href = event.currentTarget.getAttribute('href')
  if (href?.startsWith('#') && scrollToSection(href)) event.preventDefault()
}
