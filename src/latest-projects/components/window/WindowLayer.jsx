import { useWindowManager } from '../../context/WindowManagerContext.jsx'
import { AppWindow } from './AppWindow.jsx'
import './WindowLayer.css'

export function WindowLayer() {
  const { windows } = useWindowManager()
  return (
    <div className="window-layer">
      {windows.map((win) => (
        <AppWindow key={win.id} win={win} />
      ))}
    </div>
  )
}
