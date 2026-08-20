import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../../context/SettingsContext.jsx'
import './BackgroundLayer.css'

const FRAME_COUNT = 258
const FPS = 20
const PRELOAD_AHEAD = 6

function frameSrc(n) {
  return `/images/${n}.png`
}

export function BackgroundLayer() {
  const { isAnimatedBackground } = useSettings()
  const [frame, setFrame] = useState(1)
  const rafRef = useRef(null)
  const lastTickRef = useRef(0)
  const preloaded = useRef(new Set())

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const shouldAnimate = isAnimatedBackground && !prefersReducedMotion

  // Preload a short rolling window of upcoming frames so the loop stays smooth.
  useEffect(() => {
    for (let i = 0; i < PRELOAD_AHEAD; i++) {
      const n = ((frame - 1 + i) % FRAME_COUNT) + 1
      if (!preloaded.current.has(n)) {
        const img = new Image()
        img.src = frameSrc(n)
        preloaded.current.add(n)
      }
    }
  }, [frame])

  useEffect(() => {
    if (!shouldAnimate) return undefined

    const interval = 1000 / FPS
    function step(timestamp) {
      if (timestamp - lastTickRef.current >= interval) {
        lastTickRef.current = timestamp
        setFrame((f) => (f % FRAME_COUNT) + 1)
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [shouldAnimate])

  return (
    <div className="background-layer" aria-hidden="true">
      {/* Aurora gradient sits underneath as a graceful base / fallback,
          in case the frame sequence hasn't been dropped into public/images yet. */}
      <div className="background-layer__aurora" />

      {shouldAnimate ? (
        <img
          key="sequence"
          className="background-layer__frame"
          src={frameSrc(frame)}
          alt=""
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.opacity = '0'
          }}
        />
      ) : (
        <img
          key="static"
          className="background-layer__frame background-layer__frame--static"
          src="/images/wallpaper-static.jpg"
          alt=""
          draggable={false}
        />
      )}

      <div className="background-layer__vignette" />
    </div>
  )
}
