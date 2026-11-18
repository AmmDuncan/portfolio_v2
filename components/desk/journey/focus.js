/** Keyboard focus for the journey: lands on a section's heading after a jump, and follows Tab inside a screen. */
export function createFocus({ screenEls, cardEls, getTimeline, scroller, onScroll }) {
  let pending = null;

  function focusSection(key) {
    pending = null;
    const container = key in screenEls ? screenEls[key] : cardEls[key];
    const heading = container?.querySelector("h2");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }

  /** Scrolls the page until the focused row sits mid-screen, where it is revealed. */
  function onScreenFocus(event) {
    const key = event.currentTarget === screenEls.work ? "work" : "nda";
    const viewport = event.target.closest(".viewport");
    if (viewport) requestAnimationFrame(() => (viewport.scrollTop = 0));
    const row = event.target.closest("[data-reveal]");
    const screen = getTimeline()?.scrolls[key];
    if (!row || !screen?.scrollable) return;
    const wanted = row.offsetTop + row.offsetHeight / 2 - screen.viewportHeight / 2;
    const share = Math.min(1, Math.max(0, wanted / screen.scrollable));
    scroller.jump(screen.start + share * (screen.end - screen.start));
    onScroll();
  }

  screenEls.work.addEventListener("focusin", onScreenFocus);
  screenEls.nda.addEventListener("focusin", onScreenFocus);

  return {
    request(key) {
      pending = key;
    },
    flush() {
      if (pending) focusSection(pending);
    },
    dispose() {
      screenEls.work.removeEventListener("focusin", onScreenFocus);
      screenEls.nda.removeEventListener("focusin", onScreenFocus);
    },
  };
}
