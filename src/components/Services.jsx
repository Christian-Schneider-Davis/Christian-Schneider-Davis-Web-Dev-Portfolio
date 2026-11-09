import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    title: 'Web Design',
    description:
      'Marketing sites and product pages designed to load fast, read clearly, and hold a brand together across every breakpoint.',
    tools: ['Webflow', 'React', 'CSS', 'Adobe Photoshop', 'Vite', 'JavaScript', 'TypeScript'],
  },
  {
    title: 'UX / UI',
    description:
      'Interface systems and flows for web and product, grounded in research and built to be handed straight to engineering.',
    tools: ['Adobe Photoshop', 'Prototyping', 'Design systems', 'Canva'],
  },
  {
    title: 'Front-End Development',
    description:
      'Pixel-accurate builds with considered motion — components that feel as good to use as they look in the file.',
    tools: ['React', 'Vite', 'JavaScript', 'CSS', 'EJS', 'TypeScript'],
  },
  {
    title: 'Brand Identity',
    description:
      'Naming-adjacent visual systems: type, color and voice worked out together so a brand reads the same everywhere.',
    tools: ['Type systems', 'Art direction', 'Color theory', 'Visual Story Telling'],
  },
]

const DESKTOP_QUERY = '(min-width: 901px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
const VIDEO_DURATION = 5.06
const VIDEO_FPS = 30

// Desktop pins the stage for this much scroll. Mobile doesn't pin: the box
// scrolls through normally and the video plays as it travels up the screen.
const PIN_VH = 420
// Share of the pinned scroll spent playing the video; the rest holds the
// finished layout on screen before the section lets go.
const VIDEO_END = { desktop: 0.62, mobile: 0.8 }
// Desktop "Expertise" links land once everything has faded in.
const ANCHOR_FRACTION = 0.8

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// A mouse opens an item on hover and closes it on leave; touch and keyboard
// toggle it with a tap or Enter instead.
function ServiceList({ openIndex, setOpenIndex, className = '' }) {
  const hoveredRef = useRef(-1)

  return (
    <ul className={`expertise__list ${className}`}>
      {SERVICES.map((service, index) => {
        const isOpen = openIndex === index
        return (
          <li
            key={service.title}
            className={`expertise__item expertise__item--${index + 1}`}
            style={{ '--i': index }}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'mouse') return
              hoveredRef.current = index
              setOpenIndex(index)
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== 'mouse') return
              hoveredRef.current = -1
              setOpenIndex((current) => (current === index ? -1 : current))
            }}
          >
            <button
              className="expertise__row"
              aria-expanded={isOpen}
              onClick={(event) => {
                const mouseHovering = event.detail > 0 && hoveredRef.current === index
                if (mouseHovering) setOpenIndex(index)
                else setOpenIndex(isOpen ? -1 : index)
              }}
            >
              <span className="expertise__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="expertise__title">{service.title}</span>
              <span className={`expertise__toggle ${isOpen ? 'expertise__toggle--open' : ''}`}>
                +
              </span>
            </button>

            <p className={`expertise__desc ${isOpen ? 'expertise__desc--open' : ''}`}>
              {service.description}
            </p>

            <div className="expertise__panel" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
              <div className="expertise__panel-inner">
                <ul className="expertise__tools">
                  {service.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function Services() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const reduced = useMediaQuery(REDUCED_QUERY)
  const [openIndex, setOpenIndex] = useState(-1)

  const pinRef = useRef(null)
  const stageRef = useRef(null)
  const frameRef = useRef(null)
  const videoRef = useRef(null)
  const eyebrowRef = useRef(null)
  const headingRef = useRef(null)
  const mobileListRef = useRef(null)

  const mode = isDesktop ? 'desktop' : 'mobile'
  const pinVh = reduced ? 100 : PIN_VH
  const videoSrc = isDesktop ? 'expertise/laptop-1080.mp4' : 'expertise/laptop-720.mp4'

  useLayoutEffect(() => {
    const pin = pinRef.current
    const stage = stageRef.current
    const frameEl = frameRef.current
    const video = videoRef.current
    if (!pin || !stage || !frameEl || !video) return undefined

    const items = gsap.utils.toArray('.expertise__item', stage)
    const duration = () => (Number.isFinite(video.duration) ? video.duration : VIDEO_DURATION)

    const alignStage = () => {
      if (!isDesktop) {
        stage.style.marginLeft = ''
        return
      }
      stage.style.marginLeft = '0px'
      stage.style.marginLeft = `${-stage.getBoundingClientRect().left}px`
    }
    alignStage()

    const primeVideo = () => {
      const attempt = video.play()
      if (attempt) attempt.then(() => video.pause()).catch(() => {})
    }
    video.addEventListener('loadedmetadata', primeVideo, { once: true })

    if (reduced) {
      const showEnd = () => {
        video.currentTime = Math.max(0, duration() - 0.05)
      }
      if (video.readyState >= 1) showEnd()
      else video.addEventListener('loadedmetadata', showEnd, { once: true })
      gsap.set([eyebrowRef.current, headingRef.current, ...items], { autoAlpha: 1, y: 0, scale: 1 })
      window.addEventListener('resize', alignStage)
      return () => {
        window.removeEventListener('resize', alignStage)
        video.removeEventListener('loadedmetadata', primeVideo)
        video.removeEventListener('loadedmetadata', showEnd)
      }
    }

    // Seek by whole frames, and only when the frame changes — re-seeking the
    // same spot every tick makes the browser flicker between neighbours.
    const playhead = { t: 0 }
    const lastFrame = () => Math.max(0, Math.floor(duration() * VIDEO_FPS) - 1)
    let wantedFrame = 0
    let shownFrame = -1
    let frame = 0

    const seek = () => {
      if (!video.seeking && video.readyState >= 1 && wantedFrame !== shownFrame) {
        shownFrame = wantedFrame
        video.currentTime = (wantedFrame + 0.5) / VIDEO_FPS
      }
      frame = requestAnimationFrame(seek)
    }
    frame = requestAnimationFrame(seek)

    const videoEnd = VIDEO_END[mode]
    const headingIn = videoEnd * 0.5

    gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
    gsap.set(headingRef.current, { autoAlpha: 0, scale: 0.82, y: 18 })
    gsap.set(items, { autoAlpha: 0, y: 26 })
    const card = { reveal: 0 }
    const paintCard = () => stage.style.setProperty('--reveal', card.reveal.toFixed(3))
    paintCard()

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        ...(isDesktop
          ? { trigger: pin, start: 'top top', end: 'bottom bottom' }
          : { trigger: frameEl, start: 'top 85%', end: 'top 15%' }),
        scrub: 0.5,
        invalidateOnRefresh: true,
        onRefresh: alignStage,
      },
    })

    tl.to(
      playhead,
      {
        t: 1,
        duration: videoEnd,
        onUpdate: () => {
          wantedFrame = Math.round(playhead.t * lastFrame())
        },
      },
      0,
    )
      .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, headingIn)
      .to(headingRef.current, { scale: 1, duration: videoEnd - headingIn, ease: 'power1.inOut' }, headingIn)
      .to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' }, videoEnd - 0.08)
      .to(card, { reveal: 1, duration: 0.1, ease: 'power1.out', onUpdate: paintCard }, videoEnd - 0.08)

    if (isDesktop) {
      tl.to(
        items,
        { autoAlpha: 1, y: 0, duration: 0.07, stagger: 0.035, ease: 'power2.out' },
        videoEnd - 0.08,
      )
    }

    tl.to({}, { duration: 1 - tl.duration() }, tl.duration())

    let observer
    if (!isDesktop && mobileListRef.current) {
      const list = mobileListRef.current
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            list.classList.add('is-visible')
            observer.disconnect()
          }
        },
        { threshold: 0.15 },
      )
      observer.observe(list)
    }

    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
      video.removeEventListener('loadedmetadata', primeVideo)
      observer?.disconnect()
      tl.scrollTrigger?.kill()
      tl.kill()
      gsap.set([eyebrowRef.current, headingRef.current, ...items], { clearProps: 'all' })
      stage.style.removeProperty('--reveal')
    }
  }, [isDesktop, reduced, mode])

  return (
    <section id="services" className={`expertise expertise--${mode}`}>
      <div className="expertise__pin" ref={pinRef} style={isDesktop ? { height: `${pinVh}vh` } : undefined}>
        {isDesktop && (
          <span
            className="expertise__anchor"
            data-scroll-anchor="#services"
            aria-hidden="true"
            style={{ top: `${(pinVh - 100) * ANCHOR_FRACTION}vh` }}
          />
        )}
        <div className="expertise__stage" ref={stageRef}>
          <div className="expertise__frame" ref={frameRef}>
            <video
              key={videoSrc}
              ref={videoRef}
              className="expertise__video"
              src={videoSrc}
              poster="expertise/laptop-poster.jpg"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
            />

            <div className="expertise__layout">
              <p className="eyebrow expertise__eyebrow" ref={eyebrowRef}>
                Expertise
              </p>
              <h2 className="section-heading expertise__heading" ref={headingRef}>
                Where I add the
                <br />
                most value.
              </h2>
              {isDesktop && <ServiceList openIndex={openIndex} setOpenIndex={setOpenIndex} />}
            </div>
          </div>
        </div>
      </div>

      {!isDesktop && (
        <div className="expertise__mobile-list" ref={mobileListRef}>
          <ServiceList openIndex={openIndex} setOpenIndex={setOpenIndex} />
        </div>
      )}
    </section>
  )
}
