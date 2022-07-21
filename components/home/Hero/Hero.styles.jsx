import styled from "styled-components";

const HeroRoot = styled.div`
  h1 {
    margin-block: 11.8rem 2.4rem;
    font-family: "Crimson Text", Georgia, "Times New Roman", Times, serif;
    font-weight: 400;
    font-size: max(4.8rem, 8.5vw);
    line-height: 1.1;
    letter-spacing: -0.02em;
    max-width: 37.5rem;
  }

  p {
    max-width: 32.8rem;
    line-height: 1.6;
    font-weight: 300;
  }

  @media (max-width: 450px) {
    h1 {
      margin-block: 10.4rem 2.4rem;
      font-size: max(4rem, 8vw);
    }
    /* svg {
      display: none;
    } */
  }

  @media (min-width: 572px) {
    h1 {
      max-width: max(45rem, 90vw);
      margin-block: 13.5rem 2.4rem;
      font-size: min(8rem, max(4.8rem, 8vw));
      line-height: 0.9;
    }

    p {
      max-width: 41rem;
      font-size: 2rem;
    }
  }

  @media (min-width: 992px) {
    h1 {
      max-width: 85.4rem;
      font-size: min(7.5rem, 8vw);
      line-height: 0.9;
      letter-spacing: -0.015em;
    }

    p {
      font-size: 2.4rem;
      max-width: 48.8rem;
    }
  }

  @media (min-width: 1100px) {
    .hero__container {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
    }

    .content {
      width: max-content;
    }

    h1 {
      max-width: 87.4rem;
      font-size: min(8rem, 8vw);
    }
  }
`;

const Highlight = styled.span`
  color: var(--color-primary);
`;

const Ctas = styled.section`
  position: relative;

  margin-top: 5.6rem;

  &:before {
    content: "";
    position: absolute;
    z-index: -1;
    left: 0;
    bottom: 0;
    background: var(--color-cta-br);
    width: 100%;
    height: 2px;
  }

  .ctas__container {
    display: grid;
    grid: 1fr / auto-flow max-content;
    gap: 1.6rem;
  }

  @media (max-width: 450px) {
    &:before {
      display: none;
    }

    .ctas__container {
      grid: 1fr 1fr / 1fr;
      gap: 2.4rem;
    }
  }

  @media (min-width: 768px) {
    margin-top: 9.6rem;

    .ctas__container {
      gap: 2.4rem;
    }
  }
`;

export { HeroRoot, Highlight, Ctas };
