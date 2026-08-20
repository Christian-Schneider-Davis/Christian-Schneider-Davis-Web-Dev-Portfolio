import { useMemo } from 'react'
import { Icon } from '../common/Icon.jsx'
import { useDraggable } from '../../hooks/useDraggable.js'
import { useWindowManager } from '../../context/WindowManagerContext.jsx'
import { useOsContainer } from '../../context/OsContainerContext.jsx'
import { getApp } from '../../data/apps.js'
import { AboutContent } from '../sections/AboutContent.jsx'
import { WorksContent } from '../sections/WorksContent.jsx'
import { ContactContent } from '../sections/ContactContent.jsx'
import { ResumeContent } from '../sections/ResumeContent.jsx'
import './AppWindow.css'

const CONTENT_MAP = {
  about: AboutContent,
  works: WorksContent,
  contact: ContactContent,
  resume: ResumeContent,
}

function slugUrl(appId) {
  return appId === 'about' ? 'christianschneiderdavis.com' : `christianschneiderdavis.com/${appId}`
}

export function AppWindow({ win }) {
  const { closeWindow, minimizeWindow, toggleMaximize, moveWindow, focusWindow } = useWindowManager()
  const { getSize } = useOsContainer()
  const app = getApp(win.appId)
  const ContentComponent = CONTENT_MAP[win.appId]

  const position = useMemo(() => ({ x: win.x, y: win.y }), [win.x, win.y])

  const { onPointerDown, isDragging } = useDraggable(
    position,
    (x, y) => moveWindow(win.id, x, y),
    {
      disabled: win.maximized,
      bounds: () => {
        // Confine dragging to the embed's own box, not the browser window.
        const { width: w, height: h } = getSize()
        return { minX: -win.width + 160, minY: 0, maxX: w - 160, maxY: h - 96 }
      },
      onDragStart: () => focusWindow(win.id),
    },
  )

  if (win.minimized) return null

  const style = win.maximized
    ? { left: 6, top: 6, width: 'calc(100% - 12px)', height: 'calc(100% - var(--taskbar-h) - 12px)', zIndex: win.zIndex }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }

  return (
    <section
      className={`app-window acrylic${isDragging ? ' is-dragging' : ''}`}
      style={style}
      onPointerDown={() => focusWindow(win.id)}
      role="dialog"
      aria-label={win.title}
    >
      <header className="app-window__chrome" onPointerDown={onPointerDown} onDoubleClick={() => toggleMaximize(win.id)}>
        <div className="app-window__tab">
          <span className="app-window__tab-icon" style={{ color: app?.accent }}>
            <Icon name={app?.icon ?? 'file'} size={14} />
          </span>
          <span className="app-window__tab-title">{win.title}</span>
        </div>

        <div className="app-window__address">
          <Icon name="search" size={12} className="app-window__address-icon" />
          <span>{slugUrl(win.appId)}</span>
        </div>

        <div className="app-window__controls">
          <button
            type="button"
            className="app-window__ctrl"
            aria-label="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => minimizeWindow(win.id)}
          >
            <Icon name="minimize" size={13} />
          </button>
          <button
            type="button"
            className="app-window__ctrl"
            aria-label={win.maximized ? 'Restore' : 'Maximize'}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMaximize(win.id)}
          >
            <Icon name={win.maximized ? 'restore' : 'maximize'} size={12} />
          </button>
          <button
            type="button"
            className="app-window__ctrl app-window__ctrl--close"
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => closeWindow(win.id)}
          >
            <Icon name="close" size={13} />
          </button>
        </div>
      </header>

      <div className="app-window__body">{ContentComponent ? <ContentComponent /> : null}</div>
    </section>
  )
}
