export const ASSET_BASE = '/gesture-demo';

// ?embed=1 is added when the demo runs inside the frame on the home page.
export const EMBED = new URLSearchParams(window.location.search).has('embed');

// Each flower has a forward clip (closed → open) and the same clip reversed (open → closed).
// The reversed copies let the flower close smoothly; browsers can't play MP4s backwards.
export const VIDEOS = {
  left: {
    forward: `${ASSET_BASE}/flowers/two-forward.mp4`,
    reverse: `${ASSET_BASE}/flowers/two-reverse.mp4`,
    poster: `${ASSET_BASE}/flowers/two-poster.jpg`,
    label: 'Left hand',
  },
  right: {
    forward: `${ASSET_BASE}/flowers/one-forward.mp4`,
    reverse: `${ASSET_BASE}/flowers/one-reverse.mp4`,
    poster: `${ASSET_BASE}/flowers/one-poster.jpg`,
    label: 'Right hand',
  },
};

export const TRACKING = {
  // MediaPipe library, runtime + models, all loaded from CDNs (no npm package needed).
  libUrl: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs',
  wasmPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm',
  handModel:
    'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  faceModel:
    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',

  // MediaPipe labels hands as if the image were mirrored (selfie view).
  // If right/left ever feel reversed on your setup, flip this to false.
  swapHandedness: true,

  // How many fingers (out of 5) must be extended to count as an "open" hand.
  minExtendedFingers: 4,
  // Consecutive frames needed before a hand switches open/closed (debounce).
  framesToOpen: 3,
  framesToClose: 5,

  // Swipe = palm travels this fraction of the camera width (0–1) within swipeWindowMs.
  swipeDistance: 0.22,
  swipeWindowMs: 450,
  // Pause after a swipe so one sweep doesn't count twice.
  swipeCooldownMs: 1000,
  // Flip if swiping right goes back instead of forward on your setup.
  invertSwipe: true,
};

export const PLAYBACK = {
  // How fast the flowers open and close. 1 = the clip's own speed, 1.7 = 70% faster.
  speed: 3.5,
};

// ---- Your details: edit these and the whole site updates ----
export const SITE = {
  name: 'Christian Schneider-Davis',
  role: 'Digital Event & Brand Experiences',
  email: 'schneiderdavis@aol.com',
  // Headline is split so the last line can be set in italic serif.
  headline: ['Curating digital', 'experiences,'],
  headlineAccent: 'one fold at a time.',
  intro:
    'I design and produce event and brand experiences that people step into, not scroll past: launches, live activations, installations and the digital moments around them.',
  shortIntro: 'Event and brand experiences people step into, not scroll past.',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/christianscottie' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/christian-schneider-davis' },
    { label: 'GitHub', href: 'https://github.com/Christian-Schneider-Davis'}
  ],
};
