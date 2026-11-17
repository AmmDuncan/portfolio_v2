import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import { FiExternalLink } from "react-icons/fi";

import { Button, Container } from "../../common";
import { BooksRoot, BookCardRoot } from "./Books.styles";
import { books } from "../../../data/books";

function Books() {
  return (
    <BooksRoot id="books">
      <Container>
        <h2>Books</h2>
        <header className="header">
          <p>Guides I&apos;ve written on how I work with AI coding tools.</p>
        </header>
        <div className="books">
          {books.map((book) => (
            <BookCard key={book.title} {...book} />
          ))}
        </div>
      </Container>
    </BooksRoot>
  );
}

function BookCard({ title, label, coverSrc, description, price, link, blogLink }) {
  return (
    <BookCardRoot>
      <a className="cover" href={link} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
        <div className="cover__image">
          <Image src={coverSrc} alt={`${title} cover`} fill sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </a>
      <div className="content">
        <span className="meta">
          {label} · {price}
        </span>
        <h3>{title}</h3>
        <p className="description">{description}</p>
        <div className="actions">
          <Button as="a" className="primary" href={link} target="_blank" rel="noopener noreferrer">
            Get the PDF
            <HiArrowRight />
          </Button>
          {blogLink && (
            <a className="blog-link" href={blogLink} target="_blank" rel="noopener noreferrer">
              Read it on the blog
              <FiExternalLink />
            </a>
          )}
        </div>
      </div>
    </BookCardRoot>
  );
}

export default Books;
