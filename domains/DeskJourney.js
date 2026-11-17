/** Scroll-to-camera math for the desk journey. Framework-free. */

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const smoothstep = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const lerpVec = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));

/** Distance at which a camera with `fovDeg` (vertical) fills the viewport with a w x h rectangle. */
function coverDistance(width, height, fovDeg, aspect) {
  const halfV = Math.tan((fovDeg * Math.PI) / 360);
  const fromHeight = height / 2 / halfV;
  const fromWidth = width / 2 / (halfV * aspect);
  return Math.min(fromHeight, fromWidth);
}

/** Camera pose looking straight at the centre of a screen along its normal. */
function screenPose({ center, normal, width, height }, fovDeg, aspect, inset = 0.9) {
  const d = coverDistance(width, height, fovDeg, aspect) * inset;
  return {
    position: center.map((c, i) => c + normal[i] * d),
    target: center,
  };
}

/** Interpolated pose for a scroll position, given keyframes sorted by `at` (px). */
function poseAt(scrollY, keyframes) {
  if (keyframes.length === 0) return null;
  if (scrollY <= keyframes[0].at) return keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (scrollY >= last.at) return last;
  const i = keyframes.findIndex((k) => k.at > scrollY);
  const from = keyframes[i - 1];
  const to = keyframes[i];
  const t = smoothstep(clamp01((scrollY - from.at) / (to.at - from.at)));
  return {
    position: lerpVec(from.position, to.position, t),
    target: lerpVec(from.target, to.target, t),
  };
}

/** 0..1 progress of scrollY through [start, end]. */
function progress(scrollY, start, end) {
  if (end <= start) return scrollY >= end ? 1 : 0;
  return clamp01((scrollY - start) / (end - start));
}

export const DeskJourney = {
  coverDistance,
  screenPose,
  poseAt,
  progress,
  smoothstep,
  lerp,
};
