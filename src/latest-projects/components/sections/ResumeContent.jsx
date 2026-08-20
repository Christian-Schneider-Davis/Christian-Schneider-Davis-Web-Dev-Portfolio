import { SectionHeader } from './SectionHeader.jsx'
import { SectionFooter } from './SectionFooter.jsx'
import { Icon } from '../common/Icon.jsx'
import './sections.css'
import './ResumeContent.css'

const HISTORY = [
  { role: 'Independent Web Developer & Designer', period: '2023 — Present', detail: 'Product design and front-end engineering for early-stage teams.' },
  { role: 'UX Designer', period: '2021 — 2023', detail: 'Led design systems and interaction design for a product team.' },
  { role: 'Front-End Developer', period: '2019 — 2021', detail: 'Built and maintained customer-facing React applications.' },
]

export function ResumeContent() {
  return (
    <div className="section-content">
      <SectionHeader eyebrow="Résumé" title="Experience &amp; background" />

      <div className="section-content__body">
        <a className="resume-download" href="/resume.pdf" download>
          <Icon name="download" size={16} />
          Download PDF
        </a>

        <ol className="resume-history">
          {HISTORY.map((h) => (
            <li key={h.role}>
              <div className="resume-history__top">
                <h3>{h.role}</h3>
                <span>{h.period}</span>
              </div>
              <p>{h.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <SectionFooter />
    </div>
  )
}
