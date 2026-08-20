import { useRef, useState } from 'react'
import { BackgroundLayer } from './BackgroundLayer.jsx'
import { DesktopIcon } from './DesktopIcon.jsx'
import { APPS } from '../../data/apps.js'
import { useWindowManager } from '../../context/WindowManagerContext.jsx'
import './Desktop.css'

export function Desktop() {
  const containerRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)
  const { openApp } = useWindowManager()

  const icons = APPS.filter((a) => a.desktop).sort((a, b) => a.order - b.order)

  return (
    <div
      className="desktop"
      ref={containerRef}
      onPointerDown={(e) => {
        if (e.target === containerRef.current) setSelectedId(null)
      }}
    >
      <BackgroundLayer />

      <div className="desktop__icons">
        {icons.map((app, i) => (
          <DesktopIcon
            key={app.id}
            app={app}
            index={i}
            containerRef={containerRef}
            isSelected={selectedId === app.id}
            onSelect={setSelectedId}
            onOpen={openApp}
          />
        ))}
      </div>
    </div>
  )
}
