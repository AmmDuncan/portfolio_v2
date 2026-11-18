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

/** Pose part way from one camera pose to another. */
function blendPose(from, to, t) {
  return { position: lerpVec(from.position, to.position, t), target: lerpVec(from.target, to.target, t) };
}

const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** Camera pose t (0..1) along an arc between two poses, lifted up and back so it clears the desk. */
function flightPose(from, to, t) {
  const eased = easeInOutCubic(t);
  const distance = Math.hypot(...to.position.map((v, i) => v - from.position[i]));
  const lift = Math.sin(Math.PI * eased) * distance * 0.25;
  const [x, y, z] = lerpVec(from.position, to.position, eased);
  return { position: [x, y + lift, z + lift], target: lerpVec(from.target, to.target, eased) };
}

/** Progress (0..1) of item `index` of `count` entering as a group, each starting a little after the last. */
function stagger(t, index, count, spread = 0.45) {
  const start = count > 1 ? (index / (count - 1)) * spread : 0;
  return clamp01((t - start) / (1 - spread));
}

/** Flight time in ms for a camera move of this many metres. */
function flightDuration(distance) {
  return Math.min(1600, Math.max(800, 800 + distance * 350));
}

/** 0..1 share of `duration` ms that has passed since `start`. */
function timeProgress(start, duration, now) {
  return clamp01((now - start) / duration);
}

/** Key of the section whose half-open [start, end) scroll range holds y, or null between sections. */
function activeSectionAt(y, ranges) {
  return Object.keys(ranges).find((key) => y >= ranges[key][0] && y < ranges[key][1]) ?? null;
}

/** The desk's height in cm as it rises (rise 0..1) from 74 to 112 cm. */
function deskHeightCm(rise) {
  return Math.round(74 + (112 - 74) * rise);
}

function framePose(y, timeline, flight, flightT, intro) {
  if (flight) return flightPose(flight.from, flight.to, flightT);
  const pose = poseAt(y, timeline.keyframes);
  if (intro < 1) return blendPose(timeline.introPose, pose, easeOutCubic(intro));
  return pose;
}

function screenOffsets(contentY, timeline) {
  const entries = Object.entries(timeline.scrolls).map(([key, screen]) => {
    const back = screen.reset ? smoothstep(progress(contentY, ...screen.reset)) : 0;
    const offset = screen.scrollable * progress(contentY, screen.start, screen.end) * (1 - back);
    return [key, { offset, arrival: progress(contentY, ...timeline.screenArrivals[key]) }];
  });
  return Object.fromEntries(entries);
}

/**
 * Everything the journey shows at scroll position y, as plain values. While a flight runs the camera follows its
 * arc, the page content is already at the flight's target, and the desk eases between the two positions.
 */
function frameAt(y, timeline, { flight = null, intro = 1, now = 0 } = {}) {
  const flightT = flight ? timeProgress(flight.start, flight.duration, now) : 0;
  const contentY = flight ? flight.y : y;
  const travel = (value) => (flight ? lerp(value(flight.fromY), value(flight.y), smoothstep(flightT)) : value(y));
  const rise = travel((at) => smoothstep(progress(at, ...timeline.rise)));
  return {
    pose: framePose(y, timeline, flight, flightT, intro),
    power: smoothstep(progress(intro, 0.3, 0.75)),
    active: flight ? null : activeSectionAt(contentY, timeline.ranges),
    screens: screenOffsets(contentY, timeline),
    phoneLit: travel((at) => progress(at, ...timeline.phoneLit)),
    rise,
    heightCm: deskHeightCm(rise),
    heroOpacity: 1 - progress(contentY, ...timeline.heroFade),
    cards: timeline.cards.map(({ key, range }) => {
      const shown = progress(contentY, ...range);
      return { key, shown, opacity: Math.min(1, shown * 3), inert: flight !== null || shown < 0.34 };
    }),
  };
}

/**
 * Render resolution after a run of frames: one step lower when the average frame took longer than `slowMs`,
 * never below `floor`. It only ever goes down, so it can't oscillate.
 */
function nextPixelRatio(current, averageFrameMs, { floor = 1, step = 0.25, slowMs = 22 } = {}) {
  if (averageFrameMs <= slowMs) return current;
  return Math.max(floor, current - step);
}

export const DeskJourney = {
  nextPixelRatio,
  frameAt,
  deskHeightCm,
  activeSectionAt,
  timeProgress,
  coverDistance,
  screenPose,
  poseAt,
  progress,
  smoothstep,
  easeOutCubic,
  blendPose,
  flightPose,
  flightDuration,
  stagger,
  lerp,
};
