import styled from "styled-components";

import { EASE_OUT } from "./theme";

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

    .external {
      line-height: 20px;
    }

    .external svg {
      margin-left: 0.18em;
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
      transition: opacity 180ms ${EASE_OUT}, transform 180ms ${EASE_OUT},
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
