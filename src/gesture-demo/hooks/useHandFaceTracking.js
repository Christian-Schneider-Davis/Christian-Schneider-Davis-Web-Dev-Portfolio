import { useCallback, useEffect, useRef, useState } from 'react';
import { TRACKING } from '../config.js';
import { countExtendedFingers, resolveHand } from '../lib/gestures.js';

/**
 * Owns the camera stream and the MediaPipe models.
 *
 * status: 'idle' | 'requesting' | 'loading' | 'running' | 'denied' | 'unsupported' | 'error'
 * hands:  { left: boolean, right: boolean }  — debounced "is this hand open" state
 * onGesture({ hand, open }) fires whenever a hand switches between open and closed.
 * onSwipe('next' | 'prev') fires when either hand sweeps sideways quickly.
 *   'next' = towards the person's right, 'prev' = towards their left.
 */
export function useHandFaceTracking({ videoRef, canvasRef, onGesture, onSwipe }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [hands, setHands] = useState({ left: false, right: false });
  const [faceFound, setFaceFound] = useState(false);

  const streamRef = useRef(null);
  const modelsRef = useRef(null);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(-1);
  const counters = useRef({
    left: { open: false, streak: 0 },
    right: { open: false, streak: 0 },
  });
  const onGestureRef = useRef(onGesture);
  onGestureRef.current = onGesture;
  const onSwipeRef = useRef(onSwipe);
  onSwipeRef.current = onSwipe;
  // Recent palm positions per hand, used for swipe detection.
  const trails = useRef({ left: [], right: [] });
  const lastSwipeAt = useRef(0);
  const onScreenRef = useRef(true);

  const trackSwipe = (hand, lm, now) => {
    const palm = lm[9]; // middle-finger knuckle ≈ centre of the palm
    const trail = trails.current[hand];
    trail.push({ x: palm.x, y: palm.y, t: now });
    while (trail.length && now - trail[0].t > TRACKING.swipeWindowMs) trail.shift();
    if (now - lastSwipeAt.current < TRACKING.swipeCooldownMs || trail.length < 3) return;

    const first = trail[0];
    const dx = palm.x - first.x;
    const dy = palm.y - first.y;
    if (Math.abs(dx) < TRACKING.swipeDistance || Math.abs(dx) < Math.abs(dy) * 1.8) return;

    // The camera frame is not mirrored: moving towards your right makes x go DOWN.
    let dir = dx < 0 ? 'next' : 'prev';
    if (TRACKING.invertSwipe) dir = dir === 'next' ? 'prev' : 'next';
    lastSwipeAt.current = now;
    trails.current = { left: [], right: [] };
    onSwipeRef.current?.(dir);
  };

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    // Release the "open" state of any hand so videos can react.
    for (const hand of ['left', 'right']) {
      if (counters.current[hand].open) onGestureRef.current?.({ hand, open: false });
      counters.current[hand] = { open: false, streak: 0 };
    }
    setHands({ left: false, right: false });
    setFaceFound(false);
    setStatus('idle');
  }, [videoRef]);

  const updateHand = (hand, isOpenNow) => {
    const c = counters.current[hand];
    if (isOpenNow === c.open) {
      c.streak = 0;
      return;
    }
    c.streak += 1;
    const needed = isOpenNow ? TRACKING.framesToOpen : TRACKING.framesToClose;
    if (c.streak >= needed) {
      c.open = isOpenNow;
      c.streak = 0;
      setHands((prev) => ({ ...prev, [hand]: isOpenNow }));
      onGestureRef.current?.({ hand, open: isOpenNow });
    }
  };

  const draw = (result, faceResult, DrawingUtils, HandLandmarker, FaceLandmarker) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const du = new DrawingUtils(ctx);

    for (const face of faceResult?.faceLandmarks ?? []) {
      du.drawConnectors(face, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, {
        color: 'rgba(255,255,255,0.55)',
        lineWidth: 2,
      });
      du.drawConnectors(face, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: '#e9c9a8', lineWidth: 2 });
      du.drawConnectors(face, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#e9c9a8', lineWidth: 2 });
      du.drawConnectors(face, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: '#d9805a', lineWidth: 2 });
    }

    result.landmarks.forEach((lm, i) => {
      const label = result.handednesses[i]?.[0]?.categoryName ?? 'Right';
      const hand = resolveHand(label, TRACKING.swapHandedness);
      const open = counters.current[hand].open;
      const color = open ? '#e9c9a8' : 'rgba(255,255,255,0.8)';
      du.drawConnectors(lm, HandLandmarker.HAND_CONNECTIONS, { color, lineWidth: 3 });
      du.drawLandmarks(lm, { color: '#ffffff', fillColor: open ? '#b4532a' : '#1a1918', radius: 3, lineWidth: 1 });
    });
  };

  const start = useCallback(async () => {
    if (!window.isSecureContext) {
      setStatus('unsupported');
      setError(
        `Cameras only work on https or localhost. Open http://localhost:${location.port || 5173} instead of ${location.host}.`
      );
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported');
      setError('This browser does not support camera access. Try a recent Chrome, Edge, Firefox or Safari.');
      return;
    }

    setError('');
    setStatus('requesting');
    let stream;
    try {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
      } catch (err) {
        // Some webcams reject the size/facing hints; retry with no constraints at all.
        if (err?.name === 'OverconstrainedError' || err?.name === 'NotReadableError' || err?.name === 'AbortError') {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('[camera]', err?.name, err?.message, err);
      const messages = {
        NotAllowedError:
          'Camera permission is blocked. Click the camera icon in the address bar, choose Allow, then try again. On Windows also check Settings → Privacy & security → Camera.',
        SecurityError: 'Camera access is blocked by the browser on this page.',
        NotFoundError: 'No camera was found. Is a webcam plugged in and enabled?',
        NotReadableError:
          'Your camera is busy. Close other apps that might be using it (Teams, Zoom, Camera, OBS, another browser tab) and try again.',
        AbortError: 'The camera could not start. Close other apps using it and try again.',
      };
      setStatus(err?.name === 'NotAllowedError' || err?.name === 'SecurityError' ? 'denied' : 'error');
      setError(messages[err?.name] ?? `The camera could not be opened (${err?.name || 'unknown error'}).`);
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;
    video.srcObject = stream;
    await video.play().catch(() => {});

    setStatus('loading');
    let vision;
    try {
      vision = await import(/* @vite-ignore */ TRACKING.libUrl);
      if (!modelsRef.current) {
        const fileset = await vision.FilesetResolver.forVisionTasks(TRACKING.wasmPath);
        const make = async (delegate) => {
          const hand = await vision.HandLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: TRACKING.handModel, delegate },
            runningMode: 'VIDEO',
            numHands: 2,
          });
          const face = await vision.FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: TRACKING.faceModel, delegate },
            runningMode: 'VIDEO',
            numFaces: 1,
          });
          return { hand, face };
        };
        try {
          modelsRef.current = await make('GPU');
        } catch {
          modelsRef.current = await make('CPU');
        }
      }
    } catch (err) {
      console.error(err);
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setStatus('error');
      setError('The tracking models could not be loaded. Check your internet connection and try again.');
      return;
    }

    // The user may have stopped the camera while the models were loading.
    if (!streamRef.current) return;

    setStatus('running');
    const { hand, face } = modelsRef.current;
    const { DrawingUtils, HandLandmarker, FaceLandmarker } = vision;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const v = videoRef.current;
      if (!v || v.readyState < 2 || document.hidden || !onScreenRef.current) return;
      if (v.currentTime === lastTimeRef.current) return;
      lastTimeRef.current = v.currentTime;

      const now = performance.now();
      const handResult = hand.detectForVideo(v, now);
      const faceResult = face.detectForVideo(v, now);

      const seen = { left: false, right: false };
      const present = { left: false, right: false };
      handResult.landmarks.forEach((lm, i) => {
        const label = handResult.handednesses[i]?.[0]?.categoryName ?? 'Right';
        const h = resolveHand(label, TRACKING.swapHandedness);
        seen[h] = seen[h] || countExtendedFingers(lm) >= TRACKING.minExtendedFingers;
        if (!present[h]) trackSwipe(h, lm, now);
        present[h] = true;
      });
      for (const h of ['left', 'right']) if (!present[h]) trails.current[h] = [];
      updateHand('left', seen.left);
      updateHand('right', seen.right);
      setFaceFound(faceResult.faceLandmarks.length > 0);

      draw(handResult, faceResult, DrawingUtils, HandLandmarker, FaceLandmarker);
    };
    loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, canvasRef]);

  // Clean up camera + models when the component goes away.
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      modelsRef.current?.hand.close();
      modelsRef.current?.face.close();
      modelsRef.current = null;
    },
    []
  );

  // When embedded in a longer page, skip tracking while the demo is scrolled out of view.
  // (Inside an iframe, IntersectionObserver measures against the top-level viewport.)
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      onScreenRef.current = entry.isIntersecting;
    });
    io.observe(document.documentElement);
    return () => io.disconnect();
  }, []);

  return { status, error, hands, faceFound, start, stop };
}
