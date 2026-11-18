import React from "react";
import { createPortal } from "react-dom";
import Lenis from "lenis";

import { DeskJourney as JourneyMath } from "../../domains/DeskJourney";
import { LogoPurple } from "../../assets";
import { sideProjects, thumbSrc } from "../../data/projects";
import { books } from "../../data/books";
import { BLOG_URL, EMAIL, GITHUB_URL } from "../../data/site";
import { createDeskScene, loadDeskModels } from "./scene/createDeskScene";
import { setScreenFonts } from "./scene/screens";
import { HOVER_LABEL, MODEL_CREDIT, NDA_COPY, SCREEN_COPY, SECTIONS } from "./deskContent";
import { FallbackRows } from "./FallbackRows";
import { LockScreen } from "./LockScreen";
import { makeScreenElement, SCREEN_SIZES, ScreenUI } from "./ScreenUI";
import { buildTimeline } from "./timeline";
import { Card, CtaRow } from "./Card.styles";
import { Screen } from "./Fallback.styles";
import { Nav } from "./Nav.styles";
import { CssHost, Hero, HoverTag, Root, Section, Stage } from "./DeskJourney.styles";
const guide = books[0];
const INTRO_MS = 2600;

const FIGURE_ENTRY = { rise: 60, scale: 0.06, blur: 8 };
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

export default function DeskJourney({ fonts }) {
  const rootRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const cssHostRef = React.useRef(null);
  const heroRef = React.useRef(null);
  const heightRef = React.useRef(null);
  const hoverRef = React.useRef(null);
  const flyRef = React.useRef(null);
  const timelineRef = React.useRef(null);
  const scrollerRefs = { work: React.useRef(null), nda: React.useRef(null) };
  const [screenEls] = React.useState(() => ({
    work: makeScreenElement(SCREEN_SIZES.monitor),
    nda: makeScreenElement(SCREEN_SIZES.laptop),
  }));
  const [noWebGL, setNoWebGL] = React.useState(false);
  const [loaded, setLoaded] = React.useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navRef = React.useRef(null);
  const menuButtonRef = React.useRef(null);
  const refs = {
    work: React.useRef(null),
    nda: React.useRef(null),
    guides: React.useRef(null),
    side: React.useRef(null),
    contact: React.useRef(null),
  };
  const cardRefs = { guides: React.useRef(null), side: React.useRef(null), contact: React.useRef(null) };

  React.useEffect(() => {
    let cancelled = false;
    let stop = null;
    loadDeskModels((fraction) => !cancelled && setLoaded(Math.floor(fraction * 100) / 100))
      .then((models) => {
        if (!cancelled) stop = startJourney(models);
      })
      .catch((error) => {
        console.error(error);
        setNoWebGL(true);
      });
    return () => {
      cancelled = true;
      stop?.();
    };

    function startJourney(models) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const introStart = performance.now();
      const playIntro = !reduceMotion && window.scrollY < window.innerHeight * 0.1;
      const introProgress = () => (playIntro ? Math.min(1, (performance.now() - introStart) / INTRO_MS) : 1);
      setScreenFonts(fonts);
      let scene = null;
      try {
        scene = createDeskScene(canvasRef.current, {
          coverSrcs: books.map((b) => b.coverSrc),
          cssHost: cssHostRef.current,
          screenElements: { monitor: screenEls.work, laptop: screenEls.nda },
          models,
        });
      } catch {
        setNoWebGL(true);
        return null;
      }
      const els = Object.fromEntries(Object.entries(refs).map(([key, ref]) => [key, ref.current]));
      const screens = {
        work: { element: screenEls.work, scroller: scrollerRefs.work.current },
        nda: { element: screenEls.nda, scroller: scrollerRefs.nda.current },
      };
      let dirty = true;
      const pointer = { x: 0, y: 0, moved: false, mouse: false };
      const lenis = reduceMotion ? null : new Lenis({ lerp: 0.09 });
      let flight = null;
      let lastPose = null;
      let pendingFocus = null;
      const flightProgress = () => Math.min(1, (performance.now() - flight.start) / flight.duration);

      function layout() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        scene.resize(w, h);
        timelineRef.current = buildTimeline(scene, els, screens, h, w);
        dirty = true;
      }

      function update(scrollY) {
        const timeline = timelineRef.current;
        const intro = introProgress();
        let pose = JourneyMath.poseAt(scrollY, timeline.keyframes);
        if (flight) pose = JourneyMath.flightPose(flight.from, flight.to, flightProgress());
        else if (intro < 1) pose = JourneyMath.blendPose(timeline.introPose, pose, JourneyMath.easeOutCubic(intro));
        scene.setPose(pose);
        lastPose = pose;
        const power = JourneyMath.smoothstep(JourneyMath.progress(intro, 0.3, 0.75));
        scene.setPower(power);
        cssHostRef.current.style.opacity = String(power);
        const contentY = flight ? flight.y : scrollY;
        const travel = (value) =>
          flight ? JourneyMath.lerp(value(flight.fromY), value(flight.y), JourneyMath.smoothstep(flightProgress())) : value(scrollY);
        const active = flight ? null : activeSection(contentY);
        screenEls.work.inert = active !== "work";
        screenEls.nda.inert = active !== "nda";
        rootRef.current.toggleAttribute("data-on-screen", active === "work");
        Object.entries(timeline.scrolls).forEach(([key, screen]) => {
          const back = screen.reset ? JourneyMath.smoothstep(JourneyMath.progress(contentY, ...screen.reset)) : 0;
          const offset = screen.scrollable * JourneyMath.progress(contentY, screen.start(), screen.end()) * (1 - back);
          screen.scroller.style.transform = `translateY(${-offset}px)`;
          if (!screen.scroller.isConnected) return;
          revealScreen(screen, offset, JourneyMath.progress(contentY, ...timeline.screenArrivals[key]));
        });
        scene.setPhoneLit(travel((y) => JourneyMath.progress(y, ...timeline.phoneLit)));
        const rise = travel((y) => JourneyMath.smoothstep(JourneyMath.progress(y, ...timeline.rise)));
        scene.setRise(rise);
        heightRef.current.textContent = `Desk height ${Math.round(74 + (112 - 74) * rise)} cm`;
        heroRef.current.style.opacity = String(1 - JourneyMath.progress(contentY, ...timeline.heroFade));
        timeline.cards.forEach(({ key, range }) => {
          const shown = JourneyMath.progress(contentY, ...range);
          const card = cardRefs[key].current;
          card.style.opacity = String(Math.min(1, shown * 3));
          card.inert = flight !== null || shown < 0.34;
          const parts = [...card.querySelectorAll(".panel > :not(ul), .panel li")];
          parts.forEach((el, i) =>
            enter(el, JourneyMath.stagger(shown, i, parts.length, 0.5), { rise: 16, fadeOnly: reduceMotion }),
          );
        });
      }

      /** Scroll-scrubbed entrance for a device screen: heading as the camera arrives, then each row as it rises into view. */
      function revealScreen({ scroller, viewportHeight }, offset, arrival) {
        const head = [...scroller.children].filter((el) => el.tagName !== "OL");
        head.forEach((el, i) =>
          enter(el, JourneyMath.stagger(arrival, i, head.length), { rise: 24, fadeOnly: reduceMotion }),
        );
        const glow = scroller.parentElement.querySelector(".glow");
        if (glow) glow.style.opacity = String(1 - arrival * 0.85);
        const rowsOpen = JourneyMath.progress(arrival, 0.5, 1);
        scroller.querySelectorAll("[data-reveal]").forEach((row) => {
          const top = row.offsetTop - offset;
          const t = Math.min(rowsOpen, JourneyMath.progress(viewportHeight - top, 0, viewportHeight * 0.45));
          const parts = [row.querySelector("figure"), ...row.querySelector(".meta").children];
          parts.forEach((el, i) =>
            enter(
              el,
              JourneyMath.stagger(t, i, parts.length),
              i === 0 ? { ...FIGURE_ENTRY, fadeOnly: reduceMotion } : { rise: 24, fadeOnly: reduceMotion },
            ),
          );
          const focus = 1 - JourneyMath.progress(Math.abs(top + row.offsetHeight / 2 - viewportHeight / 2), 0, viewportHeight * 0.6);
          row.style.setProperty("--focus", String(focus));
        });
      }

      /** After a jump, moves keyboard focus to the section's heading so the next Tab lands inside it. */
      function focusSection(key) {
        pendingFocus = null;
        const container = key in screenEls ? screenEls[key] : cardRefs[key]?.current;
        const heading = container?.querySelector("h2");
        if (!heading) return;
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }

      /** Keyboard focus inside a screen scrolls the page until the focused row sits mid-screen, where it is revealed. */
      function onScreenFocus(event) {
        const key = event.currentTarget === screenEls.work ? "work" : "nda";
        const viewport = event.target.closest(".viewport");
        if (viewport) requestAnimationFrame(() => (viewport.scrollTop = 0));
        const row = event.target.closest("[data-reveal]");
        const screen = timelineRef.current?.scrolls[key];
        if (!row || !screen?.scrollable) return;
        const wanted = row.offsetTop + row.offsetHeight / 2 - screen.viewportHeight / 2;
        const share = Math.min(1, Math.max(0, wanted / screen.scrollable));
        const y = screen.start() + share * (screen.end() - screen.start());
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
        dirty = true;
      }

      function activeSection(scrollY) {
        return JourneyMath.activeSectionAt(scrollY, timelineRef.current.ranges);
      }

      function updateHover() {
        const overUi = document.elementFromPoint(pointer.x, pointer.y)?.closest("a, button, nav, .panel");
        const key = overUi ? null : scene.pick(pointer.x, pointer.y, window.innerWidth, window.innerHeight);
        const target = key && key !== activeSection(window.scrollY) ? key : null;
        document.body.style.cursor = target ? "pointer" : "";
        const tag = hoverRef.current;
        tag.hidden = !target;
        if (target) {
          tag.textContent = `${HOVER_LABEL[target]} →`;
          tag.style.transform = `translate(${pointer.x + 16}px, ${pointer.y + 16}px)`;
        }
      }

      function onPointerMove(event) {
        pointer.mouse = event.pointerType === "mouse";
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.moved = true;
      }

      function onClick(event) {
        if (event.target.closest("a, button, nav, .panel")) return;
        const key = scene.pick(event.clientX, event.clientY, window.innerWidth, window.innerHeight);
        if (!key || key === activeSection(window.scrollY)) return;
        flyTo(timelineRef.current.jumps[key], key);
      }

      /** Flies the camera straight to the pose at scroll position y, then moves the page there. */
      function flyTo(y, focusKey = null) {
        pendingFocus = focusKey;
        if (!lenis || !lastPose || flight) {
          window.scrollTo(0, y);
          dirty = true;
          return;
        }
        const to = JourneyMath.poseAt(y, timelineRef.current.keyframes);
        const distance = Math.hypot(...to.position.map((v, i) => v - lastPose.position[i]));
        const duration = JourneyMath.flightDuration(distance);
        flight = { from: lastPose, to, y, fromY: window.scrollY, start: performance.now(), duration };
        lenis.stop();
        rootRef.current.toggleAttribute("data-flying", true);
        hoverRef.current.hidden = true;
      }

      function land() {
        const { y } = flight;
        flight = null;
        lenis.start();
        lenis.scrollTo(y, { immediate: true, force: true });
        rootRef.current.toggleAttribute("data-flying", false);
        dirty = true;
      }

      flyRef.current = flyTo;
      let raf = 0;
      let lastY = -1;
      function frame(time) {
        lenis?.raf(time);
        if (flight && flightProgress() >= 1) land();
        const y = window.scrollY;
        if (dirty || y !== lastY || introProgress() < 1 || flight) {
          update(y);
          scene.render();
          lastY = y;
          dirty = false;
          pointer.moved = true;
          if (pendingFocus && !flight) focusSection(pendingFocus);
        }
        if (pointer.moved && pointer.mouse && !flight) {
          updateHover();
          pointer.moved = false;
        }
        raf = requestAnimationFrame(frame);
      }

      layout();
      canvasRef.current.dataset.on = "";
      const resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(document.documentElement);
      resizeObserver.observe(screens.work.scroller);
      resizeObserver.observe(screens.nda.scroller);
      let resizeFrame = 0;
      const onViewportResize = () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(layout);
      };
      window.addEventListener("resize", onViewportResize);
      window.visualViewport?.addEventListener("resize", onViewportResize);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("click", onClick);
      screenEls.work.addEventListener("focusin", onScreenFocus);
      screenEls.nda.addEventListener("focusin", onScreenFocus);
      raf = requestAnimationFrame(frame);

      return () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        cancelAnimationFrame(resizeFrame);
        window.removeEventListener("resize", onViewportResize);
        window.visualViewport?.removeEventListener("resize", onViewportResize);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("click", onClick);
        screenEls.work.removeEventListener("focusin", onScreenFocus);
        screenEls.nda.removeEventListener("focusin", onScreenFocus);
        document.body.style.cursor = "";
        flyRef.current = null;
        lenis?.destroy();
        scene.dispose();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function jumpTo(key) {
    return (event) => {
      event.preventDefault();
      setMenuOpen(false);
      const timeline = timelineRef.current;
      const y = timeline ? timeline.jumps[key] : refs[key]?.current?.offsetTop ?? 0;
      if (flyRef.current) flyRef.current(y, key === "top" ? null : key);
      else window.scrollTo(0, y);
    };
  }

  return (
    <Root ref={rootRef} data-no-webgl={noWebGL || undefined}>
      <CssHost ref={cssHostRef} />
      <Stage ref={canvasRef} aria-hidden="true" />
      {!noWebGL && createPortal(<ScreenUI {...SCREEN_COPY.work} scrollerRef={scrollerRefs.work} />, screenEls.work)}
      {!noWebGL && createPortal(<LockScreen {...NDA_COPY} scrollerRef={scrollerRefs.nda} />, screenEls.nda)}
      <HoverTag ref={hoverRef} hidden aria-hidden="true" />
      <Nav aria-label="Sections" ref={navRef} data-open={menuOpen || undefined}>
        <a className="name" href="#top" onClick={jumpTo("top")}>
          <LogoPurple width={24} height={24} viewBox="0 0 48 48" aria-hidden="true" />
          Ammiel Yawson
        </a>
        <button
          ref={menuButtonRef}
          type="button"
          className="sections"
          aria-expanded={menuOpen}
          aria-controls="desk-sections"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Sections
        </button>
        <ul id="desk-sections">
          {SECTIONS.map(({ key, label }) => (
            <li key={key}>
              <a href={`#${key}`} onClick={jumpTo(key)}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href={BLOG_URL} target="_blank" rel="noopener noreferrer">
              Blog ↗
            </a>
          </li>
        </ul>
        <a className="email" href={`mailto:${EMAIL}`}>
          Email me
        </a>
      </Nav>
      <main id="top">
        <Section $vh={160}>
          <Hero ref={heroRef}>
            <span className="label">Product engineer in Accra</span>
            <h1>This is where I build.</h1>
            <p>Products for founders and teams, and guides on how I work.</p>
            <span className="cue" data-loading={(!noWebGL && loaded < 1) || undefined}>
              {noWebGL && "The 3D desk couldn't load, so here's the list."}
              {!noWebGL && loaded < 1 && (
                <>
                  Setting up the desk <span aria-hidden="true">{Math.round(loaded * 100)}%</span>
                  <span className="bar" style={{ "--loaded": loaded }} aria-hidden="true" />
                </>
              )}
              {!noWebGL && loaded >= 1 && "Scroll, or click an object on the desk"}
            </span>
          </Hero>
        </Section>

        <Section ref={refs.work} id="work">
          <Screen className="fallback">
              <span className="label">{SCREEN_COPY.work.label}</span>
              <h2>{SCREEN_COPY.work.title}</h2>
              <p className="intro">{SCREEN_COPY.work.intro}</p>
              <FallbackRows items={SCREEN_COPY.work.items} />
          </Screen>
        </Section>

        <Section $vh={140} />

        <Section ref={refs.nda} id="nda">
          <Screen className="fallback">
              <span className="label">{NDA_COPY.label}</span>
              <h2>{NDA_COPY.title}</h2>
              <p className="intro">{NDA_COPY.intro}</p>
              <p className="note">{NDA_COPY.stack.join(" · ")}</p>
          </Screen>
        </Section>

        <Section ref={refs.guides} id="guides" $vh={220}>
          <Card ref={cardRefs.guides}>
            <div className="panel">
              <span className="label">03 · Guides</span>
              <h2>{guide?.title}</h2>
              <p>{guide?.description}</p>
              {guide?.price && <p className="note price">{guide.price}</p>}
              {guide && (
                <CtaRow>
                  <a className="primary" href={guide.link} target="_blank" rel="noopener noreferrer">
                    Get the PDF
                  </a>
                  <a className="secondary" href={guide.blogLink} target="_blank" rel="noopener noreferrer">
                    Read it on the blog
                  </a>
                </CtaRow>
              )}
            </div>
          </Card>
        </Section>

        <Section ref={refs.side} id="side" $vh={170}>
          <Card ref={cardRefs.side}>
            <div className="panel">
              <span className="label">04 · Side projects</span>
              <h2>Side projects</h2>
              <p>Smaller things I built to learn, or for fun.</p>
              <ul>
                {sideProjects.map((p) => (
                  <li key={p.name}>
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="thumb" src={thumbSrc(p.imgSrc)} alt="" width={60} height={38} loading="lazy" />
                      <span className="name">
                        {p.name}
                        <small>{p.summary ?? p.description}</small>
                      </span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Section>

        <Section ref={refs.contact} id="contact" $vh={300}>
          <Card ref={cardRefs.contact}>
            <div className="panel">
              <span className="label">05 · Contact</span>
              <h2>Have a product to build?</h2>
              <p>Tell me what you&apos;re working on.</p>
              <CtaRow>
                <a className="primary" href={`mailto:${EMAIL}`}>
                  Email me
                </a>
                <a className="secondary" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a className="secondary" href={BLOG_URL} target="_blank" rel="noopener noreferrer">
                  Blog
                </a>
              </CtaRow>
              <p className="note" ref={heightRef} aria-hidden="true">
                Desk height 74 cm
              </p>
              <p className="credit">
                Controller model:{" "}
                <a href={MODEL_CREDIT.source} target="_blank" rel="noopener noreferrer">
                  {MODEL_CREDIT.title}
                </a>{" "}
                by {MODEL_CREDIT.author},{" "}
                <a href={MODEL_CREDIT.license} target="_blank" rel="noopener noreferrer">
                  CC BY 4.0
                </a>
                , recoloured.
              </p>
            </div>
          </Card>
        </Section>
      </main>
    </Root>
  );
}
