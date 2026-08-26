import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const MusicPlayerContext = createContext(null)

export const PLAYLIST = [
  { title: 'Fat Jon', artist: 'Nujabes (Samurai Champloo OST)', src: 'audio/track-1.mp3' },
  { title: 'Counting Stars', artist: 'Nujabes (Samurai Champloo OST)', src: 'audio/track-2.mp3' },
  { title: 'Departure', artist: 'Nujabes (Samurai Champloo OST)', src: 'audio/track-3.mp3' },
  { title: 'Just Forget', artist: 'Nujabes (Samurai Champloo OST)', src: 'audio/track-4.mp3' },
  { title: 'Dead Season', artist: 'Nujabes (Samurai Champloo OST)', src: 'audio/track-5.mp3' },
  { title: 'Same Ole Thing', artist: 'Nujabes (Samurai Champloo OST)', src: 'audio/track-6.mp3' },
  { title: 'Tsurugi No Mai', artist: 'Nujabes (Samurai Champloo OST)', src: 'audio/track-7.mp3' },
  { title: 'Sneak Chamber', artist: 'Nujabes (Samurai Champloo OST)', src: 'audio/track-8.mp3' },
  { title: 'Shiki No Uta', artist: 'Nujabes (Samurai Champloo OST)', src: 'audio/track-9.mp3' },
  { title: 'Sincerely', artist: 'Tsutchie', src: 'audio/track-10.mp3' },
]

export function MusicPlayerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const audioRef = useRef(null)

  const currentTrack = PLAYLIST[trackIndex]

  useEffect(() => {
    if (isPlaying) audioRef.current?.play().catch(() => {})
  }, [trackIndex])

  function openPlayer() {
    setIsOpen(true)
  }

  function closePlayer() {
    setIsOpen(false)
    setIsPlaying(false)
    audioRef.current?.pause()
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  // Cycles forward through the playlist in order, wrapping back to the start.
  function nextTrack() {
    setTrackIndex((i) => (i + 1) % PLAYLIST.length)
  }

  // Cycles backward, wrapping to the end.
  function prevTrack() {
    setTrackIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length)
  }

  const value = useMemo(
    () => ({ isOpen, isPlaying, currentTrack, openPlayer, closePlayer, togglePlay, nextTrack, prevTrack }),
    [isOpen, isPlaying, currentTrack],
  )

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={nextTrack}
      />
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider')
  return ctx
}
