import useReveal from '../hooks/useReveal'
import './Contact.css'

const SOCIALS = [
  { label: 'Email', href: 'mailto:schneiderdavis@aol.com' },
  { label: 'Github', href: 'https://github.com/Christian-Schneider-Davis' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/christian-schneider-davis/' },
  { label: 'Instagram', href: 'https://www.instagram.com/christianscottie' },
]

export default function Contact() {
  const revealRef = useReveal()

  return (
    <section id="contact" className="contact">
      <div className="wrap contact__inner reveal" ref={revealRef}>
        <p className="eyebrow">Contact</p>

        <a href="mailto:schneiderdavis@aol.com" className="contact__headline">
          Let's turn your
          <br />
          next idea into <em>reality.</em>
        </a>

        <div className="contact__row">
          <p>Let's work together </p>
          <ul className="contact__socials">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a href={social.href}>{social.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
