import { DeskJourney as JourneyMath } from "../../../domains/DeskJourney";
import { buildTimeline, screenFits, sizeScreens } from "../timeline";
import { applyFrame } from "./applyFrame";
import { createFlight } from "./flight";
import { createFocus } from "./focus";
import { createPointerPicking } from "./pointer";
import { measureCard, measureScreen } from "./reveal";
import { createScroller } from "./scroller";

const INTRO_MS = 2600;
const SCENE_SCREEN = { work: "monitor", nda: "laptop" };

/**
 * Runs the scroll journey on a created scene: lays the page out, drives the camera from scroll position each
 * frame and flies between sections. `dom` holds plain elements. Throws (after cleaning up) if setup fails.
 */
export function createJourney({ scene, dom, screenEls, reduceMotion }) {
  const introStart = performance.now();
  const playIntro = !reduceMotion && window.scrollY < window.innerHeight * 0.1;
  const introAt = (now) => (playIntro ? JourneyMath.timeProgress(introStart, INTRO_MS, now) : 1);
  const screens = {
    work: { element: screenEls.work, scroller: dom.scrollers.work, measured: null },
    nda: { element: screenEls.nda, scroller: dom.scrollers.nda, measured: null },
  };
  const cards = Object.fromEntries(Object.entries(dom.cards).map(([key, el]) => [key, { el, parts: [] }]));
  const view = { scene, ...dom, screens, cards, reduceMotion };
  let timeline = null;
  let dirty = true;
  let lastY = -1;
  let raf = 0;
  let resizeFrame = 0;
  let resizeObserver = null;

  const markDirty = () => {
    dirty = true;
  };
  const scroller = createScroller({ reduceMotion });
  const flight = createFlight(scroller);
  const focus = createFocus({
    screenEls,
    cardEls: dom.cards,
    getTimeline: () => timeline,
    scroller,
    onScroll: markDirty,
  });
  const pointer = createPointerPicking({
    scene,
    hoverTag: dom.hoverTag,
    getActive: () => flight.current?.key ?? JourneyMath.activeSectionAt(window.scrollY, timeline.ranges),
    isBusy: () => flight.current !== null,
    onPick: flyTo,
  });

  function layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    scene.resize(w, h);
    const fits = screenFits(scene, w, h);
    const sized = sizeScreens(fits, screens, dom.sections, h);
    Object.entries(fits).forEach(([key, fit]) => scene.setScreenSize(SCENE_SCREEN[key], fit.width, fit.height));
    timeline = buildTimeline(scene, dom.sections, fits, sized, h, w);
    Object.entries(screens).forEach(([key, screen]) => {
      screen.measured = measureScreen(screen.scroller, sized[key].viewportHeight);
    });
    Object.values(cards).forEach((card) => {
      card.parts = measureCard(card.el);
    });
    markDirty();
  }

  /** Flies the camera to a section's jump point (a new target mid-flight retargets), then moves the page there. */
  function flyTo(key) {
    const y = timeline.jumps[key];
    focus.request(key === "top" ? null : key);
    if (flight.current?.key === key) return;
    if (!flight.canFly) {
      scroller.jump(y);
      markDirty();
      return;
    }
    const to = JourneyMath.poseAt(y, timeline.keyframes);
    flight.start({ to, y, key, scrollY: window.scrollY, now: performance.now() });
    dom.root.toggleAttribute("data-flying", true);
    pointer.hide();
  }

  function land() {
    flight.land();
    dom.root.toggleAttribute("data-flying", false);
    markDirty();
  }

  function frame(time) {
    scroller.raf(time);
    const now = performance.now();
    if (flight.isDone(now)) land();
    const y = window.scrollY;
    const intro = introAt(now);
    const rendered = dirty || y !== lastY || intro < 1 || flight.current !== null;
    if (rendered) {
      const next = JourneyMath.frameAt(y, timeline, { flight: flight.current, intro, now });
      flight.remember(next.pose);
      applyFrame(next, view);
      scene.render();
      lastY = y;
      dirty = false;
      if (!flight.current) focus.flush();
    }
    pointer.onFrame(rendered);
    raf = requestAnimationFrame(frame);
  }

  function onViewportResize() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(layout);
  }

  function dispose() {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(resizeFrame);
    resizeObserver?.disconnect();
    window.removeEventListener("resize", onViewportResize);
    window.visualViewport?.removeEventListener("resize", onViewportResize);
    pointer.dispose();
    focus.dispose();
    scroller.destroy();
  }

  try {
    layout();
    resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(screens.work.scroller);
    resizeObserver.observe(screens.nda.scroller);
    window.addEventListener("resize", onViewportResize);
    window.visualViewport?.addEventListener("resize", onViewportResize);
    dom.canvas.dataset.on = "";
    raf = requestAnimationFrame(frame);
  } catch (error) {
    dispose();
    throw error;
  }

  return { flyTo, dispose };
}
