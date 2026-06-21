import styled from "styled-components";

/* Local Dictation lives in the portfolio but wears the app's own emerald→teal
   "Signal Energy" brand. Accent darkens on light bg for AA text contrast,
   lightens in dark mode. Everything else (fonts, noise, Container) is the
   portfolio's. */
/* EXTRACTION CONTRACT — every host coupling is aliased here with a fallback, so
   lifting this folder into a standalone site means redefining these few vars (or
   relying on the fallbacks). See EXTRACTING.md. The page assumes a 10px root
   (html{font-size:62.5%}) like the portfolio; the standalone host must set that. */
export const Page = styled.main`
  /* Brand (self-owned — the app's Signal Energy palette, not the portfolio's). */
  --ld-accent: #0a7d63;
  --ld-accent-strong: #13b287;
  --ld-grad: linear-gradient(120deg, #2fd6a3 0%, #13b287 48%, #0a7d63 100%);
  --ld-tint: rgba(19, 178, 135, 0.1);
  --ld-tint-br: rgba(19, 178, 135, 0.22);
  /* Type voice — falls back cleanly if extracted without the portfolio globals. */
  --ld-display: "Crimson Text", Georgia, "Times New Roman", serif;
  --ld-body: InterVariable, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  /* Host surfaces — borrow the portfolio theme, fall back to standalone values. */
  --ld-text: var(--color-text, #3c3d55);
  --ld-card-bg: var(--color-project-c-bg, #f3f3f7);
  --ld-card-br: var(--color-project-c-border, #e3e3ec);

  :global(body.dark) & {
    --ld-accent: #2fd6a3;
    --ld-tint: rgba(47, 214, 163, 0.1);
    --ld-tint-br: rgba(47, 214, 163, 0.2);
  }

  color: var(--ld-text);
  font-family: var(--ld-body);
  padding-bottom: 8rem;
  overflow-x: clip;

  h1,
  h2 {
    font-family: var(--ld-display);
    font-weight: 400;
    letter-spacing: -0.02em;
  }
`;

/* Local content container (was the portfolio's Container — inlined so the folder
   imports zero portfolio components). Matches the portfolio gutter + max-width. */
export const Wrap = styled.div`
  width: calc(100% - 4.8rem);
  max-width: 128rem;
  margin-inline: auto;
`;

export const Kick = styled.p`
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ld-accent);
  opacity: 1;
  margin: 0 0 1.6rem;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
`;

export const VibeBadge = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--ld-accent);
  background: var(--ld-tint);
  border: 1px solid var(--ld-tint-br);
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  text-transform: none;
`;

/* ---------- Hero ---------- */
export const Hero = styled.section`
  padding-top: 8rem;
  display: grid;
  gap: 5.6rem;
  align-items: center;

  @media (min-width: 920px) {
    grid-template-columns: 1.05fr 0.95fr;
    gap: 4.8rem;
    padding-top: 11rem;
  }

  h1 {
    font-size: max(4.4rem, min(7.4rem, 8.5vw));
    line-height: 1.02;
    margin: 0 0 2rem;
  }
`;

export const Highlight = styled.span`
  color: var(--ld-accent);
  font-style: italic;
`;

export const Deck = styled.p`
  font-size: 1.9rem;
  line-height: 1.55;
  max-width: 52rem;
  margin: 0 0 3.2rem;
  opacity: 0.82;
`;

export const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.2rem 2rem;
`;

export const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  height: 6rem;
  padding: 0 2.8rem;
  border-radius: 1.4rem;
  background: var(--ld-grad);
  color: #06231b;
  font-size: 1.7rem;
  font-weight: 650;
  letter-spacing: -0.01em;
  box-shadow:
    0 1rem 2.4rem -1rem rgba(19, 178, 135, 0.6),
    0 0.2rem 0.6rem rgba(0, 0, 0, 0.12);
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;

  svg {
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 1.4rem 3rem -1rem rgba(19, 178, 135, 0.7),
      0 0.2rem 0.6rem rgba(0, 0, 0, 0.14);
  }

  small {
    font-size: 1.2rem;
    font-weight: 600;
    opacity: 0.65;
  }
`;

export const GhostLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--ld-text);
  opacity: 0.85;
  position: relative;

  svg {
    width: 1.9rem;
    height: 1.9rem;
  }

  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    height: 1.5px;
    width: 100%;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 220ms ease;
  }

  &:hover {
    opacity: 1;
    &:after {
      transform: scaleX(1);
    }
  }
`;

/* ---------- Generic section ---------- */
export const Section = styled.section`
  margin-top: 11rem;

  @media (max-width: 640px) {
    margin-top: 7.2rem;
  }
`;

export const SectionHead = styled.div`
  max-width: 60rem;
  margin-bottom: 4.8rem;

  h2 {
    font-size: max(3.2rem, min(4.6rem, 6vw));
    line-height: 1.08;
    margin: 1.2rem 0 0;
  }
`;

export const SectionDeck = styled.p`
  font-size: 1.8rem;
  line-height: 1.55;
  margin: 1.6rem 0 0;
  opacity: 0.8;
  max-width: 56rem;
`;

/* ---------- Private band ---------- */
export const PrivacyBand = styled.div`
  background: var(--ld-tint);
  border: 1px solid var(--ld-tint-br);
  border-radius: 2.4rem;
  padding: 4.8rem;
  display: grid;
  gap: 3.2rem;

  @media (min-width: 800px) {
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
    padding: 5.6rem;
  }

  h2 {
    font-size: max(3rem, min(4.2rem, 5vw));
    line-height: 1.1;
    margin: 0 0 1.6rem;
  }

  p {
    font-size: 1.8rem;
    line-height: 1.6;
    opacity: 0.85;
    margin: 0;
  }
`;

export const PrivacyPoints = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.6rem;

  li {
    display: flex;
    align-items: flex-start;
    gap: 1.2rem;
    font-size: 1.6rem;
    line-height: 1.45;
  }

  svg {
    width: 2.2rem;
    height: 2.2rem;
    flex: none;
    color: var(--ld-accent);
    margin-top: 0.2rem;
  }

  strong {
    font-weight: 600;
  }
`;

/* ---------- How it works (3 stages) ---------- */
export const Steps = styled.div`
  display: grid;
  gap: 3.2rem;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.4rem;
  }
`;

export const Step = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1.6rem;
`;

export const StepLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .num {
    font-size: 1.2rem;
    font-weight: 700;
    color: #06231b;
    background: var(--ld-accent-strong);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 0.7rem;
    display: grid;
    place-items: center;
    flex: none;
  }

  .t {
    font-size: 1.7rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
`;

export const StepDesc = styled.p`
  font-size: 1.5rem;
  line-height: 1.5;
  opacity: 0.75;
  margin: 0;
`;

/* ---------- Features grid ---------- */
export const Features = styled.div`
  display: grid;
  gap: 1.6rem;
  grid-template-columns: 1fr;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 960px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const FeatureCard = styled.div`
  background: var(--ld-card-bg);
  border: 1px solid var(--ld-card-br);
  border-radius: 1.8rem;
  padding: 2.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  transition:
    transform 220ms ease,
    border-color 220ms ease;

  &:hover {
    transform: translateY(-3px);
    border-color: var(--ld-tint-br);
  }

  h3 {
    font-size: 1.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 0.4rem 0 0;
    font-family: InterVariable, Inter, sans-serif;
  }

  p {
    font-size: 1.5rem;
    line-height: 1.5;
    opacity: 0.88;
    margin: 0;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9em;
    background: var(--ld-tint);
    color: var(--ld-accent);
    padding: 0.1em 0.4em;
    border-radius: 0.5rem;
  }
`;

export const FeatureIcon = styled.div`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 1.2rem;
  background: var(--ld-tint);
  border: 1px solid var(--ld-tint-br);
  display: grid;
  place-items: center;
  color: var(--ld-accent);

  svg {
    width: 2.2rem;
    height: 2.2rem;
  }
`;

/* ---------- Vibe-coded band ---------- */
export const VibeBand = styled.div`
  border: 1px solid var(--ld-card-br);
  border-radius: 2.4rem;
  padding: 4.8rem;

  @media (min-width: 800px) {
    padding: 5.6rem;
  }

  h2 {
    font-size: max(2.8rem, min(3.8rem, 4.6vw));
    line-height: 1.12;
    margin: 1.2rem 0 2rem;
    max-width: 26ch;
  }

  p {
    font-size: 1.8rem;
    line-height: 1.6;
    opacity: 0.85;
    max-width: 60ch;
    margin: 0 0 1.6rem;
  }

  a {
    color: var(--ld-accent);
    font-weight: 600;
    border-bottom: 1.5px solid currentColor;
  }
`;

/* ---------- Download footer ---------- */
export const DownloadBand = styled.div`
  text-align: center;
  padding: 6.4rem 0 2rem;

  h2 {
    font-size: max(3.2rem, min(5rem, 6.5vw));
    line-height: 1.05;
    margin: 0 0 2.4rem;
  }
`;

export const InstallNote = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  opacity: 0.6;
  max-width: 52rem;
  margin: 3.2rem auto 0;

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.92em;
  }
`;

export const CenterCtas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.4rem 2rem;
  align-items: center;
  justify-content: center;
`;
