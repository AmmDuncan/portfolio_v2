import styled from "styled-components";

const Button = styled.button`
  --foreground: var(--btn-foreground);
  --hv-foreground: var(--btn-hv-foreground);
  --hv-background: var(--btn-hv-background);

  position: relative;
  height: 5.6rem;

  display: grid;
  grid: 1fr / auto-flow max-content;
  gap: 1.6rem;
  align-items: center;
  justify-content: center;

  padding: 1.6rem 2.8rem;
  border: none;

  background: transparent;
  color: var(--foreground);
  font-size: 1.6rem;
  font-weight: 550;
  line-height: 0.9;

  transition: color 250ms 100ms ease;
  cursor: pointer;

  path {
    transition: fill 250ms 100ms ease;
    fill: var(--foreground);
  }

  &:before {
    content: "";
    position: absolute;
    z-index: -1;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: var(--foreground);
    transition: height 250ms ease, border-radius 150ms ease;
  }

  &:hover,
  &:active {
    color: var(--hv-foreground);

    &:before {
      height: 100%;
      border-radius: 8px 8px 0 0;
    }

    path {
      fill: var(--hv-foreground);
    }
  }

  @media (min-width: 768px) {
    font-size: 2rem;
    height: 6.4rem;
    padding-inline: 3.2rem;
  }

  &.primary {
    --foreground: var(--btn-primary-foreground);
    --hv-foreground: var(--btn-primary-hv-foreground);
  }
`;

export { Button };
