import styled from "styled-components";

export const TabsRoot = styled.div`
  /* position: sticky;
  z-index: 1000;
  top: 7.2rem; */

  width: 100%;
  height: 5.6rem;
  max-width: 32rem;

  display: grid;
  grid: 1fr / auto-flow 1fr;
  align-items: stretch;

  margin-inline: auto;
  margin-block: 3.2rem 4.8rem;
  padding: 0.4rem;
  border-radius: 0.8rem;
  background: var(--color-tab-bg);

  @media (min-width: 768px) {
    height: 6.4rem;
  }

  .tab {
    display: grid;
    place-content: center;
    background-color: transparent;
    cursor: pointer;

    &.active {
      background: var(--color-bg);
      border-radius: 0.4rem;
      box-shadow: 0 1.2rem 2rem -0.4rem rgba(0, 0, 0, 0.15),
        0 2px 4px inset rgba(255, 255, 255, 0.1);
    }
  }
`;
