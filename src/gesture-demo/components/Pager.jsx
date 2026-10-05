import './Pager.css';

export default function Pager({ page, pages, goTo, step }) {
  return (
    <div className="pager">
      <button type="button" className="pager__arrow" onClick={() => step('prev')} aria-label="Previous page">
        ←
      </button>
      <ol className="pager__dots">
        {pages.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className={page === i ? 'is-on' : ''}
              onClick={() => goTo(i)}
              aria-label={`Go to ${label}`}
              aria-current={page === i ? 'step' : undefined}
            >
              <span className="pager__label">{label}</span>
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="pager__arrow" onClick={() => step('next')} aria-label="Next page">
        →
      </button>
    </div>
  );
}
