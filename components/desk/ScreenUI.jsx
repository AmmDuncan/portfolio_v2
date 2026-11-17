import styled from "styled-components";

export const SCREEN_SIZES = {
  monitor: { width: 1600, height: 901 },
  laptop: { width: 1280, height: 822 },
};

/** A detached element the 3D scene places on a device screen. */
export function makeScreenElement({ width, height }) {
  const element = document.createElement("div");
  element.dataset.width = String(width);
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  return element;
}

const Ui = styled.div`
  --ink: #eef0f4;
  --muted: #9aa3b2;
  --accent: #3d7fff;
  --line: rgba(255, 255, 255, 0.12);
  width: 100%;
  height: 100%;
  display: grid;
  grid: 44px 1fr / 1fr;
  overflow: hidden;
  background: #0b0d12;
  color: var(--ink);
  font-family: var(--font-sans), sans-serif;
  -webkit-font-smoothing: antialiased;

  .bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-inline: 16px;
    background: #141821;
    font-family: var(--font-mono), monospace;
    font-size: 14px;
    color: var(--muted);

    i {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ff5f57;
      &:nth-child(2) {
        background: #febc2e;
      }
      &:nth-child(3) {
        background: #28c840;
        margin-right: auto;
      }
    }

    span {
      margin-right: auto;
    }
  }

  .viewport {
    overflow: hidden;
  }

  .scroller {
    width: var(--col, 88%);
    margin-inline: auto;
    padding-block: 64px 120px;
    will-change: transform;
  }

  .label {
    font-family: var(--font-mono), monospace;
    font-size: 13px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
  }

  h2 {
    margin: 12px 0;
    font-size: 56px;
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.02;
  }

  .intro {
    max-width: 48ch;
    margin: 0 0 56px;
    font-size: 18px;
    line-height: 1.5;
    color: var(--muted);
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 64px;
  }

  li {
    display: grid;
    grid: auto / 5fr 7fr;
    gap: 48px;
    align-items: center;
  }

  [data-narrow] & li {
    grid: auto / 1fr;
    gap: 20px;
  }

  [data-narrow] & h2 {
    font-size: 40px;
  }

  .meta {
    display: grid;
    gap: 10px;
    justify-items: start;
  }

  h3 {
    margin: 0;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .note {
    padding: 4px 10px;
    border-radius: 99px;
    background: rgba(61, 127, 255, 0.16);
    color: #a9c6ff;
    font-size: 13px;
    font-weight: 500;
  }

  p {
    margin: 0;
    max-width: 44ch;
    font-size: 17px;
    line-height: 1.55;
    color: var(--muted);
  }

  .tools {
    font-family: var(--font-mono), monospace;
    font-size: 12px;
    color: var(--muted);
  }

  a {
    color: inherit;
    font-size: 16px;
    font-weight: 500;
    text-underline-offset: 0.3em;
    text-decoration-color: var(--accent);
  }

  figure {
    margin: 0;
    aspect-ratio: 16 / 10;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--line);
    background: #151820;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top left;
      display: block;
    }
  }
`;

/** Device-screen UI: a window bar and a list the page scroll moves. */
export function ScreenUI({ path, label, title, intro, items, scrollerRef }) {
  return (
    <Ui>
      <div className="bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{path}</span>
      </div>
      <div className="viewport">
        <div className="scroller" ref={scrollerRef}>
          <span className="label">{label}</span>
          <h2>{title}</h2>
          <p className="intro">{intro}</p>
          <ol>
            {items.map((item) => (
              <li key={item.name}>
                <div className="meta">
                  <h3>{item.name}</h3>
                  {item.note && <span className="note">{item.note}</span>}
                  <p>{item.description}</p>
                  <span className="tools">{item.tools.join(" · ")}</span>
                  {item.link && (
                    <a href={item.link} {...(item.link.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                      Open {item.name}
                    </a>
                  )}
                </div>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imgSrc} alt={`${item.name} screenshot`} />
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Ui>
  );
}
