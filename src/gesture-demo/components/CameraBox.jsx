import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useHandFaceTracking } from '../hooks/useHandFaceTracking.js';
import CameraConsent from './CameraConsent.jsx';
import GestureGuide from './GestureGuide.jsx';
import StartGate from './StartGate.jsx';
import './CameraBox.css';

const STATUS_TEXT = {
  requesting: 'Waiting for permission…',
  loading: 'Loading hand & face tracking…',
};

const MARGIN = 16;
const EDGE = 8; // how close to the window edge a dragged box may go
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi));

// Horizontal spot centred between the hero text and the flowers, or null when they're stacked.
function gapBesideFlowers(box) {
  const flowers = document.querySelector('.hero__flowers');
  const copy = document.querySelector('.hero__copy');
  const panel = flowers?.closest('.panel')?.getBoundingClientRect();
  const view = flowers?.closest('.viewport')?.getBoundingClientRect();
  if (!flowers || !copy || !panel || !view) return null;

  const range = document.createRange();
  range.selectNodeContents(copy); // the text itself, not the whole column
  const textRight = range.getBoundingClientRect().right;
  const flowersLeft = flowers.getBoundingClientRect().left;
  if (flowersLeft < textRight) return null; // stacked layout: no side gap

  const shift = view.left - panel.left; // ignore the page-slide transform
  // Fit the gap where possible (between 130px and 180px wide).
  const width = Math.max(130, Math.min(180, flowersLeft - textRight - 16));
  return { left: (textRight + flowersLeft) / 2 - width / 2 + shift, width };
}

/**
 * One camera box for the whole site. On the home page it sits over a slot in the hero;
 * on other pages (and on small screens) it tucks into the bottom-right corner so
 * tracking and swipes keep working everywhere.
 */
export default function CameraBox({ onGesture, onSwipe, docked, slotRef }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const boxRef = useRef(null);
  const [minimised, setMinimised] = useState(false);
  const [pos, setPos] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [gate, setGate] = useState(true); // the greyed-out start screen
  const [dragging, setDragging] = useState(false);
  const userPos = useRef(null); // where the visitor dragged the box to (null = automatic)
  const drag = useRef(null);
  const lastTap = useRef(0);
  const { status, error, hands, faceFound, start, stop } = useHandFaceTracking({
    videoRef,
    canvasRef,
    onGesture,
    onSwipe,
  });

  const live = status === 'running' || status === 'loading' || status === 'requesting';

  const place = useCallback(() => {
    const box = boxRef.current;
    const slot = slotRef.current;
    if (!box) return;

    // Where the slot sits when the home page is in view (ignores the page-slide transform).
    const slotRect = slot?.getBoundingClientRect();
    const panel = slot?.closest('.panel')?.getBoundingClientRect();
    const view = slot?.closest('.viewport')?.getBoundingClientRect();
    const slotUsable = !docked && slotRect && slotRect.width > 0 && panel && view;

    let next;
    if (slotUsable) {
      next = {
        mode: 'slot',
        left: slotRect.left - panel.left + view.left,
        // bottom-align with the slot, so a taller card grows upwards instead of over the flowers
        top: slotRect.bottom - panel.top + view.top - box.offsetHeight,
        width: slotRect.width,
      };
    } else {
      // On the home page without room for the slot (e.g. a short, wide frame), sit in the gap
      // between the headline and the flowers so the camera doesn't cover a flower.
      const gap = !docked && gapBesideFlowers(box);
      next = {
        mode: 'docked',
        left: gap ? gap.left : window.innerWidth - box.offsetWidth - MARGIN,
        top: window.innerHeight - box.offsetHeight - MARGIN,
        width: gap && live && !minimised ? gap.width : undefined,
      };
    }

    // A box the visitor has dragged stays where they put it (kept inside the window).
    if (userPos.current) {
      next.left = clamp(userPos.current.left, EDGE, window.innerWidth - box.offsetWidth - EDGE);
      next.top = clamp(userPos.current.top, EDGE, window.innerHeight - box.offsetHeight - EDGE);
    }
    setPos(next);
  }, [docked, slotRef, live, minimised]);

  // ---- drag with mouse or finger; double-click / double-tap puts it back ----
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('button, a')) return;
    const r = boxRef.current.getBoundingClientRect();
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: r.left, top: r.top, moved: false };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 4) return; // a tap, not a drag (yet)
      d.moved = true;
      boxRef.current.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    const box = boxRef.current;
    const left = clamp(d.left + dx, EDGE, window.innerWidth - box.offsetWidth - EDGE);
    const top = clamp(d.top + dy, EDGE, window.innerHeight - box.offsetHeight - EDGE);
    userPos.current = { left, top };
    setPos((p) => ({ ...(p ?? { mode: 'docked' }), left, top }));
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (d.moved) {
      setDragging(false);
      return;
    }
    const now = performance.now();
    if (now - lastTap.current < 320) {
      userPos.current = null;
      lastTap.current = 0;
      place();
    } else {
      lastTap.current = now;
    }
  };

  const onPointerCancel = () => {
    drag.current = null;
    setDragging(false);
  };

  useLayoutEffect(() => {
    place();
    const ro = new ResizeObserver(place);
    if (boxRef.current) ro.observe(boxRef.current);
    if (slotRef.current) ro.observe(slotRef.current);
    window.addEventListener('resize', place);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [place, live, minimised, slotRef]);

  const mode = pos?.mode ?? 'docked';
  const style = pos
    ? { left: pos.left, top: pos.top, width: pos.width }
    : { right: MARGIN, bottom: MARGIN };

  return (
    <aside
      ref={boxRef}
      className={`cam cam--${mode} ${live ? 'is-live' : ''} ${minimised ? 'is-min' : ''} ${pos ? 'is-placed' : ''} ${dragging ? 'is-dragging' : ''}`}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      title="Drag to move · double-click to reset"
      aria-label="Camera"
    >
      {/* Always mounted so the hook has a video element to attach the stream to. */}
      <div className="cam__view" hidden={!live}>
        <video ref={videoRef} className="cam__video" playsInline muted />
        <canvas ref={canvasRef} className="cam__overlay" />
        {STATUS_TEXT[status] && <div className="cam__status">{STATUS_TEXT[status]}</div>}

        {status === 'running' && (
          <div className="cam__hud">
            <span className={`tag ${hands.left ? 'is-on' : ''}`}>L</span>
            <span className={`tag ${faceFound ? 'is-on' : ''}`}>{faceFound ? 'Face' : 'No face'}</span>
            <span className={`tag ${hands.right ? 'is-on' : ''}`}>R</span>
          </div>
        )}

        <div className="cam__tools">
          <button type="button" onClick={() => setGuideOpen(true)} aria-label="How the gestures work">
            ?
          </button>
          <button
            type="button"
            onClick={() => setMinimised((m) => !m)}
            aria-label={minimised ? 'Expand camera' : 'Minimise camera'}
          >
            {minimised ? '⤢' : '–'}
          </button>
          <button type="button" onClick={stop} aria-label="Turn camera off">
            ✕
          </button>
        </div>
      </div>

      {!live && (
        <CameraConsent
          status={status}
          error={error}
          // First time: explain the gestures, and start the camera from the guide.
          // After an error: retry straight away.
          onAllow={status === 'idle' ? () => setGuideOpen(true) : start}
          compact={mode === 'docked'}
        />
      )}

      {gate && status === 'idle' && (
        <StartGate
          onStart={() => {
            setGate(false);
            setGuideOpen(true);
          }}
          onSkip={() => setGate(false)}
        />
      )}

      <GestureGuide
        open={guideOpen}
        live={live}
        onClose={() => setGuideOpen(false)}
        onStart={() => {
          setGuideOpen(false);
          start();
        }}
      />
    </aside>
  );
}
