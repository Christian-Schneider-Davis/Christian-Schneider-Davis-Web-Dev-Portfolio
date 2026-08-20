import useReveal from '../hooks/useReveal'
import './Contact.css'

const SOCIALS = [
  { label: 'Email', href: 'mailto:hello@studioray.com' },
  { label: 'Instagram', href: '#' },
  { label: 'Dribbble', href: '#' },
  { label: 'LinkedIn', href: '#' },
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
          <a href="mailto:schneiderdavis@aol.com" className="contact__email">
            schneiderdavis@aol.com
          </a>

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
