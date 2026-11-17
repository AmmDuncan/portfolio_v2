import styled from "styled-components";

const BooksRoot = styled.section`
  margin-block: 10rem;

  .header p {
    max-width: 43.4rem;
    font-weight: 300;
    line-height: 1.5;
    margin-bottom: 3.2rem;

    @media (min-width: 576px) {
      font-size: 2rem;
      margin-bottom: 4.8rem;
    }
  }

  .books {
    display: grid;
    gap: 4rem;
  }
`;

const BookCardRoot = styled.article`
  display: grid;
  gap: 2.4rem;
  align-items: center;

  @media (min-width: 768px) {
    grid: 1fr / 1.1fr 1fr;
    gap: 4.8rem;
  }

  .cover {
    display: block;
    position: relative;
    padding: min(1.25vw, 4px);
    border-radius: 8px;
    background: var(--color-project-card-bg);
    transition: transform 300ms ease;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .cover__image {
    position: relative;
    aspect-ratio: 1005 / 565;
    border-radius: 5px;
    overflow: hidden;

    img {
      object-fit: cover;
    }
  }

  .meta {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.15rem;
    font-weight: 500;
    opacity: 0.6;
  }

  h3 {
    margin: 0.8rem 0 0;
    font-size: 2.4rem;
    font-weight: 500;
    line-height: 1.25;

    @media (min-width: 768px) {
      font-size: 2.8rem;
    }
  }

  .description {
    max-width: 48rem;
    margin: 1.2rem 0 2.4rem;
    font-weight: 300;
    line-height: 1.5;

    @media (min-width: 576px) {
      font-size: 1.8rem;
    }
  }

  .actions {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: 1.6rem 2.4rem;

    a {
      text-decoration: none;
    }
  }

  .blog-link {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    color: var(--color-text);
    opacity: 0.8;

    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }

  body.dark & .cover {
    filter: brightness(90%);
  }

  @media (prefers-reduced-motion: reduce) {
    .cover {
      transition: none;
    }
  }
`;

export { BooksRoot, BookCardRoot };
