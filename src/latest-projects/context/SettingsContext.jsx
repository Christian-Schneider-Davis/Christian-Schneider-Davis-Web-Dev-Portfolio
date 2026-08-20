import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const SettingsContext = createContext(null)

const STORAGE_KEY = 'csd-portfolio-settings'

function loadInitial() {
  if (typeof window === 'undefined') {
    return { theme: 'light', backgroundMode: 'animated' }
  }
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    return {
      theme: saved?.theme === 'dark' ? 'dark' : 'light',
      backgroundMode: saved?.backgroundMode === 'static' ? 'static' : 'animated',
    }
  } catch {
    return { theme: 'light', backgroundMode: 'animated' }
  }
}

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => loadInitial().theme)
  const [backgroundMode, setBackgroundMode] = useState(() => loadInitial().backgroundMode)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, backgroundMode }))
  }, [theme, backgroundMode])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      backgroundMode,
      isAnimatedBackground: backgroundMode === 'animated',
      toggleBackgroundMode: () => setBackgroundMode((m) => (m === 'animated' ? 'static' : 'animated')),
    }),
    [theme, backgroundMode],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
