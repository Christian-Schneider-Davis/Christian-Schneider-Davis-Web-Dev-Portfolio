import { useRef, useState } from 'react'
import { Icon } from '../common/Icon.jsx'
import { useDraggable } from '../../hooks/useDraggable.js'
import './DesktopIcon.css'

// Below this many pixels of total movement, a press+release counts as a
// click/tap (opens the app) rather than a drag (repositions the icon).
const CLICK_THRESHOLD = 6

export function DesktopIcon({ app, index, isSelected, onSelect, onOpen, containerRef }) {
  const col = Math.floor(index / 5)
  const row = index % 5
  const [pos, setPos] = useState({ x: 24 + col * 104, y: 24 + row * 108 })

  const dragStartPos = useRef(pos)
  const maxDistanceRef = useRef(0)

  const { onPointerDown, isDragging } = useDraggable(
    pos,
    (x, y) => {
      const dx = x - dragStartPos.current.x
      const dy = y - dragStartPos.current.y
      maxDistanceRef.current = Math.max(maxDistanceRef.current, Math.hypot(dx, dy))
      setPos({ x, y })
    },
    {
      bounds: () => {
        const el = containerRef?.current
        const w = el ? el.clientWidth : 1280
        const h = el ? el.clientHeight : 800
        return { minX: 4, minY: 4, maxX: w - 96, maxY: h - 104 }
      },
      onDragStart: () => {
        dragStartPos.current = pos
        maxDistanceRef.current = 0
        onSelect(app.id)
      },
      onDragEnd: () => {
        // A press+release that barely moved is a click/tap, not a drag —
        // open the app. Works the same for mouse and touch.
        if (maxDistanceRef.current < CLICK_THRESHOLD) {
          onOpen(app.id)
        }
      },
    },
  )

  return (
    <button
      type="button"
      className={`desktop-icon${isSelected ? ' is-selected' : ''}${isDragging ? ' is-dragging' : ''}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, '--icon-accent': app.accent }}
      onPointerDown={onPointerDown}
      onClick={() => {
      if (maxDistanceRef.current < CLICK_THRESHOLD) onOpen(app.id)
}}    >
      <span className="desktop-icon__glyph">
        <Icon name={app.icon} size={26} />
      </span>
      <span className="desktop-icon__label">{app.title}</span>
    </button>
  )
}
