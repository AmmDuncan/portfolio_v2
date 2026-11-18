import { deskShotSrc } from "../../data/projects";
import { linkProps } from "./linkProps";

/** One project: details on the left, screenshot on the right. The parent list owns the li and its styling. */
export function ProjectRow({ item, lazyImage = false }) {
  return (
    <>
      <div className="meta">
        {item.year && <span className="year">{item.year}</span>}
        <h3>
          <span>{item.name}</span>
        </h3>
        {item.note && <span className="note">{item.note}</span>}
        <p>{item.description}</p>
        <span className="tools">{item.tools.join(" · ")}</span>
        {item.link && (
          <a className="open" href={item.link} {...linkProps(item.link)}>
            Open {item.name}
          </a>
        )}
      </div>
      <figure>
        <div className="shot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={deskShotSrc(item.imgSrc)}
            alt={`${item.name} screenshot`}
            loading={lazyImage ? "lazy" : undefined}
            decoding="async"
          />
        </div>
      </figure>
    </>
  );
}
