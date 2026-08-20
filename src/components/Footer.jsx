import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span>&copy; {year} Christian Schneider-Davis. All rights reserved.</span>
        <a href="#top" className="footer__top">
          Back to top &#8593;
        </a>
      </div>
    </footer>
  )
}
