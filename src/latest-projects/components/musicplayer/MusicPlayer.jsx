import { useState } from 'react'
import { Icon } from '../common/Icon.jsx'
import { useDraggable } from '../../hooks/useDraggable.js'
import { useMusicPlayer } from '../../context/MusicPlayerContext.jsx'
import { useOsContainer } from '../../context/OsContainerContext.jsx'
import './MusicPlayer.css'

export function MusicPlayer() {
  const { isOpen, isPlaying, currentTrack, closePlayer, togglePlay, nextTrack, prevTrack } = useMusicPlayer()
  const { getSize } = useOsContainer()
  const [pos, setPos] = useState({ x: 32, y: 32 })

  const { onPointerDown, isDragging } = useDraggable(pos, (x, y) => setPos({ x, y }), {
    bounds: () => {
      const { width, height } = getSize()
      return {
        minX: 8,
        minY: 8,
        maxX: width - 268,
        maxY: height - 92 - 96, // keep clear of the taskbar
      }
    },
  })

  if (!isOpen) return null

  return (
    <div
      className={`music-player acrylic${isDragging ? ' is-dragging' : ''}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      <div className="music-player__chrome" onPointerDown={onPointerDown}>
        <span className="music-player__chrome-label">Now Playing</span>
        <button
          type="button"
          className="music-player__close"
          aria-label="Close player"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={closePlayer}
        >
          <Icon name="close" size={12} />
        </button>
      </div>

      <div className="music-player__body">
        <div className="music-player__art" aria-hidden="true">
          <Icon name="music" size={18} />
        </div>

        <div className="music-player__info">
          <p className="music-player__title">{currentTrack.title}</p>
          <p className="music-player__artist">{currentTrack.artist}</p>
        </div>

        <button
          type="button"
          className="music-player__toggle"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlay}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size={16} />
        </button>

        <button
          type="button"
          className="music-player__skip"
          aria-label="Previous track"
          onClick={prevTrack}
        >
          <Icon name="back" size={15} />
        </button>

        <button
          type="button"
          className="music-player__skip"
          aria-label="Next track"
          onClick={nextTrack}
        >
          <Icon name="skip" size={15} />
        </button>
      </div>
    </div>
  )
}
