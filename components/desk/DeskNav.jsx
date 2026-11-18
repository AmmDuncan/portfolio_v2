import React from "react";

import { LogoPurple } from "../../assets";
import { BLOG_URL, EMAIL } from "../../data/site";
import { ArrowUpRight } from "./ArrowUpRight";
import { SECTIONS } from "./deskContent";
import { linkProps } from "./linkProps";
import { Nav } from "./Nav.styles";

/** Top bar: name, the section links (a Sections menu on phones) and the email link. */
export function DeskNav({ onJump }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navRef = React.useRef(null);
  const menuButtonRef = React.useRef(null);

  React.useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function jumpTo(key) {
    return (event) => {
      event.preventDefault();
      setMenuOpen(false);
      onJump(key);
    };
  }

  return (
    <Nav aria-label="Sections" ref={navRef} data-open={menuOpen || undefined}>
      <a className="name" href="#top" onClick={jumpTo("top")}>
        <LogoPurple width={24} height={24} viewBox="0 0 48 48" aria-hidden="true" />
        Ammiel Yawson
      </a>
      <button
        ref={menuButtonRef}
        type="button"
        className="sections"
        aria-expanded={menuOpen}
        aria-controls="desk-sections"
        onClick={() => setMenuOpen((open) => !open)}
      >
        Sections
      </button>
      <ul id="desk-sections">
        {SECTIONS.map(({ key, label }) => (
          <li key={key}>
            <a href={`#${key}`} onClick={jumpTo(key)}>
              {label}
            </a>
          </li>
        ))}
        <li>
          <a className="external" href={BLOG_URL} {...linkProps(BLOG_URL)}>
            Blog
            <ArrowUpRight />
          </a>
        </li>
      </ul>
      <a className="email" href={`mailto:${EMAIL}`}>
        Email me
      </a>
    </Nav>
  );
}
