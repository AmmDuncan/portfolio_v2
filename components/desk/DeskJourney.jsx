import React from "react";
import { createPortal } from "react-dom";
import Lenis from "lenis";

import { DeskJourney as Journey } from "../../domains/DeskJourney";
import { projects, sideProjects } from "../../data/projects";
import { books } from "../../data/books";
import { createDeskScene, loadDeskModels } from "./scene/createDeskScene";
import { setScreenFonts } from "./scene/screens";
import { LockScreen, makeScreenElement, SCREEN_SIZES, ScreenUI } from "./ScreenUI";
import { Card, CssHost, CtaRow, Hero, HoverTag, Nav, ProjectList, Root, Screen, Section, Stage } from "./DeskJourney.styles";

const EMAIL = "ammielgyanyawson@gmail.com";
const work = projects.filter((p) => p.name !== "Portfolio");
const guide = books[0];
const SECTIONS = [
  { key: "work", label: "Work" },
  { key: "nda", label: "Under NDA" },
  { key: "guides", label: "Guides" },
  { key: "side", label: "Side projects" },
  { key: "contact", label: "Contact" },
];
const SECTION_LABEL = Object.fromEntries(SECTIONS.map(({ key, label }) => [key, label]));
const SCREEN_COPY = {
  work: {
    path: "~/work",
    label: "01 · Work",
    title: "Products I've built",
    intro: "For clients and for myself, from security platforms to stores for social sellers in Ghana.",
    items: work,
  },
};
const NDA_COPY = {
  label: "02 · Under NDA",
  title: "10 platforms I can't show",
  intro: "Client work from 2023 to 2026 that I can't name or show. Frontend, plus backend where the project needed it.",
  stack: ["Nuxt", "Vue", "TypeScript", "TanStack Query", "Tailwind CSS", "Django"],
  contactHref: `mailto:${EMAIL}`,
};

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

function lookFrom(point, offset, distance) {
  return { position: point.map((v, i) => v + offset[i] * distance), target: point };
}

/** Sizes a device screen so one CSS pixel lands on one viewport pixel once the camera has pushed in, keeping text crisp. */
function screenFit(anchor, fov, aspect, viewportWidth) {
  const pose = Journey.screenPose(anchor, fov, aspect);
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

function buildTimeline(scene, els, screens, vh, vw) {
  const aspect = vw / vh;
  const { anchors } = scene;
  const portrait = aspect < 1;
  const top = (el) => el.offsetTop;
  const bottom = (el) => el.offsetTop + el.offsetHeight;

  const fits = {
    work: screenFit(anchors.monitor, scene.fov, aspect, vw),
    nda: screenFit(anchors.laptop, scene.fov, aspect, vw),
  };
  const hold = vh * 0.3;
  const scrolls = {};
  Object.entries(fits).forEach(([key, fit]) => {
    const { element, scroller } = screens[key];
    element.dataset.width = String(fit.width);
    element.style.width = `${fit.width}px`;
    element.style.height = `${fit.height}px`;
    element.style.setProperty("--col", `${Math.round(fit.columnPx)}px`);
    element.toggleAttribute("data-narrow", fit.columnPx < 760);
    const viewportHeight = fit.height - 44;
    const scrollable = Math.max(0, scroller.offsetHeight - viewportHeight * 0.9);
    els[key].style.height = `${Math.round(hold * 2 + scrollable)}px`;
    scrolls[key] = { scroller, scrollable, start: () => top(els[key]) + hold, end: () => bottom(els[key]) - hold };
  });

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
    guides: top(els.guides) + vh * 0.7,
    side: top(els.side) - vh * 0.15,
    contact: top(els.contact) - vh * 0.15,
  };
  const k = (at, pose) => ({ at, ...pose });
  const keyframes = [
    k(0, wide),
    k(top(els.work) - vh * 1.3, wideIn),
    k(top(els.work), fits.work.pose),
    k(bottom(els.work), fits.work.pose),
    k(top(els.nda) - vh * 0.7, between),
    k(top(els.nda), fits.nda.pose),
    k(bottom(els.nda), fits.nda.pose),
    k(top(els.guides) + vh * 0.25, laptopOut),
    k(arrive.guides, guides),
    k(bottom(els.guides) - vh * 0.95, guides),
    k(arrive.side, controller),
    k(bottom(els.side) - vh * 0.95, controller),
    k(arrive.contact, phone),
    k(top(els.contact) + vh * 1.0, phone),
    k(top(els.contact) + vh * 1.6, final),
  ];
  return {
    keyframes,
    scrolls,
    heroFade: [vh * 0.25, vh * 0.85],
    cards: [
      { key: "guides", range: [arrive.guides - vh * 0.3, arrive.guides] },
      { key: "side", range: [arrive.side - vh * 0.5, arrive.side - vh * 0.1] },
      { key: "contact", range: [arrive.contact - vh * 0.5, arrive.contact - vh * 0.1] },
    ],
    phoneLit: [top(els.contact) - vh * 0.1, top(els.contact) + vh * 0.5],
    rise: [top(els.contact) + vh * 1.6, top(els.contact) + vh * 2.5],
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
      guides: [arrive.guides, bottom(els.guides)],
      side: [arrive.side, bottom(els.side)],
      contact: [arrive.contact, bottom(els.contact)],
    },
  };
}

function FallbackRows({ items }) {
  return (
    <ProjectList>
      {items.map((item) => (
        <li key={item.name}>
          <div className="meta">
            {item.year && <span className="tools">{item.year}</span>}
            <h3>{item.name}</h3>
            {item.note && <span className="tools">{item.note}</span>}
            <p>{item.description}</p>
            {item.link && (
              <a className="open" href={item.link}>
                Open {item.name}
              </a>
            )}
          </div>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imgSrc} alt={`${item.name} screenshot`} loading="lazy" />
          </figure>
        </li>
      ))}
    </ProjectList>
  );
}

export default function DeskJourney({ fonts }) {
  const canvasRef = React.useRef(null);
  const cssHostRef = React.useRef(null);
  const heroRef = React.useRef(null);
  const heightRef = React.useRef(null);
  const hoverRef = React.useRef(null);
  const lenisRef = React.useRef(null);
  const timelineRef = React.useRef(null);
  const scrollerRefs = { work: React.useRef(null), nda: React.useRef(null) };
  const [screenEls] = React.useState(() => ({
    work: makeScreenElement(SCREEN_SIZES.monitor),
    nda: makeScreenElement(SCREEN_SIZES.laptop),
  }));
  const [noWebGL, setNoWebGL] = React.useState(false);
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
    loadDeskModels()
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
      setScreenFonts(fonts);
      const els = Object.fromEntries(Object.entries(refs).map(([key, ref]) => [key, ref.current]));
      const screens = {
        work: { element: screenEls.work, scroller: scrollerRefs.work.current },
        nda: { element: screenEls.nda, scroller: scrollerRefs.nda.current },
      };
      let dirty = true;
      const pointer = { x: 0, y: 0, moved: false, mouse: false };

      function layout() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        scene.resize(w, h);
        timelineRef.current = buildTimeline(scene, els, screens, h, w);
        dirty = true;
      }

      function update(scrollY) {
        const timeline = timelineRef.current;
        scene.setPose(Journey.poseAt(scrollY, timeline.keyframes));
        Object.values(timeline.scrolls).forEach(({ scroller, scrollable, start, end }) => {
          const offset = scrollable * Journey.progress(scrollY, start(), end());
          scroller.style.transform = `translateY(${-offset}px)`;
        });
        scene.setPhoneLit(Journey.progress(scrollY, ...timeline.phoneLit));
        const rise = Journey.smoothstep(Journey.progress(scrollY, ...timeline.rise));
        scene.setRise(rise);
        heightRef.current.textContent = `Desk height ${Math.round(74 + (112 - 74) * rise)} cm`;
        heroRef.current.style.opacity = String(1 - Journey.progress(scrollY, ...timeline.heroFade));
        timeline.cards.forEach(({ key, range }) => {
          cardRefs[key].current.style.opacity = String(Journey.progress(scrollY, ...range));
        });
      }

      function activeSection(scrollY) {
        const { ranges } = timelineRef.current;
        return Object.keys(ranges).find((key) => scrollY >= ranges[key][0] && scrollY <= ranges[key][1]);
      }

      function updateHover() {
        const key = scene.pick(pointer.x, pointer.y, window.innerWidth, window.innerHeight);
        const target = key && key !== activeSection(window.scrollY) ? key : null;
        document.body.style.cursor = target ? "pointer" : "";
        const tag = hoverRef.current;
        tag.hidden = !target;
        if (target) {
          tag.textContent = `${SECTION_LABEL[target]} →`;
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
        scrollToY(timelineRef.current.jumps[key]);
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lenis = reduceMotion ? null : new Lenis({ lerp: 0.09 });
      lenisRef.current = lenis;
      let raf = 0;
      let lastY = -1;
      function frame(time) {
        lenis?.raf(time);
        const y = window.scrollY;
        if (dirty || y !== lastY) {
          update(y);
          scene.render();
          lastY = y;
          dirty = false;
          pointer.moved = true;
        }
        if (pointer.moved && pointer.mouse) {
          updateHover();
          pointer.moved = false;
        }
        raf = requestAnimationFrame(frame);
      }

      layout();
      const resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(document.documentElement);
      resizeObserver.observe(screens.work.scroller);
      resizeObserver.observe(screens.nda.scroller);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("click", onClick);
      raf = requestAnimationFrame(frame);

      return () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("click", onClick);
        document.body.style.cursor = "";
        lenis?.destroy();
        scene.dispose();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollToY(y) {
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.8 });
    else window.scrollTo(0, y);
  }

  function jumpTo(key) {
    return (event) => {
      event.preventDefault();
      const timeline = timelineRef.current;
      scrollToY(timeline ? timeline.jumps[key] : refs[key]?.current?.offsetTop ?? 0);
    };
  }

  return (
    <Root data-no-webgl={noWebGL || undefined}>
      <CssHost ref={cssHostRef} />
      <Stage ref={canvasRef} aria-hidden="true" />
      {!noWebGL && createPortal(<ScreenUI {...SCREEN_COPY.work} scrollerRef={scrollerRefs.work} />, screenEls.work)}
      {!noWebGL && createPortal(<LockScreen {...NDA_COPY} scrollerRef={scrollerRefs.nda} />, screenEls.nda)}
      <HoverTag ref={hoverRef} hidden aria-hidden="true" />
      <Nav aria-label="Sections">
        <a className="name" href="#top" onClick={jumpTo("top")}>
          Ammiel Yawson
        </a>
        <ul>
          {SECTIONS.map(({ key, label }) => (
            <li key={key}>
              <a href={`#${key}`} onClick={jumpTo(key)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a className="email" href={`mailto:${EMAIL}`}>
          Email me
        </a>
      </Nav>
      <main id="top">
        <Section $vh={210}>
          <Hero ref={heroRef}>
            <span className="label">Product engineer in Accra</span>
            <h1>This is where I build.</h1>
            <p>Products for founders and teams, and guides on how I work.</p>
            <span className="cue">Scroll, or click anything on the desk</span>
          </Hero>
        </Section>

        <Section ref={refs.work} id="work">
          {noWebGL && (
            <Screen>
              <span className="label">{SCREEN_COPY.work.label}</span>
              <h2>{SCREEN_COPY.work.title}</h2>
              <p className="intro">{SCREEN_COPY.work.intro}</p>
              <FallbackRows items={work} />
            </Screen>
          )}
        </Section>

        <Section $vh={140} />

        <Section ref={refs.nda} id="nda">
          {noWebGL && (
            <Screen>
              <span className="label">{NDA_COPY.label}</span>
              <h2>{NDA_COPY.title}</h2>
              <p className="intro">{NDA_COPY.intro}</p>
              <p className="note">{NDA_COPY.stack.join(" · ")}</p>
            </Screen>
          )}
        </Section>

        <Section ref={refs.guides} id="guides" $vh={260}>
          <Card ref={cardRefs.guides}>
            <div className="panel">
              <span className="label">03 · Guides</span>
              <h2>{guide?.title}</h2>
              <p>{guide?.description}</p>
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
              {guide?.price && <p className="note">{guide.price}</p>}
            </div>
          </Card>
        </Section>

        <Section ref={refs.side} id="side" $vh={220}>
          <Card ref={cardRefs.side}>
            <div className="panel">
              <span className="label">04 · Side projects</span>
              <h2>Side projects</h2>
              <p>Smaller things I built to learn, or for fun.</p>
              <ul>
                {sideProjects.map((p) => (
                  <li key={p.name}>
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      <span className="name">
                        {p.name}
                        <small>{p.description}</small>
                      </span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Section>

        <Section ref={refs.contact} id="contact" $vh={360}>
          <Card ref={cardRefs.contact}>
            <div className="panel">
              <span className="label">05 · Contact</span>
              <h2>Have a product to build?</h2>
              <p>Tell me what you&apos;re working on.</p>
              <CtaRow>
                <a className="primary" href={`mailto:${EMAIL}`}>
                  Email me
                </a>
                <a className="secondary" href="https://github.com/AmmDuncan" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a className="secondary" href="https://blog.ammielyawson.com" target="_blank" rel="noopener noreferrer">
                  Blog
                </a>
              </CtaRow>
              <p className="note" ref={heightRef} aria-hidden="true">
                Desk height 74 cm
              </p>
            </div>
          </Card>
        </Section>
      </main>
    </Root>
  );
}
