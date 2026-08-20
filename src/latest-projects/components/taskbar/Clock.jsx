import { useClock } from '../../hooks/useClock.js'
import './Clock.css'

export function Clock() {
  const { time, date } = useClock()
  return (
    <div className="taskbar-clock" aria-live="off">
      <span className="taskbar-clock__time">{time}</span>
      <span className="taskbar-clock__date">{date}</span>
    </div>
  )
}
