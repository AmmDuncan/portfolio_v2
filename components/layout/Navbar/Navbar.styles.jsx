import styled from "styled-components";

const NavbarRoot = styled.nav`
  height: 7.2rem;
  display: flex;
  align-items: center;
  position: sticky;
  z-index: 100;
  top: 0;
  transition: background-color 0.25s ease;

  @media (min-width: 768px) {
    height: 9.6rem;
  }

  &.with-bg {
    background: var(--color-nav-bg);
    box-shadow: 0 1rem 2.4rem rgba(0, 0, 0, 0.03);
  }

  .nav__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;

  .name {
    margin-left: 0.8rem;
    font-size: 1.8rem;
    font-weight: 500;
    letter-spacing: -0.02em;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }
`;

const NavButton = styled.div`
  width: 4.4rem;
  height: 4.4rem;
  display: grid;
  place-content: center;
  transition: transform 400ms ease;
  margin-right: -1.2rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

export { NavbarRoot, Title, NavButton };
