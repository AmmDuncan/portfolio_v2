import { DeskJourney as JourneyMath } from "../../../domains/DeskJourney";

const FIGURE_ENTRY = { rise: 60, scale: 0.06, blur: 8 };
const CARD_PARTS = ".panel > :not(ul), .panel li";
const entryState = new WeakMap();

/** Places an element part way (t, 0..1) through its entrance: it rises, settles and comes into focus. */
function enter(el, t, { rise = 24, scale = 0, blur = 0, fadeOnly = false }) {
  const eased = JourneyMath.easeOutCubic(t);
  if (entryState.get(el) === eased) return;
  entryState.set(el, eased);
  el.style.opacity = String(eased);
  if (fadeOnly) return;
  const done = eased === 1;
  el.style.transform = done ? "" : `translateY(${(1 - eased) * rise}px) scale(${1 - scale * (1 - eased)})`;
  if (blur) el.style.filter = done ? "" : `blur(${(1 - eased) * blur}px)`;
}

/** The parts of a device screen that animate in; collect again after every layout. */
export function measureScreen(scroller, viewportHeight) {
  return {
    viewportHeight,
    head: [...scroller.children].filter((el) => el.tagName !== "OL"),
    glow: scroller.parentElement.querySelector(".glow"),
    rows: [...scroller.querySelectorAll("[data-reveal]")].map((row) => ({
      el: row,
      parts: [row.querySelector("figure"), ...row.querySelector(".meta").children],
    })),
  };
}

export const measureCard = (card) => [...card.querySelectorAll(CARD_PARTS)];

/** Scroll-scrubbed entrance for a device screen: heading as the camera arrives, then each row as it rises into view. */
export function revealScreen({ viewportHeight, head, glow, rows }, offset, arrival, fadeOnly) {
  head.forEach((el, i) => enter(el, JourneyMath.stagger(arrival, i, head.length), { rise: 24, fadeOnly }));
  if (glow) glow.style.opacity = String(1 - arrival * 0.85);
  const rowsOpen = JourneyMath.progress(arrival, 0.5, 1);
  rows.forEach((row) => {
    // Row positions are read live: they shift after layout (late fonts) without resizing the observed scroller.
    const top = row.el.offsetTop - offset;
    const t = Math.min(rowsOpen, JourneyMath.progress(viewportHeight - top, 0, viewportHeight * 0.45));
    row.parts.forEach((el, i) => {
      const entry = i === 0 ? FIGURE_ENTRY : { rise: 24 };
      enter(el, JourneyMath.stagger(t, i, row.parts.length), { ...entry, fadeOnly });
    });
    const fromMiddle = Math.abs(top + row.el.offsetHeight / 2 - viewportHeight / 2);
    const focus = 1 - JourneyMath.progress(fromMiddle, 0, viewportHeight * 0.6);
    row.el.style.setProperty("--focus", String(focus));
  });
}

/** A text card's parts enter in turn as it is shown (0..1). */
export function revealCard(parts, shown, fadeOnly) {
  parts.forEach((el, i) => enter(el, JourneyMath.stagger(shown, i, parts.length, 0.5), { rise: 16, fadeOnly }));
}
