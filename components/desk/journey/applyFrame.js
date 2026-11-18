import { revealCard, revealScreen } from "./reveal";

/**
 * Writes one frame to the scene and the page. `view` holds the scene, the DOM nodes and what was measured at layout:
 * screens[key] = { element, scroller, measured }, cards[key] = { el, parts }.
 */
export function applyFrame(frame, view) {
  const { scene, root, cssHost, hero, height, screens, cards, reduceMotion } = view;
  scene.setPose(frame.pose);
  scene.setPower(frame.power);
  cssHost.style.opacity = String(frame.power);
  screens.work.element.inert = frame.active !== "work";
  screens.nda.element.inert = frame.active !== "nda";
  root.toggleAttribute("data-on-screen", frame.active === "work");
  Object.entries(frame.screens).forEach(([key, { offset, arrival }]) => {
    const { scroller, measured } = screens[key];
    scroller.style.transform = `translateY(${-offset}px)`;
    if (!scroller.isConnected) return;
    revealScreen(measured, offset, arrival, reduceMotion);
  });
  scene.setPhoneLit(frame.phoneLit);
  scene.setRise(frame.rise);
  height.textContent = `Desk height ${frame.heightCm} cm`;
  hero.style.opacity = String(frame.heroOpacity);
  frame.cards.forEach(({ key, shown, opacity, inert }) => {
    const card = cards[key];
    card.el.style.opacity = String(opacity);
    card.el.inert = inert;
    revealCard(card.parts, shown, reduceMotion);
  });
}
