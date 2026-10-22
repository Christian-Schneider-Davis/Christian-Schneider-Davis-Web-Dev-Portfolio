import Grain from '../components/Grain.jsx'
import CookieConsent from '../components/CookieConsent.jsx'
import { openConsent, useConsent } from '../lib/consent'
import { COOKIE_GROUPS } from '../lib/cookieList'
import './PrivacyPage.css'

// Update this whenever the policy changes.
const LAST_UPDATED = '22 October 2026'
const EMAIL = 'schneiderdavis@aol.com'

const SECTIONS = [
  { id: 'who', title: 'Who I am' },
  { id: 'collect', title: 'What I collect' },
  { id: 'cookies', title: 'Cookies & storage' },
  { id: 'third-party', title: 'Content from other services' },
  { id: 'affiliate', title: 'Amazon affiliate links' },
  { id: 'rights', title: 'Your rights' },
  { id: 'changes', title: 'Changes' },
]

function External({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

export default function PrivacyPage() {
  const consent = useConsent()
  const year = new Date().getFullYear()
  const choice =
    consent === 'accepted' ? 'Accepted' : consent === 'declined' ? 'Declined' : 'Not chosen yet'

  return (
    <>
      <Grain />
      <header className="privacy__bar">
        <div className="privacy__bar-inner">
          <a href="/" className="privacy__logo">
            Christian Schneider-Davis<span>·</span>
          </a>
          <a href="/" className="btn btn--ghost privacy__back">
            &larr; Back to site
          </a>
        </div>
      </header>

      <main className="privacy">
        <div className="privacy__head">
          <p className="eyebrow">Legal</p>
          <h1 className="privacy__title">
            Privacy <em>policy.</em>
          </h1>
          <p className="privacy__updated">Last updated {LAST_UPDATED}</p>
        </div>

        <aside className="privacy__summary">
          <p className="privacy__summary-title">The short version</p>
          <ul>
            <li>No analytics, no ads, no tracking pixels, no cookies of my own.</li>
            <li>Fonts are hosted on this site, not loaded from Google.</li>
            <li>Anything hosted elsewhere only loads after you agree.</li>
            <li>The gesture demo&rsquo;s camera feed never leaves your device.</li>
          </ul>
        </aside>

        <nav className="privacy__toc" aria-label="On this page">
          {SECTIONS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </a>
          ))}
        </nav>

        <article className="privacy__body">
          <section id="who">
            <h2>Who I am</h2>
            <p>
              This site, christianschneiderdavis.com, is my personal portfolio. I&rsquo;m Christian
              Schneider-Davis, based in Barcelona, Spain, and I&rsquo;m responsible for any personal
              data handled here. For anything privacy-related, email me at{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
          </section>

          <section id="collect">
            <h2>What I collect</h2>
            <h3>Emails you send me</h3>
            <p>
              If you email me, I receive your email address, your name if you include it, and your
              message. I use them only to reply and to talk about work you&rsquo;ve contacted me
              about. I keep them as long as that conversation is useful, and I&rsquo;ll delete them
              if you ask. There are no forms or accounts on this site.
            </p>
            <h3>Hosting</h3>
            <p>
              The site is hosted on GitHub Pages, run by GitHub, Inc. in the United States. When you
              visit, GitHub logs your IP address for security purposes, whether or not you use
              GitHub. I don&rsquo;t have access to those logs. See the{' '}
              <External href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
                GitHub Privacy Statement
              </External>{' '}
              for how GitHub handles this data.
            </p>
            <h3>Your camera (gesture demo)</h3>
            <p>
              The &ldquo;Try it with your hands&rdquo; demo only uses your camera if you turn it on
              and your browser asks your permission. The video is processed entirely in your
              browser. It is never recorded, stored or sent anywhere.
            </p>
          </section>

          <section id="cookies">
            <h2>Cookies &amp; storage</h2>
            <p>
              This site sets no cookies of its own. It saves one setting in your browser&rsquo;s
              local storage to remember your answer to the cookie notice. Here is everything this
              site stores or can load:
            </p>

            <div className="privacy__groups">
              {COOKIE_GROUPS.map((group) => (
                <div key={group.title} className="privacy__group">
                  <h3>{group.title}</h3>
                  {group.note && <p className="privacy__group-note">{group.note}</p>}
                  {group.items.length > 0 && (
                    <ul className="privacy__items">
                      {group.items.map((item) => (
                        <li key={item.name}>
                          <div className="privacy__item-head">
                            <strong>{item.name}</strong>
                            <span>{item.type}</span>
                          </div>
                          <p>{item.purpose}</p>
                          <dl>
                            <div>
                              <dt>Provider</dt>
                              <dd>{item.provider}</dd>
                            </div>
                            {item.duration !== '—' && (
                              <div>
                                <dt>Kept</dt>
                                <dd>{item.duration}</dd>
                              </div>
                            )}
                          </dl>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="privacy__choice">
              <p>
                Your current choice: <strong>{choice}</strong>
              </p>
              <button type="button" className="btn btn--primary" onClick={openConsent}>
                Change cookie settings
              </button>
            </div>
          </section>

          <section id="third-party">
            <h2>Content from other services</h2>
            <p>
              Some parts of the site are hosted by other companies. They only load if you accept in
              the cookie notice, or if you ask for that one item on the page (for example
              &ldquo;Show photos&rdquo; or &ldquo;Load preview&rdquo;). When they load, that service
              receives your IP address and basic browser details, as with any website.
            </p>
            <ul className="privacy__list">
              <li>
                <strong>Amazon product photos</strong> on the links page, served by Amazon.
              </li>
              <li>
                <strong>Live project previews</strong> open each project&rsquo;s own website inside
                this page. That website may set its own cookies under its own privacy policy. You can
                always open it in a new tab instead.
              </li>
              <li>
                <strong>Hand-tracking files</strong> for the gesture demo: Google&rsquo;s open-source
                MediaPipe library, served by jsDelivr and Google Cloud Storage.
              </li>
            </ul>
            <p>
              The legal basis for loading these is your consent. You can withdraw it at any time
              with <button type="button" className="privacy__inline-btn" onClick={openConsent}>Cookie settings</button>.
            </p>
          </section>

          <section id="affiliate">
            <h2>Amazon affiliate links</h2>
            <p>
              As an Amazon Associate I earn from qualifying purchases. When you click an Amazon link
              on this site, you leave for amazon.com. Amazon may set cookies there, including one that
              records that you came from my link, so I can earn a small commission at no extra cost
              to you. That happens on Amazon&rsquo;s site and is covered by the{' '}
              <External href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ">
                Amazon Privacy Notice
              </External>
              . I never see who clicked or bought what.
            </p>
            <p>
              Links to my social profiles (Instagram, LinkedIn, GitHub) take you to those sites,
              which have their own privacy policies.
            </p>
          </section>

          <section id="rights">
            <h2>Your rights</h2>
            <p>
              Under the GDPR you can ask to see the personal data I hold about you, to correct or
              delete it, to restrict or object to how I use it, and to receive a copy of it. Where I
              rely on your consent, you can withdraw it at any time. Email{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and I&rsquo;ll reply within one month.
            </p>
            <p>
              If you&rsquo;re unhappy with how your data is handled, you can complain to the Spanish
              data protection authority, the{' '}
              <External href="https://www.aepd.es">Agencia Española de Protección de Datos</External>
              , or the authority where you live.
            </p>
          </section>

          <section id="changes">
            <h2>Changes</h2>
            <p>
              If anything here changes, for example if I ever add analytics, I&rsquo;ll update this
              page and the date at the top. Anything that needs consent will always ask first.
            </p>
          </section>
        </article>

        <footer className="privacy__footer">
          <span>&copy; {year} Christian Schneider-Davis</span>
          <button type="button" className="cookie-settings" onClick={openConsent}>
            Cookie settings
          </button>
        </footer>
      </main>
      <CookieConsent />
    </>
  )
}
