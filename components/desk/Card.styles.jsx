import styled from "styled-components";

import { ACCENT_HOVER } from "./theme";

export const Card = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  align-content: center;
  padding-inline: clamp(2.4rem, 6vw, 9.6rem);

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

    > svg {
      flex: none;
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
      background: ${ACCENT_HOVER};
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
