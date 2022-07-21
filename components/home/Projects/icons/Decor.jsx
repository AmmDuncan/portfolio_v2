import * as React from "react";

const ProjectCardDecor = (props) => (
  <svg
    width={41}
    height={63}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20.5 20.5C20.5 9.178 11.322 0 0 0v20.5C0 31.822 9.178 41 20.5 41S41 31.822 41 20.5V0C29.678 0 20.5 9.178 20.5 20.5Z"
      fill="#fff"
    />
    <path
      d="M20.5 42.5C20.5 53.822 11.322 63 0 63V42.5C0 31.178 9.178 22 20.5 22S41 31.178 41 42.5V63c-11.322 0-20.5-9.178-20.5-20.5Z"
      fill="#fff"
      fillOpacity={0.6}
    />
  </svg>
);

export default ProjectCardDecor;
