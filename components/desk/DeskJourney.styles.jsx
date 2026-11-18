import styled, { keyframes } from "styled-components";

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

export const SCREEN_BG = "#0b0d12";

export const Root = styled.div`
  --ink: #eef0f4;
  --muted: #9aa3b2;
  --accent: #734dd5;
  --accent-ink: #9174dc;
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

export const Screen = styled.div`
  position: relative;
  background: ${SCREEN_BG};
  padding: 12vh clamp(2.4rem, 6vw, 9.6rem) 16vh;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 40vh;
    pointer-events: none;
  }

  &::before {
    bottom: 100%;
    background: linear-gradient(to bottom, transparent, ${SCREEN_BG});
  }

  &::after {
    top: 100%;
    background: linear-gradient(to top, transparent, ${SCREEN_BG});
  }

  h2 {
    margin: 1.2rem 0 1.2rem;
    font-size: clamp(3.6rem, 4.6vw, 6.4rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.02;
  }

  .intro {
    max-width: 48ch;
    margin: 0 0 6.4rem;
    font-size: 1.8rem;
    line-height: 1.5;
    color: var(--muted);
  }
`;

export const ProjectList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8rem;

  li {
    display: grid;
    gap: 2.4rem;
    align-items: center;

    @media (min-width: 900px) {
      grid: auto / 5fr 7fr;
      gap: 6.4rem;
    }
  }

  .meta {
    display: grid;
    gap: 1.2rem;
  }

  h3 {
    margin: 0;
    font-size: clamp(2.6rem, 2.6vw, 3.6rem);
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    max-width: 44ch;
    font-size: 1.7rem;
    line-height: 1.55;
    color: var(--muted);
    text-wrap: pretty;
  }

  .tools {
    font-family: var(--font-mono), monospace;
    font-size: 1.2rem;
    letter-spacing: 0.06em;
    color: var(--muted);
  }

  .open {
    justify-self: start;
    font-size: 1.6rem;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 0.3em;
    text-decoration-color: var(--accent);
  }

  figure {
    margin: 0;
    aspect-ratio: 16 / 10;
    border-radius: 1.2rem;
    overflow: hidden;
    border: 1px solid var(--line);
    background: #151820;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top left;
      display: block;
    }
  }
`;

export const Card = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  align-content: center;
  padding-inline: clamp(2.4rem, 6vw, 9.6rem);
  pointer-events: none;

  .panel {
    pointer-events: auto;
    width: min(44rem, 100%);
    padding: 3.2rem;
    border: 1px solid var(--line);
    border-radius: 1.6rem;
    background: var(--glass);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .note.price {
    margin: -0.8rem 0 2rem;
  }

  h2 {
    margin: 1.2rem 0 1.2rem;
    font-size: clamp(3rem, 3vw, 4.4rem);
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1.05;
  }

  p {
    margin: 0 0 2.4rem;
    font-size: 1.7rem;
    line-height: 1.55;
    color: var(--muted);
    text-wrap: pretty;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    border-top: 1px solid var(--line);
  }

  li a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.2rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--line);
    font-size: 1.6rem;
    text-decoration: none;

    &:hover {
      color: var(--accent-ink);
    }
  }

  .thumb {
    flex: none;
    width: 6rem;
    height: 3.8rem;
    border: 1px solid var(--line);
    border-radius: 0.6rem;
    object-fit: cover;
  }

  .name {
    flex: 1;
    display: grid;
    gap: 0.2rem;
    min-width: 0;
  }

  small {
    overflow: hidden;
    font-size: 1.3rem;
    color: var(--muted);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media (min-aspect-ratio: 1/1) and (min-width: 1100px) {
    .panel:has(ul) {
      width: min(72rem, 100%);
    }

    ul {
      grid: auto-flow / 1fr 1fr;
      column-gap: 2.4rem;
    }
  }

  @media (max-aspect-ratio: 1/1) {
    align-content: end;
    padding-bottom: 3.2rem;

    .panel {
      padding: 2.4rem;
    }

    li a {
      padding: 0.6rem 0;
    }

    .thumb {
      width: 4.8rem;
      height: 3rem;
    }

    small {
      display: none;
    }
  }
`;

export const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem 2rem;
  align-items: center;

  .primary {
    display: inline-flex;
    align-items: center;
    min-height: 4.8rem;
    padding: 0 2.4rem;
    border-radius: 99rem;
    background: var(--accent);
    color: #fff;
    font-size: 1.6rem;
    font-weight: 600;
    text-decoration: none;
    transition: transform 160ms ease-out, background 160ms ease-out;

    &:hover {
      background: #8462dd;
    }

    &:active {
      transform: scale(0.97);
    }
  }

  .secondary {
    display: inline-flex;
    align-items: center;
    min-height: 4.4rem;
    font-size: 1.6rem;
    text-decoration: underline;
    text-underline-offset: 0.3em;
    text-decoration-color: var(--line);
  }
`;

export const Nav = styled.nav`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.6rem clamp(1.6rem, 4vw, 6.4rem);
  font-size: 1.4rem;
  pointer-events: none;

  & > * {
    pointer-events: auto;
    border: 1px solid var(--line);
    border-radius: 99rem;
    background: rgba(10, 12, 16, 0.72);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
  }

  a {
    text-decoration: none;
  }

  .name {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.6rem 1.6rem 0.6rem 1rem;
    font-weight: 600;
    margin-right: auto;
  }

  ul {
    display: flex;
    gap: 0.4rem;
    list-style: none;
    margin: 0;
    padding: 0.4rem;
    color: var(--muted);

    a {
      display: block;
      padding: 0.4rem 1.2rem;
      border-radius: 99rem;
      transition: color 160ms ease-out, background 160ms ease-out;
    }

    a:hover {
      color: var(--ink);
      background: rgba(255, 255, 255, 0.06);
    }
  }

  .email {
    padding: 0.8rem 1.6rem;

    &:hover {
      border-color: var(--accent);
    }
  }

  .sections {
    display: none;
    align-items: center;
    min-height: 4.4rem;
    padding: 0 1.6rem;
    color: var(--ink);
    font: inherit;
    cursor: pointer;
  }

  @media (max-width: 760px) {
    .sections {
      display: inline-flex;
    }

    &[data-open] .sections {
      border-color: var(--accent);
    }

    ul {
      position: absolute;
      top: calc(100% - 0.4rem);
      left: clamp(1.6rem, 4vw, 6.4rem);
      right: clamp(1.6rem, 4vw, 6.4rem);
      flex-direction: column;
      padding: 0.8rem;
      border-radius: 1.6rem;
      background: #0c0e13;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
      font-size: 1.6rem;
      transform-origin: top right;
      opacity: 0;
      transform: translateY(-4px) scale(0.98);
      visibility: hidden;
      transition: opacity 180ms cubic-bezier(0.23, 1, 0.32, 1), transform 180ms cubic-bezier(0.23, 1, 0.32, 1),
        visibility 0s 180ms;

      a {
        display: flex;
        align-items: center;
        min-height: 4.4rem;
        padding: 0 1.6rem;
        border-radius: 1rem;
      }
    }

    &[data-open] ul {
      opacity: 1;
      transform: none;
      visibility: visible;
      transition-delay: 0s;
    }
  }

  @media (max-width: 760px) and (prefers-reduced-motion: reduce) {
    ul {
      transform: none;
    }
  }
`;
