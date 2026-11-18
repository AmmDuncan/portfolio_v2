import { DeskJourney as JourneyMath } from "../../../domains/DeskJourney";

/** The camera's flight to a section; a new target mid-flight retargets from the pose on screen now. */
export function createFlight(scroller) {
  let current = null;
  let lastPose = null;

  return {
    get current() {
      return current;
    },
    get canFly() {
      return scroller.smooth && lastPose !== null;
    },
    remember(pose) {
      lastPose = pose;
    },
    start({ to, y, key, scrollY, now }) {
      const distance = Math.hypot(...to.position.map((v, i) => v - lastPose.position[i]));
      const fromY = current ? current.y : scrollY;
      current = { from: lastPose, to, y, key, fromY, start: now, duration: JourneyMath.flightDuration(distance) };
      scroller.freeze();
    },
    isDone: (now) => current !== null && JourneyMath.timeProgress(current.start, current.duration, now) >= 1,
    land() {
      const { y } = current;
      current = null;
      scroller.release(y);
    },
  };
}
