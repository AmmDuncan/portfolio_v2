import React from "react";

import { books } from "../../data/books";
import { createJourney } from "./journey/createJourney";
import { createDeskScene, loadDeskModels } from "./scene/createDeskScene";
import { setScreenFonts } from "./scene/screens";

const refMap = (keys) => Object.fromEntries(keys.map((key) => [key, React.createRef()]));
const elements = (refs) => Object.fromEntries(Object.entries(refs).map(([key, ref]) => [key, ref.current]));

/** Stable refs for every element the journey drives. */
export function useJourneyRefs() {
  const [refs] = React.useState(() => ({
    ...refMap(["root", "canvas", "cssHost", "hero", "height", "hoverTag"]),
    sections: refMap(["work", "nda", "guides", "side", "contact"]),
    cards: refMap(["guides", "side", "contact"]),
    scrollers: refMap(["work", "nda"]),
  }));
  return refs;
}

/**
 * Loads the desk models and runs the journey. `status` is "loading", "ready", or "unavailable" (no WebGL, or the
 * scene failed), in which case the page falls back to the plain list. `flyTo(key)` moves to a section.
 */
export function useDeskJourney({ fonts, refs, screenEls }) {
  const [status, setStatus] = React.useState("loading");
  const [loadProgress, setLoadProgress] = React.useState(0);
  const [journey, setJourney] = React.useState(null);
  const { sans, mono, display } = fonts;

  React.useEffect(() => {
    let cancelled = false;
    let stop = null;
    loadDeskModels((fraction) => !cancelled && setLoadProgress(Math.floor(fraction * 100) / 100))
      .then((models) => {
        if (!cancelled) stop = start(models);
      })
      .catch(fail);
    return () => {
      cancelled = true;
      stop?.();
    };

    function fail(error) {
      console.error(error);
      setStatus("unavailable");
    }

    function start(models) {
      setScreenFonts({ sans, mono, display });
      let scene = null;
      try {
        scene = createDeskScene(refs.canvas.current, {
          coverSrcs: books.map((b) => b.coverSrc),
          cssHost: refs.cssHost.current,
          screenElements: { monitor: screenEls.work, laptop: screenEls.nda },
          models,
        });
      } catch (error) {
        fail(error);
        return null;
      }
      try {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const { sections, cards, scrollers, ...single } = refs;
        const dom = {
          ...elements(single),
          sections: elements(sections),
          cards: elements(cards),
          scrollers: elements(scrollers),
        };
        const running = createJourney({ scene, dom, screenEls, reduceMotion });
        setJourney(running);
        setStatus("ready");
        return () => {
          running.dispose();
          scene.dispose();
        };
      } catch (error) {
        scene.dispose();
        fail(error);
        return null;
      }
    }
  }, [refs, screenEls, sans, mono, display]);

  const flyTo = React.useCallback(
    (key) => {
      if (journey) return journey.flyTo(key);
      const section = refs.sections[key]?.current;
      return window.scrollTo(0, section ? section.offsetTop : 0);
    },
    [journey, refs],
  );

  return { status, loadProgress, flyTo };
}
