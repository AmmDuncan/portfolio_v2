import styled from "styled-components";

const ProjectsRoot = styled.div`
  margin-block: 6.4rem 8rem;

  text-align: center;

  p {
    max-width: 35rem;
    margin-inline: auto;
  }

  h1 + p {
    margin-top: 0.4rem;
  }

  @media (min-width: 572px) {
    p {
      max-width: 43.4rem;
      font-size: 2rem;
    }
  }

  .project-list {
    display: grid;
    grid: auto-flow / 1fr;
    margin-top: 2.4rem;
    gap: 4.8rem 2.4rem;

    @media (min-width: 768px) {
      grid: auto-flow / repeat(2, 1fr);
      gap: 4.8rem 3.2rem;
    }

    @media (min-width: 1300px) {
      gap: 7.2rem 4.8rem;
      max-width: 90vw;
      /* max-width: 1200px; */
      margin-inline: auto;
    }

    /* @media (min-width: 992px) {
      grid-template-columns: repeat(3, 1fr);
    } */
  }
`;

export { ProjectsRoot };
