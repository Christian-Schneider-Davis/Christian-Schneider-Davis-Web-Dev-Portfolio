import { useEffect, useState } from 'react'

function format(date) {
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })
  return { time, date: dateStr, raw: date }
}

/** Live clock, ticking on real second boundaries rather than a fixed interval. */
export function useClock() {
  const [now, setNow] = useState(() => format(new Date()))

  useEffect(() => {
    let timeoutId
    const tick = () => {
      setNow(format(new Date()))
      const msToNextSecond = 1000 - (Date.now() % 1000)
      timeoutId = setTimeout(tick, msToNextSecond)
    }
    tick()
    return () => clearTimeout(timeoutId)
  }, [])

  return now
}
