import { Ui } from "./screenStyles";

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
