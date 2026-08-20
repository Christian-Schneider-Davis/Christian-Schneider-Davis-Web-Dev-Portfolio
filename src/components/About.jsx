import useReveal from '../hooks/useReveal'
import './About.css'

const STATS = [
  { value: '9', label: 'Years in practice' },
  { value: '60+', label: 'Projects shipped' },
  { value: '24', label: 'Brands partnered with' },
]

const DETAILS = [
  { label: 'Name', value: 'Christian Schneider-Davis' },
  { label: 'Email', value: 'schneiderdavis@aol.com', href: 'mailto:schneiderdavis@aol.com' },
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
          <h2 className="section-heading">Turning ambiguity into a clear interface.</h2>
        </div>

        <div className="about__body reveal" ref={revealRef}>
          <div className="about__main">
            <p className="about__statement">
              I design in the space between a brand&rsquo;s ambition and the
              way people actually read a screen &mdash; trimming noise until
              what&rsquo;s left is <em>obvious</em>, considered, and quietly
              confident.
            </p>

            <p className="about__bio">
              My studio partners with founders and product teams to shape
              identities, websites and interfaces that hold up under real
              use &mdash; not just first impressions. Every engagement starts
              with the same question: what is this brand trying to make
              clear?
            </p>

            <ul className="about__stats">
              {STATS.map((stat) => (
                <li key={stat.label}>
                  <span className="about__stat-value">{stat.value}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </li>
              ))}
            </ul>
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

            <a href="/resume.pdf" download className="btn btn--primary about__card-cta">
              Download CV
            </a>
          </aside>
        </div>
      </div>
    </section>
  )
}
