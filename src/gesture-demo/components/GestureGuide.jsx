import { useEffect, useRef } from 'react';
import { ASSET_BASE } from '../config.js';
import './GestureGuide.css';

/**
 * "How it works" modal. Opens from the camera button; its main button starts the camera,
 * so the browser's permission prompt only appears once people know what it's for.
 */
export default function GestureGuide({ open, live, onStart, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector('[data-autofocus]')?.focus({ preventScroll: true });
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="guide"
      aria-labelledby="guide-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()} // click on the backdrop
    >
      <div className="guide__card">
        <button type="button" className="guide__x" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <p className="eyebrow"><span aria-hidden="true">✦</span> How it works</p>
        <h2 id="guide-title" className="guide__title">
          Use your <em>hands.</em>
        </h2>

        <ol className="guide__steps">
          <li className="step">
            <div className="step__visual step__visual--bloom" aria-hidden="true">
              <img src={`${ASSET_BASE}/flowers/hint-closed.jpg`} alt="" />
              <span className="step__arrow">→</span>
              <img src={`${ASSET_BASE}/flowers/hint-open.jpg`} alt="" />
            </div>
            <div className="step__text">
              <h3>Open a hand to bloom</h3>
              <p>
                Your left hand opens the left flower, your right hand the right one. Keep it open to
                bloom fully; close it and the flower folds back up.
              </p>
            </div>
          </li>

          <li className="step">
            <div className="step__visual step__visual--swipe" aria-hidden="true">
              <span className="swipe__face" />
              <span className="swipe__hand">✋</span>
              <span className="swipe__dots">
                <i /> <i /> <i />
              </span>
            </div>
            <div className="step__text">
              <h3>Swipe to change pages</h3>
              <p>
                Sweep a hand across <strong>in front of your face</strong>: to your left for the
                next page, to your right to go back. Passing in front of your face gives the
                smoothest swipe.
              </p>
            </div>
          </li>

          <li className="step">
            <div className="step__visual step__visual--frame" aria-hidden="true">
              <span className="frame">
                <span className="frame__face" />
                <span className="frame__hand frame__hand--l">✋</span>
                <span className="frame__hand frame__hand--r">🤚</span>
              </span>
            </div>
            <div className="step__text">
              <h3>Stay in frame</h3>
              <p>About an arm’s length from the screen, in good light, with both hands visible.</p>
            </div>
          </li>
        </ol>

        <p className="guide__privacy">
          Tracking runs entirely in your browser. No video is recorded, stored or sent. No camera?
          Press and hold a flower, and swipe with your finger or use the arrow keys.
        </p>

        <div className="guide__actions">
          {live ? (
            <button type="button" className="btn" onClick={onClose} data-autofocus>Got it</button>
          ) : (
            <>
              <button type="button" className="btn btn--ghost" onClick={onClose}>Not now</button>
              <button type="button" className="btn" onClick={onStart} data-autofocus>
                Start camera <span aria-hidden="true">→</span>
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
