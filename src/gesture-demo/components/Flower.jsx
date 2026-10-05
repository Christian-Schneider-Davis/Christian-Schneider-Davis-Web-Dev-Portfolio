import { useEffect, useRef, useState } from 'react';
import { PLAYBACK } from '../config.js';
import './Flower.css';

const END_TOLERANCE = 0.04; // seconds

// Set a video's time and wait until that frame is ready to show.
function seekTo(video, time) {
  return new Promise((resolve) => {
    if (Math.abs(video.currentTime - time) < 0.001) return resolve();
    const done = () => {
      video.removeEventListener('seeked', done);
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(done, 400);
    video.addEventListener('seeked', done);
    video.currentTime = time;
  });
}

function whenReady(video) {
  if (video.readyState >= 1 && Number.isFinite(video.duration)) return Promise.resolve();
  return new Promise((resolve) => video.addEventListener('loadedmetadata', resolve, { once: true }));
}

/**
 * A flower that blooms while `open` is true and folds back up when it turns false.
 * Two stacked clips (forward + reversed) are swapped at the matching frame,
 * so it can change direction mid-bloom without jumping.
 */
export default function Flower({ forward, reverse, open, label, onHold }) {
  const fwdRef = useRef(null);
  const revRef = useRef(null);
  const [showing, setShowing] = useState('forward');
  const showingRef = useRef('forward');
  const token = useRef(0);

  useEffect(() => {
    const f = fwdRef.current;
    const r = revRef.current;
    if (!f || !r) return;
    const my = ++token.current;

    (async () => {
      await Promise.all([whenReady(f), whenReady(r)]);
      if (my !== token.current) return;
      const D = f.duration;

      // How far into the bloom we are, in seconds of the forward clip.
      const progress = showingRef.current === 'forward' ? f.currentTime : D - r.currentTime;

      const [from, to, target] = open ? [r, f, progress] : [f, r, D - progress];
      const toName = open ? 'forward' : 'reverse';

      from.pause();
      if (showingRef.current !== toName) {
        // Stay a hair inside the clip: seeking to exactly the end can show a blank frame.
        await seekTo(to, Math.min(Math.max(target, 0), D - 0.01));
        if (my !== token.current) return;
        showingRef.current = toName;
        setShowing(toName);
      }
      // play() on a finished clip would restart it, so only play if there's runway left.
      if (to.currentTime < D - END_TOLERANCE) {
        to.playbackRate = PLAYBACK.speed;
        to.play().catch(() => {});
      }
    })();
  }, [open]);

  const hold = (value) => (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    onHold?.(value);
  };

  return (
    <figure className={`flower ${open ? 'is-open' : ''}`}>
      <div
        className="flower__media"
        onPointerDown={hold(true)}
        onPointerUp={hold(false)}
        onPointerLeave={hold(false)}
        onPointerCancel={hold(false)}
        onContextMenu={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
        aria-pressed={open}
        aria-label={`${label} flower. Hold to open.`}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && !e.repeat && onHold?.(true)}
        onKeyUp={(e) => (e.key === ' ' || e.key === 'Enter') && onHold?.(false)}
      >
        <video
          ref={fwdRef}
          className={`flower__video ${showing === 'forward' ? 'is-shown' : ''}`}
          src={forward}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
        <video
          ref={revRef}
          className={`flower__video ${showing === 'reverse' ? 'is-shown' : ''}`}
          src={reverse}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>
    </figure>
  );
}
