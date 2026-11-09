import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useConsent } from '../lib/consent'
import './ProjectGallery.css'

gsap.registerPlugin(ScrollTrigger)

const MOBILE_QUERY = '(max-width: 900px)'

const PROJECTS = [
  {
    name: 'Epic Mouse App + Landing Page',
    category: 'Browser-based Application',
    year: 'Launched Oct. 2026',
    url: 'https://www.epicmouse.app',
    static: 'gallery/project-3.png',
    video: 'gallery/project-3.mp4',
  },
    {
    name: 'United Nations Consultant - Personal Portfolio',
    category: 'Portfolio Site',
    year: 'Oct. 2026',
    url: 'https://arianelignier.com',
    static: 'gallery/project-8.png',
    video: 'gallery/project-8.mp4',
  },
  {
    name: 'Vinz Barber Shop',
    category: 'E-Commerce',
    year: 'Aug. 2026',
    url: 'https://www.vinzbarbershopbcn.com/',
    static: 'gallery/project-2.png',
    video: 'gallery/project-2.mp4',
  },
  {
    name: 'PINistry Studio Vintage',
    category: 'E-Commerce',
    year: 'Feb. 2024',
    url: '',
    static: 'gallery/project-7.png',
    video: 'gallery/project-7.mp4',
  },
      {
    name: 'RPG Inspired Portfilio -Contest Runner-up- *DESKTOP VIEW ONLY*',
    category: 'Web Design',
    year: 'Sept. 2026',
    url: 'https://meta4-fan-port.vercel.app/',
    desktopOnly: true,
    static: 'gallery/project-1.png',
    video: 'gallery/project-1.mp4',
  },
  {
    name: 'Virtual Desktop Portfolio',
    category: 'Portfolio Site',
    year: 'Aug. 2026',
    url: 'https://christian-schneider-davis-port.vercel.app/',
    static: 'gallery/project-5.png',
    video: 'gallery/project-5.mp4',
  },
  {
    name: 'Personal Art Portfolio',
    category: 'Portfolio Site',
    year: 'Aug. 2026',
    url: 'https://christian-schneider-davis.github.io/art-portfolio/',
    static: 'gallery/project-4.png',
    video: 'gallery/project-4.mp4',
  },
]

// The strip is rendered twice so it can wrap seamlessly: whatever the offset,
// one of the two copies is always covering the screen.
const LOOP = [...PROJECTS, ...PROJECTS]

const PIN_VH = 340
const ENTRANCE_FRACTION = 0.07
// Nav links to #work land a little past the entrance (see scrollToSection).
const ANCHOR_FRACTION = ENTRANCE_FRACTION + 0.02
// Each panel's width as a share of the stage — the active project fills the
// left of the screen and the next runs off the right edge behind the list.
const PANEL_RATIO = 0.583
// The Selected Work card's width tracks the screen within these bounds.
const LIST_WIDTH = { min: 228, max: 294, ratio: 0.21 }
// Breathing room above and below the Selected Work card.
const CARD_MARGIN_RATIO = 0.05
// The strip drifts on its own whenever the section is on screen, easing to a
// stop while the pointer rests on a project panel or a list row.
const DRIFT_SPEED = 34
const DRIFT_EASE = 220

const wrap = (value, span) => ((value % span) + span) % span

// Pointer capture throws if the id is no longer active (a pointer that was
// cancelled, or a synthetic event). Never let that abort a drag handler.
const capturePointer = (element, pointerId) => {
  try {
    element.setPointerCapture(pointerId)
  } catch {
    /* the drag still works without capture */
  }
}

const releasePointer = (element, pointerId) => {
  try {
    element.releasePointerCapture(pointerId)
  } catch {
    /* already released */
  }
}

export default function ProjectGallery() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const stageRef = useRef(null)
  const compactOuterRef = useRef(null)
  const compactInnerRef = useRef(null)
  const compactHeadRef = useRef(null)
  const galleryViewportRef = useRef(null)
  const trackRef = useRef(null)
  const videoRefs = useRef([])
  const mobileVideoRefs = useRef([])
  const mobileTrackRef = useRef(null)
  const activeIndexRef = useRef(0)

  // The strip's position is a single running offset in pixels rather than a
  // point on a fixed track, so it can wrap forever and be driven by scrolling,
  // hovering and the idle drift without any of them fighting each other.
  const offsetRef = useRef(0)
  const offsetTweenRef = useRef(null)
  const panelWRef = useRef(0)
  const setWidthRef = useRef(0)
  const pinnedRef = useRef(false)
  const driftSpeedRef = useRef(0)
  const listDragRef = useRef({ x: 0, y: 0, active: false, baseLeft: 0, baseTop: 0 })

  const [activeIndex, setActiveIndex] = useState(0)
  const [previewIndex, setPreviewIndex] = useState(null)
  const [modalProject, setModalProject] = useState(null)
  // Live previews load the other site inside this page (with its own
  // scripts and cookies), so they wait for consent — or a one-off click.
  const consent = useConsent()
  const [previewOnce, setPreviewOnce] = useState(false)
  useEffect(() => setPreviewOnce(false), [modalProject])
  const livePreview = consent === 'accepted' || previewOnce

  useEffect(() => {
    if (!modalProject) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setModalProject(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [modalProject])

  const openProject = useCallback((project) => {
    if (!project?.url) return
    if (project.desktopOnly && window.matchMedia(MOBILE_QUERY).matches) return
    setModalProject(project)
  }, [])

  // Slide the strip to a project, taking whichever way round the loop is
  // shorter. Set by the hover handler; the idle drift picks up from wherever
  // this leaves off.
  const goToIndex = useCallback((index) => {
    const span = setWidthRef.current
    const panelW = panelWRef.current
    if (!span || !panelW) return

    const current = offsetRef.current
    let delta = wrap(index * panelW - current, span)
    if (delta > span / 2) delta -= span

    if (offsetTweenRef.current) offsetTweenRef.current.kill()
    const proxy = { value: current }
    offsetTweenRef.current = gsap.to(proxy, {
      value: current + delta,
      duration: 0.8,
      ease: 'power3.out',
      onUpdate: () => {
        offsetRef.current = proxy.value
      },
    })
  }, [])

  useLayoutEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const stage = stageRef.current
    if (!section || !pin || !stage) return undefined

    const mm = gsap.matchMedia()

    mm.add('(min-width: 901px)', () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const compactOuter = compactOuterRef.current
      const compactInner = compactInnerRef.current
      const compactHead = compactHeadRef.current
      const galleryViewport = galleryViewportRef.current
      const track = trackRef.current

      // The section sits inside an off-centre flex column, so pull the
      // full-width stage back to the left edge of the screen by hand.
      const alignStage = () => {
        stage.style.marginLeft = '0px'
        stage.style.marginLeft = `${-stage.getBoundingClientRect().left}px`
      }

      // Size the Selected Work card to the screen, inset from the right by the
      // same margin the page content has on the left, and capped in height so
      // it can't be clipped.
      const fitList = () => {
        const stageH = stage.clientHeight
        const margin = Math.max(16, Math.round(stageH * CARD_MARGIN_RATIO))
        const available = Math.max(220, stageH - margin * 2)
        const width = Math.min(LIST_WIDTH.max, Math.max(LIST_WIDTH.min, window.innerWidth * LIST_WIDTH.ratio))

        compactOuter.style.width = `${Math.round(width)}px`
        compactOuter.style.right = `${Math.round(section.getBoundingClientRect().left)}px`
        compactInner.style.maxHeight = `${available}px`
      }

      const applyMetrics = () => {
        alignStage()
        fitList()
        const panelW = stage.clientWidth * PANEL_RATIO
        panelWRef.current = panelW
        setWidthRef.current = panelW * PROJECTS.length
        track.style.setProperty('--panel-w', `${panelW}px`)
        renderTrack()
      }

      function renderTrack() {
        const span = setWidthRef.current
        if (!span) return
        track.style.transform = `translate3d(${-wrap(offsetRef.current, span)}px, 0, 0)`
      }

      const syncActive = () => {
        const panelW = panelWRef.current
        if (!panelW) return
        const index = wrap(Math.round(offsetRef.current / panelW), PROJECTS.length)
        if (index !== activeIndexRef.current) {
          activeIndexRef.current = index
          setActiveIndex(index)
        }
      }

      gsap.set(galleryViewport, { opacity: 0 })
      gsap.set(compactInner, { y: 14 })
      applyMetrics()

      const syncInteractivity = (progress) => {
        const open = progress > ENTRANCE_FRACTION * 0.4
        compactOuter.style.pointerEvents = open ? 'auto' : 'none'
        galleryViewport.style.pointerEvents = open ? 'auto' : 'none'
      }

      let lastScrollY = window.scrollY

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: applyMetrics,
          onUpdate: (self) => syncInteractivity(self.progress),
        },
      })

      tl.to(galleryViewport, { opacity: 1, duration: ENTRANCE_FRACTION }, 0)
        .to(compactInner, { y: 0, duration: ENTRANCE_FRACTION }, 0)
        // Holds the timeline at a total duration of 1 so the entrance stays a
        // short opening beat rather than stretching over the whole section.
        .to({}, { duration: 1 - ENTRANCE_FRACTION }, ENTRANCE_FRACTION)

      const st = tl.scrollTrigger
      syncInteractivity(st.progress)

      // Scrolling through the pinned section drives the strip sideways. It is
      // applied as a delta rather than mapped to a fixed range, which is what
      // lets the strip keep looping past the end of the project list.
      const scrollRatio = () => {
        const range = Math.max(1, pin.offsetHeight - window.innerHeight)
        return setWidthRef.current / range
      }

      const onScroll = () => {
        const y = window.scrollY
        const delta = y - lastScrollY
        lastScrollY = y
        const rect = pin.getBoundingClientRect()
        pinnedRef.current = rect.top <= 0 && rect.bottom >= window.innerHeight
        compactOuter.classList.toggle('is-draggable', pinnedRef.current)
        if (!pinnedRef.current || !delta) return
        if (offsetTweenRef.current) offsetTweenRef.current.kill()
        offsetRef.current += delta * scrollRatio()
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()

      // Horizontal trackpad swipes nudge the strip without moving the page.
      const onWheel = (event) => {
        if (!pinnedRef.current) return
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
        event.preventDefault()
        if (offsetTweenRef.current) offsetTweenRef.current.kill()
        offsetRef.current += event.deltaX
      }
      stage.addEventListener('wheel', onWheel, { passive: false })

      // Click-and-drag the strip itself (mouse / pen). It follows the pointer,
      // keeps gliding briefly on release, and the idle drift takes over again
      // from wherever it comes to rest.
      const stripDrag = { down: false, moved: false, startX: 0, lastX: 0, lastT: 0, v: 0, id: null }
      let suppressStripClick = false

      const onStripPointerDown = (event) => {
        if (event.pointerType === 'touch' || event.button !== 0) return
        if (galleryViewport.style.pointerEvents === 'none') return
        Object.assign(stripDrag, {
          down: true,
          moved: false,
          startX: event.clientX,
          lastX: event.clientX,
          lastT: performance.now(),
          v: 0,
          id: event.pointerId,
        })
      }

      const onStripPointerMove = (event) => {
        if (!stripDrag.down || event.pointerId !== stripDrag.id) return
        if (!stripDrag.moved) {
          if (Math.abs(event.clientX - stripDrag.startX) < 6) return
          stripDrag.moved = true
          if (offsetTweenRef.current) offsetTweenRef.current.kill()
          galleryViewport.classList.add('is-dragging')
          capturePointer(galleryViewport, event.pointerId)
        }
        const now = performance.now()
        const dx = event.clientX - stripDrag.lastX
        const dt = Math.max(1, now - stripDrag.lastT)
        stripDrag.v = 0.8 * (dx / dt) + 0.2 * stripDrag.v
        stripDrag.lastX = event.clientX
        stripDrag.lastT = now
        offsetRef.current -= dx
      }

      const onStripPointerUp = (event) => {
        if (!stripDrag.down || event.pointerId !== stripDrag.id) return
        stripDrag.down = false
        if (!stripDrag.moved) return
        galleryViewport.classList.remove('is-dragging')
        releasePointer(galleryViewport, event.pointerId)
        suppressStripClick = true
        setTimeout(() => {
          suppressStripClick = false
        }, 0)

        // Glide on with the release speed (px/ms), easing out.
        const glide = -stripDrag.v * 420
        if (Math.abs(glide) < 2) return
        const proxy = { value: offsetRef.current }
        offsetTweenRef.current = gsap.to(proxy, {
          value: offsetRef.current + glide,
          duration: 0.9,
          ease: 'power3.out',
          onUpdate: () => {
            offsetRef.current = proxy.value
          },
        })
      }

      // A drag shouldn't also open the project under the pointer.
      const onStripClickCapture = (event) => {
        if (!suppressStripClick) return
        event.preventDefault()
        event.stopPropagation()
        suppressStripClick = false
      }
      const onStripDragStart = (event) => event.preventDefault()

      galleryViewport.addEventListener('pointerdown', onStripPointerDown)
      window.addEventListener('pointermove', onStripPointerMove)
      window.addEventListener('pointerup', onStripPointerUp)
      window.addEventListener('pointercancel', onStripPointerUp)
      galleryViewport.addEventListener('click', onStripClickCapture, true)
      galleryViewport.addEventListener('dragstart', onStripDragStart)

      // The Selected Work card drags by its header only, so the rows below
      // stay free for hovering and clicking.
      const onListPointerDown = (event) => {
        if (!pinnedRef.current || event.button !== 0) return
        const drag = listDragRef.current
        const rect = compactOuter.getBoundingClientRect()
        drag.active = true
        drag.baseLeft = rect.left - drag.x
        drag.baseTop = rect.top - drag.y
        drag.pointerX = event.clientX
        drag.pointerY = event.clientY
        compactOuter.classList.add('is-dragging', 'has-dragged')
        capturePointer(compactHead, event.pointerId)
        event.preventDefault()
      }

      const onListPointerMove = (event) => {
        const drag = listDragRef.current
        if (!drag.active) return
        const rect = compactOuter.getBoundingClientRect()
        const nextX = drag.x + (event.clientX - drag.pointerX)
        const nextY = drag.y + (event.clientY - drag.pointerY)
        drag.pointerX = event.clientX
        drag.pointerY = event.clientY
        const edge = 12
        drag.x = Math.min(
          Math.max(nextX, edge - drag.baseLeft),
          window.innerWidth - edge - rect.width - drag.baseLeft,
        )
        drag.y = Math.min(
          Math.max(nextY, edge - drag.baseTop),
          window.innerHeight - edge - rect.height - drag.baseTop,
        )
      }

      const onListPointerUp = (event) => {
        const drag = listDragRef.current
        if (!drag.active) return
        drag.active = false
        compactOuter.classList.remove('is-dragging')
        releasePointer(compactHead, event.pointerId)
      }

      compactHead.addEventListener('pointerdown', onListPointerDown)
      window.addEventListener('pointermove', onListPointerMove)
      window.addEventListener('pointerup', onListPointerUp)
      window.addEventListener('pointercancel', onListPointerUp)

      // Paused while the pointer is actually on something — read live rather
      // than tracked with enter/leave, which would blink false for a frame
      // when the pointer crosses straight from one panel to the next.
      const pointerIsEngaged = () =>
        Boolean(
          track.querySelector('.project-gallery__panel:hover') ||
            compactInner.querySelector('.project-gallery__compact-row:hover'),
        )

      let lastFrame = performance.now()
      let frame = 0

      const tick = (now) => {
        const dt = Math.min(64, now - lastFrame)
        lastFrame = now

        const drifting =
          !reduced &&
          pinnedRef.current &&
          !offsetTweenRef.current?.isActive() &&
          !stripDrag.down &&
          !pointerIsEngaged()

        const targetSpeed = drifting ? DRIFT_SPEED : 0
        driftSpeedRef.current +=
          (targetSpeed - driftSpeedRef.current) * Math.min(1, dt / DRIFT_EASE)
        if (driftSpeedRef.current > 0.01) {
          offsetRef.current += driftSpeedRef.current * (dt / 1000)
        }

        // Once the section lets go, a dragged list eases back into place.
        const listDrag = listDragRef.current
        if (!pinnedRef.current && !listDrag.active && (listDrag.x || listDrag.y)) {
          listDrag.x += -listDrag.x * 0.12
          listDrag.y += -listDrag.y * 0.12
          if (Math.abs(listDrag.x) < 0.5) listDrag.x = 0
          if (Math.abs(listDrag.y) < 0.5) listDrag.y = 0
        }
        if (listDrag.x || listDrag.y || listDrag.offset) {
          compactOuter.style.transform = `translate(${listDrag.x}px, calc(-50% + ${listDrag.y}px))`
          listDrag.offset = Boolean(listDrag.x || listDrag.y)
        }

        renderTrack()
        syncActive()
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)

      const handleResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', handleResize)
      window.addEventListener('orientationchange', handleResize)

      return () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('orientationchange', handleResize)
        stage.removeEventListener('wheel', onWheel)
        galleryViewport.removeEventListener('pointerdown', onStripPointerDown)
        window.removeEventListener('pointermove', onStripPointerMove)
        window.removeEventListener('pointerup', onStripPointerUp)
        window.removeEventListener('pointercancel', onStripPointerUp)
        galleryViewport.removeEventListener('click', onStripClickCapture, true)
        galleryViewport.removeEventListener('dragstart', onStripDragStart)
        galleryViewport.classList.remove('is-dragging')
        compactHead.removeEventListener('pointerdown', onListPointerDown)
        window.removeEventListener('pointermove', onListPointerMove)
        window.removeEventListener('pointerup', onListPointerUp)
        window.removeEventListener('pointercancel', onListPointerUp)
        compactOuter.classList.remove('is-draggable', 'is-dragging', 'has-dragged')
        compactOuter.style.transform = ''
        listDragRef.current.x = 0
        listDragRef.current.y = 0
        if (offsetTweenRef.current) offsetTweenRef.current.kill()
        track.style.transform = ''
      }
    })

    return () => mm.revert()
  }, [])

  // Hovering a list row previews that project. Both copies of the panel get
  // the class (only one can ever be on screen — they sit a full strip apart),
  // but only the visible one actually plays.
  useEffect(() => {
    const videos = videoRefs.current
    videos.forEach((video, position) => {
      if (video && (previewIndex === null || position % PROJECTS.length !== previewIndex)) {
        video.pause()
      }
    })
    if (previewIndex === null) return undefined

    let best = previewIndex
    let bestVisible = -Infinity
    ;[previewIndex, previewIndex + PROJECTS.length].forEach((position) => {
      const panel = videos[position]?.parentElement
      if (!panel) return
      const rect = panel.getBoundingClientRect()
      const visible = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)
      if (visible > bestVisible) {
        bestVisible = visible
        best = position
      }
    })

    const video = videos[best]
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {})
    }
    return undefined
  }, [previewIndex])

  const playVideo = (refsArray, index) => {
    const video = refsArray.current[index]
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => {})
  }
  const pauseVideo = (refsArray, index) => {
    const video = refsArray.current[index]
    if (video) video.pause()
  }

  // Mobile / touch fallback: autoplay the preview whose panel is mostly
  // in view, since there is no hover state to rely on.
  useEffect(() => {
    const panels = Array.from(document.querySelectorAll('[data-mobile-panel]'))
    if (!panels.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-mobile-panel'))
          if (entry.isIntersecting) {
            playVideo(mobileVideoRefs, index)
          } else {
            pauseVideo(mobileVideoRefs, index)
          }
        })
      },
      { threshold: 0.6 },
    )
    panels.forEach((panel) => observer.observe(panel))
    return () => observer.disconnect()
  }, [])

  // Narrow screens with a mouse or trackpad (small desktop windows, tablets
  // with a pointer): the swipe strip also responds to click-and-drag and to
  // the vertical mouse wheel while hovered. Touch keeps its native swipe.
  useEffect(() => {
    const track = mobileTrackRef.current
    if (!track) return undefined
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    let tween = null
    let wheelTarget = null
    let idleTimer = 0
    const drag = { down: false, moved: false, startX: 0, startScroll: 0, lastX: 0, lastT: 0, v: 0 }
    let suppressClick = false

    const maxScroll = () => track.scrollWidth - track.clientWidth

    // The scroll positions the browser's own scroll-snap would land on.
    const snapPoints = () => {
      const base = track.getBoundingClientRect().left - track.scrollLeft
      const max = maxScroll()
      const points = Array.from(track.children).map((panel) =>
        Math.min(max, Math.max(0, panel.getBoundingClientRect().left - base)),
      )
      return [...new Set([...points, max].map(Math.round))]
    }

    // Where to come to rest: the nearest panel, or — when the strip was
    // pushed one way — the next panel in that direction, so even a single
    // wheel notch or a short drag moves on by one project.
    const restingPoint = (x, dir = 0) => {
      const points = snapPoints().sort((a, b) => a - b)
      if (dir > 0) return points.find((p) => p >= x - 1) ?? points[points.length - 1]
      if (dir < 0) return [...points].reverse().find((p) => p <= x + 1) ?? points[0]
      return points.reduce((best, p) => (Math.abs(p - x) < Math.abs(best - x) ? p : best), points[0])
    }
    const bounds = () => {
      const points = snapPoints()
      return [Math.min(...points), Math.max(...points)]
    }

    // Native snapping is switched off while we move the strip by hand (it
    // would fight every frame), then back on once it rests on a panel.
    const free = () => track.classList.add('is-free')
    const settle = (from = track.scrollLeft, dir = 0, duration = 0.5) => {
      tween?.kill()
      wheelTarget = null
      tween = gsap.to(track, {
        scrollLeft: restingPoint(from, dir),
        duration,
        ease: 'power3.out',
        onComplete: () => track.classList.remove('is-free'),
      })
    }

    const onWheel = (event) => {
      if (!finePointer.matches) return
      // Sideways trackpad swipes already scroll the strip natively.
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return
      const unit = event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? track.clientWidth : 1
      const delta = event.deltaY * unit
      const from = wheelTarget ?? track.scrollLeft
      const [min, max] = bounds()
      // At either end, let the page carry on scrolling.
      if ((delta < 0 && from <= min + 1) || (delta > 0 && from >= max - 1)) return
      event.preventDefault()
      free()
      wheelTarget = Math.min(max, Math.max(min, from + delta))
      const dir = Math.sign(delta)
      tween?.kill()
      tween = gsap.to(track, { scrollLeft: wheelTarget, duration: 0.45, ease: 'power2.out' })
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => settle(wheelTarget ?? track.scrollLeft, dir), 160)
    }

    const onPointerDown = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      tween?.kill()
      clearTimeout(idleTimer)
      Object.assign(drag, {
        down: true,
        moved: false,
        startX: event.clientX,
        startScroll: track.scrollLeft,
        lastX: event.clientX,
        lastT: performance.now(),
        v: 0,
      })
    }

    const onPointerMove = (event) => {
      if (!drag.down) return
      const dx = event.clientX - drag.startX
      if (!drag.moved) {
        if (Math.abs(dx) < 6) return
        drag.moved = true
        free()
        track.classList.add('is-dragging')
        try {
          track.setPointerCapture(event.pointerId)
        } catch {
          /* fine without capture */
        }
      }
      const now = performance.now()
      const dt = Math.max(1, now - drag.lastT)
      drag.v = 0.8 * ((event.clientX - drag.lastX) / dt) + 0.2 * drag.v
      drag.lastX = event.clientX
      drag.lastT = now
      track.scrollLeft = drag.startScroll - dx
    }

    const onPointerUp = (event) => {
      if (!drag.down) return
      drag.down = false
      if (!drag.moved) return
      track.classList.remove('is-dragging')
      try {
        track.releasePointerCapture(event.pointerId)
      } catch {
        /* already released */
      }
      // A quick flick carries on to the next panel or two.
      const projected = track.scrollLeft - drag.v * 260
      const moved = track.scrollLeft - drag.startScroll
      settle(projected, Math.abs(moved) > 40 ? Math.sign(moved) : 0, 0.65)
      suppressClick = true
      setTimeout(() => {
        suppressClick = false
      }, 0)
    }

    // A drag shouldn't also count as a click that opens the project.
    const onClickCapture = (event) => {
      if (!suppressClick) return
      event.preventDefault()
      event.stopPropagation()
      suppressClick = false
    }
    const onDragStart = (event) => event.preventDefault()

    track.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    track.addEventListener('click', onClickCapture, true)
    track.addEventListener('dragstart', onDragStart)

    return () => {
      tween?.kill()
      clearTimeout(idleTimer)
      track.removeEventListener('wheel', onWheel)
      track.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      track.removeEventListener('click', onClickCapture, true)
      track.removeEventListener('dragstart', onDragStart)
      track.classList.remove('is-free', 'is-dragging')
    }
  }, [])

  return (
    <section id="work" className="project-gallery" ref={sectionRef}>
      <div className="project-gallery__pin" ref={pinRef} style={{ height: `${PIN_VH}vh` }}>
        {/* Where "Work" links land: just past the scroll-driven entrance, so
            the gallery is already faded in when the jump finishes. */}
        <span
          className="project-gallery__anchor"
          data-scroll-anchor="#work"
          aria-hidden="true"
          style={{ top: `${(PIN_VH - 100) * ANCHOR_FRACTION}vh` }}
        />
        <div className="project-gallery__stage" ref={stageRef}>
          <div className="project-gallery__viewport" ref={galleryViewportRef}>
            <div className="project-gallery__track" ref={trackRef}>
              {LOOP.map((project, position) => {
                const index = position % PROJECTS.length
                return (
                  <div
                    key={`${project.name}-${position}`}
                    className={`project-gallery__panel${
                      activeIndex === index ? ' is-active' : ''
                    }${previewIndex === index ? ' is-previewing' : ''}`}
                    onMouseEnter={() => playVideo(videoRefs, position)}
                    onMouseLeave={() => pauseVideo(videoRefs, position)}
                    onClick={() => openProject(project)}
                  >
                    <img
                      className="project-gallery__panel-static"
                      src={project.static}
                      alt={project.name}
                      loading="lazy"
                    />
                    <video
                      className="project-gallery__panel-video"
                      ref={(el) => {
                        videoRefs.current[position] = el
                      }}
                      src={project.video}
                      muted
                      loop
                      playsInline
                      preload="none"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="project-gallery__compact" ref={compactOuterRef}>
            {/* "Drag me" hint; the list drags by its header. */}
            <span className="project-gallery__drag-hint" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="12" height="12">
                <path
                  d="M8 1.5v13M1.5 8h13M8 1.5 6 3.5M8 1.5l2 2M8 14.5l-2-2M8 14.5l2-2M1.5 8l2-2M1.5 8l2 2M14.5 8l-2-2M14.5 8l-2 2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Drag me
            </span>
            <div className="project-gallery__compact-card" ref={compactInnerRef}>
              <div className="project-gallery__compact-head" ref={compactHeadRef}>
                <p className="eyebrow">Selected Work</p>
                <span className="project-gallery__count">
                  {String(PROJECTS.length).padStart(2, '0')} projects
                </span>
              </div>
              <ul className="project-gallery__compact-list">
                {PROJECTS.map((project, index) => (
                  <li key={project.name}>
                    <button
                      type="button"
                      className={`project-gallery__compact-row${
                        activeIndex === index ? ' is-active' : ''
                      }`}
                      onClick={() => openProject(project)}
                      onMouseEnter={() => {
                        goToIndex(index)
                        setPreviewIndex(index)
                      }}
                      onMouseLeave={() => setPreviewIndex(null)}
                      onFocus={() => {
                        goToIndex(index)
                        setPreviewIndex(index)
                      }}
                      onBlur={() => setPreviewIndex(null)}
                    >
                      <span className="project-gallery__compact-index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="project-gallery__compact-name">{project.name}</span>
                      <span className="project-gallery__compact-meta">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / narrow-viewport fallback: no scroll-jacking, a natural
          swipeable strip with scroll-snap and view-driven autoplay. */}
      <div className="wrap project-gallery__mobile">
        <div className="project-gallery__mobile-head">
          <p className="eyebrow">Selected Work</p>
          <span className="project-gallery__count">
            {String(PROJECTS.length).padStart(2, '0')} projects
          </span>
        </div>
        <div className="project-gallery__mobile-track" ref={mobileTrackRef}>
          {PROJECTS.map((project, index) => (
            <div
              key={project.name}
              className="project-gallery__mobile-panel"
              data-mobile-panel={index}
              onClick={() => openProject(project)}
            >
              <img
                className="project-gallery__panel-static"
                src={project.static}
                alt={project.name}
                loading="lazy"
              />
              <video
                className="project-gallery__panel-video project-gallery__panel-video--mobile"
                ref={(el) => {
                  mobileVideoRefs.current[index] = el
                }}
                src={project.video}
                muted
                loop
                playsInline
                preload="none"
              />
              <div className="project-gallery__panel-meta">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{project.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalProject && (
        <div className="project-modal__overlay" onClick={() => setModalProject(null)}>
          <div className="project-modal__window" onClick={(event) => event.stopPropagation()}>
            <div className="project-modal__bar">
              <span className="project-modal__title">{modalProject.name}</span>
              <div className="project-modal__actions">
                <a
                  className="project-modal__open-new"
                  href={modalProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in new tab &#8599;
                </a>
                <button
                  type="button"
                  className="project-modal__close"
                  onClick={() => setModalProject(null)}
                  aria-label="Close preview"
                >
                  &times;
                </button>
              </div>
            </div>
            {livePreview ? (
              <iframe src={modalProject.url} title={modalProject.name} className="project-modal__frame" />
            ) : (
              <div className="project-modal__gate">
                <img className="project-modal__gate-img" src={modalProject.static} alt="" />
                <div className="project-modal__gate-card">
                  <p className="eyebrow">Live preview</p>
                  <p className="project-modal__gate-text">
                    This loads <strong>{new URL(modalProject.url).hostname.replace(/^www\./, '')}</strong>{' '}
                    inside this page. That site may set its own cookies.
                  </p>
                  <div className="project-modal__gate-actions">
                    <a
                      className="btn btn--ghost"
                      href={modalProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in new tab &#8599;
                    </a>
                    <button type="button" className="btn btn--primary" onClick={() => setPreviewOnce(true)}>
                      Load preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
