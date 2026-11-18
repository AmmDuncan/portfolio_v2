import { describe, expect, it } from "vitest";

import { DeskJourney } from "./DeskJourney";

const pose = (at, x) => ({ at, position: [x, 0, 0], target: [0, 0, x] });

describe("poseAt", () => {
  const keyframes = [pose(0, 0), pose(100, 10), pose(200, 20)];

  it("returns null with no keyframes", () => {
    expect(DeskJourney.poseAt(50, [])).toBeNull();
  });

  it("holds the first pose before the first keyframe and the last pose after the last", () => {
    expect(DeskJourney.poseAt(-40, keyframes)).toBe(keyframes[0]);
    expect(DeskJourney.poseAt(900, keyframes)).toBe(keyframes[2]);
  });

  it("lands exactly on a keyframe at its scroll position", () => {
    expect(DeskJourney.poseAt(100, keyframes).position).toEqual([10, 0, 0]);
  });

  it("is half way at the midpoint (smoothstep is symmetric)", () => {
    expect(DeskJourney.poseAt(50, keyframes)).toEqual({ position: [5, 0, 0], target: [0, 0, 5] });
  });

  it("eases: a quarter of the way in moves less than a quarter of the distance", () => {
    expect(DeskJourney.poseAt(125, keyframes).position[0]).toBeCloseTo(11.5625);
  });
});

describe("progress", () => {
  it("maps a range to 0..1 and clamps outside it", () => {
    expect(DeskJourney.progress(50, 0, 100)).toBe(0.5);
    expect(DeskJourney.progress(-10, 0, 100)).toBe(0);
    expect(DeskJourney.progress(140, 0, 100)).toBe(1);
  });

  it("treats an empty or reversed range as a step at its end", () => {
    expect(DeskJourney.progress(99, 100, 100)).toBe(0);
    expect(DeskJourney.progress(100, 100, 100)).toBe(1);
    expect(DeskJourney.progress(60, 100, 50)).toBe(1);
    expect(DeskJourney.progress(40, 100, 50)).toBe(0);
  });
});

describe("stagger", () => {
  it("starts a single item straight away and finishes it at 1 - spread", () => {
    expect(DeskJourney.stagger(0, 0, 1)).toBe(0);
    expect(DeskJourney.stagger(0.55, 0, 1)).toBe(1);
  });

  it("holds the last of three items back until the spread has passed", () => {
    expect(DeskJourney.stagger(0.45, 2, 3)).toBe(0);
    expect(DeskJourney.stagger(1, 2, 3)).toBe(1);
    expect(DeskJourney.stagger(0.45, 0, 3)).toBeCloseTo(0.8182, 4);
  });
});

describe("flightDuration", () => {
  it("never goes under 800 ms or over 1600 ms", () => {
    expect(DeskJourney.flightDuration(0)).toBe(800);
    expect(DeskJourney.flightDuration(1)).toBe(1150);
    expect(DeskJourney.flightDuration(10)).toBe(1600);
  });
});

describe("flightPose", () => {
  const from = { position: [0, 0, 0], target: [0, 0, -1] };
  const to = { position: [4, 0, 0], target: [4, 0, -1] };

  it("starts at the first pose and ends at the second", () => {
    expect(DeskJourney.flightPose(from, to, 0)).toEqual(from);
    const end = DeskJourney.flightPose(from, to, 1);
    end.position.forEach((v, i) => expect(v).toBeCloseTo(to.position[i]));
    expect(end.target).toEqual(to.target);
  });

  it("lifts up and back by a quarter of the distance at the midpoint", () => {
    expect(DeskJourney.flightPose(from, to, 0.5).position).toEqual([2, 1, 1]);
  });
});

describe("screenPose", () => {
  it("backs off along the screen normal to 90% of the distance that fills the view", () => {
    expect(DeskJourney.coverDistance(2, 1, 90, 2)).toBeCloseTo(0.5);
    const screen = { center: [0, 0, 0], normal: [0, 0, 1], width: 2, height: 1 };
    const { position, target } = DeskJourney.screenPose(screen, 90, 2);
    position.forEach((v, i) => expect(v).toBeCloseTo([0, 0, 0.45][i]));
    expect(target).toEqual([0, 0, 0]);
  });
});

describe("activeSectionAt", () => {
  const ranges = { work: [100, 200], guides: [300, 400], side: [400, 500], contact: [500, Infinity] };

  it("is null with no ranges", () => {
    expect(DeskJourney.activeSectionAt(150, {})).toBeNull();
  });

  it("returns work exactly at its start (100) and null one px before (99)", () => {
    expect(DeskJourney.activeSectionAt(100, ranges)).toBe("work");
    expect(DeskJourney.activeSectionAt(99, ranges)).toBeNull();
  });

  it("returns null exactly at work's end (200) and in the gap before guides (299)", () => {
    expect(DeskJourney.activeSectionAt(199, ranges)).toBe("work");
    expect(DeskJourney.activeSectionAt(200, ranges)).toBeNull();
    expect(DeskJourney.activeSectionAt(299, ranges)).toBeNull();
  });

  it("returns side, not guides, exactly at the shared boundary 400 (the old overlap case)", () => {
    expect(DeskJourney.activeSectionAt(399, ranges)).toBe("guides");
    expect(DeskJourney.activeSectionAt(400, ranges)).toBe("side");
  });

  it("returns contact from 500 onward and side at 499", () => {
    expect(DeskJourney.activeSectionAt(499, ranges)).toBe("side");
    expect(DeskJourney.activeSectionAt(500, ranges)).toBe("contact");
    expect(DeskJourney.activeSectionAt(1e9, ranges)).toBe("contact");
  });
});

describe("timeProgress", () => {
  it("is 0 at the start time (1000) and 0, not negative, before it (999)", () => {
    expect(DeskJourney.timeProgress(1000, 800, 1000)).toBe(0);
    expect(DeskJourney.timeProgress(1000, 800, 999)).toBe(0);
  });

  it("is 0.5 half way (1400) and 1 exactly at the end (1800) and after it (5000)", () => {
    expect(DeskJourney.timeProgress(1000, 800, 1400)).toBe(0.5);
    expect(DeskJourney.timeProgress(1000, 800, 1800)).toBe(1);
    expect(DeskJourney.timeProgress(1000, 800, 5000)).toBe(1);
  });
});

describe("deskHeightCm", () => {
  it("is 74 cm down (0), 112 cm fully up (1) and 93 cm half way (0.5)", () => {
    expect(DeskJourney.deskHeightCm(0)).toBe(74);
    expect(DeskJourney.deskHeightCm(1)).toBe(112);
    expect(DeskJourney.deskHeightCm(0.5)).toBe(93);
  });
});

describe("frameAt", () => {
  const introPose = { position: [-10, 0, 0], target: [0, 0, -10] };
  const timeline = {
    keyframes: [pose(0, 0), pose(1000, 10)],
    introPose,
    ranges: { work: [100, 300], guides: [500, 700] },
    scrolls: { work: { scrollable: 400, viewportHeight: 500, start: 100, end: 300, reset: [600, 800] } },
    screenArrivals: { work: [0, 100] },
    heroFade: [0, 200],
    cards: [{ key: "guides", range: [400, 500] }],
    phoneLit: [800, 900],
    rise: [900, 1000],
  };

  it("at 200: work active, screen half scrolled (offset 200), hero gone, card hidden and inert, desk down", () => {
    const frame = DeskJourney.frameAt(200, timeline);
    expect(frame.pose.position[0]).toBeCloseTo(1.04);
    expect(frame).toMatchObject({
      power: 1,
      active: "work",
      screens: { work: { offset: 200, arrival: 1 } },
      phoneLit: 0,
      rise: 0,
      heightCm: 74,
      heroOpacity: 0,
      cards: [{ key: "guides", shown: 0, opacity: 0, inert: true }],
    });
  });

  it("at 450: between sections (null), screen fully scrolled (400), card half shown (opacity 1) and usable", () => {
    const frame = DeskJourney.frameAt(450, timeline);
    expect(frame.active).toBeNull();
    expect(frame.screens.work.offset).toBe(400);
    expect(frame.cards).toEqual([{ key: "guides", shown: 0.5, opacity: 1, inert: false }]);
  });

  it("at 1000: screen scrolled back to 0, phone lit (1), desk fully up (112 cm)", () => {
    const frame = DeskJourney.frameAt(1000, timeline);
    expect(frame.screens.work.offset).toBe(0);
    expect(frame).toMatchObject({ active: null, phoneLit: 1, rise: 1, heightCm: 112 });
  });

  it("half way through the intro (0.5) blends from the intro pose (x -1.25) and the screens are at 0.417 power", () => {
    const frame = DeskJourney.frameAt(0, timeline, { intro: 0.5 });
    expect(frame.pose.position[0]).toBeCloseTo(-1.25);
    expect(frame.power).toBeCloseTo(0.417, 3);
  });

  it("mid-flight: camera on the arc, content at the target (450), no active section, cards inert", () => {
    const from = { position: [0, 0, 0], target: [0, 0, -1] };
    const to = { position: [4, 0, 0], target: [4, 0, -1] };
    const flight = { from, to, y: 450, fromY: 950, start: 0, duration: 800 };
    const frame = DeskJourney.frameAt(950, timeline, { flight, now: 400 });
    expect(frame.pose.position).toEqual([2, 1, 1]);
    expect(frame.active).toBeNull();
    expect(frame.screens.work.offset).toBe(400);
    expect(frame.cards[0]).toEqual({ key: "guides", shown: 0.5, opacity: 1, inert: true });
    expect(frame).toMatchObject({ phoneLit: 0.5, rise: 0.25, heightCm: 84 });
  });
});
