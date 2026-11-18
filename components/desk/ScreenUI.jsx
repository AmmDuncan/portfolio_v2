import { ProjectRow } from "./ProjectRow";
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
                <ProjectRow item={item} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Ui>
  );
}
