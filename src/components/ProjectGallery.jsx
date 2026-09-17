import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ProjectGallery.css'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    name: 'RPG Inspired Mock Site Port *DESKTOP VIEW ONLY*',
    category: 'Web Design',
    year: 'Sept. 2026',
    image: 'photos/RPG-port.png',
    url: 'https://meta4-fan-port.vercel.app/',
    static: 'gallery/project-1.png',
    video: 'gallery/project-1.mp4',
  },
  {
    name: 'Epic Mouse App + Landing Page',
    category: 'Mobile App & Web Design',
    year: 'Coming Sept. 2026',
    image: 'photos/EpicMouse.app.png',
    url: 'https://www.epicmouse.app',
    static: 'gallery/project-3.png',
    video: 'gallery/project-3.mp4',
  },
  {
    name: 'Virtual Desktop Portfolio',
    category: 'Portfolio Site',
    year: 'Aug. 2026',
    image: 'photos/My-Virtual-Desktop.png',
    url: 'https://christian-schneider-davis-port.vercel.app/',
    static: 'gallery/project-5.png',
    video: 'gallery/project-5.mp4',
  },
  {
    name: 'Vinz Barber Shop',
    category: 'E-Commerce',
    year: 'Aug. 2026',
    image: 'photos/Vinz-Barber-Shop.png',
    url: 'https://www.vinzbarbershopbcn.com/',
    static: 'gallery/project-2.png',
    video: 'gallery/project-2.mp4',
  },
  {
    name: 'PINistry Studio Vintage',
    category: 'E-Commerce',
    year: 'Feb. 2024',
    image: 'photos/PINistry-Studio.png',
    url: '',
    static: 'gallery/project-7.png',
    video: 'gallery/project-7.mp4',
  },
  {
    name: 'My Art Portfolio',
    category: 'Portfolio Site',
    year: 'Aug. 2026',
    image: 'photos/Christian-SD-Art-Port.png',
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
// Each panel's width as a share of the stage — the active project fills the
// left of the screen and the next runs off the right edge behind the list.
const PANEL_RATIO = 0.583
// The hero card shrinks on the way in, but never past what fits on screen.
const HERO_MAX_SCALE = 0.92
const HERO_MIN_SCALE = 0.58
// Breathing room above and below the two floating cards.
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

export default function ProjectGallery({ heroCardRef }) {
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
  const activeIndexRef = useRef(0)

  // The strip's position is a single running offset in pixels rather than a
  // point on a fixed track, so it can wrap forever and be driven by scrolling,
  // hovering and the idle drift without any of them fighting each other.
  const offsetRef = useRef(0)
  const offsetTweenRef = useRef(null)
  const panelWRef = useRef(0)
  const setWidthRef = useRef(0)
  const heroScaleRef = useRef(HERO_MAX_SCALE)
  const pinnedRef = useRef(false)
  const driftSpeedRef = useRef(0)
  // Hero card: the scrubbed entrance and the drag offset are composed by hand
  // each frame so neither can overwrite the other's transform.
  const heroEntranceRef = useRef({ p: 0 })
  const heroCentreRef = useRef(0)
  const dragRef = useRef({ x: 0, y: 0, active: false, baseLeft: 0, baseTop: 0 })
  const appliedHeroYRef = useRef(0)
  const listDragRef = useRef({ x: 0, y: 0, active: false, baseLeft: 0, baseTop: 0 })

  const [activeIndex, setActiveIndex] = useState(0)
  const [previewIndex, setPreviewIndex] = useState(null)
  const [modalProject, setModalProject] = useState(null)

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
    const heroCard = heroCardRef?.current
    const pin = pinRef.current
    const stage = stageRef.current
    if (!heroCard || !pin || !stage) return undefined

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

      // Size both floating cards to the screen: the hero shrinks only as far
      // as it must to fit, and the list matches whatever width that lands on
      // and is capped to the same height so neither can be clipped.
      const fitCards = () => {
        const stageH = stage.clientHeight
        const margin = Math.max(16, Math.round(stageH * CARD_MARGIN_RATIO))
        const available = Math.max(220, stageH - margin * 2)
        const naturalH = heroCard.offsetHeight

        const scale = naturalH
          ? Math.min(HERO_MAX_SCALE, Math.max(HERO_MIN_SCALE, available / naturalH))
          : HERO_MAX_SCALE
        heroScaleRef.current = scale

        compactOuter.style.width = `${Math.round(heroCard.offsetWidth * scale)}px`
        compactOuter.style.right = `${Math.round(heroCard.getBoundingClientRect().left - dragRef.current.x)}px`
        compactInner.style.maxHeight = `${available}px`

        const stickyTop = parseFloat(getComputedStyle(heroCard).top) || 0
        heroCentreRef.current = Math.round((stageH - naturalH * scale) / 2 - stickyTop)
      }

      const applyMetrics = () => {
        alignStage()
        fitCards()
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

      // Centre the shrunken hero card in the stage. It is sticky, so its
      // untransformed top is whatever `top` resolves to.
      gsap.set(heroCard, { transformOrigin: 'left top' })
      gsap.set(galleryViewport, { opacity: 0 })
      gsap.set(compactInner, { opacity: 0, y: 14 })
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

      tl.to(heroEntranceRef.current, { p: 1, duration: ENTRANCE_FRACTION }, 0)
        .to(galleryViewport, { opacity: 1, duration: ENTRANCE_FRACTION }, 0)
        .to(compactInner, { opacity: 1, y: 0, duration: ENTRANCE_FRACTION }, 0)
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
        heroCard.classList.toggle('is-draggable', pinnedRef.current)
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

      // Drag the hero card around, but only while the Work section holds the
      // screen. Links and buttons inside the card keep working.
      const onHeroPointerDown = (event) => {
        if (!pinnedRef.current || event.button !== 0) return
        if (event.target.closest('a, button')) return
        const drag = dragRef.current
        const rect = heroCard.getBoundingClientRect()
        drag.active = true
        drag.baseLeft = rect.left - drag.x
        drag.baseTop = rect.top - drag.y
        drag.pointerX = event.clientX
        drag.pointerY = event.clientY
        heroCard.classList.add('is-dragging')
        capturePointer(heroCard, event.pointerId)
        event.preventDefault()
      }

      const onHeroPointerMove = (event) => {
        const drag = dragRef.current
        if (!drag.active) return
        const scale = heroScaleRef.current
        const width = heroCard.offsetWidth * scale
        const height = heroCard.offsetHeight * scale
        const nextX = drag.x + (event.clientX - drag.pointerX)
        const nextY = drag.y + (event.clientY - drag.pointerY)
        drag.pointerX = event.clientX
        drag.pointerY = event.clientY
        const edge = 12
        drag.x = Math.min(
          Math.max(nextX, edge - drag.baseLeft),
          window.innerWidth - edge - width - drag.baseLeft,
        )
        drag.y = Math.min(
          Math.max(nextY, edge - drag.baseTop),
          window.innerHeight - edge - height - drag.baseTop,
        )
      }

      const onHeroPointerUp = (event) => {
        const drag = dragRef.current
        if (!drag.active) return
        drag.active = false
        heroCard.classList.remove('is-dragging')
        releasePointer(heroCard, event.pointerId)
      }

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
        compactOuter.classList.add('is-dragging')
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

      heroCard.addEventListener('pointerdown', onHeroPointerDown)
      window.addEventListener('pointermove', onHeroPointerMove)
      window.addEventListener('pointerup', onHeroPointerUp)
      window.addEventListener('pointercancel', onHeroPointerUp)

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
          !pointerIsEngaged()

        const targetSpeed = drifting ? DRIFT_SPEED : 0
        driftSpeedRef.current +=
          (targetSpeed - driftSpeedRef.current) * Math.min(1, dt / DRIFT_EASE)
        if (driftSpeedRef.current > 0.01) {
          offsetRef.current += driftSpeedRef.current * (dt / 1000)
        }

        // Compose the hero card's transform: entrance shrink + drag offset.
        // Once the section lets go, any drag eases back to nothing.
        const drag = dragRef.current
        if (!pinnedRef.current && !drag.active && (drag.x || drag.y)) {
          drag.x += -drag.x * 0.12
          drag.y += -drag.y * 0.12
          if (Math.abs(drag.x) < 0.5) drag.x = 0
          if (Math.abs(drag.y) < 0.5) drag.y = 0
        }
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

        const p = heroEntranceRef.current.p
        const heroScale = 1 + (heroScaleRef.current - 1) * p
        let heroY = heroCentreRef.current * p + drag.y

        // The centring offset must never push the card past the bottom of the
        // column it sticks inside, or it hangs into the section below once the
        // strip has scrolled away. Sticky stops the card; this stops the offset.
        const column = heroCard.parentElement
        if (column) {
          const naturalTop = heroCard.getBoundingClientRect().top - appliedHeroYRef.current
          const maxY =
            column.getBoundingClientRect().bottom -
            heroCard.offsetHeight * heroScale -
            naturalTop
          heroY = Math.min(heroY, maxY)
        }
        appliedHeroYRef.current = heroY

        gsap.set(heroCard, { x: drag.x, y: heroY, scale: heroScale })

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
        compactHead.removeEventListener('pointerdown', onListPointerDown)
        window.removeEventListener('pointermove', onListPointerMove)
        window.removeEventListener('pointerup', onListPointerUp)
        window.removeEventListener('pointercancel', onListPointerUp)
        compactOuter.classList.remove('is-draggable', 'is-dragging')
        compactOuter.style.transform = ''
        listDragRef.current.x = 0
        listDragRef.current.y = 0
        heroCard.removeEventListener('pointerdown', onHeroPointerDown)
        window.removeEventListener('pointermove', onHeroPointerMove)
        window.removeEventListener('pointerup', onHeroPointerUp)
        window.removeEventListener('pointercancel', onHeroPointerUp)
        heroCard.classList.remove('is-draggable', 'is-dragging')
        dragRef.current.x = 0
        dragRef.current.y = 0
        appliedHeroYRef.current = 0
        if (offsetTweenRef.current) offsetTweenRef.current.kill()
        track.style.transform = ''
      }
    })

    return () => mm.revert()
  }, [heroCardRef])

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

  return (
    <section id="work" className="project-gallery" ref={sectionRef}>
      <div className="project-gallery__pin" ref={pinRef} style={{ height: `${PIN_VH}vh` }}>
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
        <div className="project-gallery__mobile-track">
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
            <iframe src={modalProject.url} title={modalProject.name} className="project-modal__frame" />
          </div>
        </div>
      )}
    </section>
  )
}
