import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const MusicPlayerContext = createContext(null)

// Point each entry at your own file. Anything the <audio> element can play works.
export const PLAYLIST = [
  { title: 'Fat Jon', artist: 'Nujabes (Samurai Champloo OST)', src: '/audio/track-1.mp3' },
  { title: 'Counting Stars', artist: 'Nujabes (Samurai Champloo OST)', src: '/audio/track-2.mp3' },
  { title: 'Departure', artist: 'Nujabes (Samurai Champloo OST)', src: '/audio/track-3.mp3' },
  { title: 'Just Forget', artist: 'Nujabes (Samurai Champloo OST)', src: '/audio/track-4.mp3' },
  { title: 'Your 5th song name', artist: 'Nujabes (Samurai Champloo OST)', src: '/audio/track-5.mp3' },
  { title: 'Your 6th song name', artist: 'Nujabes (Samurai Champloo OST)', src: '/audio/track-6.mp3' },
  { title: 'Your 7th song name', artist: 'Nujabes (Samurai Champloo OST)', src: '/audio/track-7.mp3' },
  { title: 'Your 8th song name', artist: 'Nujabes (Samurai Champloo OST)', src: '/audio/track-8.mp3' },
  { title: 'Your 9th song name', artist: 'Minmi', src: '/audio/track-9.mp3' },
  { title: 'Your 10th song name', artist: 'Tsutchie', src: '/audio/track-10.mp3' },
]

export function MusicPlayerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const audioRef = useRef(null)

  const currentTrack = PLAYLIST[trackIndex]

  // When the track changes, the <audio> element's src updates via the JSX
  // below — this just keeps playback going if we were already playing.
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
