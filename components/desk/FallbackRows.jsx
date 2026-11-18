import React from "react";

import { ProjectList } from "./Fallback.styles";
import { ProjectRow } from "./ProjectRow";

/** The plain project list shown when the 3D desk is unavailable, and in print. */
export function FallbackRows({ items }) {
  return (
    <ProjectList>
      {items.map((item) => (
        <li key={item.name}>
          <ProjectRow item={item} lazyImage />
        </li>
      ))}
    </ProjectList>
  );
}
