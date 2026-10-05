// Landmark indices: https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker
const WRIST = 0;
const FINGERS = [
  // [tip, pip]
  [8, 6], // index
  [12, 10], // middle
  [16, 14], // ring
  [20, 18], // pinky
];
const THUMB_TIP = 4;
const THUMB_IP = 3;
const PINKY_MCP = 17;

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));

/** Number of extended fingers (0–5). Rotation-independent: compares distances from the wrist. */
export function countExtendedFingers(lm) {
  let count = 0;
  for (const [tip, pip] of FINGERS) {
    if (dist(lm[WRIST], lm[tip]) > dist(lm[WRIST], lm[pip]) * 1.15) count++;
  }
  // Thumb is extended when its tip sits farther from the pinky knuckle than its own joint does.
  if (dist(lm[THUMB_TIP], lm[PINKY_MCP]) > dist(lm[THUMB_IP], lm[PINKY_MCP]) * 1.1) count++;
  return count;
}

/** Maps MediaPipe's handedness label to the person's real hand ('left' | 'right'). */
export function resolveHand(label, swap) {
  const h = label.toLowerCase() === 'left' ? 'left' : 'right';
  if (!swap) return h;
  return h === 'left' ? 'right' : 'left';
}
