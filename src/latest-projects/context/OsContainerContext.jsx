import { createContext, useContext, useRef } from 'react'

const OsContainerContext = createContext(null)

// Used only if a measurement is requested before the container has laid out.
const FALLBACK_SIZE = { width: 1280, height: 720 }

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
