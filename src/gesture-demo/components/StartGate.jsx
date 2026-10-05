import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './StartGate.css';

/**
 * First thing a visitor sees: the page greyed out behind a single "Turn on camera" call to action.
 * The rest of the page is made inert until they choose, so nothing behind can be clicked or tabbed to.
 */
export default function StartGate({ onStart, onSkip }) {
  useEffect(() => {
    const root = document.getElementById('root');
    root?.setAttribute('inert', '');
    return () => root?.removeAttribute('inert');
  }, []);

  return createPortal(
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate__card">
        <p className="gate__badge">
          <span aria-hidden="true" /> Start here
        </p>
        <h2 id="gate-title" className="gate__title">
          Try it with your <em>hands.</em>
        </h2>
        <p className="gate__text">
          Turn on your camera to bloom the flowers and move through the pages with simple hand
          gestures. Nothing is recorded or sent.
        </p>
        <button type="button" className="gate__cta" onClick={onStart}>
          <span aria-hidden="true">✋</span> Turn on camera
        </button>
        <button type="button" className="gate__skip" onClick={onSkip}>
          Explore without camera
        </button>
      </div>
    </div>,
    document.body
  );
}
