import { useEffect, useRef, useState } from 'react'

/**
 * useDraggable
 * Pointer-driven dragging for anything with a controlled { x, y } position.
 *
 * @param {{x:number, y:number}} position   current position (controlled)
 * @param {(x:number, y:number)=>void} onChange   called continuously while dragging
 * @param {{
 *   disabled?: boolean,
 *   bounds?: () => {minX:number,maxX:number,minY:number,maxY:number},
 *   onDragStart?: () => void,
 *   onDragEnd?: () => void,
 * }} options
 */
export function useDraggable(position, onChange, options = {}) {
  const [isDragging, setIsDragging] = useState(false)

  const positionRef = useRef(position)
  const optionsRef = useRef(options)
  const onChangeRef = useRef(onChange)
  positionRef.current = position
  optionsRef.current = options
  onChangeRef.current = onChange

  const dragState = useRef({ active: false, startX: 0, startY: 0, posX: 0, posY: 0 })
  const cleanupRef = useRef(() => {})

  // Ensure listeners never leak if the component unmounts mid-drag.
  useEffect(() => () => cleanupRef.current(), [])

  function onPointerDown(e) {
    if (optionsRef.current.disabled) return
    if (e.button !== undefined && e.button !== 0) return

    dragState.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      posX: positionRef.current.x,
      posY: positionRef.current.y,
    }
    setIsDragging(true)
    optionsRef.current.onDragStart?.()

    const handleMove = (ev) => {
      if (!dragState.current.active) return
      const dx = ev.clientX - dragState.current.startX
      const dy = ev.clientY - dragState.current.startY
      let nx = dragState.current.posX + dx
      let ny = dragState.current.posY + dy
      const bounds = optionsRef.current.bounds?.()
      if (bounds) {
        nx = Math.min(Math.max(nx, bounds.minX), bounds.maxX)
        ny = Math.min(Math.max(ny, bounds.minY), bounds.maxY)
      }
      onChangeRef.current(nx, ny)
    }

    const handleUp = () => {
      dragState.current.active = false
      setIsDragging(false)
      optionsRef.current.onDragEnd?.()
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }

    cleanupRef.current = handleUp
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
  }

  return { onPointerDown, isDragging }
}
