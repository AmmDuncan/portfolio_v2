import React from "react";

import { ProjectList } from "./Fallback.styles";

export function FallbackRows({ items }) {
  return (
    <ProjectList>
      {items.map((item) => (
        <li key={item.name}>
          <div className="meta">
            {item.year && <span className="tools">{item.year}</span>}
            <h3>{item.name}</h3>
            {item.note && <span className="tools">{item.note}</span>}
            <p>{item.description}</p>
            {item.link && (
              <a className="open" href={item.link}>
                Open {item.name}
              </a>
            )}
          </div>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imgSrc} alt={`${item.name} screenshot`} loading="lazy" />
          </figure>
        </li>
      ))}
    </ProjectList>
  );
}
