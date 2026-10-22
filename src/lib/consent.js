/* ---------------------------------------------------------
   Cookie consent — tiny shared store.

   The choice is saved in localStorage as 'accepted' or 'declined'.
   Nothing from another company loads until it is 'accepted':
     - Amazon product photos (links page)
     - live project previews (Selected Work modal)
     - the gesture demo's hand-tracking files (jsDelivr / Google)
   Each of those also offers a one-off "load just this" button, which
   loads that one thing for that visit without changing the saved choice.

   If you add analytics later, only load it when hasConsent() is true,
   and listen for the change event so it can start as soon as someone
   accepts:

     import { hasConsent, CONSENT_EVENT } from './lib/consent'
     if (hasConsent()) loadAnalytics()
     window.addEventListener(CONSENT_EVENT, (e) => e.detail === 'accepted' && loadAnalytics())
--------------------------------------------------------- */
import { useEffect, useState } from 'react'

const KEY = 'csd-cookie-consent'
export const CONSENT_EVENT = 'cookie-consent:change'
export const OPEN_EVENT = 'cookie-consent:open'

export function getConsent() {
  try {
    return localStorage.getItem(KEY) // 'accepted' | 'declined' | null
  } catch {
    return null
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    /* storage blocked (private mode etc.) — choice lasts for this visit only */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

export const hasConsent = () => getConsent() === 'accepted'

// One-off permission for this page visit (e.g. "Allow & start camera"),
// without changing the saved choice.
let allowedThisVisit = false
export const allowThirdPartyOnce = () => {
  allowedThisVisit = true
}
export const thirdPartyAllowed = () => hasConsent() || allowedThisVisit

/** Re-open the banner, e.g. from a "Cookie settings" link. */
export const openConsent = () => window.dispatchEvent(new Event(OPEN_EVENT))

/**
 * React hook: the current choice ('accepted' | 'declined' | null), kept in
 * sync with the banner, other tabs, and the embedded gesture demo.
 */
export function useConsent() {
  const [consent, setState] = useState(getConsent)

  useEffect(() => {
    const sync = () => setState(getConsent())
    const onStorage = (event) => {
      if (event.key === null || event.key === KEY) sync()
    }
    window.addEventListener(CONSENT_EVENT, sync)
    window.addEventListener('storage', onStorage) // other tabs / iframes
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return consent
}
