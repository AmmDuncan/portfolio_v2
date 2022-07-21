import styled from "styled-components";

const ThemeSwitchRoot = styled.div`
  position: fixed;
  bottom: 2.4rem;
  right: 2.4rem;
  height: 4.4rem;
  width: 8rem;

  display: grid;
  align-items: center;
  padding: 0.6rem;
  border-radius: 3rem;

  background: var(--switch-bg);
  box-shadow: 0 1rem 2.4rem rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.1) inset;
  cursor: pointer;

  .head {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;

    display: grid;
    place-content: center;

    background: var(--color-bg);
    color: var(--switch-fg);
    transition: transform 250ms ease;
  }

  &.night {
    background: var(--switch-on-bg);

    .head {
      transform: translateX(3.6rem);
      color: var(--color-primary);
    }
  }
`;

export { ThemeSwitchRoot };
