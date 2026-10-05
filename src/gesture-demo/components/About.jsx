import { SITE } from '../config.js';
import './About.css';

const SERVICES = [
  { title: 'Event experience design', text: 'Concept, journey and interaction design for launches, conferences and live activations.' },
  { title: 'Brand worlds', text: 'Identity systems that hold together from a phone screen to a venue wall.' },
  { title: 'Interactive & creative tech', text: 'Camera, gesture and sensor-driven moments, like the flowers on the home page.' },
  { title: 'Digital extensions', text: 'Microsites, streams and recap content so the experience lives on after the doors close.' },
];

export default function About() {
  return (
    <section className="about page" aria-label="About">
      <div className="about__intro">
        <p className="eyebrow"><span aria-hidden="true">✦</span> About</p>
        <p className="about__statement">
          I’m {SITE.name}. 
          <p>I curate spaces where design,
          technology and live moments <em>fold into one story.</em></p>
        </p>
      </div>
      <ul className="about__services">
        {SERVICES.map((s, i) => (
          <li key={s.title} className="service">
            <span className="service__n">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="service__title">{s.title}</h3>
              <p className="service__text">{s.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
