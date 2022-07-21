import styled from "styled-components";

const ToolsUsedRoot = styled.section`
  padding-block: 24rem 11rem;
  height: max-content;

  h2 {
    margin-bottom: 5.6rem;
    text-align: center;

    @media (min-width: 768px) {
      margin-bottom: 9.6rem;
    }
  }
`;

const StyledUnderline = styled.span`
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 77%;
    z-index: -1;
    width: 100%;
    padding-top: 11%;
    background-image: url("/assets/images/underline.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
`;

const Skills = styled.div`
  position: relative;
  max-width: min(65vw, 45rem);
  display: grid;
  grid: repeat(3, 6.4rem) / repeat(3, 1fr);
  gap: 3rem;
  margin-inline: auto;
  justify-content: center;
  pointer-events: none;

  @media (min-width: 768px) {
    max-width: 78rem;
    grid: repeat(2, 8rem) / repeat(5, 1fr);
    gap: 2rem 3rem;

    &:hover {
      .usage {
        opacity: 1;
        &.occasionally path {
          fill: #eec55a;
        }

        &.frequently path {
          fill: #3fc554;
        }

        &.once path {
          fill: #d8d8d8;
        }
      }
    }
  }

  .usage {
    position: fixed;
    top: 0;
    z-index: 100;
    height: 4.8rem;
    width: max-content;

    display: grid;
    grid: 1fr / auto-flow max-content;
    align-items: center;
    gap: 1rem;
    place-content: center;

    padding: 0.8rem 2.4rem;
    border: 1px solid var(--usage-br);
    border-radius: 8px;
    background: var(--usage-bg);
    opacity: 0;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    transition: opacity 400ms ease;

    path {
      fill: var(--usage-bg);
    }
  }

  body.dark & .skill {
    filter: saturate(0) brightness(0.7);

    &:hover {
      filter: saturate(1);
    }
  }

  .skill {
    pointer-events: auto;
    position: relative;
    filter: saturate(0);
    transition: filter 150ms ease;
    justify-self: center;
    width: min(8rem, max(15vw, 5.6rem));

    &:hover {
      filter: saturate(1);
    }

    @media (min-width: 768px) {
      width: 8.8rem;
      &:nth-of-type(6),
      &:nth-of-type(7),
      &:nth-of-type(8),
      &:nth-of-type(9) {
        grid-column: span 2;
      }

      &:nth-of-type(6) {
        grid-area: 2/1/3/3;
      }

      &:nth-of-type(7) {
        grid-area: 2/2/3/4;
      }

      &:nth-of-type(8) {
        grid-area: 2/3/3/5;
      }

      &:nth-of-type(9) {
        grid-area: 2/4/3/6;
      }
    }
  }

  img {
    object-fit: contain;
    /* max-width: min(8rem, 4vw); */
  }
`;

export { ToolsUsedRoot, StyledUnderline, Skills };
