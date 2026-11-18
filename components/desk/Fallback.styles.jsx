import styled from "styled-components";

export const SCREEN_BG = "#0b0d12";

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
