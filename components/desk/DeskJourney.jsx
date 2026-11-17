import React from "react";
import Lenis from "lenis";

import { DeskJourney as Journey } from "../../domains/DeskJourney";
import { projects, sideProjects } from "../../data/projects";
import { books } from "../../data/books";
import { createDeskScene } from "./scene/createDeskScene";
import { setScreenFonts, toolsScreen, workScreen } from "./scene/screens";
import { Card, CtaRow, Hero, ProjectList, Root, Screen, Section, Stage } from "./DeskJourney.styles";

const EMAIL = "ammielgyanyawson@gmail.com";
const TOOL_NAMES = ["easel", "Pitstop", "Local Dictation"];
const tools = projects.filter((p) => TOOL_NAMES.includes(p.name));
const work = projects.filter((p) => !TOOL_NAMES.includes(p.name) && p.name !== "Portfolio");

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

function buildTimeline(scene, els, vh, aspect) {
  const { anchors } = scene;
  const portrait = aspect < 1;
  const top = (el) => el.offsetTop;
  const bottom = (el) => el.offsetTop + el.offsetHeight;

  const wide = portrait
    ? { position: [-0.5, 1.75, 3.5], target: [0.0, 1.02, 0] }
    : { position: [-1.28, 1.5, 2.1], target: [-0.62, 0.86, 0] };
  const wideIn = portrait
    ? { position: [-0.42, 1.65, 3.0], target: [0.0, 0.98, 0] }
    : { position: [-1.1, 1.4, 1.85], target: [-0.6, 0.86, 0] };
  const monitor = Journey.screenPose(anchors.monitor, scene.fov, aspect);
  const laptop = Journey.screenPose(anchors.laptop, scene.fov, aspect);
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
    ? { position: [0, 1.55, 3.6], target: [0, 0.95, 0] }
    : frameBeside([0, 1.25, 2.9], [0, 0.98, 0], aspect, 0.16);

  const k = (at, pose) => ({ at, ...pose });
  const keyframes = [
    k(0, wide),
    k(top(els.work) - vh * 1.1, wideIn),
    k(top(els.work) - vh * 0.2, monitor),
    k(bottom(els.work) - vh * 0.8, monitor),
    k(top(els.tools) - vh * 0.75, between),
    k(top(els.tools) - vh * 0.2, laptop),
    k(bottom(els.tools) - vh * 0.8, laptop),
    k(bottom(els.tools) - vh * 0.05, laptopOut),
    k(top(els.guides) + vh * 0.35, guides),
    k(bottom(els.guides) - vh * 1.1, guides),
    k(top(els.side) + vh * 0.35, controller),
    k(bottom(els.side) - vh * 1.1, controller),
    k(top(els.contact) + vh * 0.35, phone),
    k(top(els.contact) + vh * 1.0, phone),
    k(top(els.contact) + vh * 1.6, final),
  ];
  return {
    keyframes,
    heroFade: [vh * 0.25, vh * 0.85],
    phoneLit: [top(els.contact) - vh * 0.1, top(els.contact) + vh * 0.5],
    rise: [top(els.contact) + vh * 1.6, top(els.contact) + vh * 2.5],
  };
}

function ProjectRows({ items }) {
  return (
    <ProjectList>
      {items.map((item) => (
        <li key={item.name}>
          <div className="meta">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span className="tools">{item.tools.join(" · ")}</span>
            {item.link && (
              <a className="open" href={item.link} target="_blank" rel="noopener noreferrer">
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
  const heroRef = React.useRef(null);
  const refs = {
    work: React.useRef(null),
    tools: React.useRef(null),
    guides: React.useRef(null),
    side: React.useRef(null),
    contact: React.useRef(null),
  };

  React.useEffect(() => {
    const scene = createDeskScene(canvasRef.current, { coverSrcs: books.map((b) => b.coverSrc) });
    setScreenFonts(fonts);
    document.fonts.ready.then(async () => {
      const [workTex, toolsTex] = await Promise.all([workScreen(work), toolsScreen(tools)]);
      scene.setScreens({ work: workTex, tools: toolsTex });
      dirty = true;
    });

    let timeline = null;
    let dirty = true;
    const els = Object.fromEntries(Object.entries(refs).map(([key, ref]) => [key, ref.current]));

    function layout() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      scene.resize(w, h);
      timeline = buildTimeline(scene, els, h, w / h);
      dirty = true;
    }

    function update(scrollY) {
      scene.setPose(Journey.poseAt(scrollY, timeline.keyframes));
      scene.setPhoneLit(Journey.progress(scrollY, ...timeline.phoneLit));
      scene.setRise(Journey.smoothstep(Journey.progress(scrollY, ...timeline.rise)));
      heroRef.current.style.opacity = String(1 - Journey.progress(scrollY, timeline.heroFade[0], timeline.heroFade[1]));
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduceMotion ? null : new Lenis({ lerp: 0.09 });
    let raf = 0;
    function frame(time) {
      lenis?.raf(time);
      const y = window.scrollY;
      if (dirty || y !== frame.lastY) {
        update(y);
        scene.render();
        frame.lastY = y;
        dirty = false;
      }
      raf = requestAnimationFrame(frame);
    }

    layout();
    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(document.body);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      lenis?.destroy();
      scene.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guide = books[0];

  return (
    <Root>
      <Stage ref={canvasRef} aria-hidden="true" />
      <main>
        <Section $vh={210}>
          <Hero ref={heroRef}>
            <span className="label">Ammiel Yawson · Product engineer · Accra</span>
            <h1>This is where I build.</h1>
            <p>
              Products for founders, tools for building with AI, and guides on how I work. Scroll
              through the desk.
            </p>
            <span className="cue">Scroll ↓</span>
          </Hero>
        </Section>

        <Section ref={refs.work}>
          <Screen>
            <span className="label">01 · Work</span>
            <h2>Products I&apos;ve built</h2>
            <p className="intro">For clients and for myself, from security platforms to stores for social sellers in Ghana.</p>
            <ProjectRows items={work} />
          </Screen>
        </Section>

        <Section $vh={140} />

        <Section ref={refs.tools}>
          <Screen>
            <span className="label">02 · Tools</span>
            <h2>Tools for building with AI</h2>
            <p className="intro">Things I built because I needed them while working with coding agents.</p>
            <ProjectRows items={tools} />
          </Screen>
        </Section>

        <Section ref={refs.guides} $vh={260}>
          <Card>
            <div className="panel">
              <span className="label">03 · Guides</span>
              <h2>{guide.title}</h2>
              <p>{guide.description}</p>
              <CtaRow>
                <a className="primary" href={guide.link} target="_blank" rel="noopener noreferrer">
                  Get the PDF · {guide.price.toLowerCase()}
                </a>
                <a className="secondary" href={guide.blogLink} target="_blank" rel="noopener noreferrer">
                  Read it on the blog
                </a>
              </CtaRow>
            </div>
          </Card>
        </Section>

        <Section ref={refs.side} $vh={250}>
          <Card>
            <div className="panel">
              <span className="label">04 · Side projects</span>
              <h2>Games and small things</h2>
              <p>Built to learn something, or just for fun.</p>
              <ul>
                {sideProjects.map((p) => (
                  <li key={p.name}>
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      <span>{p.name}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Section>

        <Section ref={refs.contact} $vh={360}>
          <Card>
            <div className="panel">
              <span className="label">05 · Get in touch</span>
              <h2>Have a product to build?</h2>
              <p>Tell me what you&apos;re working on. I reply within a day.</p>
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
            </div>
          </Card>
        </Section>
      </main>
    </Root>
  );
}
