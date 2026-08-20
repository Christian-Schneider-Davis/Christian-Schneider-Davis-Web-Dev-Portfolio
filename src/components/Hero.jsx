import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './Hero.css'

export default function Hero() {
  const linesRef = useRef([])
  const subRef = useRef(null)
  const metaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.set(linesRef.current, { yPercent: 110 })
        .set([subRef.current, metaRef.current], { opacity: 0, y: 14 })
        .to(linesRef.current, {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.09,
        })
        .to(
          subRef.current,
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5',
        )
        .to(
          metaRef.current,
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5',
        )
    })

    return () => ctx.revert()
  }, [])

  const addLine = (el) => {
    if (el && !linesRef.current.includes(el)) linesRef.current.push(el)
  }

  return (
    <section id="top" className="hero">
      <div className="hero__content">
        <p className="eyebrow hero__eyebrow">Creative Designer — Web &amp; UX/UI</p>

        <h1 className="hero__title">
          <span className="hero__line-mask">
            <span className="hero__line" ref={addLine}>
              Clarity is
            </span>
          </span>
          <span className="hero__line-mask">
            <span className="hero__line hero__line--italic" ref={addLine}>
              a design
            </span>
          </span>
          <span className="hero__line-mask">
            <span className="hero__line" ref={addLine}>
              decision.
            </span>
          </span>
        </h1>

        <div className="hero__foot">
          <p className="hero__sub" ref={subRef}>
            I&rsquo;m Christian Schneider-Davis, a web &amp; UX/UI designer who builds calm,
            considered interfaces for brands that want to be understood at a
            glance.
          </p>

          <div className="hero__cta-row" ref={metaRef}>
            <a href="#work" className="btn btn--primary">
              My Work
            </a>
            <a href="#contact" className="btn btn--ghost">
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-label">Scroll for more</span>
        <span className="hero__scroll-track">
          <span className="hero__scroll-dot" />
        </span>
      </div>
    </section>
  )
}
