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
              I design where a brand's ambition meets the way people
              actually use a screen, trimming noise until what's left
              feels <em>natural</em>.
            </p>

            <p className="about__bio">
              My goal is to creare experiences that reach past the screen: interactive websites and live
              event experiences that respond to the people in front of them.
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

            <a
              href={`${import.meta.env.BASE_URL}resume/C-Schneider-Davis-Resume.pdf`}
              download="Christian-Schneider-Davis-Resume.pdf"
              type="application/pdf"
              className="btn btn--primary about__card-cta"
            >
              Download CV
            </a>
          </aside>
        </div>
      </div>
    </section>
  )
}
