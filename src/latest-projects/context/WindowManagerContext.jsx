import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { APPS } from '../data/apps.js'
import { useOsContainer } from './OsContainerContext.jsx'

const WindowManagerContext = createContext(null)

const BASE_Z = 100
let cascadeCount = 0

export function WindowManagerProvider({ children }) {
  const [windows, setWindows] = useState([])
  const topZ = useRef(BASE_Z)
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const { getSize } = useOsContainer()

  const nextZ = () => {
    topZ.current += 1
    return topZ.current
  }

  const focusWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ(), minimized: false } : w)),
    )
  }, [])

  const openApp = useCallback((appId) => {
    setStartMenuOpen(false)
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId)
      if (existing) {
        return prev.map((w) =>
          w.appId === appId ? { ...w, minimized: false, zIndex: nextZ() } : w,
        )
      }
      const app = APPS.find((a) => a.id === appId)
      if (!app) return prev

      cascadeCount = (cascadeCount + 1) % 6
      const offset = cascadeCount * 26

      // Measured against the embed's own box, not the browser window —
      // this app may be sitting inside a much bigger page.
      const { width: w, height: h } = getSize()
      const width = Math.min(app.defaultWidth ?? 860, w - 120)
      const height = Math.min(app.defaultHeight ?? 600, h - taskbarClearance(h))

      return [
        ...prev,
        {
          id: `${appId}-${Date.now()}`,
          appId,
          title: app.title,
          x: Math.max(20, (w - width) / 2 - 140 + offset),
          y: Math.max(20, (h - height) / 2 - 60 + offset),
          width,
          height,
          zIndex: nextZ(),
          minimized: false,
          maximized: false,
        },
      ]
    })
  }, [getSize])

  const closeWindow = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)))
  }, [])

  const toggleMaximize = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized, zIndex: nextZ() } : w)),
    )
  }, [])

  const moveWindow = useCallback((id, x, y) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)))
  }, [])

  const toggleStartMenu = useCallback(() => setStartMenuOpen((v) => !v), [])
  const closeStartMenu = useCallback(() => setStartMenuOpen(false), [])

  const value = useMemo(
    () => ({
      windows,
      openApp,
      closeWindow,
      minimizeWindow,
      toggleMaximize,
      moveWindow,
      focusWindow,
      startMenuOpen,
      toggleStartMenu,
      closeStartMenu,
    }),
    [windows, openApp, closeWindow, minimizeWindow, toggleMaximize, moveWindow, focusWindow, startMenuOpen, toggleStartMenu, closeStartMenu],
  )

  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>
}

function taskbarClearance(containerHeight) {
  // keep windows clear of the taskbar; mirrors --taskbar-h token
  return 52 + Math.max(60, containerHeight * 0.08)
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider')
  return ctx
}
