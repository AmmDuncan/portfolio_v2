import React from "react";
import { createPortal } from "react-dom";

import { NDA_COPY, SCREEN_COPY } from "./deskContent";
import { DeskCards } from "./DeskCards";
import { DeskNav } from "./DeskNav";
import { FallbackRows } from "./FallbackRows";
import { LockScreen } from "./LockScreen";
import { makeScreenElement, SCREEN_SIZES, ScreenUI } from "./ScreenUI";
import { useDeskJourney, useJourneyRefs } from "./useDeskJourney";
import { Screen } from "./Fallback.styles";
import { CssHost, Hero, HoverTag, Root, Section, Stage } from "./DeskJourney.styles";

/** The desk journey page: a 3D desk the camera travels across as you scroll, with a plain list as the fallback. */
export default function DeskJourney({ fonts }) {
  const refs = useJourneyRefs();
  const [screenEls] = React.useState(() => ({
    work: makeScreenElement(SCREEN_SIZES.monitor),
    nda: makeScreenElement(SCREEN_SIZES.laptop),
  }));
  const { status, loadProgress, flyTo } = useDeskJourney({ fonts, refs, screenEls });
  const { sections: sectionRefs, cards: cardRefs, scrollers: scrollerRefs } = refs;
  const unavailable = status === "unavailable";

  return (
    <Root ref={refs.root} data-no-webgl={unavailable || undefined}>
      <CssHost ref={refs.cssHost} />
      <Stage ref={refs.canvas} aria-hidden="true" />
      {!unavailable && createPortal(<ScreenUI {...SCREEN_COPY.work} scrollerRef={scrollerRefs.work} />, screenEls.work)}
      {!unavailable && createPortal(<LockScreen {...NDA_COPY} scrollerRef={scrollerRefs.nda} />, screenEls.nda)}
      <HoverTag ref={refs.hoverTag} hidden aria-hidden="true" />
      <DeskNav onJump={flyTo} />
      <main id="top">
        <Section $vh={160}>
          <Hero ref={refs.hero}>
            <span className="label">Product engineer in Accra</span>
            <h1>This is where I build.</h1>
            <p>Products for founders and teams, and guides on how I work.</p>
            <span className="cue" data-loading={status === "loading" || undefined}>
              {unavailable && "The 3D desk couldn't load, so here's the list."}
              {status === "loading" && (
                <>
                  Setting up the desk <span aria-hidden="true">{Math.round(loadProgress * 100)}%</span>
                  <span className="bar" style={{ "--loaded": loadProgress }} aria-hidden="true" />
                </>
              )}
              {status === "ready" && "Scroll, or click an object on the desk"}
            </span>
          </Hero>
        </Section>

        <Section ref={sectionRefs.work} id="work">
          <Screen className="fallback">
            <span className="label">{SCREEN_COPY.work.label}</span>
            <h2>{SCREEN_COPY.work.title}</h2>
            <p className="intro">{SCREEN_COPY.work.intro}</p>
            <FallbackRows items={SCREEN_COPY.work.items} />
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
