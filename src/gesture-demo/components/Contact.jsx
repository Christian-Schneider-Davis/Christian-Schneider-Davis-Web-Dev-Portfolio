import { SITE } from '../config.js';
import './Contact.css';

export default function Contact() {
  return (
    <section className="contact page" aria-label="Contact">
      <div className="contact__main">
        <p className="eyebrow"><span aria-hidden="true">✦</span> Contact</p>
        <h2 className="contact__title">
          Have an event or brand
          <br />
          that needs a <em>moment?</em>
        </h2>
        <a className="contact__email" href={`mailto:${SITE.email}`}>
          {SITE.email} <span aria-hidden="true">↗</span>
        </a>
        <ul className="contact__socials">
          {SITE.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <p className="contact__fine">
        © {new Date().getFullYear()} {SITE.name}. Hand & face tracking runs entirely in your
        browser; no video leaves your device.
      </p>
    </section>
  );
}
