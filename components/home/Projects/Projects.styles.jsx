import styled from "styled-components";

const ProjectsRoot = styled.section`
  margin-block: 10rem;

  .header {
    margin-bottom: 3.2rem;
    p {
      max-width: 35rem;
      font-weight: 300;
      line-height: 1.5;
      margin-bottom: 4rem;
    }
  }

  @media (min-width: 576px) {
    .header {
      margin-bottom: 4.8rem;

      p {
        max-width: 43.4rem;
        font-size: 2rem;
      }
    }
  }

  @media (min-width: 768px) {
    .header {
      display: grid;
      grid: 1fr / repeat(2, max-content);
      justify-content: space-between;
      align-items: center;

      p {
        margin-bottom: 0;
      }
    }
  }
`;

const ProjectsContainerRoot = styled.div`
  display: grid;
  grid: min(92vw, 440px) max-content max-content / 1fr;
  gap: 2.4rem;

  @media (min-width: 576px) {
    grid-template-rows: min(110vw, 480px) max-content max-content;
  }

  .project {
    border-radius: 0.8rem;
  }

  .highlight {
    position: relative;
    display: grid;
    align-content: space-between;
    padding: 3.2rem 2rem 2rem;
    box-shadow: 0 0.8rem 1.6rem rgba(0, 0, 0, 0.15) inset;
    background: linear-gradient(
      180deg,
      var(--color-primary),
      var(--color-purple-600) 100%
    );

    .decor {
      width: 100%;
      max-width: 46rem;
      margin-inline: auto;
      & > * {
        /* position: absolute; */
        transform: scale(0.7);
      }
    }
  }

  @media (min-width: 620px) {
    grid: min(75vw, 440px) max-content max-content / 1fr;
    grid: repeat(2, max-content) / 1.2fr 1fr;
    gap: 1.6rem;
    .highlight {
      grid-area: 1/1/3/2;

      .decor {
        max-width: 60rem;
      }
    }
  }

  @media (min-width: 992px) {
    grid: repeat(2, max-content) / 6fr 4fr;
    gap: 2.4rem;
    .highlight {
      padding: 5.6rem 5.6rem 2rem;
      .decor > * {
        transform: scale(0.8);
      }
    }
  }
`;

const ProjectCardRoot = styled.div`
  position: relative;
  display: grid;
  grid: auto-flow max-content / 1fr;
  gap: 1.2rem;
  width: 100%;
  margin-inline: auto;

  .image-root {
    position: relative;
    width: 100%;
    padding-top: 59%;
    background: var(--color-project-card-bg);
    border-radius: 8px;

    .image-container {
      --border-size: min(1.25vw, 4px);
      --size: calc(100% - (var(--border-size) * 2));
      position: absolute;
      top: var(--border-size);
      left: var(--border-size);
      width: var(--size);
      height: var(--size);
      border-radius: 5px;
      overflow: hidden;
    }

    @media (min-width: 620px) {
      height: 100%;
      box-sizing: border-box;
    }
  }

  .title {
    margin-bottom: min(2vw, 4rem);
    /* color: var(--color-gray-100); */
  }

  img {
    object-fit: cover;
    object-position: 0 0;
  }

  // styles for outside highlight
  &:not(.in-highlight) {
    .title {
      position: absolute;
      bottom: -3.2rem;
      left: 2.4rem;
      transition: opacity 300ms 150ms ease, bottom 300ms 150ms ease;
      opacity: 0;
    }

    .image-container:after {
      content: "";
      position: absolute;
      bottom: -6rem;
      left: 0;
      width: 100%;
      height: 5.6rem;
      max-height: 100%;

      opacity: 0;
      transition: opacity 300ms ease, bottom 300ms ease;
      box-shadow: 0 1rem 3.2rem rgba(0, 0, 0, 0.2);
      background: var(--color-project-card-bg);
    }

    // &:hover {
      .image-container:after {
        bottom: 0;
        opacity: 0.92;
      }

      .title {
        bottom: 1rem;
        opacity: 1;
        @media (min-width: 768px) {
          bottom: -2%;
        }
      }
    // }
  }

  &.in-highlight {
    max-width: 46rem;

    .title {
      color: var(--color-gray-100);
    }

    .image-root {
      background: var(--color-project-card-highlight-bg);
      transform-style: preserve-3d;
    }
  }

  @media (min-width: 620px) {
    &.in-highlight {
      max-width: 60rem;
    }
  }
`;

export { ProjectsRoot, ProjectsContainerRoot, ProjectCardRoot };
