import { DeskJourney as JourneyMath } from "../../domains/DeskJourney";
import { SCREEN_CHROME_PX } from "./screenStyles";

/** Shifts a pose sideways (desktop) or down (portrait) so the object clears the text card. */
function frameBeside(position, target, aspect, amount, portraitAmount = amount * 0.5) {
  const d = Math.hypot(...position.map((v, i) => v - target[i]));
  if (aspect >= 1) {
    const dx = -amount * d;
    return { position: [position[0] + dx, position[1], position[2]], target: [target[0] + dx, target[1], target[2]] };
  }
  const dy = -portraitAmount * d;
  return { position: [position[0], position[1] + dy, position[2]], target: [target[0], target[1] + dy, target[2]] };
}

/** The same view pushed a little closer, so a held shot still moves while you scroll. */
function driftIn(pose, amount = 0.1) {
  return { position: pose.position.map((v, i) => v + (pose.target[i] - v) * amount), target: pose.target };
}

function lookFrom(point, offset, distance) {
  return { position: point.map((v, i) => v + offset[i] * distance), target: point };
}

/** Sizes a device screen so one CSS pixel lands on one viewport pixel once the camera has pushed in, keeping text crisp. */
function screenFit(anchor, fov, aspect, viewportWidth) {
  const pose = JourneyMath.screenPose(anchor, fov, aspect);
  const distance = Math.hypot(...pose.position.map((v, i) => v - anchor.center[i]));
  const visibleWidth = 2 * distance * Math.tan((fov * Math.PI) / 360) * aspect;
  const width = Math.round((anchor.width / visibleWidth) * viewportWidth);
  return {
    pose,
    width,
    height: Math.round(width * (anchor.height / anchor.width)),
    columnPx: width * Math.min(1, visibleWidth / anchor.width) * 0.9,
  };
}
const HOLD = 0.3;

/** How each device screen is sized and framed for this viewport. */
export function screenFits(scene, vw, vh) {
  const aspect = vw / vh;
  return {
    work: screenFit(scene.anchors.monitor, scene.fov, aspect, vw),
    nda: screenFit(scene.anchors.laptop, scene.fov, aspect, vw),
  };
}

/**
 * Sizes each screen element to its fit and each screen's section to hold its scroll. Returns what the screens
 * measured once sized: { [key]: { scrollable, viewportHeight } }.
 */
export function sizeScreens(fits, screens, sections, vh) {
  const hold = vh * HOLD;
  const sized = {};
  Object.entries(fits).forEach(([key, fit]) => {
    const { element, scroller } = screens[key];
    element.style.width = `${fit.width}px`;
    element.style.height = `${fit.height}px`;
    element.style.setProperty("--col", `${Math.round(fit.columnPx)}px`);
    element.toggleAttribute("data-narrow", fit.columnPx < 760);
    const viewportHeight = fit.height - SCREEN_CHROME_PX;
    const scrollable = Math.max(0, scroller.offsetHeight - viewportHeight * 0.9);
    sections[key].style.height = `${Math.round(hold * 2 + scrollable)}px`;
    sized[key] = { scrollable, viewportHeight };
  });
  return sized;
}

/** Scroll positions (px) for every camera keyframe, screen scroll, reveal and jump. Reads the page, never writes. */
export function buildTimeline(scene, els, fits, sized, vh, vw) {
  const aspect = vw / vh;
  const { anchors } = scene;
  const portrait = aspect < 1;
  const top = (el) => el.offsetTop;
  const bottom = (el) => el.offsetTop + el.offsetHeight;
  const hold = vh * HOLD;
  const scrolls = Object.fromEntries(
    Object.entries(sized).map(([key, size]) => [
      key,
      { ...size, start: top(els[key]) + hold, end: bottom(els[key]) - hold },
    ]),
  );

  const wide = portrait
    ? { position: [-0.5, 1.75, 3.5], target: [0.0, 1.02, 0] }
    : { position: [-1.28, 1.5, 2.1], target: [-0.62, 0.86, 0] };
  const wideIn = portrait
    ? { position: [-0.42, 1.65, 3.0], target: [0.0, 0.98, 0] }
    : { position: [-1.1, 1.4, 1.85], target: [-0.6, 0.86, 0] };
  const between = { position: [-0.05, 1.3, 1.25], target: [-0.05, 0.9, -0.1] };
  const lc = anchors.laptop.center;
  const laptopOut = { position: [lc[0] + 0.1, lc[1] + 0.32, lc[2] + 0.75], target: [lc[0], lc[1] - 0.12, lc[2] + 0.15] };
  const guides = frameBeside(
    lookFrom(anchors.guides, [0.15, 0.85, 0.62], portrait ? 0.95 : 0.5).position,
    anchors.guides,
    aspect,
    0.22,
  );
  const controller = frameBeside(
    lookFrom(anchors.controller, [-0.25, 0.8, 0.62], portrait ? 0.85 : 0.6).position,
    anchors.controller,
    aspect,
    0.24,
    0.28,
  );
  const phoneView = lookFrom(anchors.phone.center, anchors.phone.normal, portrait ? 0.5 : 0.36);
  const phone = frameBeside(phoneView.position, phoneView.target, aspect, 0.22);
  const final = portrait
    ? { position: [0.15, 1.05, 4.9], target: [0.15, 0.3, 0] }
    : frameBeside([0, 1.25, 2.9], [0, 0.98, 0], aspect, 0.16);

  const arrive = {
    guides: Math.round(top(els.guides) + vh * 0.7),
    side: Math.round(top(els.side) - vh * 0.15),
    contact: Math.round(top(els.contact) - vh * 0.15),
  };
  scrolls.work.reset = [arrive.guides, arrive.side];
  const introPose = { position: wide.position.map((v, i) => v + (v - wide.target[i]) * 0.35), target: wide.target };
  const k = (at, pose) => ({ at, ...pose });
  const keyframes = [
    k(0, wide),
    k(top(els.work) - vh * 1.3, wideIn),
    k(top(els.work), fits.work.pose),
    k(bottom(els.work), fits.work.pose),
    k(top(els.nda) - vh * 0.7, between),
    k(top(els.nda), fits.nda.pose),
    k(bottom(els.nda), driftIn(fits.nda.pose, 0.04)),
    k(top(els.guides) + vh * 0.25, laptopOut),
    k(arrive.guides, guides),
    k(bottom(els.guides) - vh * 0.95, driftIn(guides)),
    k(arrive.side, controller),
    k(bottom(els.side) - vh * 0.95, driftIn(controller)),
    k(arrive.contact, phone),
    k(top(els.contact) + vh * 0.8, driftIn(phone)),
    k(top(els.contact) + vh * 1.3, final),
  ];
  return {
    keyframes,
    introPose,
    scrolls,
    screenArrivals: {
      work: [top(els.work) - vh * 0.45, top(els.work)],
      nda: [top(els.nda) - vh * 0.4, top(els.nda)],
    },
    heroFade: [vh * 0.25, vh * 0.85],
    cards: [
      { key: "guides", range: [arrive.guides - vh * 0.3, arrive.guides] },
      { key: "side", range: [arrive.side - vh * 0.5, arrive.side - vh * 0.1] },
      { key: "contact", range: [arrive.contact - vh * 0.5, arrive.contact - vh * 0.1] },
    ],
    phoneLit: [top(els.contact) - vh * 0.45, top(els.contact) + vh * 0.05],
    rise: [top(els.contact) + vh * 1.3, top(els.contact) + vh * 2.0],
    jumps: {
      top: 0,
      work: top(els.work) + hold,
      nda: top(els.nda) + hold,
      guides: arrive.guides,
      side: arrive.side,
      contact: arrive.contact,
    },
    ranges: {
      work: [top(els.work), bottom(els.work)],
      nda: [top(els.nda), bottom(els.nda)],
      guides: [arrive.guides, arrive.side],
      side: [arrive.side, arrive.contact],
      contact: [arrive.contact, Infinity],
    },
  };
}
