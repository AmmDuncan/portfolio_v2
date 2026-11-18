import styled from "styled-components";

import { ACCENT_INK, ACCENT_RGB, INK, LINE, MUTED, SCREEN_BG } from "./theme";

/** Height of the window bar at the top of a device screen. */
export const SCREEN_CHROME_PX = 44;

export const Ui = styled.div`
  --ink: ${INK};
  --muted: ${MUTED};
  --accent: ${ACCENT_INK};
  --line: ${LINE};
  width: 100%;
  height: 100%;
  display: grid;
  grid: ${SCREEN_CHROME_PX}px 1fr / 1fr;
  overflow: hidden;
  background: ${SCREEN_BG};
  color: var(--ink);
  font-family: var(--font-sans), sans-serif;
  -webkit-font-smoothing: antialiased;

  .bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-inline: 16px;
    background: #141821;
    font-family: var(--font-mono), monospace;
    font-size: 14px;
    color: var(--muted);

    i {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ff5f57;
      &:nth-child(2) {
        background: #febc2e;
      }
      &:nth-child(3) {
        background: #28c840;
        margin-right: auto;
      }
    }

    span {
      margin-right: auto;
    }
  }

  .viewport {
    position: relative;
    overflow: hidden;
  }

  .glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(165deg, rgba(${ACCENT_RGB}, 0.26), rgba(${ACCENT_RGB}, 0.1) 55%, rgba(${ACCENT_RGB}, 0.04));
    pointer-events: none;
  }

  .scroller {
    width: var(--col, 88%);
    margin-inline: auto;
    position: relative;
    padding-block: 120px;
  }

  h2 {
    margin: 12px 0;
    font-family: var(--font-display), sans-serif;
    font-size: 56px;
    line-height: 1.02;
  }

  .intro {
    max-width: 48ch;
    margin: 0 0 56px;
    font-size: 18px;
    line-height: 1.5;
    color: var(--muted);
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 64px;
  }

  li {
    display: grid;
    grid: auto / 5fr 7fr;
    gap: 48px;
    align-items: center;
  }

  .shot {
    position: relative;
    height: 100%;
  }

  [data-narrow] & li {
    grid: auto / 1fr;
    gap: 20px;
  }

  [data-narrow] & h2 {
    font-size: 40px;
  }

  .meta {
    display: grid;
    gap: 10px;
    justify-items: start;
  }

  h3 {
    margin: 0;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .note {
    padding: 4px 10px;
    border-radius: 99px;
    background: rgba(${ACCENT_RGB}, 0.22);
    font-weight: 500;
  }

  p {
    margin: 0;
    max-width: 44ch;
    font-size: 17px;
    line-height: 1.55;
    color: var(--muted);
  }

  .tools {
    font-family: var(--font-mono), monospace;
    font-size: 12px;
    color: var(--muted);
  }

  .year {
    font-family: var(--font-mono), monospace;
    font-size: 13px;
    letter-spacing: 0.06em;
    color: var(--muted);
  }

  a {
    color: inherit;
    font-size: 16px;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 0.3em;
    text-decoration-color: var(--accent);
  }

  figure {
    margin: 0;
    aspect-ratio: 16 / 10;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--line);
    background: #151820;
    box-shadow: 0 calc(24px * var(--focus, 0)) calc(64px * var(--focus, 0))
      rgba(${ACCENT_RGB}, calc(0.28 * var(--focus, 0)));

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top left;
      display: block;
      filter: brightness(calc(0.72 + 0.28 * var(--focus, 0)));
    }
  }
`;

export const Lock = styled.div`
  --ink: ${INK};
  --muted: ${MUTED};
  --accent: ${ACCENT_INK};
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: radial-gradient(120% 90% at 50% 0%, #251a42 0%, ${SCREEN_BG} 62%);
  color: var(--ink);
  font-family: var(--font-sans), sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;

  .inner {
    display: grid;
    justify-items: center;
    gap: 16px;
    max-width: min(760px, var(--col, 88%));
  }

  svg {
    width: 44px;
    height: 44px;
    color: var(--accent);
  }

  h2 {
    margin: 0;
    font-family: var(--font-display), sans-serif;
    font-size: 56px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.02;
    text-wrap: balance;
  }

  [data-narrow] & h2 {
    font-size: 36px;
  }

  p {
    margin: 0;
    max-width: 44ch;
    font-size: 18px;
    line-height: 1.5;
    color: var(--muted);
  }

  .stack {
    font-family: var(--font-mono), monospace;
    font-size: 13px;
    color: var(--muted);
  }
`;
