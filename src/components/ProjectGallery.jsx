import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './ProjectGallery.css'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

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

// Scroll distance (in viewport heights) given to the pinned gallery, and the
// fraction of it spent on the opening transition before the horizontal
// scrub takes over. PANEL_RATIO is each panel's width as a share of the
// stage, so the active project fills the left of the screen and the next
// one runs off the right edge behind the list.
const PIN_VH = 340
const ENTRANCE_FRACTION = 0.07
const PANEL_RATIO = 0.583
const HERO_SCALE = 0.92

export default function ProjectGallery({ heroCardRef }) {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const stageRef = useRef(null)
  const compactOuterRef = useRef(null)
  const compactInnerRef = useRef(null)
  const galleryViewportRef = useRef(null)
  const trackRef = useRef(null)
  const videoRefs = useRef([])
  const mobileVideoRefs = useRef([])
  const scrollTriggerRef = useRef(null)
  const scrollTweenRef = useRef(null)
  const activeIndexRef = useRef(0)
  // Horizontal metrics shared between the scrub and the hover/wheel handlers
  // so every input agrees on where a given project sits.
  const metricsRef = useRef({ panelW: 0, end: 0 })

  const [activeIndex, setActiveIndex] = useState(0)
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

  // How far along the horizontal scrub a given project sits. Every project
  // parks against the left edge, except where that would overscroll the end
  // of the strip and leave dead space — the last one or two then share the
  // tail. Hover and the scrub both read this, so they always agree.
  const fractionForIndex = (index, panelW, end) =>
    end > 0 ? Math.min(index * panelW, end) / end : 0

  const updateActiveFromProgress = useCallback((progress) => {
    const { panelW, end } = metricsRef.current
    let idx = 0
    if (progress > ENTRANCE_FRACTION && panelW > 0 && end > 0) {
      const p = (progress - ENTRANCE_FRACTION) / (1 - ENTRANCE_FRACTION)
      let best = Infinity
      for (let i = 0; i < PROJECTS.length; i += 1) {
        const distance = Math.abs(fractionForIndex(i, panelW, end) - p)
        if (distance < best) {
          best = distance
          idx = i
        }
      }
    }
    if (idx !== activeIndexRef.current) {
      activeIndexRef.current = idx
      setActiveIndex(idx)
    }
  }, [])

  // The scroll position that brings a given project into view.
  const scrollYForIndex = useCallback((index) => {
    const st = scrollTriggerRef.current
    const { panelW, end } = metricsRef.current
    if (!st || !end) return null
    const progress =
      ENTRANCE_FRACTION + fractionForIndex(index, panelW, end) * (1 - ENTRANCE_FRACTION)
    return st.start + progress * (st.end - st.start)
  }, [])

  const scrollToProject = useCallback(
    (index) => {
      const targetY = scrollYForIndex(index)
      if (targetY == null) return
      if (scrollTweenRef.current) scrollTweenRef.current.kill()
      scrollTweenRef.current = gsap.to(window, {
        duration: 0.7,
        ease: 'power3.out',
        overwrite: true,
        // autoKill would cancel this the moment the scrub moves the page,
        // which is exactly what this tween is trying to do.
        scrollTo: { y: targetY, autoKill: false },
      })
      activeIndexRef.current = index
      setActiveIndex(index)
    },
    [scrollYForIndex],
  )

  useLayoutEffect(() => {
    const heroCard = heroCardRef?.current
    const pin = pinRef.current
    const stage = stageRef.current
    if (!heroCard || !pin || !stage) return undefined

    const mm = gsap.matchMedia()

    mm.add('(min-width: 901px)', () => {
      const compactOuter = compactOuterRef.current
      const compactInner = compactInnerRef.current
      const galleryViewport = galleryViewportRef.current
      const track = trackRef.current

      const galleryWidth = () => stage.clientWidth
      const panelWidth = () => stage.clientWidth * PANEL_RATIO

      // The section sits inside an off-centre flex column, so pull the
      // full-width stage back to the left edge of the screen by hand.
      const alignStage = () => {
        stage.style.marginLeft = '0px'
        stage.style.marginLeft = `${-stage.getBoundingClientRect().left}px`
      }

      const applyMetrics = () => {
        alignStage()
        // The list mirrors the hero card: same visual width once the card has
        // shrunk, and the same inset from its own side of the screen.
        compactOuter.style.width = `${Math.round(heroCard.offsetWidth * HERO_SCALE)}px`
        compactOuter.style.right = `${Math.round(heroCard.getBoundingClientRect().left)}px`
        const panelW = panelWidth()
        track.style.setProperty('--panel-w', `${panelW}px`)
        metricsRef.current = {
          panelW,
          end: Math.max(0, track.scrollWidth - galleryWidth()),
        }
      }

      const trackTravel = () => -metricsRef.current.end

      gsap.set(heroCard, { transformOrigin: 'left top' })
      gsap.set(galleryViewport, { opacity: 0 })
      gsap.set(compactInner, { opacity: 0, y: 14 })
      applyMetrics()

      // Keep the list and strip clickable from the moment the panel opens,
      // including when the page loads already scrolled into the section.
      const syncInteractivity = (progress) => {
        const open = progress > ENTRANCE_FRACTION * 0.4
        compactOuter.style.pointerEvents = open ? 'auto' : 'none'
        galleryViewport.style.pointerEvents = open ? 'auto' : 'none'
      }

      // The ScrollTrigger is declared as config on the timeline rather than
      // built separately and handed over: gsap.timeline({ scrollTrigger: <instance> })
      // does not scrub, it just plays the timeline straight through on mount.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: applyMetrics,
          onUpdate: (self) => {
            updateActiveFromProgress(self.progress)
            syncInteractivity(self.progress)
          },
        },
      })

      tl.to(heroCard, { scale: HERO_SCALE, duration: ENTRANCE_FRACTION }, 0)
        .to(galleryViewport, { opacity: 1, duration: ENTRANCE_FRACTION }, 0)
        .to(compactInner, { opacity: 1, y: 0, duration: ENTRANCE_FRACTION }, 0)
        .to(track, { x: trackTravel, duration: 1 - ENTRANCE_FRACTION }, ENTRANCE_FRACTION)

      const st = tl.scrollTrigger
      scrollTriggerRef.current = st
      syncInteractivity(st.progress)

      // Wheel over the stage drives the strip sideways instead of running the
      // page past it. Vertical and horizontal (trackpad) deltas both work.
      const handleWheel = (event) => {
        const rect = pin.getBoundingClientRect()
        const pinned = rect.top <= 0 && rect.bottom >= window.innerHeight
        if (!pinned) return
        const delta =
          Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
        if (!delta) return
        if (scrollTweenRef.current) scrollTweenRef.current.kill()
        event.preventDefault()
        window.scrollBy(0, delta)
      }
      stage.addEventListener('wheel', handleWheel, { passive: false })

      const handleResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        stage.removeEventListener('wheel', handleWheel)
        scrollTriggerRef.current = null
      }
    })

    return () => mm.revert()
  }, [heroCardRef, updateActiveFromProgress])

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
              {PROJECTS.map((project, index) => (
                <div
                  key={project.name}
                  className={`project-gallery__panel${activeIndex === index ? ' is-active' : ''}`}
                  onMouseEnter={() => playVideo(videoRefs, index)}
                  onMouseLeave={() => pauseVideo(videoRefs, index)}
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
                      videoRefs.current[index] = el
                    }}
                    src={project.video}
                    muted
                    loop
                    playsInline
                    preload="none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="project-gallery__compact" ref={compactOuterRef}>
            <div className="project-gallery__compact-card" ref={compactInnerRef}>
              <div className="project-gallery__compact-head">
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
                      onMouseEnter={() => scrollToProject(index)}
                      onFocus={() => scrollToProject(index)}
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
