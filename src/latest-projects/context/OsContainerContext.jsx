import { createContext, useContext, useRef } from 'react'

const OsContainerContext = createContext(null)

// Used only if a measurement is requested before the container has laid out.
const FALLBACK_SIZE = { width: 1280, height: 720 }

/**
 * Wrap the embed's root element with this, passing the ref attached to it.
 * Anything inside can then call useOsContainer().getSize() to read the
 * embed's own current width/height, instead of reaching for the browser
 * window — which is wrong once this is nested inside someone else's page.
 */
export function OsContainerProvider({ containerRef, children }) {
  const value = useRef({
    containerRef,
    getSize: () => {
      const el = containerRef.current
      if (!el) return FALLBACK_SIZE
      return { width: el.clientWidth, height: el.clientHeight }
    },
  }).current

  return <OsContainerContext.Provider value={value}>{children}</OsContainerContext.Provider>
}

export function useOsContainer() {
  const ctx = useContext(OsContainerContext)
  if (!ctx) throw new Error('useOsContainer must be used within OsContainerProvider')
  return ctx
}
