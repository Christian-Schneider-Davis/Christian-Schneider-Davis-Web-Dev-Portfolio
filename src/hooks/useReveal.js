import { useEffect, useRef } from 'react'

/**
 * Adds the `is-visible` class to the returned ref's element the first
 * time it scrolls into view. Pair with the `.reveal` utility class.
 */
export default function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.unobserve(node)
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px', ...options },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
}
