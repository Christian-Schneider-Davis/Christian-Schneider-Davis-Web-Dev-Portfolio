import { SectionHeader } from './SectionHeader.jsx'
import { SectionFooter } from './SectionFooter.jsx'
import { Icon } from '../common/Icon.jsx'
import './sections.css'
import './ResumeContent.css'

export function ResumeContent() {
  return (
    <div className="section-content">
      <SectionHeader eyebrow="Résumé" title="Experience" />

      <div className="resume-intro">
        <p>I won't bore you with all the details. Click the pretty button for a coopy of my resume.</p>
        <a className="resume-download" href="resume/C-Schneider-Davis-Resume.pdf" download>
          <Icon name="download" size={16} />
          Download PDF
        </a>
      </div>

      <SectionFooter />
    </div>
  )
}
