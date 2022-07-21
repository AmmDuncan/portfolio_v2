import * as React from "react";

function NavOpenIcon(props) {
  return (
    <svg
      width={37}
      height={15}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        d="M1.992 1.5h34M1.992 13.5h34"
      />
    </svg>
  );
}

export { NavOpenIcon };
