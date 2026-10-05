import Flower from './Flower.jsx';
import { SITE, VIDEOS } from '../config.js';
import './Hero.css';

export default function Hero({ open, onHold, onNext, camSlotRef }) {
  return (
    <section className="hero page" aria-label="Home">
      <div className="hero__copy">
        <p className="eyebrow">
          <span aria-hidden="true">✦</span> {SITE.role}
        </p>
        <h1 className="hero__title">
          {SITE.headline.map((line) => (
            <span key={line} className="hero__line">{line}</span>
          ))}
          <em className="hero__line">{SITE.headlineAccent}</em>
        </h1>

        <div className="hero__lower">
          <div className="hero__intro">
            <p className="hero__lede">
              <span className="hero__lede-long">{SITE.intro}</span>
              <span className="hero__lede-short">{SITE.shortIntro}</span>
            </p>
            <button type="button" className="btn" onClick={onNext}>
              About me <span aria-hidden="true">→</span>
            </button>
          </div>
          {/* The floating camera box sits over this slot while you're on the home page. */}
          <div className="hero__camslot" ref={camSlotRef} aria-hidden="true" />
        </div>
      </div>

      <div className="hero__flowers">
        {['left', 'right'].map((hand) => (
          <Flower
            key={hand}
            forward={VIDEOS[hand].forward}
            reverse={VIDEOS[hand].reverse}
            label={VIDEOS[hand].label}
            open={open[hand]}
            onHold={(v) => onHold(hand, v)}
          />
        ))}
      </div>
    </section>
  );
}
