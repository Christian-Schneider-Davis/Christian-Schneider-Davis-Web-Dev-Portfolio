import { Icon } from '../common/Icon.jsx'
import { Clock } from './Clock.jsx'
import { StartMenu } from './StartMenu.jsx'
import { APPS, SOCIAL_LINKS } from '../../data/apps.js'
import { useWindowManager } from '../../context/WindowManagerContext.jsx'
import './Taskbar.css'

export function Taskbar() {
  const { windows, openApp, focusWindow, minimizeWindow, startMenuOpen, toggleStartMenu, closeStartMenu } =
    useWindowManager()

  const pinnedApps = APPS.filter((a) => a.pinned).sort((a, b) => a.order - b.order)

  function isRunning(appId) {
    return windows.some((w) => w.appId === appId)
  }

  function isFocused(appId) {
    if (!windows.length) return false
    const top = windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
    return top.appId === appId && !top.minimized
  }

  function handleTaskbarAppClick(appId) {
    const win = windows.find((w) => w.appId === appId)
    if (!win) {
      openApp(appId)
      return
    }
    if (win.minimized || !isFocused(appId)) {
      focusWindow(win.id)
    } else {
      minimizeWindow(win.id)
    }
  }

  // Windows open for apps that aren't pinned (e.g. Résumé) still get a taskbar entry.
  const unpinnedRunning = windows
    .map((w) => APPS.find((a) => a.id === w.appId))
    .filter((app) => app && !app.pinned)
    .filter((app, i, arr) => arr.findIndex((a) => a.id === app.id) === i)

  return (
    <>
      {startMenuOpen && <div className="taskbar-scrim" onClick={closeStartMenu} />}

      <div className="taskbar">
        <div className="taskbar__side" />

        <div className="taskbar__center">
          <button
            type="button"
            className={`taskbar__start${startMenuOpen ? ' is-active' : ''}`}
            aria-label="Open Start menu"
            aria-expanded={startMenuOpen}
            onClick={toggleStartMenu}
          >
            <Icon name="windows" size={19} />
          </button>

          {[...pinnedApps, ...unpinnedRunning].map((app) => (
            <button
              key={app.id}
              type="button"
              className={`taskbar__app${isRunning(app.id) ? ' is-running' : ''}${isFocused(app.id) ? ' is-focused' : ''}`}
              style={{ '--app-accent': app.accent }}
              aria-label={app.title}
              onClick={() => handleTaskbarAppClick(app.id)}
            >
              <Icon name={app.icon} size={18} />
              {isRunning(app.id) && <span className="taskbar__app-dot" />}
            </button>
          ))}
        </div>

        <div className="taskbar__side taskbar__side--right">
          <div className="taskbar__tray">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="taskbar__tray-icon"
                aria-label={s.label}
              >
                <Icon name={s.icon} size={15} />
              </a>
            ))}
          </div>
          <Clock />
        </div>
      </div>

      <StartMenu />
    </>
  )
}
