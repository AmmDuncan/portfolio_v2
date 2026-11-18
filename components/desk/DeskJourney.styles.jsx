import styled, { keyframes } from "styled-components";

import { ACCENT, ACCENT_INK } from "./theme";

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
`;

const fade = keyframes`
  from {
    opacity: 0;
  }
`;

export const Root = styled.div`
  --ink: #eef0f4;
  --muted: #9aa3b2;
  --accent: ${ACCENT};
  --accent-ink: ${ACCENT_INK};
  --line: rgba(255, 255, 255, 0.12);
  --glass: rgba(10, 12, 16, 0.72);
  position: relative;
  color: var(--ink);
  background: #07080a;
  font-family: var(--font-sans), sans-serif;

  a {
    color: inherit;
  }

  h1,
  h2 {
    font-family: var(--font-display), sans-serif;
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  h3 {
    font-family: var(--font-sans), sans-serif;
  }

  &::before {
    content: "";
    position: fixed;
    z-index: 2;
    inset: 0 0 auto;
    height: 12rem;
    background: linear-gradient(#0b0d12 35%, rgba(11, 13, 18, 0));
    pointer-events: none;
    opacity: 0;
    transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  &[data-on-screen]::before {
    opacity: 1;
  }

  &[data-no-webgl] canvas {
    display: none;
  }

  .fallback {
    display: none;
  }

  &[data-no-webgl] .fallback {
    display: block;
  }

  @media print {
    --ink: #111;
    --muted: #444;
    --glass: transparent;
    --line: #ccc;
    background: #fff;

    canvas,
    nav,
    .cue,
    main > section:first-child > div::before,
    &::before,
    & > div:first-child {
      display: none !important;
    }

    .fallback {
      display: block;
      background: none;
      padding: 2.4rem 0;
    }

    .fallback::before,
    .fallback::after {
      display: none;
    }

    section,
    section > * {
      position: static !important;
      height: auto !important;
    }

    main * {
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
    }

    .panel {
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      break-inside: avoid;
    }

    .fallback ol,
    .fallback ul {
      display: block;
    }

    .fallback li {
      display: grid;
      grid: auto / 1fr 1fr;
      gap: 2.4rem;
      align-items: start;
      margin-bottom: 3.2rem;
      break-inside: avoid;
    }
  }

  &[data-no-webgl] section {
    height: auto;
    padding-block: 4.8rem;
  }

  &[data-no-webgl] section:not(:first-child) > * {
    position: static;
    height: auto;
  }

  &[data-no-webgl] section:first-child {
    height: 100vh;
    padding-block: 0;
  }

  main {
    position: relative;
    z-index: 2;
    pointer-events: none;
    transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  &[data-flying] main {
    opacity: 0;
    transition-duration: 200ms;
  }

  .note {
    margin: 1.6rem 0 0;
    font-family: var(--font-mono), monospace;
    font-size: 1.2rem;
    letter-spacing: 0.06em;
    color: var(--muted);
  }

  .credit {
    margin: 0.8rem 0 0;
    font-size: 1.2rem;
    line-height: 1.5;
    color: var(--muted);

    a {
      color: inherit;
      text-underline-offset: 0.2em;
    }
  }

  .label {
    font-family: var(--font-mono), monospace;
    font-size: 1.2rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent-ink);
  }
`;

export const CssHost = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
`;

export const Stage = styled.canvas`
  position: fixed;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.2s ease-out;

  &[data-on] {
    opacity: 1;
  }
`;

export const HoverTag = styled.div`
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  padding: 0.6rem 1.2rem;
  border: 1px solid var(--line);
  border-radius: 99rem;
  background: var(--glass);
  backdrop-filter: blur(10px);
  font-size: 1.3rem;
  font-weight: 500;
  pointer-events: none;
  white-space: nowrap;
`;

export const Section = styled.section`
  position: relative;
  height: ${({ $vh }) => ($vh ? `${$vh}vh` : "auto")};
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

export const Hero = styled.div`
  position: sticky;
  top: 0;
  isolation: isolate;
  height: 100vh;
  display: grid;
  align-content: center;
  padding-inline: clamp(2.4rem, 6vw, 9.6rem);
  pointer-events: none;

  & > * {
    animation: ${rise} 900ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  & > :nth-child(1) {
    animation-delay: 300ms;
  }

  & > :nth-child(2) {
    animation-delay: 420ms;
  }

  & > :nth-child(3) {
    animation-delay: 560ms;
  }

  & > :nth-child(4) {
    animation-delay: 1400ms;
  }

  @media (prefers-reduced-motion: reduce) {
    & > * {
      animation-name: ${fade};
    }
  }

  h1 {
    margin: 1.6rem 0 2rem;
    max-width: 11ch;
    font-size: clamp(4rem, 5.2vw, 7.6rem);
    font-weight: 600;
    line-height: 0.98;
    letter-spacing: -0.035em;
    text-wrap: balance;
  }

  p {
    max-width: 38ch;
    margin: 0;
    font-size: clamp(1.7rem, 1.4vw, 2rem);
    line-height: 1.5;
    color: var(--muted);
    text-wrap: pretty;
  }

  .cue {
    position: absolute;
    bottom: 4rem;
    left: clamp(2.4rem, 6vw, 9.6rem);
    font-family: var(--font-mono), monospace;
    font-size: 1.2rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);

    .bar {
      display: block;
      width: 16rem;
      height: 2px;
      margin-top: 1.2rem;
      border-radius: 1px;
      background: rgba(255, 255, 255, 0.12);
      overflow: hidden;
    }

    .bar::after {
      content: "";
      display: block;
      height: 100%;
      background: var(--accent-ink);
      transform: scaleX(var(--loaded));
      transform-origin: left;
      transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
    }

    @media (prefers-reduced-motion: reduce) {
      .bar::after {
        transition: none;
      }
    }
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(to right, rgba(7, 8, 10, 0.78), rgba(7, 8, 10, 0.35) 45%, transparent 65%);
  }

  @media (max-aspect-ratio: 1/1) {
    align-content: start;
    padding-top: 12vh;

    &::before {
      background: linear-gradient(to bottom, rgba(7, 8, 10, 0.85), rgba(7, 8, 10, 0.4) 45%, transparent 60%);
    }
  }
`;
