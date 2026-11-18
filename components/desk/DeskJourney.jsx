import React from "react";
import { createPortal } from "react-dom";

import { TAGLINE } from "../../data/site";
import { HERO_COPY, NDA_COPY, WORK_COPY } from "./deskContent";
import { FallbackRows } from "./FallbackRows";
import { LockScreen } from "./LockScreen";
import { ScreenUI } from "./ScreenUI";
import "./Card.styles";
import { Screen } from "./Fallback.styles";
import "./Nav.styles";
import { CssHost, DeskPageBackground, Hero, HoverTag, Root, Section, Stage } from "./DeskJourney.styles";
import { DeskCards } from "./DeskCards";
import { DeskNav } from "./DeskNav";
import { useDeskJourney, useJourneyRefs } from "./useDeskJourney";

/** The desk journey page: a 3D desk the camera travels across as you scroll, with a plain list as the fallback. */
export default function DeskJourney({ fonts }) {
  const refs = useJourneyRefs();
  const [screenEls] = React.useState(() => ({
    work: document.createElement("div"),
    nda: document.createElement("div"),
  }));
  const { status, loadProgress, flyTo } = useDeskJourney({ fonts, refs, screenEls });
  const { sections: sectionRefs, cards: cardRefs, scrollers: scrollerRefs } = refs;
  const unavailable = status === "unavailable";

  return (
    <Root ref={refs.root} data-no-webgl={unavailable || undefined}>
      <DeskPageBackground />
      <CssHost ref={refs.cssHost} />
      <Stage ref={refs.canvas} aria-hidden="true" />
      {!unavailable && createPortal(<ScreenUI {...WORK_COPY} scrollerRef={scrollerRefs.work} />, screenEls.work)}
      {!unavailable && createPortal(<LockScreen {...NDA_COPY} scrollerRef={scrollerRefs.nda} />, screenEls.nda)}
      <HoverTag ref={refs.hoverTag} hidden aria-hidden="true" />
      <DeskNav onJump={flyTo} />
      <main id="top">
        <Section $vh={160}>
          <Hero ref={refs.hero}>
            <span className="label">{TAGLINE}</span>
            <h1>{HERO_COPY.title}</h1>
            <p>{HERO_COPY.intro}</p>
            <span className="cue" data-loading={status === "loading" || undefined}>
              {unavailable && HERO_COPY.unavailable}
              {status === "loading" && (
                <>
                  {HERO_COPY.loading} <span aria-hidden="true">{Math.round(loadProgress * 100)}%</span>
                  <span className="bar" style={{ "--loaded": loadProgress }} aria-hidden="true" />
                </>
              )}
              {status === "ready" && HERO_COPY.ready}
            </span>
          </Hero>
        </Section>

        <Section ref={sectionRefs.work} id="work">
          <Screen className="fallback">
            <span className="label">{WORK_COPY.label}</span>
            <h2>{WORK_COPY.title}</h2>
            <p className="intro">{WORK_COPY.intro}</p>
            <FallbackRows items={WORK_COPY.items} />
          </Screen>
        </Section>

        <Section $vh={140} />

        <Section ref={sectionRefs.nda} id="nda">
          <Screen className="fallback">
            <span className="label">{NDA_COPY.label}</span>
            <h2>{NDA_COPY.title}</h2>
            <p className="intro">{NDA_COPY.intro}</p>
            <p className="note">{NDA_COPY.stack.join(" · ")}</p>
          </Screen>
        </Section>

        <DeskCards sectionRefs={sectionRefs} cardRefs={cardRefs} heightRef={refs.height} />
      </main>
    </Root>
  );
}
