import useReveal from '../hooks/useReveal'
import './About.css'

const DETAILS = [
  { label: 'Name', value: 'Christian Schneider-Davis' },
  { label: 'Location', value: 'Barcelona, Spain' },
  { label: 'Availability', value: 'Open for new projects' },
]

export default function About() {
  const revealRef = useReveal()

  return (
    <section id="about" className="about">
      <div>
        <div className="about__head">
          <p className="eyebrow">About</p>
          <h2 className="section-heading"> <b>Simplicity</b>. The most effective interface.</h2>
        </div>

        <div className="about__body reveal" ref={revealRef}>
          <div className="about__main">
            <p className="about__statement">
              I design in the space between a brand's ambition and the
              way people actually read a screen, trimming noise until
              what's left is <em>obvious</em>, considered, and quietly
              confident.
            </p>

            <p className="about__bio">
              The goal is to build identities for brands through websites and interfaces that hold up under real
              use, not just flashy first impressions.
            </p>
          </div>

          <aside className="about__card">
            <dl className="about__details">
              {DETAILS.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>
                    {detail.href ? <a href={detail.href}>{detail.value}</a> : detail.value}
                  </dd>
                </div>
              ))}
            </dl>

            <a href="resume/C-Schneider-Davis-Resume.pdf" download className="btn btn--primary about__card-cta">
              Download CV
            </a>
          </aside>
        </div>
      </div>
    </section>
  )
}
