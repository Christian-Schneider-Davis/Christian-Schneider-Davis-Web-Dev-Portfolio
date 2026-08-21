import useReveal from '../hooks/useReveal'
import './Contact.css'

const SOCIALS = [
  { label: 'Email', href: 'mailto:schneiderdavis@aol.com' },
  { label: 'Github', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
]

export default function Contact() {
  const revealRef = useReveal()

  return (
    <section id="contact" className="contact">
      <div className="wrap contact__inner reveal" ref={revealRef}>
        <p className="eyebrow">Contact</p>

        <a href="mailto:schneiderdavis@aol.com" className="contact__headline">
          Let&rsquo;s make your
          <br />
          next idea <em>clear.</em>
        </a>

        <div className="contact__row">
          <p className="contactCTA">Let's work together - </p>

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
