import './Awards.css'

const AWARDS = [
  'Site of the Day — Awwwards',
  'Honorable Mention — CSSDA',
  'Developer Award — Awwwards',
  'Featured — Lapa Ninja',
  'Portfolio Honors — Muzli',
]

export default function Awards() {
  const track = [...AWARDS, ...AWARDS]

  return (
    <section className="awards" aria-label="Recognition">
      <div className="awards__marquee">
        <div className="awards__track">
          {track.map((item, index) => (
            <span className="awards__item" key={`${item}-${index}`}>
              {item}
              <span className="awards__dot" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
