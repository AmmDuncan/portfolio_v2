import styled from "styled-components";

export const SCREEN_BG = "#0b0d12";

export const Root = styled.div`
  --ink: #eef0f4;
  --muted: #9aa3b2;
  --accent: #3d7fff;
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

  &[data-no-webgl] canvas {
    display: none;
  }

  main {
    position: relative;
    z-index: 2;
    pointer-events: none;
  }

  .note {
    margin: 1.6rem 0 0;
    font-family: var(--font-mono), monospace;
    font-size: 1.2rem;
    letter-spacing: 0.06em;
    color: var(--muted);
  }

  .label {
    font-family: var(--font-mono), monospace;
    font-size: 1.2rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
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
    gap: 1.6rem;
    padding: 1.2rem 0;
    border-bottom: 1px solid var(--line);
    font-size: 1.6rem;
    text-decoration: none;

    &:hover {
      color: var(--accent);
    }
  }

  @media (max-aspect-ratio: 1/1) {
    align-content: end;
    padding-bottom: 3.2rem;

    .panel {
      padding: 2.4rem;
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
      background: #5b93ff;
    }

    &:active {
      transform: scale(0.97);
    }
  }

  .secondary {
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
  gap: 2.4rem;
  padding: 1.6rem clamp(2.4rem, 6vw, 9.6rem) 3.2rem;
  font-size: 1.4rem;
  background: linear-gradient(to bottom, rgba(7, 8, 10, 0.92) 40%, rgba(7, 8, 10, 0));

  a {
    text-decoration: none;
  }

  .name {
    font-weight: 600;
    margin-right: auto;
  }

  ul {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
    color: var(--muted);

    a:hover {
      color: var(--ink);
    }
  }

  .email {
    padding: 0.8rem 1.6rem;
    border: 1px solid var(--line);
    border-radius: 99rem;
    background: var(--glass);
    backdrop-filter: blur(10px);

    &:hover {
      border-color: var(--accent);
    }
  }

  @media (max-width: 760px) {
    ul {
      display: none;
    }
  }
`;
