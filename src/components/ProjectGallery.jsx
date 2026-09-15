import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './ProjectGallery.css'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const PROJECTS = [
  {
    name: 'RPG Inspired Mock Site Port',
    category: 'Web Design',
    year: 'Sept. 2026',
    image: 'photos/RPG-port.png',
    url: 'https://meta4-fan-port.vercel.app/',
    static: 'gallery/project-1.png',
    video: 'gallery/project-1.mp4',
  },
  {
    name: 'Epic Mouse App Landing Page',
    category: 'Web Design',
    year: 'Aug. 2026',
    image: 'photos/EpicMouse.app.png',
    url: 'https://www.epicmouse.app',
    static: 'gallery/project-3.png',
    video: 'gallery/project-3.mp4',
  },
  {
    name: 'Epic Mouse App',
    category: 'Apple IOS App',
    year: 'Coming Sept. 2026',
    image: 'photos/EpicMouseApp.png',
    url: 'https://www.epicmouse.app',
    static: 'gallery/project-6.png',
    video: 'gallery/project-6.mp4',
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
    name: 'My Art Portfolio',
    category: 'Portfolio Site',
    year: 'Aug. 2026',
    image: 'photos/Christian-SD-Art-Port.png',
    url: 'https://christian-schneider-davis.github.io/art-portfolio/',
    static: 'gallery/project-4.png',
    video: 'gallery/project-4.mp4',
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
]

// Total scroll distance (in viewport heights) given to the pinned gallery,
// and the fraction of that distance spent on the "opening" transition
// before the horizontal scrub takes over.
const PIN_VH = 340
const ENTRANCE_FRACTION = 0.18
const EDGE_MARGIN = 28
const STAGE_GAP = 40

export default function ProjectGallery({ heroCardRef }) {
  // --- pinned stage refs ---
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const compactOuterRef = useRef(null)
  const compactInnerRef = useRef(null)
  const galleryViewportRef = useRef(null)
  const trackRef = useRef(null)
  const videoRefs = useRef([])
  const mobileVideoRefs = useRef([])
  const scrollTriggerRef = useRef(null)
  const activeIndexRef = useRef(0)
  const scrollTweenRef = useRef(null)

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

  const updateActiveFromProgress = useCallback((progress) => {
    let idx
    if (progress <= ENTRANCE_FRACTION) {
      idx = 0
    } else {
      const p = (progress - ENTRANCE_FRACTION) / (1 - ENTRANCE_FRACTION)
      idx = Math.min(PROJECTS.length - 1, Math.max(0, Math.round(p * (PROJECTS.length - 1))))
    }
    if (idx !== activeIndexRef.current) {
      activeIndexRef.current = idx
      setActiveIndex(idx)
    }
  }, [])

  // --- The scroll-driven pin + scrub timeline (desktop / pointer-capable only) ---
  useLayoutEffect(() => {
    const heroCard = heroCardRef?.current
    const section = sectionRef.current
    const pin = pinRef.current
    if (!heroCard || !section || !pin) return undefined

    const mm = gsap.matchMedia()

    mm.add('(min-width: 901px)', () => {
      const compactOuter = compactOuterRef.current
      const compactInner = compactInnerRef.current
      const galleryViewport = galleryViewportRef.current
      const track = trackRef.current

      // The natural (untransformed) left edge of an element, regardless of
      // whatever x-transform GSAP has already applied to it.
      const naturalLeft = (el) => {
        const currentX = gsap.getProperty(el, 'x') || 0
        return el.getBoundingClientRect().left - currentX
      }

      const heroTargetX = () => EDGE_MARGIN - naturalLeft(heroCard)
      // The gallery viewport runs full-bleed from the left screen edge —
      // it deliberately passes UNDER the hero card (which floats above it
      // via z-index) rather than stopping short of it — and only respects
      // the compact list's left edge on the right side.
      const galleryWidth = () => {
        const compactLeft = compactOuter.getBoundingClientRect().left
        return Math.max(480, compactLeft - STAGE_GAP)
      }
      const panelWidth = () => galleryWidth() * 0.7
      const trackTravel = () => -(track.scrollWidth - galleryViewport.clientWidth)

      const applyPanelWidth = () => {
        track.style.setProperty('--panel-w', `${panelWidth()}px`)
      }

      gsap.set(galleryViewport, { width: 0, opacity: 0 })
      gsap.set(compactInner, { opacity: 0, x: 20 })
      applyPanelWidth()

      const st = ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.65,
        invalidateOnRefresh: true,
        onRefresh: applyPanelWidth,
        onUpdate: (self) => {
          updateActiveFromProgress(self.progress)
          const openEnough = self.progress > ENTRANCE_FRACTION * 0.4
          compactOuter.style.pointerEvents = openEnough ? 'auto' : 'none'
          galleryViewport.style.pointerEvents = openEnough ? 'auto' : 'none'
        },
      })
      scrollTriggerRef.current = st

      const handleWheel = (event) => {
        if (!st.isActive) return
        event.preventDefault()
        window.scrollBy(0, event.deltaY)
      }
      pin.addEventListener('wheel', handleWheel, { passive: false })

      const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: 'none' } })

      tl.to(heroCard, { x: heroTargetX, duration: ENTRANCE_FRACTION }, 0)
        .fromTo(
          compactInner,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: ENTRANCE_FRACTION * 0.85 },
          ENTRANCE_FRACTION * 0.15,
        )
        .fromTo(
          galleryViewport,
          { width: 0, opacity: 0 },
          { width: galleryWidth, opacity: 1, duration: ENTRANCE_FRACTION, onUpdate: applyPanelWidth },
          0,
        )
        .to(track, { x: trackTravel, duration: 1 - ENTRANCE_FRACTION, ease: 'none' }, ENTRANCE_FRACTION)

      const handleResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        pin.removeEventListener('wheel', handleWheel)
      }
    })

    return () => mm.revert()
  }, [heroCardRef, updateActiveFromProgress])

  const scrollToProject = (index) => {
    const st = scrollTriggerRef.current
    if (!st) return
    const frac = ENTRANCE_FRACTION + (index / (PROJECTS.length - 1)) * (1 - ENTRANCE_FRACTION)
    const targetY = st.start + frac * (st.end - st.start)

    if (scrollTweenRef.current) scrollTweenRef.current.kill()
    scrollTweenRef.current = gsap.to(window, {
      duration: 0.8,
      ease: 'power2.inOut',
      scrollTo: { y: targetY, autoKill: true },
    })
    activeIndexRef.current = index
    setActiveIndex(index)
  }

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
      {/* Pinned, scroll-scrubbed video gallery (desktop / pointer devices) —
          this IS the Work section now; there is no separate static list. */}
      <div className="project-gallery__pin" ref={pinRef} style={{ height: `${PIN_VH}vh` }}>
        <div className="project-gallery__stage">
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
                  <div className="project-gallery__panel-meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{project.name}</span>
                  </div>
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
                      onClick={() => scrollToProject(index)}
                      onMouseEnter={() => scrollToProject(index)}
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
