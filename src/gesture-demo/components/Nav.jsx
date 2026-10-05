import { SITE } from '../config.js';
import './Nav.css';

const LINKS = ['Home', 'About', 'Contact'];

export default function Nav({ page, goTo }) {
  return (
    <header className="nav">
      <div className="nav__left">
        <button type="button" className="nav__brand" onClick={() => goTo(0)}>
          {SITE.name}
        </button>
        <nav aria-label="Pages">
          <ul className="nav__links">
            {LINKS.map((label, i) => (
              <li key={label}>
                <button
                  type="button"
                  className={page === i ? 'is-current' : ''}
                  aria-current={page === i ? 'page' : undefined}
                  onClick={() => goTo(i)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <button type="button" className="pill pill--dark" onClick={() => goTo(2)}>
        Say hello
      </button>
    </header>
  );
}
