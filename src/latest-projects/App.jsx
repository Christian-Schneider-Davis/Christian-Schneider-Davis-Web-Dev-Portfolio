import { useRef } from 'react'
import { SettingsProvider, useSettings } from './context/SettingsContext.jsx'
import { WindowManagerProvider } from './context/WindowManagerContext.jsx'
import { MusicPlayerProvider } from './context/MusicPlayerContext.jsx'
import { OsContainerProvider } from './context/OsContainerContext.jsx'
import { Desktop } from './components/desktop/Desktop.jsx'
import { WindowLayer } from './components/window/WindowLayer.jsx'
import { Taskbar } from './components/taskbar/Taskbar.jsx'
import { MusicPlayer } from './components/musicplayer/MusicPlayer.jsx'
import './styles/global.css'

function OsRoot() {
  const { theme } = useSettings()
  const containerRef = useRef(null)

  return (
    <OsContainerProvider containerRef={containerRef}>
      <div className="os-root" data-theme={theme} ref={containerRef}>
        <WindowManagerProvider>
          <MusicPlayerProvider>
            <Desktop />
            <WindowLayer />
            <MusicPlayer />
            <Taskbar />
          </MusicPlayerProvider>
        </WindowManagerProvider>
      </div>
    </OsContainerProvider>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <OsRoot />
    </SettingsProvider>
  )
}
