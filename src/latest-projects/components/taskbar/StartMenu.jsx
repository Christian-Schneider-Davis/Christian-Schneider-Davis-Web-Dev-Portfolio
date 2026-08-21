import { useMemo, useState } from 'react'
import { Icon } from '../common/Icon.jsx'
import { APPS } from '../../data/apps.js'
import { WORKS } from '../../data/works.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useWindowManager } from '../../context/WindowManagerContext.jsx'
import { useMusicPlayer } from '../../context/MusicPlayerContext.jsx'
import './StartMenu.css'

const RECENT_LABELS = ['12m ago', '38m ago', '1h ago', 'Yesterday']

export function StartMenu() {
  const { startMenuOpen, openApp, closeStartMenu } = useWindowManager()
  const { isDark, toggleTheme, isAnimatedBackground, toggleBackgroundMode } = useSettings()
  const { isOpen: isPlayerOpen, openPlayer } = useMusicPlayer()
  const [query, setQuery] = useState('')

  const year = new Date().getFullYear()

  const pinned = useMemo(() => APPS.slice().sort((a, b) => a.order - b.order), [])
  const filteredPinned = useMemo(
    () => pinned.filter((a) => a.title.toLowerCase().includes(query.trim().toLowerCase())),
    [pinned, query],
  )
  const recent = WORKS.slice(0, 4)

  return (
    <nav
      className={`start-menu acrylic${startMenuOpen ? ' is-open' : ''}`}
      aria-hidden={!startMenuOpen}
      aria-label="Start menu"
    >
      <div className="start-menu__search">
        <Icon name="search" size={15} />
        <input
          type="text"
          placeholder="Search About, Recent Works, Contact…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <section className="start-menu__section">
        <div className="start-menu__section-head">
          <h2>Pinned</h2>
        </div>
        <div className="start-menu__grid">
          {(query ? filteredPinned : pinned).map((app) => (
            <button
              key={app.id}
              type="button"
              className="start-menu__tile"
              onClick={() => {
                openApp(app.id)
                closeStartMenu()
              }}
            >
              <span className="start-menu__tile-icon" style={{ '--tile-accent': app.accent }}>
                <Icon name={app.icon} size={19} />
              </span>
              <span>{app.title}</span>
            </button>
          ))}

          <button
            type="button"
            className="start-menu__tile"
            onClick={() => {
              openPlayer()
              closeStartMenu()
            }}
          >
            <span className="start-menu__tile-icon" style={{ '--tile-accent': 'var(--accent-teal)' }}>
              <Icon name="music" size={19} />
            </span>
            <span>{isPlayerOpen ? 'Music Player' : 'Music Player (closed)'}</span>
          </button>

          {query && filteredPinned.length === 0 && (
            <p className="start-menu__empty">No matches for &ldquo;{query}&rdquo;</p>
          )}
        </div>
      </section>

      <div className="start-menu__toggles">
        <button type="button" className="start-menu__toggle" onClick={toggleTheme}>
          <Icon name={isDark ? 'moon' : 'sun'} size={16} />
          <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
          <span className={`start-menu__switch${isDark ? ' is-on' : ''}`} aria-hidden="true" />
        </button>

        <button type="button" className="start-menu__toggle" onClick={toggleBackgroundMode}>
          <Icon name="image" size={16} />
          <span>{isAnimatedBackground ? 'Animated wallpaper' : 'Static wallpaper'}</span>
          <span className={`start-menu__switch${isAnimatedBackground ? ' is-on' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="start-menu__footer">
        <div className="start-menu__user">
          <span className="start-menu__avatar">CS</span>
          <span>Christian Schneider-Davis</span>
        </div>
        <p className="start-menu__copyright">&copy; {year} Christian Schneider-Davis</p>
      </div>
    </nav>
  )
}
