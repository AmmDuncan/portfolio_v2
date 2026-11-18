import Lenis from "lenis";

/** Page scrolling: smooth (Lenis) normally, the browser's own under reduced motion. */
export function createScroller({ reduceMotion }) {
  const lenis = reduceMotion ? null : new Lenis({ lerp: 0.09 });

  function jump(y) {
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }

  return {
    smooth: lenis !== null,
    raf: (time) => lenis?.raf(time),
    jump,
    freeze: () => lenis?.stop(),
    release(y) {
      lenis?.start();
      jump(y);
    },
    destroy: () => lenis?.destroy(),
  };
}
