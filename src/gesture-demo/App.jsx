import { useCallback, useEffect, useRef, useState } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Pager from './components/Pager.jsx';
import CameraBox from './components/CameraBox.jsx';
import { EMBED, SITE } from './config.js';

// Off-screen pages are made inert so Tab can't wander into them.
// (Set as a DOM attribute so it works on both React 18 and 19.)
const inertUnless = (visible) => (el) => el?.toggleAttribute('inert', !visible);

const PAGES = ['Home', 'About', 'Contact'];
const LAST = PAGES.length - 1;

export default function App() {
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const [bounce, setBounce] = useState(null); // 'start' | 'end' | null
  const [tracked, setTracked] = useState({ left: false, right: false }); // from the camera
  const [held, setHeld] = useState({ left: false, right: false }); // from press-and-hold
  const camSlotRef = useRef(null);

  useEffect(() => {
    document.title = `${SITE.name} · ${SITE.role}`;
  }, []);

  const goTo = useCallback((i) => {
    const next = Math.max(0, Math.min(LAST, i));
    pageRef.current = next;
    setPage(next);
  }, []);

  const step = useCallback(
    (dir) => {
      const current = pageRef.current;
      if (dir === 'next') {
        if (current === LAST) setBounce('end');
        else goTo(current + 1);
      } else {
        if (current === 0) setBounce('start');
        else goTo(current - 1);
      }
    },
    [goTo]
  );

  const handleGesture = useCallback(({ hand, open }) => {
    setTracked((prev) => ({ ...prev, [hand]: open }));
  }, []);

  const handleHold = useCallback((hand, value) => {
    setHeld((prev) => (prev[hand] === value ? prev : { ...prev, [hand]: value }));
  }, []);

  // Keyboard: arrows / page keys.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea') || document.querySelector('dialog[open], .gate')) return;
      if (['ArrowRight', 'PageDown'].includes(e.key)) step('next');
      if (['ArrowLeft', 'PageUp'].includes(e.key)) step('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  // Mouse wheel / trackpad, one page per gesture.
  const wheelLock = useRef(0);
  const onWheel = (e) => {
    // Embedded in a scrolling page, the wheel belongs to that page.
    if (EMBED) return;
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 25 || performance.now() < wheelLock.current) return;
    wheelLock.current = performance.now() + 900;
    step(delta > 0 ? 'next' : 'prev');
  };

  // Finger swipes on touch screens (drag left = next, like any carousel).
  const touch = useRef(null);
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') touch.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 'next' : 'prev');
  };

  const open = { left: tracked.left || held.left, right: tracked.right || held.right };

  return (
    <div className="app">
      <Nav page={page} goTo={goTo} />

      <div
        className="viewport"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (touch.current = null)}
      >
        <div
          className={`bouncer ${bounce ? `bounce-${bounce}` : ''}`}
          onAnimationEnd={() => setBounce(null)}
        >
          <div className="track" style={{ transform: `translate3d(${-page * 100}%, 0, 0)` }}>
            <div className="panel" ref={inertUnless(page === 0)} aria-hidden={page !== 0}>
              <Hero open={open} onHold={handleHold} onNext={() => step('next')} camSlotRef={camSlotRef} />
            </div>
            <div className="panel" ref={inertUnless(page === 1)} aria-hidden={page !== 1}>
              <About />
            </div>
            <div className="panel" ref={inertUnless(page === 2)} aria-hidden={page !== 2}>
              <Contact />
            </div>
          </div>
        </div>
      </div>

      <Pager page={page} pages={PAGES} goTo={goTo} step={step} />

      <CameraBox
        onGesture={handleGesture}
        onSwipe={step}
        docked={page !== 0}
        slotRef={camSlotRef}
      />
    </div>
  );
}
