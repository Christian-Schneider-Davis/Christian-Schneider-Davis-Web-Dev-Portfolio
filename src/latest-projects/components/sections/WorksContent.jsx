import { SectionHeader } from './SectionHeader.jsx'
import { SectionFooter } from './SectionFooter.jsx'
import { WORKS } from '../../data/works.js'
import { Icon } from '../common/Icon.jsx'
import './sections.css'
import './WorksContent.css'

export function WorksContent() {
  return (
    <div className="section-content">
      <SectionHeader
        eyebrow="Recent Works"
        title="Selected projects, 2022&ndash;2025"
        tagline="A working sample of product, web, and illustration work. Case studies available on request."
      />

      <div className="section-content__body">
        <ul className="works-list">
          {WORKS.map((work) => (
            <li key={work.id} className="works-list__item">
              <div className="works-list__thumb" aria-hidden="true">
                <Icon name="sparkle" size={22} />
              </div>
              <div className="works-list__meta">
                <div className="works-list__heading">
                  <h3>{work.title}</h3>
                  <span className="works-list__year">{work.year}</span>
                </div>
                <p className="works-list__category">{work.category}</p>
                <p className="works-list__blurb">{work.blurb}</p>
                <div className="works-list__tags">
                  {work.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <SectionFooter />
    </div>
  )
}
