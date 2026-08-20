import './sections.css'

export function SectionHeader({ eyebrow, title, tagline }) {
  return (
    <header className="section-header">
      <div className="section-header__top">
        <span className="section-header__mark">CSD</span>
        <span className="section-header__eyebrow">{eyebrow}</span>
      </div>
      <h1 className="section-header__title">{title}</h1>
      {tagline ? <p className="section-header__tagline">{tagline}</p> : null}
    </header>
  )
}
