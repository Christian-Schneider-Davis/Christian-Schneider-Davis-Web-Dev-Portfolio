import { SectionHeader } from './SectionHeader.jsx'
import { SectionFooter } from './SectionFooter.jsx'
import './sections.css'
import './AboutContent.css'

const SKILLS = [
  'React', 'JavaScript / TypeScript', 'Figma', 'Motion & Interaction Design',
  'Design Systems', 'WebGL / Three.js', 'Illustration', 'Accessibility (WCAG)',
]

export function AboutContent() {
  return (
    <div className="section-content">
      <SectionHeader
        eyebrow="About"
        title="Christian Schneider-Davis"
        tagline="I build interfaces the way I make art — deliberately, one decision at a time — and I write the code that ships them."
      />

      <div className="section-content__body about-content">
        <p className="about-content__p">
          I&rsquo;m a web developer, artist, and UX designer working at the point where
          those three overlap: products that are technically sound, visually
          considered, and easy to actually use. Most projects start as a sketch
          before they become a component, and most components stay flexible
          enough to keep changing after launch.
        </p>
        <p className="about-content__p">
          Over the last several years I&rsquo;ve worked across product design,
          front-end engineering, and illustration — sometimes on the same
          project in the same week. That range shapes how I work now: I design
          with implementation in mind, and I build with the eye of someone who
          also has to look at the result.
        </p>

        <div className="about-content__grid">
          <div>
            <h2 className="about-content__label">Currently</h2>
            <p className="about-content__value">Designing and building independent projects &amp; client work.</p>
          </div>
          <div>
            <h2 className="about-content__label">Based in</h2>
            <p className="about-content__value">Available for remote work, worldwide.</p>
          </div>
        </div>

        <div className="about-content__skills">
          <h2 className="about-content__label">Tools &amp; disciplines</h2>
          <ul className="about-content__skill-list">
            {SKILLS.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      <SectionFooter />
    </div>
  )
}
