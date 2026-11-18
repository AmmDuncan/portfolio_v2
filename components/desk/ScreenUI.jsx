import styled from "styled-components";

export const SCREEN_SIZES = {
  monitor: { width: 1600, height: 853 },
  laptop: { width: 1280, height: 826 },
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
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ink: #eef0f4;
  --muted: #9aa3b2;
  --accent: #9174dc;
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
    position: relative;
    overflow: hidden;
  }

  .glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(80% 70% at 72% 18%, rgba(115, 77, 213, 0.55), transparent 70%),
      radial-gradient(60% 60% at 12% 92%, rgba(145, 116, 220, 0.25), transparent 70%);
    pointer-events: none;
  }

  .scroller {
    width: var(--col, 88%);
    margin-inline: auto;
    position: relative;
    padding-block: 120px;
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
    font-family: var(--font-display), sans-serif;
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

  .shot {
    position: relative;
    height: 100%;
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
    background: rgba(115, 77, 213, 0.22);
    color: #c9baf3;
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

  .year {
    font-family: var(--font-mono), monospace;
    font-size: 13px;
    letter-spacing: 0.06em;
    color: var(--muted);
  }

  a {
    color: inherit;
    font-size: 16px;
    font-weight: 500;
    text-decoration: underline;
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
      position: absolute;
      top: -6%;
      width: 100%;
      height: 112%;
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
        <div className="glow" aria-hidden="true" />
        <div className="scroller" ref={scrollerRef}>
          <span className="label">{label}</span>
          <h2>
            <span>{title}</span>
          </h2>
          <p className="intro">{intro}</p>
          <ol>
            {items.map((item) => (
              <li key={item.name} data-reveal>
                <div className="meta">
                  {item.year && <span className="year">{item.year}</span>}
                  <h3>
                    <span>{item.name}</span>
                  </h3>
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
                  <div className="shot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imgSrc} alt={`${item.name} screenshot`} />
                  </div>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Ui>
  );
}

const Lock = styled.div`
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ink: #eef0f4;
  --muted: #9aa3b2;
  --accent: #9174dc;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: radial-gradient(120% 90% at 50% 0%, #251a42 0%, #0b0d12 62%);
  color: var(--ink);
  font-family: var(--font-sans), sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;

  .inner {
    display: grid;
    justify-items: center;
    gap: 16px;
    max-width: min(760px, var(--col, 88%));
  }


  svg {
    width: 44px;
    height: 44px;
    color: var(--accent);
  }

  .label {
    font-family: var(--font-mono), monospace;
    font-size: 13px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
  }

  h2 {
    margin: 0;
    font-family: var(--font-display), sans-serif;
    font-size: 56px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.02;
    text-wrap: balance;
  }

  [data-narrow] & h2 {
    font-size: 36px;
  }

  p {
    margin: 0;
    max-width: 44ch;
    font-size: 18px;
    line-height: 1.5;
    color: var(--muted);
  }

  .stack {
    font-family: var(--font-mono), monospace;
    font-size: 13px;
    color: var(--muted);
  }
`;

/** Laptop lock screen for client work that can't be named or shown. */
export function LockScreen({ label, title, intro, stack, scrollerRef }) {
  return (
    <Lock>
      <div className="inner" ref={scrollerRef}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
        <span className="label">{label}</span>
        <h2>{title}</h2>
        <p>{intro}</p>
        <span className="stack">{stack.join(" · ")}</span>
      </div>
    </Lock>
  );
}
