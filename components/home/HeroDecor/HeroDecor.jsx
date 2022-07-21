import Image from "next/image";
import { HeroDecorRoot } from "./HeroDecor.styles";

function HeroDecor() {
  return (
    <HeroDecorRoot>
      <Shape1 />
      <Shape2 />
    </HeroDecorRoot>
  );
}

function Shape1() {
  return (
    <svg
      width={219}
      height={219}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M109.5 109.5C109.5 49.025 60.475 0 0 0v109.5C0 169.975 49.025 219 109.5 219S219 169.975 219 109.5V0c-60.475 0-109.5 49.025-109.5 109.5Z"
        fill="#734DD5"
      />
    </svg>
  );
}

function Shape2() {
  return (
    <svg
      width={219}
      height={219}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M109.5 109.5C109.5 169.975 60.475 219 0 219V109.5C0 49.025 49.025 0 109.5 0S219 49.025 219 109.5V219c-60.475 0-109.5-49.025-109.5-109.5Z"
        fill="#AB8EF8"
        fillOpacity={0.6}
      />
    </svg>
  );
}

export default HeroDecor;
