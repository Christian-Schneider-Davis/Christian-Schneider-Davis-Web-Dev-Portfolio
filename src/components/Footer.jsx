import { openConsent } from '../lib/consent'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span>&copy; {year} Christian Schneider-Davis. All rights reserved.</span>
        <div className="footer__links">
          <button type="button" className="cookie-settings" onClick={openConsent}>
            Cookie settings
          </button>
          <a href="#top" className="footer__top">
            Back to top &#8593;
          </a>
        </div>
      </div>
    </footer>
  )
}
