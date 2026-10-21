/* ---------------------------------------------------------
   Cookie consent — tiny shared store.

   The choice is saved in localStorage as 'accepted' or 'declined'.
   If you add analytics later, only load it when hasConsent() is true,
   and listen for the 'cookie-consent:change' event so it can start
   as soon as someone accepts:

     import { hasConsent, CONSENT_EVENT } from './lib/consent'
     if (hasConsent()) loadAnalytics()
     window.addEventListener(CONSENT_EVENT, (e) => e.detail === 'accepted' && loadAnalytics())
--------------------------------------------------------- */
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

/** Re-open the banner, e.g. from a "Cookie settings" link. */
export const openConsent = () => window.dispatchEvent(new Event(OPEN_EVENT))
