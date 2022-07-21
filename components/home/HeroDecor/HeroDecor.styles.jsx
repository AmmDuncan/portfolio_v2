import styled from "styled-components";

const HeroDecorRoot = styled.div`
  position: relative;
  width: 21.9rem;
  display: grid;
  grid: repeat(3, 11rem) / 1fr;
  margin-top: 7.2rem;
  /* opacity: 0.3; */

  svg {
    /* animation: spinY 5s ease infinite; */
    pointer-events: none;
    display: block;
    grid-column: 1/2;
  }

  svg:nth-of-type(1) {
    grid-row: 1/3;
  }

  svg:nth-of-type(2) {
    grid-row: 2/4;
    animation-delay: -2s;
  }

  @keyframes spinY {
    0% {
      transform: rotateY(0);
    }

    100% {
      transform: rotateY(360deg);
    }
  }

  @media (max-width: 1099.9px) {
    display: none;
  }

  body.dark & {
    filter: saturate(0.9);
  }
`;

export { HeroDecorRoot };
