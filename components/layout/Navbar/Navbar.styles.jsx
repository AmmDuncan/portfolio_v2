import styled from "styled-components";

const NavbarRoot = styled.nav`
  height: 7.2rem;
  display: flex;
  align-items: center;
  position: sticky;
  z-index: 10000;
  top: 0;
  transition: background-color 0.25s ease;

  @media (min-width: 768px) {
    height: 9.6rem;

    .sidebar-root {
      display: none;
    }
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

  .nav-list {
    display: none;
    grid: 1fr / auto-flow max-content;
    gap: 3.2rem;
    padding: 0;
    list-style: none;
    font-size: 1.8rem;

    @media (min-width: 768px) {
      display: grid;
    }
  }

  .link {
    display: grid;
    grid: 1fr / auto-flow max-content;
    gap: 0.4rem;
    align-items: center;
    cursor: pointer;
    font-weight: 300;
  }

  .active {
    font-weight: 600;
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

  @media (min-width: 768px) {
    display: none;
  }
`;

const SidebarRoot = styled.div`
  position: fixed;

  .nav-list {
    display: grid;
    grid: auto-flow max-content / 1fr;
    align-items: center;
    width: calc(100% - 4.8rem);
    height: 100%;
    margin-inline: auto;
    gap: 4.8rem;
  }

  .link {
    justify-content: center;
  }

  .sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    height: 100vh;
    width: 100%;
    max-width: 30rem;

    display: grid;
    grid: auto-flow max-content / 1fr;
    place-content: center;
    justify-items: center;
    gap: 4rem;

    transition: left 300ms ease;
    background: var(--color-bg);

    .close {
      position: absolute;
      right: 2rem;
      top: 2rem;
      padding: 0.4rem;
      cursor: pointer;
    }
  }

  .overlay {
    position: fixed;
    z-index: -1;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(0.4rem);
    pointer-events: none;
    opacity: 0;
    transition: opacity 200ms ease;
  }

  &.open {
    .sidebar {
      left: 0;
    }

    .overlay {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

export { NavbarRoot, Title, NavButton, SidebarRoot };
