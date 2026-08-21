import { SectionHeader } from './SectionHeader.jsx'
import { SectionFooter } from './SectionFooter.jsx'
import './sections.css'
import './AboutContent.css'

const SKILLS = [
  'React', 'JavaScript / TypeScript', 'Motion & Interaction Design',
  'Design Systems', 'WebGL / Three.js', 'Illustration', 'EJS', 'Adobe Photoshop', 'Brand Marketing', 'Event Management'
]

export function AboutContent() {
  return (
    <div className="section-content">
      <SectionHeader
        eyebrow="About"
        title="Christian Schneider-Davis"
        tagline="I build interfaces the way I make art — deliberately, one decision at a time. I also write the code that ships them."
      />

      <div className="section-content__body about-content">
        <p className="about-content__p">
          Hello there, I'm Christian. A Full-Stack web developer, artist, and UX designer working at the point where
          those three skills overlap. My focus is to create interactive web experiences and production-ready applications for brands that want to be understood at a glance.
        </p>
        <p className="about-content__p">
          Over the last several years I've worked across product design,
          front-end engineering, event planning, and visual artistry. Sometimes all within the same
          project! That range shapes how I work now. I create
          with implementation in mind and build with the eye of someone who understands and appreciates attractive/intuitive design.
        </p>

        <div className="about-content__grid">
          <div>
            <h2 className="about-content__label">Currently</h2>
            <p className="about-content__value">Designing and building independent projects.</p>
          </div>
          <div>
            <h2 className="about-content__label">Based in</h2>
            <p className="about-content__value">Barcelona, Spain and available work both locally and worldwide.</p>
          </div>
        </div>

        <div className="about-content__skills">
          <h2 className="about-content__label">Tools, Skills, & Disciplines</h2>
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
